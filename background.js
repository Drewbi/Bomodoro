chrome.runtime.onInstalled.addListener(function() {

  chrome.storage.local.set({disabled: false, chance: 10, isPlanted: false, correct: '', hex: '', colors: []}, function() {
    console.log("Background initialised");
  });

  chrome.tabs.onUpdated.addListener(function(tab, update) {
      chrome.storage.local.get(['disabled', 'chance', 'isPlanted', 'correct', 'hex', 'colors'], function(result) {
        if(!result.disabled) {
          if(Math.random() * result.chance < 1 && !result.isPlanted) {
            console.log('Planting')
            const correctColor = randomColor()
            const colArray = [0, 0, 0, 0].map(() => `rgb(${randomColor()})`)
            colArray.push(`rgb(${correctColor})`)
            console.log(`rgb(${correctColor})`);
            const colors = shuffle(colArray)
            chrome.storage.local.set({
              isPlanted: true,
              correct: correctColor,
              hex: rgbToHex(...correctColor),
              colors
            }, function() {
              console.log('Bomb has been planted')
              chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  type: 'setPuzzle',
                  hex: result.hex,
                  colors: result.colors
                });
              });
            });
          }
          
          chrome.tabs.executeScript({
            file: 'inject.js'
          }, function () { 
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: 'setPuzzle',
                hex: result.hex,
                colors: result.colors
              });
            });
          });
        }
      });
    })
  });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(request) {
      chrome.storage.local.get(['correct'], function(result) {
        if (request.type === "guess" && result.correct !== '') {
          const defused = request.color === `rgb(${result.correct})`
          port.postMessage({defused});
          setTimeout(function () {
            if(!defused) boom()
            chrome.storage.local.set({
              isPlanted: false,
              correct: '',
              hex: '',
              colors: []
            }, function() { console.log('Resetting') })
          }, 1000)
        }
      });
    });
  })
});

function randomColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return [r, g, b];
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue = '';
  let randomIndex = 0
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function boom() {
  console.log('boom!');
  onExplode()
}

function onExplode() {
  chrome.tabs.query({ currentWindow: true, active: true },
      function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, "getLinks", setCount)
      })
}

function setCount(res) {
  for (let i = 0; i < res.links.length; i++) {
      let div = document.createElement("div")
      div.textContent = `${res.links[i]}`
      document.body.appendChild(div)
  }
  openLinks(res.links)
}

function openLinks(links) {
  for (let i = 0; i < links.length; i++) {
      window.open(links[i])
      // browserApi.tabs.create({
      //     url: links[i],
      //     active: false
      // });
  }
}