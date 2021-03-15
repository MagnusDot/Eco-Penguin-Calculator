let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color: 'green' });
    chrome.storage.sync.get(['color'], function(color){
        console.log(color)
    });
    console.log('Default background color set to %cgreen', `color: ${color}`);
});


chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.type == "UpdateData"){
        chrome.storage.sync.get(['PagesSize'], function(PagesSize){

            console.log(PagesSize)
            if(typeof PagesSize.PagesSize === 'undefined'){
                chrome.storage.sync.set({PagesSize: request.options.size}, function(){
                    console.log('set ' + request.options.size)
                });
            }else {
                let total = PagesSize.PagesSize + request.options.size
                chrome.storage.sync.set({PagesSize: total}, function(){
                    console.log('added ' + request.options.size)
                });
            }

        });

    }
});
