const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const card  = document.getElementById('card');
const overlay = document.getElementById('overlay');
const flowersLayer = document.getElementById('flowers');

function placeNoInitially(){
  const stage = card.querySelector('.stage');
  const rect = stage.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const left = rect.left + rect.width * 0.58 - btnRect.width/2;
  const top  = rect.top  + rect.height * 0.35 - btnRect.height/2;
  moveNoTo(left, top);
}

function moveNoTo(x, y){
  const margin = 10;
  const maxX = window.innerWidth - noBtn.offsetWidth - margin;
  const maxY = window.innerHeight - noBtn.offsetHeight - margin;
  const nx = Math.max(margin, Math.min(x, maxX));
  const ny = Math.max(margin, Math.min(y, maxY));
  noBtn.style.left = nx + 'px';
  noBtn.style.top  = ny + 'px';
}

let shrinkFactor = 1.0;
let wanderTimer = null;
function randomMove(){
  const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 20) + 10;
  const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 20) + 10;
  noBtn.style.transition = 'left .35s ease, top .35s ease, transform .25s ease';
  moveNoTo(x, y);
}
function startWander(){
  if (wanderTimer) return;
  wanderTimer = setInterval(randomMove, 650);
}
function shrink(){
  shrinkFactor = Math.max(0.5, shrinkFactor - 0.08);
  noBtn.style.transform = `scale(${shrinkFactor})`;
}
['mouseenter','touchstart','click'].forEach(evt=>{
  noBtn.addEventListener(evt, (e)=>{
    e.preventDefault();
    shrink();
    randomMove();
    startWander();
  }, {passive:false});
});

yesBtn.addEventListener('click', ()=>{
  card.style.opacity = '0';
  card.style.transform = 'scale(0.98)';
  setTimeout(()=>{
    card.style.display = 'none';
    showCelebration();
  }, 250);
});

function showCelebration(){
  overlay.classList.add('show');
  spawnFlowers(36);
}
function spawnFlowers(count){
  const emojis = ['🌸','🌺','🌼','💐','🌷','🌻'];
  for (let i=0;i<count;i++){
    const span = document.createElement('span');
    span.className = 'flower';
    span.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    const size = 20 + Math.random()*18;
    span.style.fontSize = size + 'px';
    span.style.left = Math.random()*100 + 'vw';
    const duration = 3.5 + Math.random()*3.5;
    const delay = Math.random()*1.5;
    span.style.animationDuration = duration + 's';
    span.style.animationDelay = delay + 's';
    span.style.transform = `translateY(-10vh) rotate(${Math.random()*360}deg)`;
    flowersLayer.appendChild(span);
    setTimeout(()=> span.remove(), (delay+duration)*1000 + 200);
  }
  let waves = 2;
  const waveInt = setInterval(()=>{
    if (waves-- <= 0){ clearInterval(waveInt); return; }
    spawnFlowers(18);
  }, 1300);
}

window.addEventListener('resize', ()=>{
  moveNoTo(parseFloat(noBtn.style.left||0), parseFloat(noBtn.style.top||0));
});
window.addEventListener('load', ()=>{ placeNoInitially(); });
