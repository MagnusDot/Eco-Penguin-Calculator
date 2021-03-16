chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.type == "UpdateData"){
        chrome.storage.sync.get(['PagesSize'], function(PagesSize){

            if(typeof PagesSize.PagesSize === 'undefined'){
                chrome.storage.sync.set({PagesSize: request.options.size}, function(){
                });
            }else {
                let total = PagesSize.PagesSize + request.options.size
                chrome.storage.sync.set({PagesSize: total}, function(){
                });
            }

        });

    }
});
