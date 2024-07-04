chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.storage.sync.get('whitelist', (data) => {
      const whitelist = data.whitelist || [];
      const url = new URL(tab.url);

      console.log(whitelist);
      console.log(url.hostname);
      const isWhitelisted = whitelist.some((domain) => url.hostname.includes(domain));

      if (isWhitelisted) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js'],
        });
      }
    });
  }
});
