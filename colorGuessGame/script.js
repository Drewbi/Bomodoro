var numSquares = 3;
var colors = [];
var pickedColor;
var squares = document.querySelectorAll(".square");
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

// ADDED BOOM
function boom() {
    console.log('boom!');
    window.setTimeout(function () {
        var imgTag = document.createElement("iframe");
        imgTag.setAttribute("src", "https://giphy.com/embed/XUFPGrX5Zis6Y")
        imgTag.setAttribute("width", "700")
        imgTag.setAttribute("height", "700")
        imgTag.setAttribute("frameBorder", "0")
        document.body.appendChild(imgTag)
        document.querySelector(".wrapper").remove();
    }, 1000);
}

// /ENDING OF BOOM

function setUpSquares() {
    for (var i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", function () {
            var clickedColor = this.style.backgroundColor;
            if (clickedColor === pickedColor) {
                messageDisplay.textContent = '" Correct !"';
                resetButton.textContent = "Play Again?";
                changeColors(clickedColor);
                h2.style.backgroundColor = clickedColor;
            } else {
                this.style.backgroundColor = "#232323";
                messageDisplay.textContent = '" Oh no! Watch out "';
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
    h2.style.backgroundColor = "#ffeaa7";
    resetButton.textContent = "New Colors";
    messageDisplay.textContent = '" Give it a shot "';
}

resetButton.addEventListener("click", function () {
    reset();
});