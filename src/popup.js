const checkbox = document.querySelector('#enabled');
const statusText = document.querySelector('#status');

async function loadState() {
  const { enabled = true } = await chrome.storage.sync.get({ enabled: true });
  checkbox.checked = enabled;
  statusText.textContent = enabled ? '清理已启用。' : '清理已暂停。';
}

checkbox.addEventListener('change', async () => {
  const nextEnabled = checkbox.checked;
  checkbox.disabled = true;

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'setEnabled',
      enabled: nextEnabled,
    });

    if (!response?.ok) {
      checkbox.checked = !nextEnabled;
      statusText.textContent = `设置失败：${response?.error ?? '未知错误'}`;
      return;
    }

    statusText.textContent = nextEnabled ? '清理已启用。' : '清理已暂停。';
  } catch (error) {
    checkbox.checked = !nextEnabled;
    statusText.textContent = `设置失败：${error.message}`;
  } finally {
    checkbox.disabled = false;
  }
});

loadState().catch((error) => {
  statusText.textContent = `加载失败：${error.message}`;
});
