var socket = io.connect();

/*
* Socket
*/

socket.on("Data_Food_Water", function (data) {
    data = JSON.parse(data);
    updateChart(data);
});

socket.on("connect", function (data) {
    socket.emit("request_localeTime", "vietnam");
});

socket.on("response_localeTime", function (data) {
    timeNow  = new Date(data);
});

/*
* Chart
* */
var options = {
    title: {
        display: false,                      // Show title
        text: "Food_Water",               // Text of title
        fontSize: 30,                       // Size of title
        fontColor: ['rgb(0, 255, 0)'],      // Color of title
        fontStyle: "bold"                   // Style of title
    },
    /****/
    scales: {
        /**/
        xAxes : [{                          // Ox
            gridLines : {                   // Grid
                display : false
            },
            ticks: {
                autoSkip: true,
                maxTicksLimit: 20           // Max label show on Chart = 20
            },
            scaleLabel: {                   // Label of Ox
                display: true,
                labelString: "time",
                fontSize: 20,
                fontColor: ['rgb(128, 128, 128)']
            }
        }],
        /**/
        yAxes: [{                           // Oy
            id: "food_id",
            position: 'left',
            type: 'linear',
            scaleLabel: {                   // Label of Oy
                display: true,
                labelString: "food",
                fontSize: 20,
                fontColor: ['rgb(255, 0, 0)'],
            },
        },
            {
                id: "water_id",
                position: 'right',
                type: 'linear',
                scaleLabel: {                   // Label of Oy
                    display: true,
                    labelString: "water",
                    fontSize: 20,
                    fontColor: ['rgb(0, 0, 255)']
                }
            }]
    },
    /****/
    elements:{
        point:{
            radius: 0
        }
    },
    animation: {
        duration: 500
    }
};
var ctx = document.getElementById('mychart').getContext('2d');
var myChart = new Chart(ctx, {
    title: "Hear",
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "food",
            yAxisID: 'food_id',
            data: [],
            backgroundColor: ['rgba(255, 255, 255, 0.2)'],
            borderColor: ['rgb(255, 0, 0)'],
            borderWidth: 1
        },
            {
                label: "water",
                yAxisID: 'water_id',
                data: [],
                backgroundColor: ['rgba(255, 255, 255, 0.2)'],
                borderColor: ['rgb(0, 0, 255)'],
                borderWidth: 1
            },
        ]
    },
    options: options
});

function updateChart(data) {
    var len = data.length;
    var tmp_data = {
        food: [],
        water: [],
        time: []
    };

    data.reverse();

    for(var i=0; i<len; i++){
            tmp_data.food.push(data[i].FOOD);
            tmp_data.water.push(data[i].WATER);
            tmp_data.time.push(data[i].TIME.split(" ")[1]);
    }
    myChart.data.labels = tmp_data.time;
    myChart.data.datasets[0].data = tmp_data.food;
    myChart.data.datasets[1].data = tmp_data.water;
    myChart.update();
}

/*
* Date time
* */
function addZero(num){
    num = parseInt(num);
    return num<10 ? '0'+num : num;
}

setInterval(function () {
    var timeNow = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Ho_Chi_Minh'}));
    $("#vietnam").html("Time: " + addZero(timeNow.getHours()) + ":" + addZero(timeNow.getMinutes()) + ":" + addZero(timeNow.getSeconds()));
}, 500);

/*
* Control device
* */

/*sent status of button*/
function switch_onclick(element) {
    var id_switch = element.id.split("-")[1];
    socket.emit("Click", JSON.stringify({"id": id_switch, "value": !$("#"+id_switch)[0].checked}));
    console.log(!$("#"+id_switch)[0].checked);
}

socket.on("t", function(data){
	console.log(data);
});

/*recived status of button*/
socket.on("Click", function (data) {
    console.log("CLICK: ", data);
    //$("#switch3").bootstrapToggle("on");
});

/*recived from button*/
socket.on("ON", function (data) {
    console.log("data");
    $("#switch3").bootstrapToggle("on");
});

