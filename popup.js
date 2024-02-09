document.addEventListener('DOMContentLoaded', () => {
    updateBlockedSitesList();
});

document.getElementById('blockSite').addEventListener('click', () => {
    
    const url = new URL(document.getElementById('siteUrl').value);
    const domain = url.hostname;
    if (url) {
        chrome.storage.local.get({ blockedSites: [] }, (result) => {
            const updatedList = [...result.blockedSites, domain];
            chrome.storage.local.set({ blockedSites: updatedList }, () => {
                updateBlockedSitesList();
            });
        });
    }
});

document.getElementById('unblockSite').addEventListener('click', () => {
    const inputUrl = document.getElementById('siteUrl').value;
    const url = new URL(inputUrl).hostname; // Extrair o hostname da URL inserida

    chrome.storage.local.get({ blockedSites: [] }, (result) => {
        const updatedList = result.blockedSites.filter(site => site !== url);
        chrome.storage.local.set({ blockedSites: updatedList }, () => {
            updateBlockedSitesList();
            updateDynamicRules(updatedList); // Atualizar as regras dinâmicas
        });
    });
});


function updateBlockedSitesList() {
    chrome.storage.local.get({ blockedSites: [] }, (result) => {
        const listElement = document.getElementById('blockedSitesList');
        listElement.innerHTML = '';
        result.blockedSites.forEach(site => {
            const listItem = document.createElement('li');
            listItem.textContent = site;
            listElement.appendChild(listItem);
        });
    });
}
