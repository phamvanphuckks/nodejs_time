
var mysql = require("mysql");
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

var data_mysql = {
    table: "Pets",
    old_length: 0
};


var db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "phuckks_user",
    password: "phuckks_pass",
    dateStrings: true,
    database: "phuckks_db"
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


});

var j=0;

setInterval(function () {
	
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

    socket.on("disconnect", function () {
        console.log(socket.id + "disconnect");
    });

});


//mysql_close();
