var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};
var piUser = "";

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

    console.log('A user connected:', socket.id);

    socket.on("identity", function(msg) {
        console.log("This is a", msg);
        if(msg == "pi") {
            piUser = socket.id;
        }
        console.log("piUser:", piUser);
    });

    socket.on("register", function(data) {
        [name, email, passwd, ssn] = data.split(';');
        users[email] = {"name": name, "passwd": passwd, "ssn": ssn};
        console.log("Registering:", email);
    });

    socket.on("cliAuth", function(data) {
        [email, serial] = data.split(';');
        users[email]["serial"] = serial;
        console.log("Auth check:", serial);
        io.to(piUser).emit("reqAuth", `${email};${serial}`);
    });

    socket.on("piAuth", function(data) {
        [email, status] = data.split(';');
        if(status == "success") {
            users[email]["pirate"] = "no";
        } else {
            users[email]["pirate"] = "yes";
        }
    });

    socket.on('disconnect', function() {
        console.log('A user disconnected:', socket.id);
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
