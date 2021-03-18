const defaultLocation = 'regionOther';
let userLocation = defaultLocation;

const defaultCarbonIntensityFactorIngCO2PerKWh = 519;
const kWhPerByteDataCenter = 0.000000000072;
const kWhPerByteNetwork = 0.000000000152;
const kWhPerMinuteDevice = 0.00021;

const GESgCO2ForOneKmByCar = 220;
const GESgCO2ForOneChargedSmartphone = 8.3;

const carbonIntensityFactorIngCO2PerKWh = {
    'regionEuropeanUnion': 276,
    'regionFrance': 34.8,
    'regionUnitedStates': 493,
    'regionChina': 681,
    'regionOther': defaultCarbonIntensityFactorIngCO2PerKWh
};

let statsInterval;

parseStats = () => {
    const stats = localStorage.getItem('stats');
    return null === stats ? {} : JSON.parse(stats);
}

getStats = () => {
    const stats = parseStats();
    let total = 0;
    const sortedStats = [];

    for (let origin in stats) {
        total += stats[origin];
        sortedStats.push({ 'origin': origin, 'byte': stats[origin] });
    }

    sortedStats.sort(function(a, b) {
        return a.byte < b.byte ? 1 : a.byte > b.byte ? -1 : 0
    });

    const highestStats = sortedStats.slice(0, 4);
    let subtotal = 0;
    for (let index in highestStats) {
        subtotal += highestStats[index].byte;
    }

    if (total > 0) {
        const remaining = total - subtotal;
        if (remaining > 0) {
            highestStats.push({ 'origin': translate('statsOthers'), 'byte': remaining });
        }

        highestStats.forEach(function(item) {
            item.percent = Math.round(100 * item.byte / total)
        });
    }

    return {
        'total': total,
        'highestStats': highestStats
    }
}

toMegaByte = (value) => (Math.round(value / 1024 / 1024));

showStats = () => {
    const stats = getStats();
    let ctx = document.getElementById('myChart').getContext('2d');

    if (stats.total === 0) {
        return;
    }

    show(statsElement);

    const statsListItemsElement = document.getElementById('statsListItems');
    while (statsListItemsElement.firstChild) {
        statsListItemsElement.removeChild(statsListItemsElement.firstChild);
    }

    for (let index in stats.highestStats) {
        if (stats.highestStats[index].percent < 1) {
            continue;
        }


        const text = document.createTextNode(`${stats.highestStats[index].percent}% ${stats.highestStats[index].origin}`);
        const li = document.createElement("LI");
        li.appendChild(text);
        statsListItemsElement.appendChild(li);
    }

    let duration = localStorage.getItem('duration');
    duration = null === duration ? 0 : duration;


    const principalWebsite = [];
    const principalWebsiteStats = [];
    stats.highestStats.forEach(data=>{
        principalWebsite.push(data.origin);
        principalWebsiteStats.push(data.percent)
    })

    const kWhDataCenterTotal = stats.total * kWhPerByteDataCenter;
    const GESDataCenterTotal = kWhDataCenterTotal * defaultCarbonIntensityFactorIngCO2PerKWh;

    const kWhNetworkTotal = stats.total * kWhPerByteNetwork;
    const GESNetworkTotal = kWhNetworkTotal * defaultCarbonIntensityFactorIngCO2PerKWh;

    const kWhDeviceTotal = duration * kWhPerMinuteDevice;
    const GESDeviceTotal = kWhDeviceTotal * carbonIntensityFactorIngCO2PerKWh[userLocation];

    const kWhTotal = Math.round(1000 * (kWhDataCenterTotal + kWhNetworkTotal + kWhDeviceTotal)) / 1000;
    const gCO2Total = Math.round(GESDataCenterTotal + GESNetworkTotal + GESDeviceTotal);
    const pingoo = Math.round(gCO2Total/6666);

    const kmByCar = Math.round(1000 * gCO2Total / GESgCO2ForOneKmByCar) / 1000;
    const chargedSmartphones = Math.round(gCO2Total / GESgCO2ForOneChargedSmartphone);


    const megaByteTotal = toMegaByte(stats.total);


    const hours = (duration / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    document.getElementById('duration').textContent = rhours + "h" + rminutes;
    document.getElementById('mbTotalValue').textContent = megaByteTotal;
    document.getElementById('pingoo').textContent = pingoo;

    document.getElementById('kWhTotalValue').textContent = kWhTotal.toString();
    document.getElementById('gCO2Value').textContent = gCO2Total.toString();
   // document.getElementById('chargedSmartphonesValue').textContent = chargedSmartphones.toString();
    document.getElementById('kmByCarValue').textContent = kmByCar.toString();
    console.log(principalWebsite)
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: principalWebsite,
            datasets: [{
                label: '# of Votes',
                data: principalWebsiteStats,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        display: false
                    }
                }]
            }
        }
    });


    /* const equivalenceTitle = document.getElementById('equivalenceTitle');
    while (equivalenceTitle.firstChild) {
        equivalenceTitle.removeChild(equivalenceTitle.firstChild);
    }
    equivalenceTitle.appendChild(document.createTextNode(chrome.i18n.getMessage('equivalenceTitle', [duration.toString(), megaByteTotal, kWhTotal.toString(), gCO2Total.toString()])));
*/
}

start = () => {
    chrome.runtime.sendMessage({ action: 'start' });

    hide(startButton);
    show(stopButton);
    show(analysisInProgressMessage);
    localStorage.setItem('analysisStarted', '1');
}

stop = () => {
    chrome.runtime.sendMessage({ action: 'stop' });

    hide(stopButton);
    show(startButton);
    hide(analysisInProgressMessage);
    clearInterval(statsInterval);
    localStorage.removeItem('analysisStarted');
}

reset = () => {
    if (!confirm(translate('resetConfirmation'))) {
        return;
    }

    localStorage.removeItem('stats');
    localStorage.removeItem('duration');
    hide(statsElement);
    showStats();
    hide(resetButton);
}

init = () => {
    const selectedRegion = localStorage.getItem('selectedRegion');

    if (null !== selectedRegion) {
        userLocation = selectedRegion;
        selectRegion.value = selectedRegion;
    }

    if (null === localStorage.getItem('stats')) {
        hide(resetButton);
    } else {
        show(resetButton);
    }

    showStats();

    if (null === localStorage.getItem('analysisStarted')) {
        return;
    }

    start();
    statsInterval = setInterval(showStats, 2000);
}

selectRegionHandler = (event) => {
    const selectedRegion = event.target.value;

    if ('' === selectedRegion) {
        return;
    }

    localStorage.setItem('selectedRegion', selectedRegion);
    userLocation = selectedRegion;
    showStats();
}

translate = (translationKey) => {
    return chrome.i18n.getMessage(translationKey);
}

translateText = (target, translationKey) => {
    target.appendChild(document.createTextNode(translate(translationKey)));
}

translateHref = (target, translationKey) => {
    target.href = chrome.i18n.getMessage(translationKey);
}

hide = element => element.classList.add('hidden');
show = element => element.classList.remove('hidden');

const analysisInProgressMessage = document.getElementById('analysisInProgressMessage');

const statsElement = document.getElementById('stats');

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', start);

const stopButton = document.getElementById('stopButton');
stopButton.addEventListener('click', stop);

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', reset);

const selectRegion = document.getElementById('selectRegion');
selectRegion.addEventListener('change', selectRegionHandler);

document.querySelectorAll('[translate]').forEach(function(element) {
    translateText(element, element.getAttribute('translate'));
});

document.querySelectorAll('[translate-href]').forEach(function(element) {
    translateHref(element, element.getAttribute('translate-href'));
});

init();
