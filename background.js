chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    chrome.permissions.contains({ origins: [url.origin + '/*'] }, (result) => {
      if (result) {
        console.log('IS IN WHITELIST');
        chrome.tabs.executeScript(tabId, {
          code: 'window.localStorage.setItem("umami.disabled", "true");',
        });
      }
    });
  }
});
