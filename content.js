chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message == 'getLinks'){
        var links = document.links
        var extractlinks = []

        for (let i = 0; i < links.length; i++) {
            extractlinks.push(links[i].href)
        }
        console.log(`Found ${links.length} links`)
        sendResponse({ count: links, links: extractlinks })
    }
})