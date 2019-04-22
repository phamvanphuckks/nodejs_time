var mysql = require("mysql");
var express = require("express"),
    app = express();

app.use('/pages', express.static(__dirname + "/pages"));
app.get('/',function(req, res){
    res.sendfile(__dirname + '/pages/html/index.html');
});

app.get('/alarm',function(req, res){
    res.sendfile(__dirname + '/pages/html/alarm.html');
});

app.get('/weight',function(req, res){
    res.sendfile(__dirname + '/pages/html/weight.html');
});


var server = require("http").createServer(app).listen(8888, function(){
    console.log("Server Running.....\nListening : localhost:8888");
});

var io = require("socket.io").listen(server);

var data_mysql = {
    table: "Food_Water",
    old_length: 0
};


var db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "Phuckks_User",
    password: "Phuckks_Pass",
    dateStrings: true,
    database: "Phuckks_DB"
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

var j=0;

setInterval(function () {

//    mysql_query("SELECT * FROM " + data_mysql.table+ " ORDER BY ID DESC LIMIT 20", function(callback){
//             io.sockets.emit("Data_Food_Water", JSON.stringify(callback)); 
//	     console.log(JSON.stringify(callback));
//    });

}, 1000);


io.sockets.on("connection", function (socket) {
    console.log(socket.id + " connected");
    socket.on("disconnect", function () {
        console.log(socket.id + "disconnect");
    });

    socket.on("request_localeTime", function (data) {
        var timeNow;
        timeNow = new Date().toLocaleString('en-US', {timeZone: 'Asia/Ho_Chi_Minh'});
        console.log(timeNow);
        socket.emit("response_localeTime", timeNow);
    });

    socket.on("Click", function (data) {
        io.sockets.emit("Click", JSON.stringify(data));
	console.log("emit...ON");

    });

});
