require('events').EventEmitter.prototype._maxListeners = 0;
var mysql = require("mysql");
var express = require("express"),
    app = express();

app.use('/pages', express.static(__dirname + "/pages"));
app.get('/',function(req, res){
    res.sendfile(__dirname + '/pages/html/index.html');
});

app.get('/weight',function(req, res){
    res.sendfile(__dirname + '/pages/html/alarm.html');
});


var server = require("http").createServer(app).listen(8888, function(){
    console.log("Server Running.....\nListening : localhost:8888");
})

var io = require("socket.io").listen(server);

io.sockets.on("connection", function (socket) {
    console.log(socket.id + " connected");


    socket.on("disconnect", function () {
        console.log(socket.id + "disconnect");
    });

    socket.emit("t", "ok");

});



