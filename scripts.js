
fetch('https://djhayes.github.io/LongCovidTrials/COVID_LC_Interv_Normalized_collab_JSON_20230924.json')
    .then((response) => response.json())
    .then((json) => buildVisualizations(json));

function buildVisualizations(json) {
    console.log(json);

    let dataReduce = (data, key) =>
        data.reduce((acc, dataPoint) => {
            let value = dataPoint[key].split(";")[0]; //If multiple countries are listed just use the first
            if (!acc[value]) {
                acc[value] = 0;
            }
            acc[value] = acc[value] + 1;
            return acc;
        }, {});

    let trialStatus = dataReduce(json, 'Recruitment_Status_valid')
    let categories = dataReduce(json, 'Category_valid')
    let countries = dataReduce(json, 'Countries_valid')
    let cleanCountries = cleanUpCountriesForPieChart(countries);

    buildPieCharts(trialStatus, categories, cleanCountries);
    buildMap(json);
}

/*
Our data contains far more countries than we can fit on a pie chart, so we should take the top 10 and place the 
rest in 'Other'
*/
function cleanUpCountriesForPieChart(countries) {
    let sortedCountries = Object.entries(countries).sort((a,b) => b[1] - a[1]);
    
    let counter = 0
    let cleanCountries = {}
    for (const country of sortedCountries) {
        if (counter < 10) {
            cleanCountries[country[0]] = country[1];
            counter++;
        } else {
            if (!cleanCountries["Other"]) {
                cleanCountries["Other"] = 0;
            }
            cleanCountries["Other"] = cleanCountries["Other"] + 1;
        }
    }
    return cleanCountries
}


function buildPieCharts(trialStatus, categories, countries) {
    const ctx = document.getElementById('statusChart');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.entries(trialStatus),
            datasets: [{
                label: 'Trial Status',
                data: Object.values(trialStatus)
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Trial Status'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    })

    const ctx2 = document.getElementById('categoryChart');
    new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: Object.entries(categories),
            datasets: [{
                label: 'Trial Category of Intervention',
                data: Object.values(categories)
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Trial Category of Intervention'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    })

    const ctx3 = document.getElementById('countryChart');
    new Chart(ctx3, {
        type: 'pie',
        data: {
            labels: Object.entries(countries),
            datasets: [{
                label: 'Trial Country of Sponsorship',
                data: Object.values(countries)
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Trial Country of Sponsorship'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    })
}

function buildMap(data) {
    let map;
    async function initMap() {
        let position = { lat: 0, lng: 0 };

        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

        map = new Map(document.getElementById("map"), {
            zoom: 2,
            center: position,
            mapId: "DEMO_MAP_ID",
        });
        const infoWindow = new google.maps.InfoWindow({
            content: "",
            disableAutoPan: true,
        })

        const markers = data.map((dataPoint, i) => {
            const pinGlyph = new google.maps.marker.PinElement({
                glyphColor: "white",
            })

            position = { lat: dataPoint['LATITUDE_valid'], lng: dataPoint['LONGITUDE_valid'] }
            const marker = new google.maps.marker.AdvancedMarkerElement({
                position,
                content: pinGlyph.element,
            })

            return marker;
        })

        new markerClusterer.MarkerClusterer({ markers, map })
    }
    initMap();
}