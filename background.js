chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({blockedSites : []})
})

chrome.storage.onChanged.addListener(function(changes, namespace){
    for(let [key, {newValue}] of Object.entries(changes)){
        if(key === 'blockedSites'){
            updateDynamicRules(newValue)
        }
    }
})

function updateDynamicRules(){
    chrome.declarativeNetRequest.getDynamicRules(rules => {
        const ruleIds = rules.map(rule => rule.id)
        chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds:ruleIds},() => {
            const newRules = sites.map((site,index) => createRule(site, index +1))
            chrome.declarativeNetRequest.updateDynamicRules({addRules: newRules})
        })
    })
}
function createRule(site, id){
    return {
        id: id,
        priority: 1,
        action: {type:'block'},
        condition: {urlFilter: `*://${site}, resourceTypes:['main_frame']`}
    }
}

