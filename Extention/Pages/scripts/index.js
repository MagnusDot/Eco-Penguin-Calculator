

function UpdateSize(){
    chrome.storage.sync.get(['PagesSize'], function(PagesSize){
        let gigaConsumed  = PagesSize.PagesSize / 1000000000;
        let KWH = gigaConsumed * 5.12;
        let CO2 = KWH * 50;
        let pingoo = CO2 / 40;
        document.getElementById('co2').innerHTML = (CO2+"").split('.')[0];
        document.getElementById('co2dec').innerHTML = "."+(CO2+"").split('.')[1];

        document.getElementById('kwh').innerHTML = (KWH+"").split('.')[0];
        document.getElementById('kwhdec').innerHTML = "."+(KWH+"").split('.')[1];

        document.getElementById('pingoo').innerHTML = (pingoo+"").split('.')[0];
        document.getElementById('pingoodec').innerHTML = "."+(pingoo+"").split('.')[1];

    })
}

setTimeout(UpdateSize, 2 + 1000)





