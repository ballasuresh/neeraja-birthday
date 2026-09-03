function indiaNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function isBirthdayDate(date) {
  return date.getMonth() === 8 && date.getDate() === 3;
}

function nextBirthdayFrom(date) {
  const year = date.getFullYear();
  const thisYear = new Date(year, 8, 3, 0, 0, 0);
  if (date < thisYear) return thisYear;
  return new Date(year + 1, 8, 3, 0, 0, 0);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

const gate = document.getElementById("gate");
const story = document.getElementById("story");
const envelope = document.getElementById("openSeal");
const liveLine = document.getElementById("liveLine");
const countdown = document.getElementById("countdown");
const todayMark = document.getElementById("todayMark");
const momentLabel = document.getElementById("momentLabel");
const momentTitle = document.getElementById("momentTitle");

function mood() {
  const now = indiaNow();
  if (isBirthdayDate(now)) return "birthday";
  const until = nextBirthdayFrom(now) - now;
  if (until > 0 && until < 1000 * 60 * 60 * 24 * 14) return "soon";
  return "always";
}

function applyCopy() {
  const now = indiaNow();
  const mode = mood();
  const kicker = document.getElementById("gateKicker");
  const title = document.getElementById("gateTitle");
  const hint = document.getElementById("gateHint");
  const letterDate = document.getElementById("letterDate");
  const letterLead = document.getElementById("letterLead");
  const letterGold = document.getElementById("letterGold");

  if (mode === "birthday") {
    document.body.classList.add("is-today");
    kicker.textContent = "Today is your day";
    title.textContent = "Happy Birthday";
    hint.textContent = "Open your birthday letter";
    momentLabel.textContent = "Today";
    momentTitle.textContent = "Your birthday is here";
    liveLine.textContent = "Happy birthday, my love. This day belongs to you.";
    letterDate.textContent = "Today · September 3";
    letterLead.textContent =
      "Happy birthday. This is your morning, your sunlight, your day — and I wanted you to open it knowing you are loved without measure.";
    letterGold.textContent =
      "Today the calendar writes September 3 in gold. The world can wait. This hour is only for you.";
    countdown.classList.add("is-hidden");
    return;
  }

  document.body.classList.remove("is-today");
  kicker.textContent = "A letter, kept for you";
  title.textContent = "For Neeraja";
  hint.textContent = "Open whenever you wish";
  letterDate.textContent = "For you, whenever you arrive";
  letterLead.textContent =
    "Happy birthday. I made this so you would have a place that holds your name the way I hold it — carefully, proudly, and a little in awe. If you are reading this today, tomorrow, or years from now, it is still for you.";
  letterGold.textContent =
    "September 3 will always be gold on my calendar. Whenever you open this, this hour is only for you.";

  const until = nextBirthdayFrom(now) - now;
  if (until > 0 && until < 1000 * 60 * 60 * 24 * 40) {
    countdown.classList.remove("is-hidden");
    momentLabel.textContent = "Until September 3";
    momentTitle.textContent = "Your next birthday";
    liveLine.textContent = "A countdown, and a letter that already belongs to you.";
  } else {
    countdown.classList.add("is-hidden");
    momentLabel.textContent = "Always";
    momentTitle.textContent = "This letter is yours";
    liveLine.textContent = "Come back any day. I wrote this to stay.";
  }
}

function tickCountdown() {
  const now = indiaNow();
  if (isBirthdayDate(now) || countdown.classList.contains("is-hidden")) return;

  const diff = nextBirthdayFrom(now) - now;
  if (diff <= 0) return;

  const sec = Math.floor(diff / 1000);
  document.getElementById("d").textContent = pad(Math.floor(sec / 86400));
  document.getElementById("h").textContent = pad(Math.floor((sec % 86400) / 3600));
  document.getElementById("m").textContent = pad(Math.floor((sec % 3600) / 60));
  document.getElementById("s").textContent = pad(sec % 60);
}

envelope.addEventListener("click", () => {
  envelope.classList.add("is-open");
  setTimeout(() => {
    gate.hidden = true;
    story.hidden = false;
    story.classList.add("is-shown");
    story.animate(
      [
        { opacity: 0, transform: "translateY(14px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 700, easing: "ease", fill: "forwards" }
    );
    const extra = mood() === "birthday";
    burst(extra ? 320 : 220);
    if (extra) {
      setTimeout(() => burst(220), 900);
      setTimeout(() => burst(180), 1800);
    }
  }, 650);
});

document.getElementById("celebrate").addEventListener("click", (event) => {
  const btn = event.currentTarget;
  btn.classList.remove("is-lit");
  void btn.offsetWidth;
  btn.classList.add("is-lit");
  const x = event.clientX || window.innerWidth / 2;
  const y = event.clientY || window.innerHeight * 0.72;
  burst(90, x, y);
  burst(160, window.innerWidth / 2, window.innerHeight * 0.45);
  setTimeout(() => burst(120, window.innerWidth * 0.28, window.innerHeight * 0.38), 180);
  setTimeout(() => burst(120, window.innerWidth * 0.72, window.innerHeight * 0.38), 280);
});

applyCopy();
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

const stars = Array.from({ length: 90 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.4 + 0.3,
  tw: Math.random() * Math.PI * 2,
}));

const petals = Array.from({ length: 28 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: 3 + Math.random() * 6,
  s: 0.25 + Math.random() * 0.55,
  a: Math.random() * Math.PI * 2,
  hue: 330 + Math.random() * 25,
}));

function drawPetals() {
  const w = petalCanvas.width;
  const h = petalCanvas.height;
  pctx.clearRect(0, 0, w, h);

  stars.forEach((st) => {
    st.tw += 0.018;
    pctx.globalAlpha = 0.25 + Math.sin(st.tw) * 0.35;
    pctx.fillStyle = "#f7efe4";
    pctx.beginPath();
    pctx.arc(st.x * w, st.y * h, st.r, 0, Math.PI * 2);
    pctx.fill();
  });
  pctx.globalAlpha = 1;

  petals.forEach((p) => {
    p.y += p.s;
    p.x += Math.sin(p.a) * 0.35;
    p.a += 0.01;
    if (p.y > h + 20) {
      p.y = -20;
      p.x = Math.random() * w;
    }
    pctx.save();
    pctx.translate(p.x, p.y);
    pctx.rotate(p.a);
    pctx.fillStyle = `hsla(${p.hue}, 48%, 78%, 0.38)`;
    pctx.beginPath();
    pctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
    pctx.fill();
    pctx.restore();
  });
  requestAnimationFrame(drawPetals);
}

drawPetals();

let sparks = [];
const sparkColors = ["#efd3a0", "#fff6e8", "#e8b4bc", "#e0707c", "#c9a15a", "#ffffff"];

function burst(count, ox, oy) {
  const x = ox ?? window.innerWidth / 2;
  const y = oy ?? window.innerHeight * 0.32;
  for (let i = 0; i < count; i += 1) {
    const kind = i % 7 === 0 ? "heart" : i % 3 === 0 ? "spark" : "dot";
    sparks.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.9) * 18,
      life: 1,
      size: kind === "heart" ? 5 + Math.random() * 4 : 1.6 + Math.random() * 2.4,
      kind,
      rot: Math.random() * Math.PI,
      color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
    });
  }
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(x, y - size * 0.3, x - size, y - size * 0.3, x - size, y + size * 0.15);
  ctx.bezierCurveTo(x - size, y + size * 0.7, x, y + size, x, y + size * 1.15);
  ctx.bezierCurveTo(x, y + size, x + size, y + size * 0.7, x + size, y + size * 0.15);
  ctx.bezierCurveTo(x + size, y - size * 0.3, x, y - size * 0.3, x, y + size * 0.3);
  ctx.fill();
}

function drawSparks() {
  sctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
  sparks = sparks.filter((sp) => sp.life > 0);
  sparks.forEach((sp) => {
    sp.x += sp.vx;
    sp.y += sp.vy;
    sp.vy += 0.13;
    sp.rot += 0.08;
    sp.life -= 0.01;
    sctx.globalAlpha = Math.max(sp.life, 0);
    sctx.fillStyle = sp.color;
    if (sp.kind === "heart") {
      drawHeart(sctx, sp.x, sp.y, sp.size);
    } else if (sp.kind === "spark") {
      sctx.save();
      sctx.translate(sp.x, sp.y);
      sctx.rotate(sp.rot);
      sctx.fillRect(-sp.size, -0.6, sp.size * 2, 1.2);
      sctx.fillRect(-0.6, -sp.size, 1.2, sp.size * 2);
      sctx.restore();
    } else {
      sctx.beginPath();
      sctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      sctx.fill();
    }
  });
  sctx.globalAlpha = 1;
  requestAnimationFrame(drawSparks);
}

drawSparks();
