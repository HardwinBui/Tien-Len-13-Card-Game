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

// Loading up socket.io tools
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    // Called whenever there's a connection
    console.log('A challenger approaches.');
    
    // Add player to player list
    PLAYER_LIST.push(socket);
    playerAmt += 1;

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
    
    
    
    // Check if the combo is valid then respond accordingly
    socket.on('newCombo', function(data){
        // Read the inputted combo
        var comboStr = JSON.parse(data.combo);
        var theCombo = new Combo();
        for(var i = 0; i < comboStr.length; i++){
            var card = new Card(comboStr[i].value, comboStr[i].suit);
            theCombo.addCard(card);
        }
        
        // Try to play the combo and 
        if(!game.playCombo(theCombo)){
            // Determine which error message to send
            var errMsg;
            if(!Combo.isValid(theCombo))
                errMsg = 'Your input is invalid.';
            else if(game.curTurn <= 0 && !Combo.hasThreeOfSpades(theCombo))
                errMsg = 'You must use the 3 of spades in your combination.';
            else
                errMsg = 'Your combination doesn\'t beat the current combination.';
                        
            // Send error message to player
            socket.emit('invalidInput', {
                msg: errMsg,
                curPlayer: game.curPlayer,
            });
        }
        
    });
    
    // Check if the current player decided to skip their turn
    socket.on('skipRound', function(data){
        game.passRound();
    });
    
});



// Called every 40 mills
setInterval(function(){
    
    // For each player, emit game message
    if(playerAmt >= 4){ 
        for(var i in PLAYER_LIST){
            var player = PLAYER_LIST[i];
            //stuff
            player.emit('curGame', {
                //update the specific player with data
                gameData: JSON.stringify(game),
                playerNum: i,
            });
        }
    }
    
}, 1000/25);
