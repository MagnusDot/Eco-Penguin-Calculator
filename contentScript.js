function log_sizes(perfEntry) {
    return perfEntry.decodedBodySize
}

function check_PerformanceEntries() {
    // Use getEntriesByType() to just get the "resource" events
    let p = performance.getEntriesByType("resource");
    let total = 0
    for (let i = 0; i < p.length; i++) {
        total += log_sizes(p[i]);
    }


    return total;
}

function sendData() {

    let final = 0;

    setInterval(function () {
        let data = check_PerformanceEntries();
        if (final === 0) {
            console.log('whouloulou')
            final = data;
            chrome.runtime.sendMessage({
                type: "UpdateData", options: {
                    size: data,
                }
            });
        }
        chrome.runtime.sendMessage({
            type: "UpdateData", options: {
                size: (data - final),
            }
        });

        final = data;


    }, 10 * 1000)

}

sendData();



