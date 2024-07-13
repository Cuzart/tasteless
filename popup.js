document?.addEventListener('DOMContentLoaded', () => {
  const whitelistEl = document.getElementById('whitelist');
  const domainInput = document.getElementById('domain');
  const addButton = document.getElementById('add');

  chrome.permissions.getAll(function (permissions) {
    permissions?.origins.forEach((domain) => addDomainToUI(domain));
  });

  addButton?.addEventListener('click', () => {
    let domain = domainInput.value.trim();

    if (!domain.includes('www.')) {
      domain = 'www.' + domain;
    }
    if (!(domain.startsWith('http://') || domain.startsWith('https://'))) {
      domain = 'https://' + domain;
    }

    if (!domain.endsWith('/')) {
      domain += '/';
    }

    if (domain) {
      chrome.permissions.request({ origins: [domain] }, (granted) => {
        if (granted) {
          const isTrailingSlash = domain.at(-1) === '/';
          addDomainToUI(domain + isTrailingSlash ? '*' : '/*');
          domainInput.value = '';
        } else {
          console.log('Permission not granted');
        }
      });
    }
  });

  function addDomainToUI(domain) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const button = document.createElement('button');
    button.classList.add('btn-delete');
    button?.addEventListener('click', () => {
      li.remove();

      chrome.permissions.remove({ origins: [domain] }, (removed) => {
        console.log(removed, 'TRIED to remove');
      });
    });

    span.textContent = domain;
    li.appendChild(span);
    li.appendChild(button);
    whitelistEl.appendChild(li);
  }
});
