const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let hasStartedOnEdge = false;
let countdown;
let timeLeft = 20;
let currentLevel = 0;
let lives = 3;
let lastPenalty = 0;
let shapePoints = [];
let coveredSegments = [];
let gameEnded = false;

//  Popup 
function showPopup(type, message, callback) {
  let icon, color;
  switch(type) {
    case "success": icon="success"; color="#00cc66"; break;
    case "error": icon="error"; color="#ff3333"; break;
    case "warning": icon="warning"; color="#ffcc00"; break;
    default: icon="info"; color="#0099ff";
  }
  Swal.fire({
    text: message,
    icon: icon,
    confirmButtonText: "Continue",
    confirmButtonColor: color,
    background: "#1a1a1a",
    color: "#fff"
  }).then(() => { if(callback) callback(); });
}

// Shapes 
function setupShape() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  shapePoints = [];
  coveredSegments = [];

  const totalShapes = 6; // Circle, Square, Triangle, Pentagon, Hexagon, Star
  let shapeType = currentLevel % totalShapes;

  switch(shapeType){
    case 0: drawCircle(); break;
    case 1: drawSquare(); break;
    case 2: drawTriangle(); break;
    case 3: drawPentagon(); break;
    case 4: drawHexagon(); break;
    case 5: drawStar(); break;
  }
}

// Shape Drawing 
function drawCircle() {
  ctx.beginPath();
  ctx.arc(250,250,100,0,2*Math.PI);
  ctx.strokeStyle="#ffcc00"; ctx.lineWidth=5; ctx.stroke();

  for(let i=0;i<360;i++){
    let angle = i*Math.PI/180;
    let x = 250 + 100*Math.cos(angle);
    let y = 250 + 100*Math.sin(angle);
    shapePoints.push({x,y});
  }
  coveredSegments = new Array(shapePoints.length).fill(false);
}

function drawSquare() {
  const size=200, left=150, top=150;
  ctx.beginPath();
  ctx.rect(left, top, size, size);
  ctx.strokeStyle="#ffcc00"; ctx.lineWidth=5; ctx.stroke();

  let step=2;
  for(let x=left; x<=left+size; x+=step){ shapePoints.push({x,y:top}); shapePoints.push({x,y:top+size}); }
  for(let y=top; y<=top+size; y+=step){ shapePoints.push({x:left,y}); shapePoints.push({x:left+size,y}); }
  coveredSegments = new Array(shapePoints.length).fill(false);
}

function drawTriangle() {
  const cx=250, cy=150, size=180;
  const points=[{x:cx,y:cy},{x:cx-size,y:cy+size},{x:cx+size,y:cy+size}];
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.closePath();
  ctx.strokeStyle="#ffcc00"; ctx.lineWidth=5; ctx.stroke();

  for(let i=0;i<points.length;i++){
    let p1=points[i], p2=points[(i+1)%points.length];
    for(let t=0; t<=1; t+=0.01){ shapePoints.push({x:p1.x+(p2.x-p1.x)*t, y:p1.y+(p2.y-p1.y)*t}); }
  }
  coveredSegments = new Array(shapePoints.length).fill(false);
}

//  New Shapes 
function drawPentagon(){ drawPolygon(250,250,100,5); }
function drawHexagon(){ drawPolygon(250,250,100,6); }
function drawStar(){
  const cx=250, cy=250, outer=100, inner=50;
  const points=[];
  for(let i=0;i<10;i++){
    let angle = i*Math.PI/5 - Math.PI/2;
    let r = i%2===0 ? outer : inner;
    points.push({x:cx+r*Math.cos(angle), y:cy+r*Math.sin(angle)});
  }
  drawPolygonPoints(points,true);
}

// Helper to generate regular polygons
function drawPolygon(cx,cy,r,sides){
  const points=[];
  for(let i=0;i<sides;i++){
    let angle = i*2*Math.PI/sides - Math.PI/2;
    points.push({x:cx+r*Math.cos(angle), y:cy+r*Math.sin(angle)});
  }
  drawPolygonPoints(points,true);
}

// Draw polygon from points array and generate edge points
function drawPolygonPoints(points,closePath=false){
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for(let i=1;i<points.length;i++) ctx.lineTo(points[i].x, points[i].y);
  if(closePath) ctx.closePath();
  ctx.strokeStyle="#ffcc00"; ctx.lineWidth=5; ctx.stroke();

  for(let i=0;i<points.length;i++){
    let p1=points[i], p2=points[(i+1)%points.length];
    for(let t=0;t<=1;t+=0.01){ shapePoints.push({x:p1.x+(p2.x-p1.x)*t, y:p1.y+(p2.y-p1.y)*t}); }
  }
  coveredSegments = new Array(shapePoints.length).fill(false);
}

// Outline-only versions
function drawCircleOutline(){ ctx.beginPath(); ctx.arc(250,250,100,0,2*Math.PI); ctx.strokeStyle="#ffcc00"; ctx.lineWidth=5; ctx.stroke(); }
function drawSquareOutline(){ ctx.beginPath(); ctx.rect(150,150,200,200); ctx.strokeStyle="#ffcc00"; ctx.lineWidth=5; ctx.stroke(); }
function drawTriangleOutline(){ const cx=250, cy=150, size=180; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx-size,cy+size); ctx.lineTo(cx+size,cy+size); ctx.closePath(); ctx.strokeStyle="#ffcc00"; ctx.lineWidth=5; ctx.stroke(); }
function drawPolygonOutline(points){ ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y); for(let i=1;i<points.length;i++) ctx.lineTo(points[i].x, points[i].y); ctx.closePath(); ctx.strokeStyle="#ffcc00"; ctx.lineWidth=5; ctx.stroke(); }

// Drawing 
canvas.addEventListener("mousedown",(e)=>{
  if(gameEnded) return;
  const {offsetX, offsetY}=e;
  if(isNearShape(offsetX,offsetY)){ isDrawing=true; hasStartedOnEdge=true; canvas.classList.add("active"); }
});
canvas.addEventListener("mousemove",(e)=>{
  if(!isDrawing||gameEnded) return;
  const {offsetX,offsetY}=e;
  if(!isNearShape(offsetX,offsetY)){ penalize("❌ You went outside the shape!"); return; }
  markSegments(offsetX,offsetY); drawCanvas();
});
canvas.addEventListener("mouseup",()=>{ if(gameEnded) return; isDrawing=false; canvas.classList.remove("active"); checkCompletion(); });

function isNearShape(x,y){ return shapePoints.some(pt=>Math.hypot(pt.x-x,pt.y-y)<15); }
function markSegments(x,y){ shapePoints.forEach((pt,i)=>{ if(Math.hypot(pt.x-x,pt.y-y)<15) coveredSegments[i]=true; }); }

function drawCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const totalShapes=6, shapeType=currentLevel%totalShapes;
  switch(shapeType){
    case 0: drawCircleOutline(); break;
    case 1: drawSquareOutline(); break;
    case 2: drawTriangleOutline(); break;
    case 3: drawPentagon(); break;
    case 4: drawHexagon(); break;
    case 5: drawStar(); break;
  }

  ctx.beginPath();
  ctx.strokeStyle="#00ff99"; ctx.lineWidth=3;
  shapePoints.forEach((pt,i)=>{ if(coveredSegments[i]){ ctx.moveTo(pt.x,pt.y); ctx.lineTo(pt.x+1,pt.y+1); }});
  ctx.stroke();
}

// Completion & Penalty 
function checkCompletion(){ const coverage=coveredSegments.filter(Boolean).length/shapePoints.length; if(coverage>0.8) levelUp(); else penalize("⚠️ Incomplete drawing!"); }
function penalize(reason){ const now=Date.now(); if(now-lastPenalty<1000) return; lastPenalty=now; lives--; document.getElementById("lives").innerText=`❤️ Lives: ${lives}`; if(lives<=0) gameOver("💀 Game Over!"); else showPopup("warning",reason,()=>resetGame(false)); }
function levelUp(){ currentLevel++; showPopup("success",`🎉 Level ${currentLevel} Passed!`,()=>resetGame(false)); }
function gameOver(message){ if(gameEnded) return; gameEnded=true; clearInterval(countdown); isDrawing=false; hasStartedOnEdge=false; showPopup("error",message,()=>resetGame(true)); }

//  Reset & Timer 
function resetGame(fullReset=true){ if(fullReset){ currentLevel=0; lives=3; } isDrawing=false; hasStartedOnEdge=false; lastPenalty=0; gameEnded=false; setupShape(); drawCanvas(); document.getElementById("result").innerText="Draw along the shape to pass!"; document.getElementById("lives").innerText=`❤️ Lives: ${lives}`; document.getElementById("level").innerText=`⭐ Level: ${currentLevel+1}`; startTimer(); }
function startTimer(){ clearInterval(countdown); timeLeft=20; document.getElementById("timer").innerText=`⏱️ Time: ${timeLeft}s`; countdown=setInterval(()=>{ timeLeft--; document.getElementById("timer").innerText=`⏱️ Time: ${timeLeft}s`; if(timeLeft<=0){ clearInterval(countdown); gameOver("⌛ Time's up!"); } },1000); }

//  Start Game 
resetGame();
