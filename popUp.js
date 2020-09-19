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