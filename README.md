# URL 跟踪参数清理器 Chrome 插件

这是一个 Manifest V3 Chrome 插件，用于在网页导航时自动移除 URL 中常见的营销、广告和社交平台跟踪参数，例如 `utm_*`、`fbclid`、`gclid`、`msclkid` 等。

## 功能

- 使用 `declarativeNetRequest` 在请求阶段清理主页面和 iframe 导航 URL。
- 默认启用静态规则集 `tracking_params`，无需远程服务。
- 提供弹窗开关，可随时启用或暂停清理。
- 不收集、不上传、不存储浏览历史；仅在浏览器本地保存启用状态。

## 项目结构

```text
manifest.json                 # Chrome 扩展清单
popup.html                    # 扩展弹窗入口
src/background.js             # 同步规则集开关状态的 service worker
src/popup.js                  # 弹窗交互逻辑
src/popup.css                 # 弹窗样式
rules/tracking-params.json    # declarativeNetRequest 清理规则
docs/debug-and-publish.md     # 调试与发布流程
```

## 本地安装

1. 打开 Chrome，进入 `chrome://extensions/`。
2. 开启右上角「开发者模式」。
3. 点击「加载已解压的扩展程序」。
4. 选择本仓库目录。
5. 打开包含跟踪参数的网址进行验证，例如：
   `https://example.com/?utm_source=newsletter&fbclid=test&id=123`。

更多调试、打包和发布步骤见 [docs/debug-and-publish.md](docs/debug-and-publish.md)。

## Console 日志排查

如果网页 Console 中出现 `content_main.js`、`content_guard.js`、Chrome Built-In AI `LanguageDetector` 或 Cloudflare `Just a moment...` 相关错误，请先参考 [Console 日志排查](docs/troubleshooting-console-logs.md)。本插件不注入网页 content script，通常不会产生这些日志。
