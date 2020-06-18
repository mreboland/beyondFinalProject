// what a game engine needs:

// We should be able to have multiple states.
// We should be able to move from one state to another(e.g.the 'welcome' screen to the 'play' screen).
// A state should be able to draw itself.
// A state should be able to update itself(e.g.on some arbitrary tick we advance the invaders etc).
// A state should be able to be 'pushed' - for example a paused screen is a state on top of whatever state is below it.Unpausing simply pops the state.

// Creates an instance of the Game class.
function Game() {

    // Set the initial config (game settings, how fast invaders will move, etc. 
    this.config = {
        gameWidth: 400,
        gameHeight: 300,
        fps: 50,
    }

    // All state is in the variables below (The state of the whole game then follows, i.e viewport)
    this.lives = 3;
    this.width = 0;
    this.height = 0;
    this.gameBound  = {left: 0, top: 0, right: 0, bottom: 0};

    // The state stack (used to store game states)
    this.stateStack = [];

    // Input/output (used to hold the keys pressed and canvas to render the game)
    this.pressedKeys = {};
    this.gameCanvas = null;
}

// Initialize the Game with a canvas.
Game.prototype.initialise = function(gameCanvas) {

    // Set (store) the game canvas.
    this.gameCanvas = gameCanvas;

    // Set the game width and height
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    // Set the state game bounds (the rectangle that the game is played in. We set the dimensions of the game in config, and then we plot things relative to the game bounds)
    this.gameBounds = {
        left: gameCanvas.width / 2 - this.config.gameWidth / 2,
        right: gameCanvas.width / 2 + this.config.gameWidth / 2,
        top: gameCanvas.height / 2 - this.config.gameHeight / 2,
        bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
    };
};

// Returns the current state of our game
Game.prototype.currentState = function() {
    // If we have anything in the stack (which is an array, but can be used as a stack), we return the top item (i.e last item in array). Otherwise we return null.
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null; 
};

// This is what moving to a state does:

// If we're already in a state, we check if the state object has a function called 'leave'. If it does, we call it. This means our state objects can choose to be notified if they're about to exit.
// If we're already in a state, pop it from the state stack.
// If there's a function named 'enter' for the new state, call it. This means states can choose to be notified if they're about to be entered.
// Now we push our new state onto the stack.

// So the take - away here is this - moveToState replaces the top of the state stack with a new state - and states can know when they're entering or leaving. 

Game.prototype.moveToState = function(state) {

    // Are we already in a state?
    if(this.currentState())  {

        // Before we pop the current state, see if the state has a Leave function. If it does we can call it.
        if(this.currentState().leave) {
            this.currentState().leave(game);
        }

        this.stateStack.pop();
    }

    // If there's an enter function for the new state, call it.
    if (state.enter) {
        state.enter(game);
    }

    // Set the current state
    this.stateStack.push(state);
}


// pushState and popState function on the same principals as the moveToState function.
Game.prototype.pushState = function(state) {

    // If there's an enter function for the new state, call it.
    if (state.enter) {
        state.enter(game);
    }
    //  Set the current state.
    this.stateStack.push(state);
};

Game.prototype.popState = function() {

    // Leave and pop the state
    if (this.currentState()) {
        if (this.currentState().leave) {
            this.currentState().leave(game);
        }

        //  Set the current state.
        this.stateStack.pop();
    }
};


// For our game to do anything, we need a loop to run that tells the active state that it needs to draw and so on.

// The main loop
function gameLoop(game) {
    // First, get the current game state.
    const currentState = game.currentState();
    if(currentState) {

        // Delta t is the time to update/draw.
        // Now work out how much time is in one 'tick' of the loop. This is one over the FPS - if we loop ten times per second, each tick is 100 milliseconds. 
        const dt = 1 / game.config.fps;

        // Get the drawing context.
        // Get a drawing context from the canvas
        const ctx = game.gameCanvas.getContext("2d");

        // Update if we have an update function. Also draw if we have a draw function.
        // If there is a function called 'update' in the state, call it, passing the game object and the amount of time that's passed.
        if(currentState.update) {
            currentState.update(game, dt);
        }
        // If there's a function called 'draw' in the state, call it, passing the game object, the amount of time that's passed and the drawing context.
        if(currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }
}

// Now we need to call the gameLoop function on a timer.

// Start the game.
Game.prototype.start = function() {

    // We start the game by moving into a new instance of WelcomeState class.
    this.moveToState(new WelcomeState());

    // Set the game variables.
    this.lives = 3;
    this.config.debugMode = /debug=true/.test(window.location.href);

    // Start the game loop.
    const game = this;
    // The timer is based on the fps config setting
    this.intervalId = setInterval(function () { gameLoop(game); }, 1000 / this.config.fps);
};

// Welcome state, showing the title of the game.

// the Welcome State is so simple it doesn't even have any data members.
function WelcomeState() {

} 

// Creating a draw function
WelcomeState.prototype.draw = function(game, dt, ctx) {

    // Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    // We clear the drawing surface, write out "Space Invaders" and ask the user to press the spacebar.
    ctx.font = "30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = "center";
    ctx.textAlign = "center";
    ctx.fillText("Space Invaders", game.width / 2, game.height / 2 - 40);
    ctx.font = "16px Arial";

    ctx.fillText("Press 'Space' to start.", game.width / 2, game.height / 2);
}

WelcomeState.prototype.keyDown = function (game, keyCode) {
    // 32 is the keyboard code for spacebar.
    if(keyCode == 32) {
        // Space starts the game
        // if the keyCode function is space, we move into a new state call LevelIntroState
        game.moveToState(new LevelIntroState(game.level));
    }
};

// The GameEngine can be notified that a key has been pressed or released. Once that happens we see if the current state has a keyDown or keyUp function. If so, we call it. We also need to keep track of each key pressed in an object. This is so that if the user pressed multiple keys, state can look at the game.pressedKeys object and see what is pressed.

// Inform the game a key is down.
Game.prototype.keyDown = function (keyCode) {
    this.pressedKeys[keyCode] = true;
    //  Delegate to the current state too.
    if (this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, keyCode);
    }
};

// Inform the game a key is up
Game.prototype.keyUp = function (keyCode) {
    delete this.pressedKeys[keyCode];
    //  Delegate to the current state too.
    if (this.currentState() && this.currentState().keyUp) {
        this.currentState().keyUp(this, keyCode);
    }
};

// The Level Intro

/*

    Level Intro State

    The level Intro state shows a "level X" message and a countdown for the level

*/









