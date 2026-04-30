const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function update(){

}

function draw(){
    
}

function gameLoop(){

    requestAnimationFrame(gameLoop);
}

gameLoop();