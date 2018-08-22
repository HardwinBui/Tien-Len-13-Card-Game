console.log('Link Start');

const Game = require('./13Game');
const Combo = require('./Combo');
const Card = require('./Card');

var port = 2000;
var express = require('express');
var app = express();
var serv = require('http').Server(app);

// Send index.html file
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
// Send the client file that was requested
app.use('/client', express.static(__dirname + '/client'));

serv.listen(port);


var PLAYER_LIST = [];
var playerAmt = 0;

var temp = 1;
var game;
var c = new Combo();
c.addCard(new Card(4, 0));
g.playCombo(c);

// Loading up socket.io tools
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	// Called whenever there's a connection
	console.log('A challenger approaches.');
	
	// Add player to player list
	PLAYER_LIST.push(socket);
	playerAmt += 1;
//	new Game(socket, socket, socket, socket);

	// Make a game if there are four players
	if(playerAmt >= 4){
		g = new Game(PLAYER_LIST[0], PLAYER_LIST[1], PLAYER_LIST[2], PLAYER_LIST[3]);
	}

	// Server recieves message
	socket.on(':^]', function(data){
		console.log(data.why);
	});
	
	// Server sends message
	socket.emit(':^[', {
		msg:'not happy',
	});
});



// Called every 40 mills
setInterval(function(){
	//for each player, emit game message

	//console.log(PLAYER_LIST.length);

	/*	
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		//stuff
		player.emit('msg', {
			//update the specific player with data
		});
	}
	*/
	
}, 1000/25);
