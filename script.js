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

document.getElementById("celebrate").addEventListener("click", () => burst(320));

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

const petals = Array.from({ length: 48 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: 4 + Math.random() * 7,
  s: 0.35 + Math.random() * 0.8,
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
    pctx.fillStyle = `hsla(${p.hue}, 55%, 68%, 0.5)`;
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
      y: window.innerHeight * 0.32,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.85) * 16,
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
