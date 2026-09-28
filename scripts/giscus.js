/* global hexo */
'use strict';

// Giscus 留言：只注入到文章页（post），首页/归档/关于页不加载
hexo.extend.injector.register('body_end', () => `
<div class="comments" id="giscus-comments" style="margin-top:32px;max-width:700px;margin-left:auto;margin-right:auto;padding:0 20px;">
<script src="https://giscus.app/client.js"
  data-repo="styrigx/gray-blog"
  data-repo-id="R_kgDOUvdSCg"
  data-category="Blog Comments"
  data-category-id="DIC_kwDOUvdSCs4DGjtd"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="zh-CN"
  crossorigin="anonymous"
  async></script>
</div>
`, 'post');
