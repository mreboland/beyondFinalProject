// Following the below tutorial to learn about game design for Space Invaders. List will grow if new sources are needed:
// https://www.codeproject.com/Articles/642499/Learn-JavaScript-Part-1-Create-a-Starfield

/*
	Starfield lets you take a div and turn it into a starfield.
*/

//	Define the starfield class.
function Starfield() {
    this.fps = 30;
    this.canvas = null;
    this.width = 0;
    this.height = 0;
    this.minVelocity = 15;
    this.maxVelocity = 30;
    this.stars = 100;
    this.intervalId = 0;
}

// The initialise function initialises a starfield object so that
// it's ready to be started. We must provide a container div, that's
// what the starfield will live in.


// Adding a function to the starfield prototype which means each starfield will be able to use it. The function takes on param, div.
Starfield.prototype.initialise = function (div) {

    // Storing a copy of this in a local variable.
    const self = this;

    // Store the reference to the div we've been provided
    this.containerDiv = div;
    // Store the client area of the browser window. The window object is provided by the browser which allows you to manipulate it in many ways.
    self.width = window.innerWidth;
    self.height = window.innerHeight;

    // Handling the resize event of the window.
    // we use addEventListener as it will not stop any other events that have already been added from working. If we use onresize it'd replace whatever was there before which we do not want. The listener ensures that we don't interfere with other libraries.
    // When the function is called we update our width and height, update the canvas width and height and then call the draw function.
    window.addEventListener('resize', function resize(event) {
        // Why are we using 'self' and not this?

        // In the context of the initialise function, 'this' is the Starfield. But when the window calls the 'resize' function for us, by the time we're in that function, 'this' is actually the window. So to edit the starfield instance, we use the 'self' variable we declared earlier, which is a reference to the starfield.

        // This is actually quite advanced - the function is called and somehow we're using a variable that was created outside of the function. This is called a closure, and it makes our lives a lot easier! Closures allow us to access state from another context. When writing callback functions and so on, this is a very helpful thing to be able to do.
        self.width = window.innerWidth;
        self.height = window.innerHeight;
        self.canvas.width = self.width;
        self.canvas.height = self.height;
        self.draw();
    });

    // Create the canvas
    // we use document object to create a new HTML element. document is important as it represent the DOM (document object model). It allows us us to change everything on the page.
    // Here we use document to create a new HTML canvas, then add it to our container div, to which we then set its width and height.
    const canvas = document.createElement('canvas');
    div.appendChild(canvas);
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
};

// Let's recap:

// Store the div.
// Store useful properties, the width and height.
// Listen for the window resize, when it does, update the width and height and redraw.
// Create a canvas to draw on, and make it a child of the container div.


// Starting the Starfield

// Adding a function like earlier using the prototype.
Starfield.prototype.start = function() {

    // Create the stars

    // we start with creating an array in order to use it for queueing or a list.
    const stars = [];

    // We loop over the number of starts (which we set in the constructor Starfield at the top) and create a Star in the array each time. At this point we haven't created the star function yet which is at the end of the code (added after writing this).
    for (let i = 0; i < this.stars; i++) {
        // Here we want to represent star object so we have a function that sets some properties to do so. Calling new on the function instantiates a type from it with the properties provided from the Star function. Math.random returns a value between 0 and 1 to randomize the initial position, size, and velocity of the star.
        stars[i] = new Star(Math.random() * this.width, Math.random() * this.height, Math.random() * 3 + 1, (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity);
    }

    // with the array created, we now store it in this, the Starfield object.
    this.stars = stars;

    // with SetInterval it creates a callback that will be called every time an interval elapses. The interval in this case is specified by the fps. Every time the function is called, we call update and draw. We use the self closure to make sure we're calling them on the Starfield Object.

    const self = this;
    // Start the timer

    // We store the id returned by setInterval so we can use it to stop it later.
    this.intervalId = setInterval(function() {
        self.update();
        self.draw();
    }, 1000 / this.fps);
};

// Stop function to start the Starfield
Starfield.prototype.stop = function () {
    clearInterval(this.intervalId);
};

// Create the update function which will update the state of the Starfield.
Starfield.prototype.update = function() {

    // This is the core logic of moving stars. We work out how much time has passed (dt is delta t). Then we go through each star, and update its position based on its velocity and time that has passed.
    const dt = 1 / this.fps;
    for(let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];
        star.y += dt * star.velocity;
        // If the star has moved past the bottom of the screen, spawn it at the top
        if (star.y > this.height) {
            this.stars[i] = new Star(Math.random() * this.width, 0, Math.random() * 3 + 1,
                (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity);
        }
    }
};


// Now we need the draw function to create everything on page

Starfield.prototype.draw = function() {

    // Get the drawing context
    // Canvas is an object that you use to do bitmap-based drawing in JS. You can daw lines, polygons, and so on.
    const ctx = this.canvas.getContext("2d");

    // Draw the background
    // here we fill the background with black
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw stars
    // set the fill colour to white (everything drawn not the background) and we draw a little rectangle for each star.
    ctx.fillStyle = "#ffffff";
    for(let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];
        ctx.fillRect(star.x, star.y, star.size, star.size)
    }
}

function Star(x, y, size, velocity) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.velocity = velocity;
}

// Here's a roundup of what we've learnt:

// In JavaScript, classes are created using a 'constructor' function.
// The 'constructor' function is called with 'new' to create a new instance of the type.
//     The 'constructor' function has a property called 'prototype' and is shared between all instances of the type.
//         Normally, class member functions are defined on the prototype.
// The JavaScript 'window' object is provided by the browser and represents the environment the code is running in.
// The JavaScript 'document' object is provided by the engine and represents the HTML document.
// Timers can be created in JavaScript with 'setInterval'.
//     The 'this' keyword in JavaScript should be used with caution - in callback functions, 'this' might not be what you expect.
// You can create an array in JavaScript using var array = [];
// You can use a variable defined outside of a callback function in the callback function, this is a closure.



