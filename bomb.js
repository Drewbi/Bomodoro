var numSquares = 3;
var colors = [];
var pickedColor;
var squares = document.getElementsByClassName("square");
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.getElementById("message");
var h2 = document.querySelector("h2");
var resetButton = document.querySelector("#reset");
var modeButtons = document.querySelectorAll(".mode");


init();

function init() {
    setUpSquares();
    reset();
}

function boom() {
    console.log('boom!');
    messageDisplay.textContent = 'Oh no! Watch out';
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
        // window.open(links[i])
        browserApi.tabs.create({
            url: links[i],
            active: false
        });
    }
}

function setUpSquares() {
    for (var i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", function () {
            var clickedColor = this.style.backgroundColor;
            if (clickedColor === pickedColor) {
                messageDisplay.textContent = 'Correct !';
                resetButton.textContent = "Play Again?";
                changeColors(clickedColor);
            } else {
                boom();
            }
        });
    }
}

function changeColors() {
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = pickedColor;
    }
}

function pickColor() {
    var random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

function generateRandomColors(num) {
    var arr = []
    for (var i = 0; i < num; i++) {
        arr.push(randomColor())
    }
    return arr;
}

function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function reset() {
    colors = generateRandomColors(numSquares);
    pickedColor = pickColor();
    colorDisplay.textContent = pickedColor;
    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.display = "block";
            squares[i].style.backgroundColor = colors[i];
        } else {
            squares[i].style.display = "none";
        }
    }
    resetButton.textContent = "New Colors";
    messageDisplay.textContent = 'Guess a wire to cut';
}

resetButton.addEventListener("click", function () {
    reset();
});