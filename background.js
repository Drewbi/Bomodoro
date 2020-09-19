chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({disabled: false, chance: 100}, function() {
    console.log("Background initialised");
  });
  chrome.tabs.onCreated.addListener(function() {
    chrome.storage.local.get(['disabled', 'chance'], function(result) {
      if(!result.disabled && Math.random() * result.chance < 1) console.log('boom') 
    });
  })
});