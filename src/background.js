const RULESET_ID = 'tracking_params';

async function syncRulesetState() {
  const { enabled = true } = await chrome.storage.sync.get({ enabled: true });
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: enabled ? [RULESET_ID] : [],
    disableRulesetIds: enabled ? [] : [RULESET_ID],
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const currentState = await chrome.storage.sync.get('enabled');
  if (typeof currentState.enabled === 'undefined') {
    await chrome.storage.sync.set({ enabled: true });
  }
  await syncRulesetState();
});

chrome.runtime.onStartup.addListener(syncRulesetState);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'setEnabled') {
    return false;
  }

  (async () => {
    await chrome.storage.sync.set({ enabled: Boolean(message.enabled) });
    await syncRulesetState();
    sendResponse({ ok: true });
  })().catch((error) => {
    sendResponse({ ok: false, error: error.message });
  });

  return true;
});
