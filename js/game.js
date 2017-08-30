var game = new Phaser.Game(1200, 750, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','img/tiles/grass.jpg');
    //game.load.spritesheet('player','img/sprites/1.png',60,150);
    game.load.image('player', 'img/sprites/agente.png');
    game.load.image('playera', 'img/sprites/nave.png');
    game.load.image('coin', 'img/other/coin.png');
    game.load.image('three','img/tiles/piedras.png');


}

var limitX = 2200;
var limitY = 1050;
var player, player2;
var cursors;
var coords = [];
var coinLen = 70;
var threeLen = 20;


var collite = false;
var lastMove = 0;

/*function fireKeyboardEvent(event, keycode) {
    var keyboardEvent = document.createEventObject ?
        document.createEventObject() : document.createEvent("Events");

    if(keyboardEvent.initEvent) {
        keyboardEvent.initEvent(event, true, true);
    }

    keyboardEvent.keyCode = keycode;
    keyboardEvent.which = keycode;

    document.dispatchEvent ? document.dispatchEvent(keyboardEvent) 
                           : document.fireEvent(event, keyboardEvent);
  }
*/
function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}



function createCoin(x, y){
    var coin = game.add.sprite(x, y, 'coin');
    game.physics.p2.enable(coin);
    coin.body.static = true;
    coin.body.onBeginContact.add(function(arr){
        var coin = this[1];
        document.querySelector("#coin-sound").play();
        coin.kill();
        updateCoinCounter();
    }, [this, coin]);
} 

function createThree(x,y){
    var three = game.add.sprite(x, y, 'three');
    game.physics.p2.enable(three);
    three.body.static = true;
    three.body.onBeginContact.add(function(){
        document.querySelector("#block-sound").play();
        console.log("choque");
    }, null);
}

function checkCoords(x,y){
    return coords.indexOf(x+","+y) > -1;
}

function addCoords(x,y){
    coords[coords.length] = x+","+y;
}

function updateCoinCounter(){
    var coins = document.querySelector("#coincount");
    if(parseInt(coins.innerText) < 9) coins.innerText = '0'+(parseInt(coins.innerText) + 1);
    else coins.innerText = parseInt(coins.innerText) + 1;
    if(parseInt(coins.innerText) >= coinLen){
        document.querySelector("#win-sound").play();
        alert("GANASTE");
        location.reload();
    }
}

function create() {
    
    //document.querySelector("#background-music").volume = 0.2;
    game.add.tileSprite(0, 0, limitX, limitY, 'background');

    game.world.setBounds(0, 0, limitX, limitY);
    
    game.physics.startSystem(Phaser.Physics.P2JS);

    //Player Declarations
    player = game.add.sprite(game.world.centerX-30, game.world.centerY, 'player');
    // player.animations.add('down',[0,1,2]);
    // player.animations.add('left',[12,13,14]);
    // player.animations.add('right',[24,25,26]);
    // player.animations.add('up',[36,37,38]);

    player2 = game.add.sprite(game.world.centerX+30, game.world.centerY, 'playera');
    // player2.animations.add('down',[3,4,5]);
    // player2.animations.add('left',[15,16,17]);
    // player2.animations.add('right',[27,28,29]);
    // player2.animations.add('up',[39,40,41]);
    
    game.physics.p2.enable(player);
    game.physics.p2.enable(player2);

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player2);
    

    //Distribuye fichas por todo el mapa
    for(var i = 0; i < coinLen+5; i++){

        var x = Math.floor((Math.random() * limitX));
        var y = Math.floor((Math.random() * limitY));

        while( checkCoords(x,y) ){
            x = Math.floor((Math.random() * limitX));
            y = Math.floor((Math.random() * limitY));
        }

        createCoin(x,y);
        addCoords(x,y);
    }
    for(var i = 0; i < threeLen; i++){

        var x = Math.floor((Math.random() * limitX));
        var y = Math.floor((Math.random() * limitY));

        while( checkCoords(x,y) ){
            x = Math.floor((Math.random() * limitX));
            y = Math.floor((Math.random() * limitY));
        }

        createThree(x,y);
        addCoords(x,y);
    }


    

}

var idMoveDown;
function moveDown(){
    game.physics.p2.enable(player,false);
    player.body.x+=0;
    player.body.y+=3;
    player.animations.play('down', 5, true);
}
var idMoveUp;
function moveUp(){
    game.physics.p2.enable(player,false);
    player.body.x+=0;
    player.body.y-=3;
    player.animations.play('up', 5, true);
}
var idMoveLeft;
function moveLeft(){
    game.physics.p2.enable(player,false);
    player.body.x-=3;
    player.body.y+=0;
    player.animations.play('left', 5, true);
}
var idMoveRight;
function moveRight(){
    game.physics.p2.enable(player,false);
    player.body.x+=3;
    player.body.y+=0;
    player.animations.play('right', 5, true);
}

function stopMove(){
    //player.animations.play('down', 0, true);
    clearInterval(idMoveLeft);
    clearInterval(idMoveRight);
    clearInterval(idMoveDown);
    clearInterval(idMoveUp);
}

setInterval(IaMove, 1000);

function IaMove(){

    switch( Math.floor((Math.random() * 5) + 1) ){
        case 1: stopMove() 
                idMoveLeft = setInterval(function(){
                    moveLeft();
                },12); 
            break;
        case 2: stopMove()
                idMoveUp = setInterval(function(){
                    moveUp();
                },12);
            break;
        case 3: stopMove()
                idMoveDown = setInterval(function(){
                    moveDown();
                },12);
            break;
        case 4: stopMove()
                idMoveRight = setInterval(function(){
                    moveRight();
                },12);
            break;
        default: stopMove();
    }
        
}

    




function update() {
    player2.body.setZeroVelocity();
    player2.body.fixedRotation = true;


    player.body.setZeroVelocity();
    player.body.fixedRotation = true;
    

    if (cursors.up.isDown )
    {
        player2.body.moveUp(250)
        player2.animations.play('up', 5, true);
    }
    else if (cursors.down.isDown)
    {
        player2.animations.play('down', 5, true);
        player2.body.moveDown(250);
    }
    else if (cursors.left.isDown)
    {
        player2.animations.play('left', 5, true);
        player2.body.velocity.x = -250;
    }
    else if (cursors.right.isDown)
    {
        player2.animations.play('right', 5, true);
        player2.body.moveRight(250);
    }else{
        player2.animations.play('down', 5, true);
    }
    //player.body.setZeroVelocity();
}

function render() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.spriteCoords(player, 32, 500);
    

}


