console.log('Link Start');

const Game = require('./13Game');
const Combo = require('./Combo');
const Card = require('./Card');
//const JSON = require('circular-json');

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
//g.playCombo(c);

// Loading up socket.io tools
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	// Called whenever there's a connection
	console.log('A challenger approaches.');
	
	// Add player to player list
	PLAYER_LIST.push(socket);
	playerAmt += 1;
//	new Game(socket, socket, socket, socket);

	for(var i = 0; i < PLAYER_LIST.length; i++)
		console.log(PLAYER_LIST[i].id);

	// Make a game if there are four players
	if(playerAmt >= 4){
		game = new Game(PLAYER_LIST[0], PLAYER_LIST[1], PLAYER_LIST[2], PLAYER_LIST[3]);
	}


	// Remove player from the list if they disconnect
	socket.on('disconnect', function(){
		for(var i = 0; i < PLAYER_LIST.length; i++){
			if(PLAYER_LIST[i] == socket){
				PLAYER_LIST.splice(i, 1);
				break;
			}
		}
		playerAmt -= 1;
		console.log('A player has left.');
	});





	// Server recieves message
	socket.on(':^]', function(data){
		console.log(data.why);
	});
	
	// Server sends message
	socket.emit(':^[', {
			// can see message in website console log
		msg:'not happy',
	});
	
	
	
	socket.on('newCombo', function(data){
		var theCombo = JSON.parse(data.combo);
		for(var i = 0; i < theCombo.length; i++){
			console.log(theCombo[i].value + " " + theCombo[i].suit);
		}
	});
	
});



// Called every 40 mills
setInterval(function(){
	//for each player, emit game message

	//console.log(PLAYER_LIST.length);

	if(playerAmt >= 4){	
		//console.log(playerAmt);
		for(var i in PLAYER_LIST){
			var player = PLAYER_LIST[i];
			//stuff
			player.emit('curGame', {
				//update the specific player with data
				gameData: JSON.stringify(game),
				playerNum: i,
			});
		}

		/*
		PLAYER_LIST[game.curPlayer].on('upsGame', function(data){
			//not sure if work test tmr
		});
		*/
	}
	
}, 1000/25);
