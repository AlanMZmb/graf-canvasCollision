const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let img = new Image();
img.src = "hamburguesa.png"; 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = [];
let totalObjects = 20;
let score = 0;

const scoreText = document.getElementById("score");

class FallingCircle{

constructor(){
this.reset();
}

reset(){

this.radius = Math.random()*25 + 20;

this.x = Math.random()*(canvas.width - this.radius*2) + this.radius;

this.y = -this.radius;

this.speed = getSpeed();

this.color = randomColor();

}

update(){

this.y += this.speed;

if(this.y - this.radius > canvas.height){
this.reset();
}

}

draw(){

ctx.drawImage(
img,
this.x - this.radius,
this.y - this.radius,
this.radius*2,
this.radius*2
);

}
contains(mx,my){

let dx = this.x - mx;
let dy = this.y - my;

let distance = Math.sqrt(dx*dx + dy*dy);

return distance <= this.radius;

}

}

function randomColor(){
return `hsl(${Math.random()*360},70%,60%)`;
}

function getSpeed(){

if(score > 15) return Math.random()*4 + 6;
if(score > 10) return Math.random()*3 + 4;

return Math.random()*2 + 2;

}

function createObjects(){

for(let i=0;i<totalObjects;i++){
objects.push(new FallingCircle());
}

}

canvas.addEventListener("click",(e)=>{

const rect = canvas.getBoundingClientRect();

const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;

for(let i=0;i<objects.length;i++){

if(objects[i].contains(mouseX,mouseY)){

score++;

scoreText.innerText = "Eliminados: " + score;

objects[i].reset();

break;

}

}

});

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

for(let obj of objects){

obj.update();
obj.draw();

}

requestAnimationFrame(animate);

}

createObjects();
animate();