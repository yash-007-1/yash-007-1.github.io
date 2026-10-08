const companies=[
 ['google','Google','#4285F4'],['amazon','Amazon','#FF9900'],['microsoft','Microsoft','#F25022'],['openai','OpenAI','#10A37F'],['nvidia','NVIDIA','#76B900'],['meta','Meta','#0866FF'],['apple','Apple','#F5F5F7'],['adobe','Adobe','#FF0000'],['oracle','Oracle','#F80000'],['ibm','IBM','#4589FF'],['intel','Intel','#0071C5'],['github','GitHub','#F0F0F0'],['amazonaws','AWS','#FF9900'],['zoho','Zoho','#F24E1E'],['salesforce','Salesforce','#00A1E0'],['figma','Figma','#F24E1E'],['docker','Docker','#2496ED'],['python','Python','#3776AB'],['react','React','#61DAFB'],['typescript','TypeScript','#3178C6'],['nodejs','Node.js','#5FA04E'],['postgresql','PostgreSQL','#4169E1'],['mongodb','MongoDB','#47A248'],['tensorflow','TensorFlow','#FF6F00']
];

const qs=(s,e=document)=>e.querySelector(s), qsa=(s,e=document)=>[...e.querySelectorAll(s)];
const field=qs('#logo-field');
const reduceMotion=typeof matchMedia==='function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const releaseBoot=()=>{const boot=qs('#boot'); if(boot) boot.classList.add('hidden')};
window.setTimeout(releaseBoot, 1200);
let px=.5,py=.5,scrollTop=0;
const orbitItems=[];

function buildLogos(){
  if(!field) return;
  orbitItems.length=0;
  const count=innerWidth<760?14:34;
  field.innerHTML='';
  for(let i=0;i<count;i++){
    const c=companies[i%companies.length], el=document.createElement('div');
    el.className='brand-orbit'; el.style.setProperty('--brand',c[2]);
    const img=document.createElement('img'); img.src=`https://cdn.simpleicons.org/${c[0]}/${c[2].slice(1)}`; img.alt=''; el.appendChild(img);
    const label=document.createElement('span'); label.textContent=c[1].toUpperCase(); el.appendChild(label); field.appendChild(el);
    orbitItems.push({el,idx:i,phase:Math.random()*Math.PI*2,speed:(.000075+Math.random()*.00013)*(Math.random()>.5?1:-1),radius:.13+Math.random()*.28,yRadius:.08+Math.random()*.17,depth:.65+Math.random()*.55,lane:i%8,scale:.68+Math.random()*.65,drift:Math.random()*7,spin:(Math.random()>.5?1:-1)*(8+Math.random()*24)});
  }
}
function animateLogos(t){
  const w=innerWidth,h=innerHeight;
  orbitItems.forEach(o=>{
    const p=o.phase+t*o.speed*1000, lane=o.lane;
    const bandY=(.11+(lane%4)*.25)*h;
    const bandX=(.05+((lane*1.13)%7)*.14)*w;
    const x=bandX+Math.sin(p)*w*o.radius+(px-.5)*40*o.depth+Math.sin(p*1.8+o.drift)*w*.045-20;
    const y=bandY+Math.cos(p*1.17+o.drift)*h*o.yRadius+(py-.5)*30*o.depth+Math.sin(p*.53+lane)*h*.05-20-scrollTop*.008;
    const z=.72+.28*Math.sin(p+lane), scale=o.scale*(.83+z*.23);
    o.el.style.transform=`translate3d(${x}px,${y}px,0) rotate(${p*o.spin}deg) scale(${scale})`;
    o.el.style.opacity=(.28+z*.55).toFixed(2);
    o.el.style.zIndex=String(Math.floor(z*30));
  });
  if(!reduceMotion) requestAnimationFrame(animateLogos);
}
buildLogos(); if(!reduceMotion) requestAnimationFrame(animateLogos);

const logoWall=qs('#logo-wall');
if(logoWall) companies.slice(0,18).forEach(c=>{
  const item=document.createElement('div'),img=document.createElement('img');
  img.src=`https://cdn.simpleicons.org/${c[0]}/${c[2].slice(1)}`; img.alt=''; item.append(img,document.createTextNode(c[1].toUpperCase())); logoWall.appendChild(item);
});

const space=qs('#space'),ctx=space?.getContext?.('2d');let stars=[];
function resizeSpace(){
  if(!space || !ctx) return;
  const dpr=Math.min(devicePixelRatio||1,2); space.width=innerWidth*dpr;space.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const n=Math.min(170,Math.floor(innerWidth*innerHeight/10500));stars=Array.from({length:n},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.15+Math.random()*.9,a:.05+Math.random()*.35,v:.01+Math.random()*.03,p:Math.random()*6}));
}
function drawSpace(){
  if(!ctx) return;
  ctx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){s.x+=s.v;if(s.x>innerWidth)s.x=0;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(160,215,255,${s.a*(.65+.35*Math.sin(performance.now()*.001+s.p))})`;ctx.fill()} if(!reduceMotion) requestAnimationFrame(drawSpace)}
resizeSpace();drawSpace();addEventListener('resize',()=>{resizeSpace();buildLogos();});

addEventListener('pointermove',e=>{px=e.clientX/innerWidth;py=e.clientY/innerHeight;const core=qs('#cursor-core'),ring=qs('#cursor-ring');if(core){core.style.left=e.clientX+'px';core.style.top=e.clientY+'px'}if(ring){ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px'}},{passive:true});
qsa('a,button,.project-card.compact,.flagship').forEach(el=>{el.addEventListener('mouseenter',()=>qs('#cursor-ring').classList.add('hover'));el.addEventListener('mouseleave',()=>qs('#cursor-ring').classList.remove('hover'))});
addEventListener('scroll',()=>{scrollTop=scrollY;const topbar=qs('.topbar');if(topbar) topbar.classList.toggle('scrolled',scrollTop>35);updateActiveNav();},{passive:true});

function updateActiveNav(){const sections=['home','work','research','stack','contact'];let current='home';for(const id of sections){const s=qs('#'+id);if(s && scrollY>=s.offsetTop-260)current=id;}qsa('.main-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current}`));qsa('.side-item').forEach((el,i)=>el.classList.toggle('active',i===sections.indexOf(current)));}

setTimeout(releaseBoot, 1100);
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});qsa('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%6,5)*60}ms`;observer.observe(el)});

const palette=qs('#palette'),openPal=qs('#open-palette'),closePal=qs('#close-palette'),input=qs('#palette-input');
function togglePalette(v){if(!palette)return;palette.classList.toggle('open',v);palette.setAttribute('aria-hidden',String(!v));if(v && input) setTimeout(()=>input.focus(),50)}
if(openPal) openPal.addEventListener('click',()=>togglePalette(true));if(closePal) closePal.addEventListener('click',()=>togglePalette(false));if(palette) palette.addEventListener('click',e=>{if(e.target===palette)togglePalette(false)});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();togglePalette(true)} if(e.key==='Escape'){togglePalette(false);closeModal()}});
qsa('.palette-list a').forEach(a=>a.addEventListener('click',()=>togglePalette(false)));
if(input) input.addEventListener('input',()=>{const q=input.value.toLowerCase();qsa('.palette-list a').forEach(a=>a.style.display=a.textContent.toLowerCase().includes(q)?'grid':'none')});

const projects={
 argus:{kicker:'01 / FLAGSHIP SYSTEM',title:'ARGUS V',copy:'Investigation and evidence intelligence platform built around structured evidence, AI-assisted analysis, computer vision, machine-learning features and production-oriented APIs.',role:'SYSTEM ARCHITECT / BUILDER',focus:'AI / AGENTS / EVIDENCE',stack:'React · TypeScript · FastAPI · SQLAlchemy'},
 mindcue:{kicker:'02 / COMPUTER VISION',title:'MindCue',copy:'Facial-expression analysis and ML experimentation focused on converting visual signals into useful predictions and measurable model behaviour.',role:'ML / COMPUTER VISION',focus:'VISION / CLASSIFICATION',stack:'Python · OpenCV · ML'},
 rover:{kicker:'03 / ROBOTICS',title:'Rover Path Recovery',copy:'AI-assisted navigation and path recovery workflow for autonomous rover scenarios, focused on decision logic, recovery and route reasoning.',role:'ROBOTICS / AI',focus:'PLANNING / RECOVERY',stack:'AI · Planning · Robotics'},
 imrt:{kicker:'04 / RESEARCH',title:'IMRT Planning Agent',copy:'SARSA-based optimization research exploring intelligent dose-planning decisions inside radiotherapy workflows.',role:'RESEARCH / RL',focus:'OPTIMIZATION / RL',stack:'SARSA · Reinforcement Learning'},
 lifeline:{kicker:'05 / FULL STACK',title:'LIFELINE',copy:'Blood and organ donation management system designed as a complete application for managing users, data, discovery and workflows.',role:'FULL STACK',focus:'DATA / PRODUCT',stack:'React · Next.js · Database'}
};
const modal=qs('#project-modal');
function openModal(id){const p=projects[id];if(!p)return;qs('#modal-kicker').textContent=p.kicker;qs('#modal-title').textContent=p.title;qs('#modal-copy').textContent=p.copy;qs('#modal-role').textContent=p.role;qs('#modal-focus').textContent=p.focus;qs('#modal-stack').textContent=p.stack;modal.classList.add('open');modal.setAttribute('aria-hidden','false')}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
qsa('[data-project]').forEach(card=>card.addEventListener('click',e=>{if(e.target.closest('a'))return;openModal(card.dataset.project)}));
const modalClose=qs('#modal-close');if(modalClose) modalClose.addEventListener('click',closeModal);if(modal) modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});

qsa('.topic').forEach(t=>t.addEventListener('click',()=>{qsa('.topic').forEach(x=>x.classList.remove('active'));t.classList.add('active')}));

async function loadGitHub(){const status=qs('#github-status');try{const res=await fetch('https://api.github.com/users/yash-007-1',{headers:{Accept:'application/vnd.github+json'}});if(!res.ok)throw new Error('github unavailable');const data=await res.json();qs('#repo-count').textContent=data.public_repos??'—';qs('#followers').textContent=data.followers??'—';qs('#updated').textContent=data.updated_at?new Date(data.updated_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short'}).toUpperCase():'—';status.textContent='LIVE PUBLIC PROFILE DATA / GITHUB';}catch{status.textContent='GITHUB DATA LAYER READY / LIVE API UNAVAILABLE';}}
loadGitHub();
releaseBoot();
