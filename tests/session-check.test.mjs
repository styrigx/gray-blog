/**
 * functions/_middleware.js 的 /api/session-check 接口 + 受保护 HTML no-store 测试。
 * 用 Node 内置 test runner：node --test tests/
 *
 * 覆盖：
 *  - session-check：有效 cookie → 200 {ok:true}；无/坏/过期/epoch 过旧 cookie → 401 {ok:false}
 *  - session-check：锁屏未配置（SGX_SITE 不是 'blog'）→ 200 {ok:true}（与放行逻辑一致）
 *  - session-check：公钥未配置 → 401（fail closed）
 *  - 响应一律带 Cache-Control: no-store
 *  - 受保护的 HTML 响应带 no-store；非 HTML 不动
 *  - 锁屏 302 带 no-store
 *  - pages.dev 生产别名上 /api/session-check 仍先 301（链首顺序）
 *
 * 注意：主站 /api/session-epoch 用桩替换（模块内 60 秒缓存，全部测试共用 epoch=1）。
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/_middleware.js';

const EPOCH_URL = 'https://styrigx.com/api/session-epoch';
const STUB_EPOCH = 1;

let privateKey;
let publicKeyPem;

function b64url(bytes) {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function makeCookie(epoch, exp, key = privateKey) {
  const payload = `${epoch}.${exp}`;
  const sig = await crypto.subtle.sign('Ed25519', key, new TextEncoder().encode(payload));
  return `${payload}.${b64url(sig)}`;
}

function blogEnv() {
  return { SGX_SITE: 'blog', SGX_ED25519_PUBLIC: publicKeyPem };
}

function mockContext(url, { env = blogEnv(), cookie, nextBody } = {}) {
  const headers = {};
  if (cookie) headers.cookie = `sgx-verified=${encodeURIComponent(cookie)}`;
  return {
    request: new Request(url, { headers }),
    next: async () =>
      nextBody instanceof Response
        ? nextBody
        : new Response(nextBody ?? 'next', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          }),
    env,
  };
}

async function sessionCheck(ctx) {
  const res = await onRequest(ctx);
  return { res, body: await res.json() };
}

before(async () => {
  const kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  privateKey = kp.privateKey;
  const spki = Buffer.from(await crypto.subtle.exportKey('spki', kp.publicKey)).toString('base64');
  publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${spki.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;

  const origFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const u = String(input && input.url ? input.url : input);
    if (u === EPOCH_URL) {
      return new Response(JSON.stringify({ epoch: STUB_EPOCH }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return origFetch(input, init);
  };
  globalThis.__origFetch = origFetch;
});

after(() => {
  globalThis.fetch = globalThis.__origFetch;
  delete globalThis.__origFetch;
});

test('有效 cookie → 200 {ok:true}，带 no-store', async () => {
  const cookie = await makeCookie(1, Date.now() + 3600_000);
  const { res, body } = await sessionCheck(
    mockContext('https://blog.styrigx.com/api/session-check', { cookie }),
  );
  assert.equal(res.status, 200);
  assert.deepEqual(body, { ok: true });
  assert.equal(res.headers.get('Content-Type'), 'application/json');
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
});

test('无 cookie → 401 {ok:false}，带 no-store', async () => {
  const { res, body } = await sessionCheck(
    mockContext('https://blog.styrigx.com/api/session-check'),
  );
  assert.equal(res.status, 401);
  assert.deepEqual(body, { ok: false });
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
});

test('签名被篡改 → 401 {ok:false}', async () => {
  const good = await makeCookie(1, Date.now() + 3600_000);
  const parts = good.split('.');
  const sigChars = parts[2].split('');
  /* 翻转签名中间的一个字符（末尾字符低 2 位是填充位，改它可能不改变签名字节） */
  sigChars[10] = sigChars[10] === 'A' ? 'B' : 'A';
  const cookie = `${parts[0]}.${parts[1]}.${sigChars.join('')}`;
  const { res, body } = await sessionCheck(
    mockContext('https://blog.styrigx.com/api/session-check', { cookie }),
  );
  assert.equal(res.status, 401);
  assert.deepEqual(body, { ok: false });
});

test('过期 cookie → 401 {ok:false}', async () => {
  const cookie = await makeCookie(1, Date.now() - 1000);
  const { res, body } = await sessionCheck(
    mockContext('https://blog.styrigx.com/api/session-check', { cookie }),
  );
  assert.equal(res.status, 401);
  assert.deepEqual(body, { ok: false });
});

test('epoch 过旧（< 主站最新 epoch）→ 401 {ok:false}', async () => {
  const cookie = await makeCookie(0, Date.now() + 3600_000);
  const { res, body } = await sessionCheck(
    mockContext('https://blog.styrigx.com/api/session-check', { cookie }),
  );
  assert.equal(res.status, 401);
  assert.deepEqual(body, { ok: false });
});

test('锁屏未配置（SGX_SITE 不是 blog）→ 200 {ok:true}，与放行逻辑一致', async () => {
  const { res, body } = await sessionCheck(
    mockContext('https://blog.styrigx.com/api/session-check', { env: {} }),
  );
  assert.equal(res.status, 200);
  assert.deepEqual(body, { ok: true });
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
});

test('SGX_ED25519_PUBLIC 未配置 → 401（fail closed）', async () => {
  const { res, body } = await sessionCheck(
    mockContext('https://blog.styrigx.com/api/session-check', { env: { SGX_SITE: 'blog' } }),
  );
  assert.equal(res.status, 401);
  assert.deepEqual(body, { ok: false });
});

test('pages.dev 生产别名上 /api/session-check 仍先 301 到正式域名', async () => {
  const res = await onRequest(
    mockContext('https://styrigx-blog.pages.dev/api/session-check', { env: {} }),
  );
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('Location'), 'https://blog.styrigx.com/api/session-check');
});

test('受保护的 HTML 响应带 Cache-Control: no-store', async () => {
  const cookie = await makeCookie(1, Date.now() + 3600_000);
  const res = await onRequest(
    mockContext('https://blog.styrigx.com/post/abc/', {
      cookie,
      nextBody: new Response('<html></html>', {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }),
    }),
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
  assert.equal(await res.text(), '<html></html>');
});

test('受保护的非 HTML 响应不加 no-store', async () => {
  const cookie = await makeCookie(1, Date.now() + 3600_000);
  const res = await onRequest(
    mockContext('https://blog.styrigx.com/rss.xml', {
      cookie,
      nextBody: new Response('<rss/>', {
        headers: { 'Content-Type': 'application/rss+xml' },
      }),
    }),
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Cache-Control'), null);
});

test('无效会话的页面请求 302 到主站锁屏，带 no-store', async () => {
  const res = await onRequest(mockContext('https://blog.styrigx.com/post/abc/'));
  assert.equal(res.status, 302);
  assert.ok(res.headers.get('Location').startsWith('https://styrigx.com/?lock=1&return='));
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
});
