require('events').EventEmitter.prototype._maxListeners = 0;
var mysql = require("mysql");
var mqtt = require("mqtt");
var express = require("express"),
    app = express();

app.use('/pages', express.static(__dirname + "/pages"));
app.get('/',function(req, res){
    res.sendfile(__dirname + '/pages/html/index.html');
});


var server = require("http").createServer(app).listen(8888, function(){
    console.log("Server Running.....\nListening : localhost:8888");
});

var io = require("socket.io").listen(server);

/*---------------------------------------------------------------------------------*/
	process.setMaxListeners(0);
	require('events').EventEmitter.prototype._maxListeners = 0;
	var EventEmitter = require('events');

	class MyEmitter extends EventEmitter {}

	const myEmitter = new MyEmitter();
	myEmitter.setMaxListeners(0);
/*---------------------------------------------------------------------------------*/
var device_vietnam = 1;
var device_philippines = 1;
var switch_status = {
    esp1: [0, 0, 0],
    esp2: [0, 0, 0],
    esp3: [0, 0, 0]
};

var data_mysql = {
    table: ["vietnam", "philippines"],
    old_length: 0
};

var data_mqtt = {
    broker: "mqtt://localhost",
    topic: ['esp1-switch1', 'esp1-switch2', 'esp1-switch3', 'esp2-switch1', 'esp2-switch2', 'esp2-switch3']
};

var db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "uBox_user",
    password: "uBox_pass",
    dateStrings: true,
    database: "ubox"
});

/*---------------------------------------------------------------------------------*/
function mysql_connect(){
    db.connect(function (err) {
        if(err)
            throw(err);
        console.log("Connected MySQL");
    });
}

function mysql_query(sql, callback){
    db.query(sql, function(err, result, fields){
        if(err)
            throw err;
        return callback(result);
    });
}

function mysql_close(){
    db.end();
    console.log("Disconnected MySQL");
}

mysql_connect();

var mqtt_client = mqtt.connect("mqtt://localhost");
mqtt_client.on("connect", function () {
    console.log("Connected to MQTT server");
          topic_mqtt = "data"
          mqtt_client.subscribe(topic_mqtt)

});

var j=0;

setInterval(function () {
	mysql_query("SELECT TEMP FROM " + data_mysql.table[0]+ " WHERE DEVICE=" + device_vietnam +" AND"+" ID="+j+" ORDER BY ID DESC LIMIT 50", function(callback){
             dataMail = callback;
             dataMail = JSON.stringify(dataMail);
               var temp = dataMail.substr(9,2);

             var temp = Number(temp);
             console.log(temp);

                    if( temp > 40 ){
                                var nodemailer = require('nodemailer');

                                var transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                        user: 'vietnam9094@gmail.com',
                                        pass: '21011998a'
                                         }
                                 });

                                var mailOptions = {
                                        from: 'vietnam9094@gmail.com',
                                        to: 'phamvanphuckks@gmail.com',
                                        subject: 'Sending Email using Node.js',
                                        text: 'WANRING WANRING !!!!'
                                         };

                                transporter.sendMail(mailOptions, function(error, info){
                                        if (error) {
                                        console.log(error);
                                         } else {
                                        console.log('Email sent: ' + info.response);
                                         }
                                 });
                        } 

 

             j++;
	});

    mysql_query("SELECT * FROM " + data_mysql.table[0]+ " WHERE DEVICE=" + device_vietnam +" ORDER BY ID DESC LIMIT 50", function(callback){
             io.sockets.emit("data/vietnam", JSON.stringify(callback)); 
    });

    mysql_query("SELECT * FROM " + data_mysql.table[1]+ " WHERE DEVICE=" + device_philippines +" ORDER BY ID DESC LIMIT 50", function(callback){
            io.sockets.emit("data/philippines", JSON.stringify(callback));
    });
}, 5000);


io.sockets.on("connection", function (socket) {
    console.log(socket.id + " connected");

    socket.on("request_localeTime", function (data) {
        var timeNow;
        if(data=="vietnam")
            timeNow = new Date().toLocaleString('en-US', {timeZone: 'Asia/Ho_Chi_Minh'});
        if(data=="philippines")
            timeNow = new Date().toLocaleString('en-US', {timeZone: 'Asia/Manila'});
        console.log(timeNow);
        socket.emit("response_localeTime", timeNow);
    });

    socket.on("request_switch_status", function (data) {
        data = JSON.parse(data);
        if(data.country=="vietnam")
            socket.emit("response_switch_status", switch_status["esp" + data.device]);
        if(data.country=="philippines")
            socket.emit("response_switch_status", [0, 0, 0]);
    });

    mysql_query("SELECT * FROM " + data_mysql.table[0] + " WHERE DEVICE=" + device_vietnam +" ORDER BY ID DESC LIMIT 50", function(callback){
        //callback = JSON.stringify(callback);
        socket.emit("data/vietnam", JSON.stringify(callback));
    });

    mysql_query("SELECT * FROM " + data_mysql.table[1] + " WHERE DEVICE=" + device_philippines +" ORDER BY ID DESC LIMIT 50", function(callback){
        socket.emit("data/philippines", JSON.stringify(callback));
    });

    socket.on("disconnect", function () {
        console.log(socket.id + "disconnect");
    });

	socket.on("request_device", function(data){
		data = JSON.parse(data);
		if(data.country=="vietnam")
			device_vietnam = data.device;
		if(data.country=="philippines")
			device_philippines= data.device;
	});
    socket.on("switch", function (data) {
        // example data: {"device":1,"id":"esp1-switch2","value":true}
        io.sockets.emit("switch", data);
        data = JSON.parse(data);
        if(data.country=="vietnam"){
            mqtt_client.publish(data.id, (data.value==true) ? "ON" : "OFF");
            switch_status["esp" + data.device][parseInt(data.id[data.id.length-1])-1] = (data.value==true) ? 1 : 0;
        }
    });
});


//mysql_close();
