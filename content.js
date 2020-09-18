chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var links = document.links
    var extractlinks = []
    console.log(links[1].href)

    for (let i = 0; i < links.length; i++) {
        extractlinks.push(links[i].href)
    }
    console.log(extractlinks)
    sendResponse({ count: links, links: extractlinks })
})