const companies=[
["google","Google","#4285F4"],["amazon","Amazon","#FF9900"],["microsoft","Microsoft","#F25022"],["openai","OpenAI","#10A37F"],
["nvidia","NVIDIA","#76B900"],["meta","Meta","#0866FF"],["apple","Apple","#F5F5F7"],["adobe","Adobe","#FF0000"],
["oracle","Oracle","#F80000"],["ibm","IBM","#4589FF"],["intel","Intel","#0071C5"],["github","GitHub","#F0F0F0"],
["amazonaws","AWS","#FF9900"],["zoho","Zoho","#F24E1E"],["salesforce","Salesforce","#00A1E0"],["figma","Figma","#F24E1E"],
["docker","Docker","#2496ED"],["python","Python","#3776AB"],["react","React","#61DAFB"],["typescript","TypeScript","#3178C6"],
["nodejs","Node.js","#5FA04E"],["postgresql","PostgreSQL","#4169E1"],["mongodb","MongoDB","#47A248"],["tensorflow","TensorFlow","#FF6F00"]
];

const field=document.getElementById("logo-field");
const items=[];
const mobile=innerWidth<700;
const count=mobile?18:34;

for(let i=0;i<count;i++){
  const c=companies[i%companies.length];
  const a=document.createElement("div");
  a.className="brand-logo";
  a.style.setProperty("--brand",c[2]);
  a.style.setProperty("--opacity",(0.34+Math.random()*.48).toFixed(2));
  const img=document.createElement("img");
  img.src=`https://cdn.simpleicons.org/${c[0]}/${c[2].replace("#","")}`;
  img.alt="";
  a.appendChild(img); field.appendChild(a);
  items.push({
    el:a, phase:Math.random()*Math.PI*2, speed:.00012+Math.random()*.00016,
    track:i%5, radius:.12+Math.random()*.24, wobble:30+Math.random()*100,
    scale:.65+Math.random()*.7, ybias:(Math.random()-.5)*.7
  });
}

let t=0, scroll=0;
function animateLogos(now){
  t=now;
  const w=innerWidth,h=innerHeight;
  items.forEach((o,i)=>{
    const p=o.phase+now*o.speed;
    const track=o.track;
    let cx=w*(.18+((track*0.19)%0.72));
    let cy=h*(.10+((track*0.17)%0.8));
    // Large overlapping elliptical / spiral trajectories make the ecosystem span the screen.
    const rx=w*(o.radius*(track%2?1.25:.9)+.08);
    const ry=h*(o.radius*.42+.10);
    const x=cx+Math.cos(p)*(rx+Math.sin(p*.7)*o.wobble)-24;
    const y=cy+Math.sin(p*1.15)*(ry+Math.cos(p*.6)*o.wobble)+o.ybias*h*.25-24;
    const z=.72+(.28*Math.sin(p+track));
    const sc=o.scale*z;
    o.el.style.transform=`translate3d(${x}px,${y+scroll*.025}px,0) rotate(${p*40}deg) scale(${sc})`;
    o.el.style.zIndex=Math.floor(z*10);
  });
  requestAnimationFrame(animateLogos);
}
requestAnimationFrame(animateLogos);

const nav=document.querySelector(".nav");
addEventListener("scroll",()=>{scroll=scrollY;nav.classList.toggle("scrolled",scrollY>30)},{passive:true});

addEventListener("load",()=>{setTimeout(()=>document.body.classList.add("loaded"),650)});

const obs=new IntersectionObserver(entries=>entries.forEach(e=>{
 if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target)}
}),{threshold:.12});
document.querySelectorAll(".reveal").forEach((e,i)=>{e.style.transitionDelay=`${Math.min(i%5,4)*70}ms`;obs.observe(e)});

// particle field
const canvas=document.getElementById("particles"),ctx=canvas.getContext("2d");let pts=[];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);pts=Array.from({length:Math.min(100,Math.floor(innerWidth*innerHeight/14000))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.2+Math.random()*1,vx:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.08,a:.08+Math.random()*.3}))}
function particles(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=innerWidth;if(p.x>innerWidth)p.x=0;if(p.y<0)p.y=innerHeight;if(p.y>innerHeight)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${p.a})`;ctx.fill()}requestAnimationFrame(particles)}
resize();particles();addEventListener("resize",resize);

// cursor influence on logo swarm
let mx=.5,my=.5;addEventListener("pointermove",e=>{mx=e.clientX/innerWidth;my=e.clientY/innerHeight});
setInterval(()=>{items.forEach((o,i)=>{o.wobble+=((mx-.5)*10+(i%3-1)*2)*.04})},80);
