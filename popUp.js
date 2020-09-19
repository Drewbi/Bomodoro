let browserApi;
try {
    browserApi = browser;
} catch (e) {
    if (e instanceof ReferenceError) {
        console.log('switch to chrome api');
        browserApi = chrome;
    } else {
        throw (e);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("explode").addEventListener("click", onClick, false)

    function onClick() {
        chrome.tabs.query({ currentWindow: true, active: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, "hi", setCount)
            })
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

    function setCount(res) {

        for (let i = 0; i < res.links.length; i++) {
            let div = document.createElement("div")
            div.textContent = `${res.links[i]}`
            document.body.appendChild(div)
        }
        openLinks(res.links)
    }

}, false)