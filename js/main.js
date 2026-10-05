const companies = [
  ["google", "Google"],
  ["amazon", "Amazon"],
  ["microsoft", "Microsoft"],
  ["openai", "OpenAI"],
  ["nvidia", "NVIDIA"],
  ["meta", "Meta"],
  ["apple", "Apple"],
  ["adobe", "Adobe"],
  ["oracle", "Oracle"],
  ["ibm", "IBM"],
  ["intel", "Intel"],
  ["github", "GitHub"],
  ["amazonaws", "AWS"],
  ["zoho", "Zoho"]
];

const orbit = document.getElementById("orbit");

companies.forEach((company, index) => {
  const logo = document.createElement("a");
  logo.className = "orbit-logo";
  logo.href = "#stack";
  logo.title = company[1];
  logo.setAttribute("aria-label", company[1]);

  const img = document.createElement("img");
  img.src = `https://cdn.simpleicons.org/${company[0]}/ffffff`;
  img.alt = company[1];
  img.loading = "lazy";

  const angle = (360 / companies.length) * index;
  const radius = 170 + (index % 3) * 35;
  const duration = 24 + (index % 5) * 5;

  logo.style.setProperty("--angle", `${angle}deg`);
  logo.style.setProperty("--radius", `${radius}px`);
  logo.style.setProperty("--duration", `${duration}s`);

  logo.appendChild(img);
  orbit.appendChild(logo);
});

// Loader
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader")?.classList.add("is-done");
  }, 700);
});

// Navbar
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  nav?.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

// Reveal-on-scroll
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
  revealObserver.observe(el);
});

// Particle field
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(90, Math.floor((width * height) / 15000));

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.3 + .25,
    vx: (Math.random() - .5) * .12,
    vy: (Math.random() - .5) * .12,
    a: Math.random() * .35 + .08
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.a})`;
    ctx.fill();
  }

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();

window.addEventListener("resize", resizeCanvas);

// Slight hero parallax
const heroContent = document.querySelector(".hero__content");

window.addEventListener("mousemove", event => {
  if (!heroContent || window.innerWidth < 900) return;

  const x = (event.clientX / window.innerWidth - .5);
  const y = (event.clientY / window.innerHeight - .5);

  heroContent.style.transform =
    `translate3d(${x * 7}px, ${y * 5}px, 0)`;
});
