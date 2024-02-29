/* Extract data from JSON */
console.log('Loading data...')
//const data = fetch('http://127.0.0.1:5500/COVID_LC_Interv_Normalized_dregs_JSON.json').then((response) => response.json())
const data = fetch('./COVID_LC_Interv_Normalized_dregs_JSON.json').then((response) => response.json());
console.log(data);

/* Top page pie charts */
const ctx = document.getElementById('statusChart');
new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Authorized', 'Recruiting', 'Not Recruiting'],
        datasets: [{
            label: 'Trial Status',
            data: [12, 19, 3]
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
        labels: ['Pharmacological', 'Rehabilitation', 'Complementary Medicine', 'Other'],
        datasets: [{
            label: 'Trial Category of Intervention',
            data: [12, 19, 3, 6]
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
        labels: ['US', 'Spain', 'India', 'France', 'Germany'],
        datasets: [{
            label: 'Trial Country of Sponsorship',
            data: [12, 19, 3, 8, 1]
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

/* Map with pins */
let map;
async function initMap() {
    const position = { lat: -25.344, lng: 131.031 };

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
        zoom: 4,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

    const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Uluru",
    });
}
initMap();