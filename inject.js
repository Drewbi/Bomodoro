if (!document.injected) {
  let hex = ''
  let colors = []

  chrome.runtime.onMessage.addListener(
    function (request) {
      if (request.type === 'setPuzzle') {
        console.log('Setting Puzzle');
        hex = request.hex
        colors = request.colors
        if (hex !== '') constructBomb(hex, colors)
      }
    });

  document.injected = true
}


function constructBomb(hex, colors) {
  if (document.getElementById('bomb-container') === null) {
    console.log('Constructing');
    const bomb = document.createElement('div')

    bomb.setAttribute('id', 'bomb-container')

    const interface = document.createElement('div')
    interface.setAttribute('id', 'bomb-interface')

    const display = document.createElement('p')
    display.setAttribute('id', 'bomb-display')
    display.innerText = hex

    const input = document.createElement('div')
    input.setAttribute('id', 'bomb-input')

    colors.forEach(function (color) {
      const square = document.createElement('button')
      square.setAttribute('class', 'bomb-button')
      square.setAttribute('style', `background-color: ${color}`)
      square.addEventListener('click', function () { submitGuess(color) })
      input.appendChild(square)
    })

    interface.appendChild(display)
    interface.appendChild(input)

    bomb.appendChild(interface)
    const [body] = document.getElementsByTagName('body')
    body.appendChild(bomb)
  }
}

function bombTriggered() {
  const display = document.getElementById('bomb-display')
  display.innerText = 'Detonating Bomb'
  setTimeout(cleanupBomb, 1000)
}

function bombDefused() {
  const display = document.getElementById('bomb-display')
  display.innerText = 'Bomb Defused'
  display.style.color = '#2288ff'
  setTimeout(cleanupBomb, 1000)
}

function cleanupBomb() {
  const bombDebris = document.getElementById('bomb-container')
  const [body] = document.getElementsByTagName('body')
  body.removeChild(bombDebris)
}

function submitGuess(color) {
  const port = chrome.runtime.connect({name: "defusalPort"});
  port.postMessage({type: "guess", color: color});
  port.onMessage.addListener(function(response) {
    if(response.defused) bombDefused()
    else if(!response.defused) bombTriggered()
  });
}



