
var deltaTime;
var timeLast = Date.now();

var bow = new Image();
var target = new Image();
var volume = 0;

window.onload = function() {
    Canvas.start();
    bow.src ="assests/bow.png";
    target.src = "assests/target.png";

    collisionObjects.push(new Collision(Canvas.width-200, Canvas.height/2-60, 36, 125));
    collisionObjects.push(new Collision(Canvas.width-4, 0, 20,Canvas.height-4));

    /// Call gameLoop.
    gameLoop();
}

window.onclick = function() {
    Bow.canAnimate = true;
}

var Mouse = {
    x : 0,
    y : 0,
}

window.addEventListener("mousemove", function(ev) {
    Mouse.x = ev.clientX;
    Mouse.y = ev.clientY;
});

var Bow = {
    width : 70,
    height : 90,
    x : 200,
    y : window.innerHeight/2,
    canAnimate : false,
    animationIndex : 0,
    animationSpeed : 16,
    subImages : 12,
    angle : 0,
    update : function() {
        /// Rotate Bow.
        this.angle = Math.atan2(Mouse.y - this.y, Mouse.x - this.x);

        /// Keep track of animation.
        if (this.canAnimate) {
            this.animationIndex += this.animationSpeed * deltaTime;
            this.animationIndex = this.animationIndex % this.subImages;
            if (this.animationIndex >= 11) {
                this.canAnimate = false;
                this.animationIndex = 0;
                arrowObjects.push(new Arrow(this.x, this.y, this.angle));
            }
        }
    },
    draw : function() {
        Canvas.ctx.save();
        Canvas.ctx.translate(this.x, this.y);
        Canvas.ctx.rotate(this.angle);
        Canvas.ctx.drawImage(bow, Math.floor(this.animationIndex)*this.width, 0, this.width, this.height, this.x-this.x-this.width/2, this.y-this.y-this.height/2, this.width, this.height);
        //Canvas.ctx.resetTransform();
        Canvas.ctx.restore();
    }
}

var arrowObjects = [];
function Arrow (x, y, angle) {
    this.id = Date.now();
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 2;
    this.angle = angle;
    this.speed = 600;
    this.canMove = true;
    this.update = function() {

        if (!this.canMove) return;
        
        /// Movement.
        this.angle += (25 * Math.PI/180) * deltaTime;
        this.x += (Math.cos(this.angle) * this.speed)  * deltaTime;
        this.y += (Math.sin(this.angle) * this.speed) * deltaTime;

        /// Collision
        for (let i=0; i<collisionObjects.length; i++) {
            if (this.x > collisionObjects[i].x && this.x < collisionObjects[i].x+collisionObjects[i].width &&
                this.y > collisionObjects[i].y && this.y < collisionObjects[i].y+collisionObjects[i].height) {
                this.canMove = false;
                switch(i) {
                    case 0: /// target
                        if (this.y > collisionObjects[i].y + 110)
                            volume = 10;
                        else if (this.y > collisionObjects[i].y + 91)
                            volume = 25;
                        else if (this.y > collisionObjects[i].y + 75)
                            volume = 50;
                        else if (this.y > collisionObjects[i].y + 65)
                            volume = 75;
                        else if (this.y > collisionObjects[i].y + 59)
                            volume = 100;
                        else if (this.y > collisionObjects[i].y + 50)
                            volume = 75;
                        else if (this.y > collisionObjects[i].y + 33)
                            volume = 50;  
                        else if (this.y > collisionObjects[i].y + 15)
                            volume = 25;
                        else if (this.y > collisionObjects[i].y)
                            volume = 10;
                        break;
                    case 1: /// Back wall
                        volume = 0;
                        break;
                }
            }
        }
        

        /// Destory arrow if it leaves canvas.
        if (this.x > Canvas.width + 100 || this.x < -100 || this.y > Canvas.height + 100 || this.y < -100) {
            for (let i=0; i<arrowObjects.length; i++) {
                if (arrowObjects[i].id === this.id) {
                    arrowObjects.splice(i,1);
                    break;
                }
            }
        }
    };
    this.draw = function() {
        Canvas.ctx.fillStyle = "#fff";
        Canvas.ctx.save();
        Canvas.ctx.translate(this.x, this.y);
        Canvas.ctx.rotate(this.angle);
        Canvas.ctx.fillRect(0-this.width, 0-this.height, this.width, this.height);
        Canvas.ctx.restore();
    }
}

var collisionObjects = [];
function Collision(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = function() {
        Canvas.ctx.fillStyle="rgba(0, 0, 255, 0.4)";
        Canvas.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

var Canvas = {
    Canvas : document.createElement("Canvas"),
    ctx : undefined,
    width : window.innerWidth,
    height : window.innerHeight - 4,
    start : function() {
        this.ctx = this.Canvas.getContext("2d");
        this.Canvas.width = this.width;
        this.Canvas.height = this.height;
        this.Canvas.style["background-color"] = "black";
        document.body.appendChild(this.Canvas);
    },
    clear : function() {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
    }
};


function gameLoop() {
    requestAnimationFrame(gameLoop);

    /// Fps
    let timeNow = Date.now();
    deltaTime = (timeNow - timeLast) / 1000;
    timeLast = timeNow;

    /// Clear canvas
    Canvas.clear();

    /// Update code.
    Bow.update();
    for (let i=0; i<arrowObjects.length; i++) {
        arrowObjects[i].update();
    }

    /// Draw funciton.
    draw();
}

function draw() {
    Bow.draw();
    for (let i=0; i<arrowObjects.length; i++) {
        arrowObjects[i].draw();
    }

    Canvas.ctx.drawImage(target, window.innerWidth - 200, window.innerHeight/2 - target.height/2);

    /// 0%
    Canvas.ctx.fillStyle = "#fff";
    Canvas.ctx.fillRect(window.innerWidth-4, 0, 4, window.innerHeight);
    Canvas.ctx.save();
    Canvas.ctx.font = "14px Calibri";
    Canvas.ctx.fillText("0%", window.innerWidth-30, window.innerHeight/2);
    Canvas.ctx.restore();

    /// Volume
    Canvas.ctx.save();
    Canvas.ctx.font = "72px Calibri";
    Canvas.ctx.fillStyle = "#fff"
    Canvas.ctx.fillText("Volume: " + volume + "%", 30, Canvas.height - 60);
    Canvas.ctx.restore();

    /// Debug
    //debug();
}

function debug() {
    Canvas.ctx.fillStyle="#fff";

    Canvas.ctx.fillText(deltaTime, 0, 10);
    Canvas.ctx.fillText("Mouse : " + Mouse.x + ", " + Mouse.y, 0, 20);
    Canvas.ctx.fillText("Bow : " + Bow.x + ", " + Bow.y, 0, 30);
    Canvas.ctx.fillText("Angle (200, 350) : " + (Math.atan((Mouse.y - 350) / (Mouse.x - 200)) * 180/Math.PI) , 0, 40);
    Canvas.ctx.fillText("Arrow Objects : " + arrowObjects.length, 0, 50);

    Canvas.ctx.fillStyle="#000";

    collisionObjects.forEach(function(el) {
        el.draw();
    });
}



