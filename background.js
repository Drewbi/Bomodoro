chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({disabled: false, chance: 100}, function() {
    console.log("Background initialised");
  });
});