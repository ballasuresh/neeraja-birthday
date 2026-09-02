const BIRTHDAY = new Date("2026-09-03T00:00:00+05:30");

const gate = document.getElementById("gate");
const story = document.getElementById("story");
const envelope = document.getElementById("openSeal");
const liveLine = document.getElementById("liveLine");

function pad(n) {
  return String(n).padStart(2, "0");
}

function tickCountdown() {
  const now = new Date();
  const diff = BIRTHDAY - now;

  if (diff <= 0) {
    document.getElementById("d").textContent = "00";
    document.getElementById("h").textContent = "00";
    document.getElementById("m").textContent = "00";
    document.getElementById("s").textContent = "00";
    liveLine.textContent = "It is your day. The whole sky is for you.";
    return;
  }

  const sec = Math.floor(diff / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  document.getElementById("d").textContent = pad(d);
  document.getElementById("h").textContent = pad(h);
  document.getElementById("m").textContent = pad(m);
  document.getElementById("s").textContent = pad(s);
  liveLine.textContent = "Until your birthday begins in India.";
}

envelope.addEventListener("click", () => {
  envelope.classList.add("is-open");
  setTimeout(() => {
    gate.style.transition = "opacity 0.7s ease";
    gate.style.opacity = "0";
    setTimeout(() => {
      gate.hidden = true;
      story.hidden = false;
      story.animate(
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 800, easing: "ease", fill: "forwards" }
      );
      burst(180);
    }, 720);
  }, 780);
});

document.getElementById("celebrate").addEventListener("click", () => burst(260));

tickCountdown();
setInterval(tickCountdown, 1000);

const petalCanvas = document.getElementById("petals");
const sparkCanvas = document.getElementById("spark");
const pctx = petalCanvas.getContext("2d");
const sctx = sparkCanvas.getContext("2d");

function sizeCanvases() {
  [petalCanvas, sparkCanvas].forEach((c) => {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  });
}

sizeCanvases();
window.addEventListener("resize", sizeCanvases);

const petals = Array.from({ length: 36 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: 4 + Math.random() * 7,
  s: 0.4 + Math.random() * 0.9,
  a: Math.random() * Math.PI * 2,
  hue: 340 + Math.random() * 30,
}));

function drawPetals() {
  pctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
  petals.forEach((p) => {
    p.y += p.s;
    p.x += Math.sin(p.a) * 0.4;
    p.a += 0.01;
    if (p.y > petalCanvas.height + 20) {
      p.y = -20;
      p.x = Math.random() * petalCanvas.width;
    }
    pctx.save();
    pctx.translate(p.x, p.y);
    pctx.rotate(p.a);
    pctx.fillStyle = `hsla(${p.hue}, 55%, 68%, 0.55)`;
    pctx.beginPath();
    pctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
    pctx.fill();
    pctx.restore();
  });
  requestAnimationFrame(drawPetals);
}

drawPetals();

let sparks = [];

function burst(count) {
  for (let i = 0; i < count; i += 1) {
    sparks.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 14,
      life: 1,
      color: Math.random() > 0.5 ? "#e8c48a" : "#e0707c",
    });
  }
}

function drawSparks() {
  sctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
  sparks = sparks.filter((sp) => sp.life > 0);
  sparks.forEach((sp) => {
    sp.x += sp.vx;
    sp.y += sp.vy;
    sp.vy += 0.12;
    sp.life -= 0.012;
    sctx.globalAlpha = Math.max(sp.life, 0);
    sctx.fillStyle = sp.color;
    sctx.beginPath();
    sctx.arc(sp.x, sp.y, 2.4, 0, Math.PI * 2);
    sctx.fill();
  });
  sctx.globalAlpha = 1;
  requestAnimationFrame(drawSparks);
}

drawSparks();
