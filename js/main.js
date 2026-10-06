const companies = [
  ["google","Google","#4285F4"],["amazon","Amazon","#FF9900"],["microsoft","Microsoft","#F25022"],
  ["openai","OpenAI","#10A37F"],["nvidia","NVIDIA","#76B900"],["meta","Meta","#0866FF"],
  ["apple","Apple","#F5F5F7"],["adobe","Adobe","#FF0000"],["oracle","Oracle","#F80000"],
  ["ibm","IBM","#4589FF"],["intel","Intel","#0071C5"],["github","GitHub","#F0F0F0"],
  ["amazonaws","AWS","#FF9900"],["zoho","Zoho","#F24E1E"],["salesforce","Salesforce","#00A1E0"],
  ["figma","Figma","#F24E1E"],["docker","Docker","#2496ED"],["python","Python","#3776AB"],
  ["react","React","#61DAFB"],["typescript","TypeScript","#3178C6"],["nodejs","Node.js","#5FA04E"],
  ["postgresql","PostgreSQL","#4169E1"],["mongodb","MongoDB","#47A248"],["tensorflow","TensorFlow","#FF6F00"]
];

const field = document.getElementById("logo-field");
const logoItems = [];
const isMobile = innerWidth < 700;
const logoCount = isMobile ? 20 : 42;

/* The logos are deliberately duplicated into several trajectories.
   They are not a single orbit: the swarm crosses the entire viewport at
   different depths, speeds, scales and brand-colour glows. */
for(let i=0;i<logoCount;i++){
  const company = companies[i % companies.length];
  const el = document.createElement("div");
  el.className = "brand-logo";
  el.style.setProperty("--brand", company[2]);
  el.style.setProperty("--opacity", (0.25 + Math.random()*0.55).toFixed(2));

  const img = document.createElement("img");
  img.src = `https://cdn.simpleicons.org/${company[0]}/${company[2].replace("#","")}`;
  img.alt = "";
  img.loading = "lazy";
  el.appendChild(img);
  field.appendChild(el);

  logoItems.push({
    el,
    phase: Math.random()*Math.PI*2,
    speed: 0.00010 + Math.random()*0.00022,
    band: i % 7,
    radius: 0.13 + Math.random()*0.26,
    wobble: 35 + Math.random()*110,
    scale: 0.62 + Math.random()*0.82,
    tilt: (Math.random()-.5)*2,
    depth: 0.55 + Math.random()*0.8
  });
}

let time = 0;
let scrollYPos = 0;
let pointerX = .5, pointerY = .5;

function animateLogos(now){
  time = now;
  const w = innerWidth, h = innerHeight;

  logoItems.forEach((o,i)=>{
    const p = o.phase + now*o.speed;
    const lane = o.band;

    const cx = w*(0.06 + (lane*0.145) % 0.90);
    const cy = h*(0.08 + ((lane*0.19) % 0.82));
    const rx = w*(o.radius*(lane%2 ? 1.28 : .88) + .10);
    const ry = h*(.11 + o.radius*.44);

    const x = cx + Math.cos(p)*rx + Math.sin(p*.61 + lane)*o.wobble
              + (pointerX-.5)*34*o.depth - 22;
    const y = cy + Math.sin(p*1.13)*ry + Math.cos(p*.57 + lane)*o.wobble*.7
              + (pointerY-.5)*24*o.depth + scrollYPos*.018 - 22;

    const z = .62 + .38*Math.sin(p + lane*.8);
    const scale = o.scale*(.82 + z*.35);

    o.el.style.transform =
      `translate3d(${x}px,${y}px,0) rotate(${p*38*o.tilt}deg) scale(${scale})`;
    o.el.style.zIndex = String(Math.floor(z*20));
  });

  requestAnimationFrame(animateLogos);
}
requestAnimationFrame(animateLogos);

addEventListener("pointermove", e=>{
  pointerX = e.clientX/innerWidth;
  pointerY = e.clientY/innerHeight;
},{passive:true});

addEventListener("scroll",()=>{
  scrollYPos = scrollY;
  document.querySelector(".nav")?.classList.toggle("scrolled", scrollY > 30);
},{passive:true});

/* Entrance system */
addEventListener("load",()=>setTimeout(()=>document.body.classList.add("loaded"),650));

const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll(".reveal").forEach((el,i)=>{
  el.style.transitionDelay = `${Math.min(i%6,5)*65}ms`;
  revealObserver.observe(el);
});

/* Subtle particle field */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas(){
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth*dpr;
  canvas.height = innerHeight*dpr;
  canvas.style.width = innerWidth+"px";
  canvas.style.height = innerHeight+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);

  const count = Math.min(120, Math.floor(innerWidth*innerHeight/13000));
  particles = Array.from({length:count},()=>({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    r:.2+Math.random()*.8,
    vx:(Math.random()-.5)*.09,vy:(Math.random()-.5)*.09,
    a:.07+Math.random()*.25
  }));
}
function drawParticles(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of particles){
    p.x += p.vx; p.y += p.vy;
    if(p.x<0)p.x=innerWidth;if(p.x>innerWidth)p.x=0;
    if(p.y<0)p.y=innerHeight;if(p.y>innerHeight)p.y=0;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${p.a})`;ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
resizeCanvas();drawParticles();addEventListener("resize",resizeCanvas);

/* Command palette */
const menu = document.getElementById("command-menu");
const openBtn = document.getElementById("command-open");
const closeBtn = document.getElementById("command-close");
function setMenu(open){
  menu.classList.toggle("open",open);
  menu.setAttribute("aria-hidden",String(!open));
}
openBtn?.addEventListener("click",()=>setMenu(true));
closeBtn?.addEventListener("click",()=>setMenu(false));
menu?.addEventListener("click",e=>{if(e.target===menu)setMenu(false)});
document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="k"){e.preventDefault();setMenu(true)}
  if(e.key==="Escape")setMenu(false);
});
menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));

/* Live public GitHub layer — fails gracefully if API/rate limits block it. */
async function loadGitHub(){
  const status = document.getElementById("github-status");
  try{
    const response = await fetch("https://api.github.com/users/yash-007-1",{
      headers:{"Accept":"application/vnd.github+json"}
    });
    if(!response.ok) throw new Error("GitHub unavailable");
    const data = await response.json();
    document.getElementById("repo-count").textContent = data.public_repos ?? "—";
    document.getElementById("followers").textContent = data.followers ?? "—";
    const date = data.updated_at ? new Date(data.updated_at) : null;
    document.getElementById("updated").textContent = date
      ? date.toLocaleDateString("en-IN",{day:"2-digit",month:"short"}).toUpperCase()
      : "—";
    status.textContent = "Public profile data connected to GitHub.";
  }catch{
    status.textContent = "GitHub data layer is ready; live API data is unavailable right now.";
  }
}
loadGitHub();
