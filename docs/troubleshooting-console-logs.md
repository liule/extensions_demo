# Console 日志排查

加载本插件后，如果在网页 DevTools Console 中看到类似下面的日志，通常并不表示本插件的代码在页面中报错：

```text
content_main.js:4683 This page uses Chrome's Built-In AI features (LanguageDetector)!
content_main.js:4683 Uncaught (in promise) fetchError: <!DOCTYPE html><html ...><title>Just a moment...</title>...
all_async_search_ee864ce.js:2038 ...
```

## 为什么这些日志通常不是本插件产生的？

本插件只声明了以下能力：

- `declarativeNetRequest`：通过静态规则在浏览器网络层清理 URL 参数。
- `storage`：保存弹窗开关状态。
- `background.service_worker`：同步规则集启用状态。

本插件没有声明 `content_scripts`，因此不会把名为 `content_main.js`、`content_guard.js` 或 `all_async_search_*.js` 的脚本注入网页，也不会在网页上下文里调用 Chrome Built-In AI 的 `LanguageDetector`。

## 这些日志分别可能代表什么？

- `This page uses Chrome's Built-In AI features (LanguageDetector)`：页面或其他扩展正在使用 Chrome 内置 AI 语言检测功能。
- `fetchError` 且响应内容包含 `Just a moment...`：某个页面脚本或其他扩展发起的请求被 Cloudflare 挑战页拦截，返回了 HTML，而不是调用方期望的接口响应。
- `all_async_search_*.js`：通常是当前网站自身的异步页面脚本输出，与本插件的规则文件命名无关。

## 如何确认是否与本插件有关？

1. 打开 `chrome://extensions/`。
2. 只保留「URL 跟踪参数清理器」启用，临时停用其他扩展。
3. 刷新目标网页，观察 Console 是否仍出现 `content_main.js` 或 `content_guard.js`。
4. 如果日志消失，说明它来自其他扩展；如果仍然出现，继续使用无痕窗口或全新 Chrome Profile 复现。
5. 若要确认本插件是否改写了导航 URL，请测试：

   ```text
   https://example.com/?utm_source=newsletter&fbclid=test&id=123
   ```

   预期结果是只删除 `utm_source` 和 `fbclid`，保留业务参数 `id=123`。

## 本插件会影响哪些请求？

当前静态规则只匹配 `main_frame` 和 `sub_frame` 导航请求。这意味着它会清理页面地址和 iframe 导航中的跟踪参数，但不会改写网页中的 `fetch`、XHR、图片、脚本或样式请求。

如果你确认为某个网站的导航参数被误删，请记录原始 URL、被删除的参数名和复现步骤，再调整 `rules/tracking-params.json`。
