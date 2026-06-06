const checkbox = document.querySelector('#enabled');
const statusText = document.querySelector('#status');

async function loadState() {
  const { enabled = true } = await chrome.storage.sync.get({ enabled: true });
  checkbox.checked = enabled;
  statusText.textContent = enabled ? '清理已启用。' : '清理已暂停。';
}

checkbox.addEventListener('change', async () => {
  checkbox.disabled = true;
  const response = await chrome.runtime.sendMessage({
    type: 'setEnabled',
    enabled: checkbox.checked,
  });
  checkbox.disabled = false;

  if (!response?.ok) {
    checkbox.checked = !checkbox.checked;
    statusText.textContent = `设置失败：${response?.error ?? '未知错误'}`;
    return;
  }

  statusText.textContent = checkbox.checked ? '清理已启用。' : '清理已暂停。';
});

loadState().catch((error) => {
  statusText.textContent = `加载失败：${error.message}`;
});
