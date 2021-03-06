// tok koden fra https://thoughtbot.com/blog/pong-clone-in-javascript

//er meget ny til javascript så fikk koden fra en nettside som forklarte det.

//kommer til og leke litt med denne koden, men kommer ikke til og pushe det

//gjør så vi har 60 bilder i sekundet

var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {window.setTimeout(callback, 1000/60)}

// variabler til canvas størrelse

var canvas = document.createElement('canvas');
var width = 400;
var height = 400;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

//gir context til canvas så den vet hvordan den skal se ut

var render = function(){
    console.log("render");
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(0, 0, width, height);
}          

// Loopen som kjører spillet

var step = function(){
    update();
    render();
    animate(step);
    }
    
//Når vinduet blir lastet kjører dette og lager et canvas element. Starter også loopen

window.onload = function() {
    document.getElementById("pong").appendChild(canvas);
    animate(step);
    };

//Funksjonen som oppdaterer ballen

var update = function(){
    ball.update();
}

//En mal for hvordan en paddle funksjon skal se ut. Man setter in x, y, width og height så får man en paddle.

function Paddle(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

// rendrer paddlenen med det som ble spesifisert i paddle funsjonen

Paddle.prototype.render = function(){
    context.fillStyle = "#0000FF";
    context.fillRect(this.x, this.y, this.width, this.height);
}

//bruker variablene til og lage nye paddeler og en ball

var player = new Player();
var computer = new Computer();
var ball = new Ball(150, 150, 10);

// lager en paddel med malen vi så på tiligere

function Player(){
    this.paddle = new Paddle(175, 380, 50, 10);
}

//lager en paddel med malen vi så på tiligere

function Computer(){
    this.paddle = new Paddle(175, 10, 50, 10);
}

//rendrer paddelen som ble lagdt tiligere av malen

Player.prototype.render = function() {
    this.paddle.render();
  };
  
//rendrer paddelen som be lagdt tiligere av malen

Computer.prototype.render = function() {
    this.paddle.render();
};

//har alle variablene til ballen

function Ball(x, y, r){
    this.x = x;
    this.y = y;
    this.radius = r;
    this.x_speed = -1;
    this.y_speed = 1;
}

//rendrer ballen

Ball.prototype.render = function(){
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false)
    context.stroke();
    context.fillStyle = "#000000";

}

//Rendrer det som ble kallt på tiligere

var render = function(){
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
}   

//Rendrer ballen og gir den en spessiell fart

Ball.prototype.update = function(){
    this.x += this.x_speed;
    this.y += this.y_speed;
    console.log("moved")
}

//Oppdaterer ballen og paddelene

var update = function(){
    ball.update(player.paddle, computer.paddle);
}

//Oppdaterer ballen og starter med kollisjon

Ball.prototype.update = function(paddle1, paddle2){
        this.x += this.x_speed;
        this.y += this.y_speed;
        var top_x = this.x - 5;
        var top_y = this.y - 5;
        var bottom_x = this.x + 5;
        var bottom_y = this.y + 5;
    

    if (this.x -5 <0){
        this.x = 5;
        this.x_speed = -this.x_speed;
    }

    else if (this.x + 5 > 400){
        this.x = 395;
        this.x_speed = -this.x_speed;
    }

    //scoring a 

    if (this.y < 0 || this.y > 400) {
        this.x = 200
        this.y = 200
        this.x_speed = 0;
        this.y_speed = 3;
    }

    //kollisjon

    if (top_y > 300) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x){
            //hit the player paddle
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed / 2)
            this.y += this.y_speed
        }
    }

    else {
        if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
          // hit the computer's paddle
          this.y_speed = 3;
          this.x_speed += (paddle2.x_speed / 2);
          this.y += this.y_speed;
        }
      }
    };

//input

var keysDown = {};

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});
    
window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});

var update = function() {
    player.update();
    ball.update(player.paddle, computer.paddle);
  };
  
//flytter på paddle

Player.prototype.update = function() {
    for(var key in keysDown) {
        var value = Number(key);
        if(value == 37) { // left arrow
            this.paddle.move(-4, 0);
        } else if (value == 39) { // right arrow
            this.paddle.move(4, 0);
        } else {
            this.paddle.move(0, 0);
    }
}
};
  
//Computer legger seg alltid under ballen

Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if(this.x < 0) { // all the way to the left
      this.x = 0;
      this.x_speed = 0;
    } else if (this.x + this.width > 400) { // all the way to the right
      this.x = 400 - this.width;
      this.x_speed = 0;
    }
  }

var update = function() {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
  };
  
//Mer kollisjon

Computer.prototype.update = function(ball) {
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if(diff < 0 && diff < -4) { // max speed left
      diff = -5;
    } else if(diff > 0 && diff > 4) { // max speed right
      diff = 5;
    }
    this.paddle.move(diff, 0);
    if(this.paddle.x < 0) {
      this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > 400) {
      this.paddle.x = 400 - this.paddle.width;
    }
  };