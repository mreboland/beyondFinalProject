// const canvas = document.getElementById("game-layer");
// const context = canvas.getContext("2d");

// context.fillStyle = "gray";
// context.fillRect(0, 0, canvas.clientWidth, canvas.height);

// context.fillStyle = "red";
// context.fillRect(5, 5, 10, 15);
// context.fillStyle = "blue";
// context.fillRect(25, 25, 20, 20);
// context.fillStyle = "green";
// context.fillRect(50, 50, 20, 40);

function Player(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.direction = -1;
}
Player.prototype.draw = function () {
    context.fillStyle = "blue";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Player.prototype.update = function () {
    this.y = this.y + this.direction;
    if( this.y <= 0 || this.y + this.height >= canvas.height ) {
        this.direction *= -1;
    }
};

function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.direction = 1;
}

Enemy.prototype.draw = function () {
    context.fillStyle = "red";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Enemy.prototype.update = function () {
    this.y = this.y + this.direction;
    if (this.y <= 0 || this.y + this.height >= canvas.height) {
        this.direction *= -1;
    }
};

const player = new Player(100, 175);
const enemy1 = new Enemy(20, 25);
const enemy2 = new Enemy(80, 25);
const enemy3 = new Enemy(160, 25);

function frameUpdate() {
    canvas = document.getElementById("game-layer");
    context = canvas.getContext("2d");

    context.fillStyle = "gray";
    context.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    enemy1.update();
    enemy1.draw();

    enemy2.update();
    enemy2.draw();

    enemy3.update();
    enemy3.draw();

    window.requestAnimationFrame(frameUpdate);
}

frameUpdate();
