const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {

constructor(x,y,radius,color,text,speed){

    this.posX = x;
    this.posY = y;

    this.radius = radius;

    this.originalColor = color;

    this.text = text;

    this.speed = speed;

    this.dx = (Math.random()*2-1) * this.speed;
    this.dy = (Math.random()*2-1) * this.speed;

    this.flash = 0; // duración del flash azul

}

draw(context){

    context.beginPath();

    if(this.flash > 0){
        context.strokeStyle = "#0000FF";
        this.flash--;
    }else{
        context.strokeStyle = this.originalColor;
    }

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";

    context.fillText(this.text,this.posX,this.posY);

    context.lineWidth = 2;

    context.arc(this.posX,this.posY,this.radius,0,Math.PI*2,false);

    context.stroke();

    context.closePath();

}

update(context){

    this.posX += this.dx;
    this.posY += this.dy;

    // rebote con bordes
    if(this.posX + this.radius > window_width || this.posX - this.radius < 0){
        this.dx = -this.dx;
    }

    if(this.posY + this.radius > window_height || this.posY - this.radius < 0){
        this.dy = -this.dy;
    }

    this.draw(context);

}

distance(other){

    let dx = this.posX - other.posX;
    let dy = this.posY - other.posY;

    return Math.sqrt(dx*dx + dy*dy);

}

checkCollision(other){

    return this.distance(other) <= this.radius + other.radius;

}

bounce(other){

    let tempDx = this.dx;
    let tempDy = this.dy;

    this.dx = other.dx;
    this.dy = other.dy;

    other.dx = tempDx;
    other.dy = tempDy;

}

}

let circles = [];

// evitar que se generen encima
function isOverlapping(x,y,radius){

for(let i=0;i<circles.length;i++){

    let dx = x - circles[i].posX;
    let dy = y - circles[i].posY;

    let distance = Math.sqrt(dx*dx + dy*dy);

    if(distance < radius + circles[i].radius){
        return true;
    }

}

return false;

}

function generateCircles(n){

for(let i=0;i<n;i++){

    let radius = Math.random()*30+20;

    let x,y;

    do{

        x = Math.random()*(window_width-radius*2)+radius;
        y = Math.random()*(window_height-radius*2)+radius;

    }while(isOverlapping(x,y,radius));

    let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;

    let speed = Math.random()*4+1;

    let text = `C${i+1}`;

    circles.push(new Circle(x,y,radius,color,text,speed));

}

}

function detectCollisions(){

for(let i=0;i<circles.length;i++){

    for(let j=i+1;j<circles.length;j++){

        if(circles[i].checkCollision(circles[j])){

            circles[i].flash = 10;
            circles[j].flash = 10;

            circles[i].bounce(circles[j]);

        }

    }

}

}

function animate(){

ctx.clearRect(0,0,window_width,window_height);

circles.forEach(circle=>{
    circle.update(ctx);
});

detectCollisions();

requestAnimationFrame(animate);

}

generateCircles(20);

animate();