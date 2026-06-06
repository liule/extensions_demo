# Chrome 插件调试与发布流程

## 1. 本地调试

1. 打开 Chrome 的 `chrome://extensions/`。
2. 开启「开发者模式」。
3. 点击「加载已解压的扩展程序」，选择项目根目录。
4. 在扩展卡片中点击「详情」，确认权限和「允许访问网站」设置符合预期。
5. 点击扩展图标打开弹窗，切换「启用清理」检查开关状态是否正常保存。

## 2. 验证清理效果

使用测试 URL：

```text
https://example.com/?utm_source=newsletter&utm_medium=email&fbclid=abc&id=123
```

预期结果：浏览器最终地址保留业务参数 `id=123`，删除 `utm_source`、`utm_medium` 和 `fbclid`。

如需调试规则：

1. 在 `chrome://extensions/` 找到扩展。
2. 点击「Service worker」链接打开 DevTools。
3. 查看 Console 是否有安装、启动或消息处理错误。
4. 修改 `rules/tracking-params.json` 后，在扩展卡片点击「重新加载」。
5. 再次访问测试 URL，确认行为符合预期。

## 3. 发布前检查

- 确认 `manifest.json` 的 `version` 已递增。
- 确认 `rules/tracking-params.json` 只清理明确的跟踪参数，避免误删业务参数。
- 在全新 Chrome Profile 中加载扩展，验证默认启用、弹窗开关和导航清理。
- 检查隐私说明：插件不上传数据，仅使用 `storage` 保存启用状态。
- 准备 Chrome Web Store 需要的素材：扩展名称、简短说明、详细说明、截图、图标和隐私政策页面。

## 4. 打包 zip

在项目根目录执行：

```bash
zip -r url-tracking-cleaner.zip manifest.json popup.html src rules README.md docs -x "*.DS_Store"
```

打包后建议解压到临时目录，再通过「加载已解压的扩展程序」验证 zip 内容完整。

## 5. Chrome Web Store 发布

1. 登录 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)。
2. 点击「新增项目」并上传 `url-tracking-cleaner.zip`。
3. 填写商品详情、分类、语言、截图和图标。
4. 填写隐私权相关表单：声明插件不收集用户数据，并说明 `declarativeNetRequest` 与 `storage` 的用途。
5. 选择发布范围，提交审核。
6. 审核通过后，先小范围验证线上版本，再扩大发布范围。

## 6. 版本更新流程

1. 修改代码或规则。
2. 更新 `manifest.json` 中的 `version`。
3. 按「发布前检查」重新验证。
4. 重新打包 zip。
5. 在 Developer Dashboard 上传新包并提交审核。
