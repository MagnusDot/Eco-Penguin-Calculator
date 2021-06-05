var isChrome = !!window.chrome;
let browserType = null;
if (isChrome) {
    browserType = chrome;
} else {
    browserType = browser;
}


extractHostname = (url) => {
    let hostname = url.indexOf("//") > -1 ? url.split('/')[2] : url.split('/')[0];

    // find & remove port number
    hostname = hostname.split(':')[0];
    // find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
};

setByteLengthPerOrigin = (origin, byteLength) => {
    const stats = localStorage.getItem('stats');
    const statsJson = null === stats ? {} : JSON.parse(stats);

    let bytePerOrigin = undefined === statsJson[origin] ? 0 : parseInt(statsJson[origin]);
    statsJson[origin] = bytePerOrigin + byteLength;

    localStorage.setItem('stats', JSON.stringify(statsJson));
};

isChrome = () => {
    return (typeof(browser) === 'undefined');
};

headersReceivedListener = (requestDetails) => {
    if (isChrome()) {
        const origin = extractHostname(!requestDetails.initiator ? requestDetails.url : requestDetails.initiator);
        const responseHeadersContentLength = requestDetails.responseHeaders.find(element => element.name.toLowerCase() === "content-length");
        const contentLength = undefined === responseHeadersContentLength ? { value: 0 } :
            responseHeadersContentLength;
        const requestSize = parseInt(contentLength.value, 10);
        setByteLengthPerOrigin(origin, requestSize);

        return {};
    }

    let filter = browser.webRequest.filterResponseData(requestDetails.requestId);

    filter.ondata = event => {
        const origin = extractHostname(!requestDetails.originUrl ? requestDetails.url : requestDetails.originUrl);
        setByteLengthPerOrigin(origin, event.data.byteLength);

        filter.write(event.data);
    };

    filter.onstop = () => {
        filter.disconnect();
    };

    return {};
};

setBrowserIcon = (type) => {
    chrome.browserAction.setIcon({ path: `icons/pingoo-${type}.png` });
};

addOneMinute = () => {
    let duration = localStorage.getItem('duration');
    duration = null === duration ? 1 : 1 * duration + 1;
    localStorage.setItem('duration', duration);
};

let addOneMinuteInterval;

handleMessage = (request) => {
    if ('start' === request.action) {
        setBrowserIcon('on');

        browserType.webRequest.onHeadersReceived.addListener(
            headersReceivedListener, { urls: ['<all_urls>'] }, ['responseHeaders']
        );

        if (!addOneMinuteInterval) {
            addOneMinuteInterval = setInterval(addOneMinute, 60000);
        }

        return;
    }

    if ('stop' === request.action) {
        setBrowserIcon('off');
        browserType.webRequest.onHeadersReceived.removeListener(headersReceivedListener);

        if (addOneMinuteInterval) {
            clearInterval(addOneMinuteInterval);
            addOneMinuteInterval = null;
        }
    }
};

browserType.runtime.onMessage.addListener(handleMessage);


let connections = {};



/*
 * Listen for message form tab and send it to devtools
 **/
const notify = (message, sender, sendResponse) => {

    if (sender.tab) {
        let tabId = sender.tab.id;
        if (tabId in connections) connections[tabId].postMessage(message);
        else console.warn("Tab not found in connection list.");
    } else console.warn("sender.tab not defined.");
}


browserType.runtime.onMessage.addListener(notify);

console.log("start background process");

// Listen to message from devTools
browserType.runtime.onConnect.addListener((devToolsConnection) => {
    console.log("received onConnect");
    // assign the listener function to a variable so we can remove it later
    let devToolsListener = (message, sender, sendResponse) => {
            // Inject a content script into the identified tab
            console.log("received script to execute form tabId " + message.tabId);
            if (!connections[message.tabId]) connections[message.tabId] = devToolsConnection;
            browserType.tabs.executeScript(message.tabId, { code: "var analyseBestPractices=" + message.analyseBestPractices + ";", allFrames: true });
            browserType.tabs.executeScript(message.tabId, { file: message.scriptToInject, allFrames: true });
        }
        // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);

    devToolsConnection.onDisconnect.addListener((port) => {
        devToolsConnection.onMessage.removeListener(devToolsListener);

        Object.keys(connections).map(tab => {
            if (connections[tab] == port) {
                delete connections[tab];
                return false;
            }
        });
    });

});