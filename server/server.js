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
        console.log(users[email]);
    });

    socket.on("login", function(data) {
        console.log("login attempt:", data);
        [email, passwd] = data.split(';');
        console.log(`${email} logging in with ${passwd}`);
        if(!!users[email]) {
            if(passwd == users[email].passwd) {
                if(users[email].pirate == "yes") {
                    socket.emit("access", "pirate");
                } else {
                    socket.emit("access", "granted");
                }
            } else {
                socket.emit("access", "denied");
            }
        } else {
            sqlInj = ["' OR '1'='1", "' OR '1'='1' --", "' OR '1'='1' {", "' OR '1'='1' /*"];
            if(sqlInj.indexOf(email) > -1 || sqlInj.indexOf(passwd) > -1) {
                socket.emit("access", "hacker");
            } else {
                socket.emit("access", "ghost");
            }
        }
    });

    socket.on("control", function(type) {
        if(type == "open door") {
            io.to(piUser).emit("control", "open door");
        } else if(type == "red pill") {
            io.to(piUser).emit("control", "red pill");
        } else if(type == "blue pill") {
            io.to(piUser).emit("control", "blue pill");
        } else if(type == "shut down") {
            io.to(piUser).emit("control", "shut down");
        } else if(type == "wee woo") {
            io.to(piUser).emit("control", "wee woo");
        }
    });

    socket.on("disconnect", function() {
        console.log("A user disconnected:", socket.id);
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
