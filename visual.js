//Update function to fetch last row
async function updateData() {

    const response = await
    fetch('https://street-pollution.herokuapp.com/monitor/lastrow', {
        method: "GET",
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json()

    const pm10 = data[0]['pm10']
    const pm25 = data[0]['pm25']

    return { pm10, pm25 }

}


async function drawChart() {

    //Fetch data from API
    const dataVis = await updateData();

    //creating datatable for PM10
    var dataPM10 = new google.visualization.DataTable();
    dataPM10.addColumn('string', 'type');
    dataPM10.addColumn('number', 'value');

    dataPM10.addRows([
        ['PM10', dataVis.pm10]
    ])

    var optionsPM10 = {
        width: 400,
        height: 180,
        greenFrom: 0,
        greenTo: 60,
        yellowFrom: 61,
        yellowTo: 90,
        redFrom: 91,
        redTo: 250,

        minorTicks: 5,
        max: 250
    };

    //creating datatable for PM25
    var dataPM25 = new google.visualization.DataTable();
    dataPM25.addColumn('string', 'type');
    dataPM25.addColumn('number', 'value');

    dataPM25.addRows([
        ['PM25', dataVis.pm25]
    ])

    var optionsPM25 = {
        width: 400,
        height: 180,
        greenFrom: 0,
        greenTo: 100,
        yellowFrom: 101,
        yellowTo: 250,
        redFrom: 251,
        redTo: 430,
        minorTicks: 5,
        max: 430
    };

    //Draw gauge for pm10
    var chartPM10 = new google.visualization.Gauge(document.getElementById('chart_div_pm10'));
    chartPM10.draw(dataPM10, optionsPM10);

    //Draw gauge for pm25
    var chartPM25 = new google.visualization.Gauge(document.getElementById('chart_div_pm25'));
    chartPM25.draw(dataPM25, optionsPM25);

    //Update charts
    setInterval(async function() {
        var dataVisLive = await updateData();

        dataPM10.setValue(0, 1, dataVisLive.pm10);
        dataPM25.setValue(0, 1, dataVisLive.pm25);

        chartPM10.draw(dataPM10, optionsPM10);
        chartPM25.draw(dataPM25, optionsPM25);
    }, 1000)
}