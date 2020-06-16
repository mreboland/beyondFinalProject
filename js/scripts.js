// Following the below tutorial to learn about game design for Space Invaders. List will grow if new sources are needed:
// https://www.briankoponen.com/html5-javascript-game-tutorial/




//space invaders is a game where the enemies come down from the top of the screen in a grid moving left to right until the hit the edge which will then prompt them to drop 1 level down and continue. The bottom most enemies will shoot a projectile occasionally at the player. The alienes will have unique points depending on their rank (tbd may just do equal points for high score).

// The player at the bottom can move left to right limited by the screen. They can also shoot a projectile upwards limited to one shot at a time on screen. If a shot hits an enemy, it is removed from the grid and the player is rewarded points. All remaining enemies speed up as a result. If all enemies are killed, a new grid is created that moves faster and shoots more often.

// If enemy hits player, ship is destroyed. If there are lives left it respawns. If none are left, top 10 high scores are displayed. High scores are saved within browser to player can come back and beat their own score from previous sessions.




// Game Entities

// Vector2d Object

const Vector2d = function (x, y) {
    this.x = x;
    this.y = y;
}

function vectorAdd(v1, v2) {
    return new Vector2d(v1.x + v2.x, v1.y + v2.y);
}

function vectorSubtract(v1, v2) {
    return new Vector2d(v1.x - v2.x, v1.y - v2.y);
}

function vectorScalarMultiply(v1, s) {
    return new Vector2d(v1.x * s, v1.y * s);
}

function vectorLength(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function vectorNormalize(v) {
    let reciprocal = 1.0 / (vectorLength(v) + 1.0e-037); // Prevent division by zero
    return vectorScalarMultiply(v, reciprocal);
}


const v3 = v1.add(v2); // Unclear if v1 is changed
const v3 = vectorAdd(v1, v2); // Obvious v1 is not changed

// We are going to need rectangles to check for collisions between entities as well as defining the boundary of the game area.This is also how we will keep track of the size of the entire group of enemies to make them move as a group.

//  Rectangle Object

function Rectangle (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Rectangle.prototype.left = function () {
    return this.x;
};

Rectangle.prototype.right = function () {
    return this.x + this.width;
};

Rectangle.prototype.top = function () {
    return this.y;
};

Rectangle.prototype.bottom = function () {
    return this.y + this.height;
};

Rectangle.prototype.intersects = function (r2) {
    return this.right() >= r2.left() && this.left() <= r2.right() && this.top() <= r2.bottom && this.bottom
}



// Player Object
function Player(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.direction = -1;
}


Player.prototype.update = function () {
    if( this.y <= 0 || this.y+this.height >= game.gameFieldHeight() ) {
        this.direction *= -1;
    }
};

// Enemy Object
function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.direction = 1;
}


Enemy.prototype.update = function () {
    if (this.y <= 0 || this.y + this.height >= game.gameFieldHeight()) {
        this.direction *= -1;
    }
};


// Renderer Object
const renderer = (function () {

    function _drawEnemy(context, enemy) {
        context.fillStyle = "red";
        context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    function _drawPlayer(context, player) {
        context.fillStyle = "blue";
        context.fillRect(player.x, player.y, player.width, player.height);
    }

    function _render() {
        const canvas = document.getElementById("game-layer");
        const context = canvas.getContext("2d");

        context.fillStyle = "gray";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let i,
            entity,
            entities = game.entities();

        for (i = 0; i < entities.length; i++) {
            entity = entities[i];

            if (entity instanceof Enemy) {
                _drawEnemy(context, entity);
            }
            else if (entity instanceof Player) {
                _drawPlayer(context, entity);
            }
        }
    }

    return {
        render: _render
    };

})();


// Physics Object
const physics = (function () {

    function _update() {
        let i,
            entities = game.entities();

        for (i = 0; i < entities.length; i++) {
            entities[i].y += entities[i].direction;
        }
    }

    return {
        update: _update
    };

})();

// Game Object
const game = (function () {
    const _gameFieldHeight = 200;
    const _entities = [];

    function _start() {
        _entities.push(new Player(100, 175));
        _entities.push(new Enemy(20, 25));
        _entities.push(new Enemy(80, 25));
        _entities.push(new Enemy(160, 25));

        window.requestAnimationFrame(this.update.bind(this));
    }

    function _update() {
        physics.update();

        let i;
        for (i = 0; i < _entities.length; i++) {
            _entities[i].update();
        }

        renderer.render();

        window.requestAnimationFrame(this.update.bind(this));
    }

    return {
        start: _start,
        update: _update,
        entities: function () { return _entities; },
        gameFieldHeight: function () { return _gameFieldHeight; }
    };

})();


game.start();
