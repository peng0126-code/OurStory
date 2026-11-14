/* ========== 0. 锁定马来西亚时间（UTC+8） ========== */
function getMalaysiaNow() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 8 * 3600 * 1000);
}

/* ========== 1. 天数 + 年月日时分秒 ========== */
const startDate = new Date("2023-01-05T00:00:00+08:00");

function updateNum(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.textContent !== String(value)) {
    el.textContent = value;
    el.classList.remove("flip");
    void el.offsetWidth;
    el.classList.add("flip");
  }
}

function updateCounter() {
  const now = getMalaysiaNow();
  const diffMs = now - startDate;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysEl = document.getElementById("days");
  if (daysEl) daysEl.textContent = totalDays.toLocaleString();

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours() - startDate.getHours();
  let minutes = now.getMinutes() - startDate.getMinutes();
  let seconds = now.getSeconds() - startDate.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0)   { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonth;
    months--;
  }
  if (months < 0) { months += 12; years--; }

  updateNum("y", years);
  updateNum("mo", months);
  updateNum("d", days);
  updateNum("h", hours);
  updateNum("mi", minutes);
  updateNum("s", seconds);
}

function animateNumber(el, target, duration = 3.5) {
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(target * progress);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const nowInit = getMalaysiaNow();
const realDays = Math.floor((nowInit - startDate) / (1000 * 60 * 60 * 24));
const daysEl = document.getElementById("days");
if (daysEl) daysEl.textContent = "0";

/* ========== 2. 读取保存的主题状态 ========== */
const themeBtn = document.getElementById("theme-btn");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "fun") {
  document.body.classList.add("theme-fun");
  themeBtn.textContent = "👑";
} else {
  document.body.classList.remove("theme-fun");
  themeBtn.textContent = "🌸";
}

/* ========== 3. 掉落物 ========== */
const sakuraContainer = document.getElementById("sakura");
const PETAL_COUNT = 25;
const PETAL_INTERVAL = 1500;
const MAX_PETALS = 25;
const USE_IMAGE = false;
const FUN_EMOJIS = ["🦊", "🦁", "⛓️‍💥", "👑", "🗡️"];
const FUN_IMAGES = [
  "images/joker/bathjoker.png",
  "images/joker/whitejoker.png",
  "images/joker/studentjoker.png",
  "images/joker/woffjoker.png"
];

function createPetal(instant) {
  if (sakuraContainer.children.length >= MAX_PETALS) return;
  const isFun = document.body.classList.contains("theme-fun");
  const petal = document.createElement("div");
  petal.className = "petal";
  const size = Math.random() * 12 + 8;

  if (isFun) {
    petal.classList.add("img-petal");
    let pick = USE_IMAGE ? FUN_IMAGES[Math.floor(Math.random() * FUN_IMAGES.length)] : FUN_EMOJIS[Math.floor(Math.random() * FUN_EMOJIS.length)];
    if (USE_IMAGE) {
      petal.style.width = (size + 30) + "px";
      petal.style.height = (size + 30) + "px";
      petal.style.backgroundImage = `url(${pick})`;
    } else {
      petal.style.width = (size + 14) + "px";
      petal.style.height = (size + 14) + "px";
      petal.style.fontSize = (size + 8) + "px";
      petal.textContent = pick;
    }
  } else {
    petal.style.width = size + "px";
    petal.style.height = size + "px";
  }

  petal.style.left = Math.random() * 100 + "vw";
  const duration = Math.random() * 8 + 8;
  petal.style.animationDuration = duration + "s";
  petal.style.animationDelay = instant ? (-Math.random() * duration) + "s" : Math.random() * 2 + "s";
  petal.style.opacity = Math.random() * 0.5 + 0.4;
  petal.addEventListener("animationend", () => petal.remove());
  sakuraContainer.appendChild(petal);
}

function fillPetals() {
  sakuraContainer.innerHTML = "";
  for (let i = 0; i < PETAL_COUNT; i++) createPetal(true);
}
fillPetals();

let petalTimer = setInterval(() => createPetal(false), PETAL_INTERVAL);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(petalTimer);
    petalTimer = null;
  } else {
    if (petalTimer) clearInterval(petalTimer);
    petalTimer = setInterval(() => createPetal(false), PETAL_INTERVAL);
  }
});

/* ========== 4. 时间线按年份折叠 + 滚动淡入淡出 ========== */
const timelineContainer = document.querySelector(".timeline");
const rawEvents = document.querySelectorAll(".event");

if (timelineContainer && rawEvents.length > 0) {
  const yearsData = {};
  let nowEvent = null;
  rawEvents.forEach(event => {
    const dateText = event.querySelector(".date").textContent.trim();
    if (dateText === "现在") {
      nowEvent = event;
      return;
    }
    const year = dateText.substring(0, 4);
    if (!yearsData[year]) yearsData[year] = [];
    yearsData[year].push(event);
  });

  timelineContainer.innerHTML = "";
  Object.keys(yearsData).forEach(year => {
    const groupWrapper = document.createElement("div");
    groupWrapper.className = "year-group";
    const header = document.createElement("div");
    header.className = "year-header";
    header.innerHTML = `<span>${year}</span> <span class="arrow"></span>`;
    const content = document.createElement("div");
    content.className = "year-content";

    yearsData[year].forEach(event => content.appendChild(event));
    groupWrapper.appendChild(header);
    groupWrapper.appendChild(content);
    timelineContainer.appendChild(groupWrapper);

    setTimeout(() => { content.style.maxHeight = content.scrollHeight + "px"; }, 100);

    content.querySelectorAll('img').forEach(img => {
      img.addEventListener('load', () => {
        if (!groupWrapper.classList.contains("collapsed")) {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });

    header.addEventListener("click", () => {
      if (groupWrapper.classList.contains("collapsed")) {
        groupWrapper.classList.remove("collapsed");
        content.style.maxHeight = content.scrollHeight + "px";
        setTimeout(() => {
          if (!groupWrapper.classList.contains("collapsed")) content.style.maxHeight = "none";
        }, 600);
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            groupWrapper.classList.add("collapsed");
            content.style.maxHeight = "0";
          });
        });
      }
    });
  });
  if (nowEvent) timelineContainer.appendChild(nowEvent);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (el.closest(".year-group.collapsed")) return;
    if (entry.isIntersecting) {
      el.classList.add("show");
      el.classList.remove("fade-out");
    } else {
      el.classList.remove("show");
      el.classList.add("fade-out");
    }
  });
}, { threshold: 0, rootMargin: "-50px 0px -50px 0px" });
document.querySelectorAll(".event").forEach(event => observer.observe(event));

/* ========== 5. 图片点击放大 ========== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const flipWrapper = document.getElementById("flip-wrapper");
const backText = document.getElementById("lightbox-back-text");

let currentSourceImg = null;
let isFlipped = false;
let isAnimating = false;
let savedRect = null;
let currentSourceEvent = null;
let savedSourceEventStyles = null;

function freezeTimelineSource(sourceImg) {
  restoreTimelineSource();
  const event = sourceImg && sourceImg.closest(".event");
  if (!event) return;
  const computedTransform = getComputedStyle(event).transform;
  currentSourceEvent = event;
  savedSourceEventStyles = { transition: event.style.transition, transform: event.style.transform };
  event.style.transition = "none";
  event.style.transform = computedTransform === "none" ? "none" : computedTransform;
  void event.offsetWidth;
}

function restoreTimelineSource() {
  if (!currentSourceEvent || !savedSourceEventStyles) return;
  currentSourceEvent.style.transition = savedSourceEventStyles.transition;
  currentSourceEvent.style.transform = savedSourceEventStyles.transform;
  currentSourceEvent = null;
  savedSourceEventStyles = null;
}

const photoSecrets = {
  "cindybirthday2023.jpg": "当初要记得你朋友的名字难了我好一阵子。",
  "genting.jpg": "我们是cool people🥶",
  "1stanniversary.jpg": "一周年快乐，未来的日子也请多指教。",
  "putuovillage.jpg": "第一次觉得可以晒到阳光真好。",
  "tianwailaiwu.jpg": "买来的不一定天长 租的不一定就廉价",
  "osoto.jpg": "吃 吃 吃",
  "1707.jpg": "是我们人生中的第一辆新车！",
  "catcafe.jpg": "猫咪:人类，罐罐呢？",
  "photo2.jpg": "冷天吃火锅，完美！"
};

function preventScroll(e) { if (e.cancelable) e.preventDefault(); }

function resetLightboxVisual() {
  flipWrapper.style.transition = "none";
  flipWrapper.style.transform = "rotateY(0deg)";
  flipWrapper.style.opacity = "1";
  flipWrapper.style.width = "";
  flipWrapper.style.height = "";
  lightboxImg.style.transition = "none";
  lightboxImg.style.transform = "none";
  lightboxImg.style.clipPath = "none";
  lightboxImg.style.opacity = "1";
  lightboxImg.style.width = "";
  lightboxImg.style.height = "";
  const backTextEl = document.querySelector('.text-paper');
  if (backTextEl) {
    backTextEl.style.transition = "none";
    backTextEl.style.transform = "none";
    backTextEl.style.opacity = "1";
  }
}

function openLightbox(src, sourceImg) {
  currentSourceImg = sourceImg;
  freezeTimelineSource(sourceImg);
  savedRect = sourceImg.getBoundingClientRect();
  resetLightboxVisual();
  lightboxImg.src = src;

  const imgName = src.split('/').pop();
  const existingMarker = flipWrapper.querySelector('.secret-marker');
  if (existingMarker) existingMarker.remove();

  if (photoSecrets[imgName]) {
    backText.textContent = photoSecrets[imgName];
    const marker = document.createElement('div');
    marker.className = 'secret-marker';
    marker.textContent = '✨';
    document.querySelector('.flip-front').appendChild(marker);
    setTimeout(() => {
      if (lightbox.classList.contains("show")) marker.classList.add("show");
    }, 450);
  } else {
    backText.textContent = "";
  }

  isFlipped = false;
  isAnimating = false;
  if (sourceImg) {
    sourceImg.style.opacity = "0";
    sourceImg.style.transition = "none";
  }

  lightbox.classList.add("show");
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });

  const startRect = savedRect;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!lightbox.classList.contains("show")) return;
      const rect = startRect;
      const imgCenterX = rect.left + rect.width / 2;
      const imgCenterY = rect.top + rect.height / 2;
      const lbRect = lightboxImg.getBoundingClientRect();
      const lightboxCenterX = lbRect.left + lbRect.width / 2;
      const lightboxCenterY = lbRect.top + lbRect.height / 2;
      const translateX = imgCenterX - lightboxCenterX;
      const translateY = imgCenterY - lightboxCenterY;
      const currentWidth = lbRect.width || 300;
      const currentHeight = lbRect.height || 300;
      const scaleX = rect.width / currentWidth;
      const scaleY = rect.height / currentHeight;
      const targetScale = Math.max(scaleX, scaleY) || 0.1;
      const finalW = currentWidth * targetScale;
      const finalH = currentHeight * targetScale;
      const insetX = Math.max(0, (finalW - rect.width) / 2);
      const insetY = Math.max(0, (finalH - rect.height) / 2);

      lightboxImg.style.clipPath = `inset(${insetY}px ${insetX}px)`;
      lightboxImg.style.transition = "none";
      lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${targetScale})`;

      void lightboxImg.offsetWidth;

      requestAnimationFrame(() => {
        lightboxImg.style.transition = "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), clip-path 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
        lightboxImg.style.transform = "translate(0, 0) scale(1)";
        lightboxImg.style.clipPath = "inset(0px 0px)";
      });
    });
  });
}

function closeLightbox() {
  isAnimating = false;
  const existingMarker = flipWrapper.querySelector('.secret-marker');
  if (existingMarker) {
    existingMarker.style.transition = "opacity 0.2s ease";
    existingMarker.style.opacity = "0";
    setTimeout(() => existingMarker.remove(), 200);
  }

  if (!currentSourceImg) {
    restoreTimelineSource();
    flipWrapper.style.transition = "transform 0.25s ease, opacity 0.25s ease";
    flipWrapper.style.transform = "scale(0.8) rotateY(0deg)";
    flipWrapper.style.opacity = "0";
    setTimeout(() => {
      lightbox.classList.remove("show");
      setTimeout(() => resetLightboxVisual(), 100);
    }, 250);
    return;
  }

  const doFlyBack = (wasFlipped) => {
    const rect = currentSourceImg ? currentSourceImg.getBoundingClientRect() : savedRect;
    const imgCenterX = rect.left + rect.width / 2;
    const imgCenterY = rect.top + rect.height / 2;
    const imgNaturalW = lightboxImg.naturalWidth;
    const imgNaturalH = lightboxImg.naturalHeight;
    const targetRatio = rect.width / rect.height;
    const imgRatio = imgNaturalW / imgNaturalH;
    const lbRect = lightboxImg.getBoundingClientRect();
    const lbWidth = lbRect.width || lightboxImg.clientWidth || 300;
    const lbHeight = lbRect.height || lightboxImg.clientHeight || 300;
    const lightboxCenterX = lbRect.left + lbRect.width / 2;
    const lightboxCenterY = lbRect.top + lbRect.height / 2;
    const translateX = imgCenterX - lightboxCenterX;
    let translateY = imgCenterY - lightboxCenterY;

    const isMobileTimeline = currentSourceImg && currentSourceEvent && window.matchMedia("(max-width: 700px)").matches;
    if (isMobileTimeline && !wasFlipped) translateY += 3;

    let clipInsetX = 0;
    let clipInsetY = 0;
    if (imgRatio > targetRatio) {
      clipInsetX = (lbWidth * (1 - targetRatio / imgRatio)) / 2;
    } else {
      clipInsetY = (lbHeight * (1 - imgRatio / targetRatio)) / 2;
    }

    const targetScaleW = rect.width / (lbWidth - clipInsetX * 2);
    const targetScaleH = rect.height / (lbHeight - clipInsetY * 2);
    const finalScale = Math.max(targetScaleW, targetScaleH);

    lightboxImg.style.transition = `transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), clip-path 0.4s cubic-bezier(0.4, 0, 0.2, 1)`;
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${finalScale})`;
    lightboxImg.style.clipPath = `inset(${clipInsetY}px ${clipInsetX}px)`;

    setTimeout(() => {
      const isMobileTimelineNow = currentSourceImg && currentSourceEvent && window.matchMedia("(max-width: 700px)").matches;
      if (isMobileTimelineNow) {
        currentSourceImg.style.opacity = "0";
        restoreTimelineSource();
        void currentSourceImg.offsetWidth;
      }
      lightbox.style.transition = "none";
      lightbox.classList.remove("show");
      void lightbox.offsetWidth;
      if (currentSourceImg) {
        currentSourceImg.style.opacity = "1";
        if (!isMobileTimelineNow) restoreTimelineSource();
      }
      setTimeout(() => {
        currentSourceImg = null;
        isFlipped = false;
        savedRect = null;
        resetLightboxVisual();
        lightbox.style.transition = "opacity 0.1s ease, visibility 0.1s ease";
      }, 10);
    }, 420);
  };

  if (isFlipped) {
    const wasFlipped = true;
    isFlipped = false;
    isAnimating = true;
    const backTextEl = document.querySelector('.text-paper');
    if (backTextEl) {
      backTextEl.style.transition = "opacity 0.2s ease";
      backTextEl.style.opacity = "0";
    }
    flipWrapper.style.transition = "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)";
    flipWrapper.style.transform = "rotateY(0deg)";
    setTimeout(() => {
      isAnimating = false;
      doFlyBack(wasFlipped);
    }, 450);
  } else {
    doFlyBack(false);
  }

  window.removeEventListener('wheel', preventScroll);
  window.removeEventListener('touchmove', preventScroll);
}

/* ================= 手势翻转 & 点击判定逻辑 ================= */
let pointerStartX = 0, pointerStartY = 0, pointerStartTime = 0, isPointerDown = false;
lightbox.addEventListener('pointerdown', (e) => {
  isPointerDown = true;
  pointerStartX = e.clientX; pointerStartY = e.clientY;
  pointerStartTime = new Date().getTime();
});

lightbox.addEventListener('pointerup', (e) => {
  if (!isPointerDown) return;
  isPointerDown = false;
  const deltaX = e.clientX - pointerStartX;
  const deltaY = e.clientY - pointerStartY;
  const timeDiff = new Date().getTime() - pointerStartTime;
  const distance = Math.hypot(deltaX, deltaY);
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) && timeDiff < 500) {
    triggerFlip(deltaX < 0 ? 1 : -1);
  } else if (distance < 10) {
    if (e.target.id === "lightbox") closeLightbox();
  }
});

lightbox.addEventListener('contextmenu', e => e.preventDefault());

let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
let mouseStartX = 0, mouseStartTime = 0, isMouseDown = false;

function triggerFlip(direction) {
  if (isAnimating) return;
  const imgName = lightboxImg.src.split('/').pop();
  if (!photoSecrets[imgName]) return;
  if (isFlipped) direction = -direction;
  isAnimating = true;
  if (direction === 1) {
    flipWrapper.style.transform = isFlipped ? "rotateY(0deg)" : "rotateY(180deg)";
  } else {
    flipWrapper.style.transform = isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)";
  }
  flipWrapper.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
  isFlipped = !isFlipped;
  setTimeout(() => {
    isAnimating = false;
    if (isFlipped) {
      flipWrapper.style.transition = "none";
      flipWrapper.style.transform = "rotateY(180deg)";
    }
  }, 600);
}

lightbox.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY;
  touchStartTime = new Date().getTime();
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  if (e.changedTouches.length !== 1) return;
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;
  const timeDiff = new Date().getTime() - touchStartTime;
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) && timeDiff < 500) {
    triggerFlip(deltaX < 0 ? 1 : -1);
  }
}, { passive: true });

lightbox.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  mouseStartX = e.clientX;
  mouseStartTime = new Date().getTime();
});

lightbox.addEventListener('mouseup', (e) => {
  if (!isMouseDown) return;
  isMouseDown = false;
  const deltaX = e.clientX - mouseStartX;
  const timeDiff = new Date().getTime() - mouseStartTime;
  if (Math.abs(deltaX) > 50 && timeDiff < 500) {
    triggerFlip(deltaX < 0 ? 1 : -1);
  }
});

document.querySelectorAll(".event .card img").forEach(img => {
  img.addEventListener("click", () => openLightbox(img.src, img));
});

lightbox.addEventListener("click", (e) => {
  if (e.target.id === "lightbox") {
    if (isAnimating) return;
    closeLightbox();
  }
});

/* ========== 6. 主题切换并保存状态 ========== */
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("theme-fun");
  const isFun = document.body.classList.contains("theme-fun");
  themeBtn.textContent = isFun ? "👑" : "🌸";
  localStorage.setItem("theme", isFun ? "fun" : "romantic");
  fillPetals();
});

/* ========== 7. 里程碑进度条 ========== */
const TOTAL_DAYS = 3650;
const milestoneFill = document.getElementById("milestone-fill");
const milestoneMarker = document.getElementById("milestone-marker");
const milestoneLabels = document.getElementById("milestone-labels");
const milestoneBar = document.querySelector(".milestone-bar");
const NODE_COUNT = 11;
const nodes = [];

for (let i = 0; i < NODE_COUNT; i++) {
  const day = Math.round((TOTAL_DAYS / (NODE_COUNT - 1)) * i);
  const percent = (day / TOTAL_DAYS) * 100;
  const node = document.createElement("div");
  node.className = "milestone-node";
  node.style.left = percent + "%";
  node.dataset.day = day;
  milestoneBar.appendChild(node);
  nodes.push(node);
  const label = document.createElement("div");
  label.className = "milestone-label";
  label.style.left = percent + "%";
  label.dataset.day = day;
  label.textContent = i === 0 ? "相遇" : (day / 365).toFixed(0) + "年";
  milestoneLabels.appendChild(label);
}

function getCurrentDays() {
  const now = getMalaysiaNow();
  return Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
}

function updateMilestone() {
  const days = getCurrentDays();
  const percent = Math.min((days / TOTAL_DAYS) * 100, 100);
  requestAnimationFrame(() => {
    milestoneFill.style.width = percent + "%";
    milestoneMarker.style.left = percent + "%";
  });
  const labelEls = milestoneLabels.querySelectorAll(".milestone-label");
  const startTime = performance.now();
  const DURATION = 2500;
  function step(now) {
    const progress = Math.min((now - startTime) / DURATION, 1);
    const currentDay = days * progress;
    nodes.forEach((node, i) => {
      if (parseInt(node.dataset.day) <= currentDay) {
        if (!node.classList.contains("passed")) {
          node.classList.add("passed");
          if (labelEls[i]) labelEls[i].classList.add("passed");
        }
      }
    });
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ========== 倒计时逻辑 ========== */
const START_YEAR = 2023;
const HER_BIRTH_YEAR = 2005;
const HIS_BIRTH_YEAR = 2001;
const HER_BIRTHDAY = { month: 5, day: 3 };
const HIS_BIRTHDAY = { month: 0, day: 26 };
const ANNIVERSARY = { month: 0, day: 5 };

function getDaysUntil(targetMonth, targetDay) {
  const now = getMalaysiaNow();
  now.setHours(0, 0, 0, 0);
  let target = new Date(now.getFullYear(), targetMonth, targetDay);
  if (target < now) target = new Date(now.getFullYear() + 1, targetMonth, targetDay);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function renderCountdownValue(cardEl, isToday, days, todayEmoji) {
  if (!cardEl) return;
  const valueEl = cardEl.querySelector(".countdown-value");
  if (!valueEl) return;
  if (isToday) {
    if (!valueEl.querySelector(".cd-today-emoji")) {
      valueEl.innerHTML = `<span class="cd-today-emoji" style="font-size:1.5rem;letter-spacing:2px;color:var(--main);font-weight:bold;">${todayEmoji}</span>`;
    } else {
      const emojiEl = valueEl.querySelector(".cd-today-emoji");
      if (emojiEl.textContent !== todayEmoji) emojiEl.textContent = todayEmoji;
    }
  } else {
    const numEl = valueEl.querySelector(".cd-num");
    if (!numEl) {
      valueEl.innerHTML = `<span class="cd-num">${days}</span> 天`;
    } else {
      if (numEl.textContent !== String(days)) numEl.textContent = days;
    }
  }
}

function updateCountdowns() {
  const now = getMalaysiaNow();
  now.setHours(0, 0, 0, 0);
  const currentYear = now.getFullYear();
  const cardAnn = document.getElementById("card-anniversary");
  const cardHer = document.getElementById("card-her");
  const cardHim = document.getElementById("card-him");
  const titleAnniversary = document.getElementById("title-anniversary");
  const titleHer = document.getElementById("title-her");
  const titleHim = document.getElementById("title-him");

  let nextAnnYear = currentYear;
  if (now > new Date(currentYear, ANNIVERSARY.month, ANNIVERSARY.day)) nextAnnYear = currentYear + 1;
  const anniversaryCount = nextAnnYear - START_YEAR;
  const isTodayAnn = (now.getMonth() === ANNIVERSARY.month && now.getDate() === ANNIVERSARY.day);

  if (cardAnn && titleAnniversary) {
    if (isTodayAnn) {
      cardAnn.classList.add("is-today");
      titleAnniversary.innerHTML = `第 ${anniversaryCount} 周年<br>纪念日快乐`;
      renderCountdownValue(cardAnn, true, 0, "❤️❤️");
    } else {
      cardAnn.classList.remove("is-today");
      titleAnniversary.textContent = anniversaryCount === 1 ? "距离 1 周年纪念" : `距离 ${anniversaryCount} 周年纪念`;
      renderCountdownValue(cardAnn, false, getDaysUntil(ANNIVERSARY.month, ANNIVERSARY.day), "");
    }
  }

  let nextHerYear = currentYear;
  if (now > new Date(currentYear, HER_BIRTHDAY.month, HER_BIRTHDAY.day)) nextHerYear = currentYear + 1;
  const herAge = nextHerYear - HER_BIRTH_YEAR;
  const isTodayHer = (now.getMonth() === HER_BIRTHDAY.month && now.getDate() === HER_BIRTHDAY.day);

  if (cardHer && titleHer) {
    if (isTodayHer) {
      cardHer.classList.add("is-today");
      titleHer.innerHTML = `Cindy<br>${herAge}岁生日快乐`;
      renderCountdownValue(cardHer, true, 0, "🎉🎂");
    } else {
      cardHer.classList.remove("is-today");
      titleHer.textContent = `距离Cindy ${herAge}岁生日`;
      renderCountdownValue(cardHer, false, getDaysUntil(HER_BIRTHDAY.month, HER_BIRTHDAY.day), "");
    }
  }

  let nextHimYear = currentYear;
  if (now > new Date(currentYear, HIS_BIRTHDAY.month, HIS_BIRTHDAY.day)) nextHimYear = currentYear + 1;
  const hisAge = nextHimYear - HIS_BIRTH_YEAR;
  const isTodayHim = (now.getMonth() === HIS_BIRTHDAY.month && now.getDate() === HIS_BIRTHDAY.day);

  if (cardHim && titleHim) {
    if (isTodayHim) {
      cardHim.classList.add("is-today");
      titleHim.innerHTML = `Kai Peng<br>${hisAge}岁生日快乐`;
      renderCountdownValue(cardHim, true, 0, "🎉🎂");
    } else {
      cardHim.classList.remove("is-today");
      titleHim.textContent = `距离Kai Peng ${hisAge}岁生日`;
      renderCountdownValue(cardHim, false, getDaysUntil(HIS_BIRTHDAY.month, HIS_BIRTHDAY.day), "");
    }
  }
}

/* ========== 统一的每秒 tick ========== */
let globalTickTimer = null;
function startGlobalTick() {
  if (globalTickTimer) return;
  globalTickTimer = setInterval(() => {
    updateCounter();
    updateCountdowns();
  }, 1000);
}
function stopGlobalTick() {
  if (globalTickTimer) {
    clearInterval(globalTickTimer);
    globalTickTimer = null;
  }
}
updateCountdowns();
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopGlobalTick();
  } else {
    updateCounter();
    updateCountdowns();
    startGlobalTick();
  }
});
window.addEventListener("focus", () => {
  updateCounter();
  updateCountdowns();
});

window.addEventListener("load", () => {
  milestoneFill.style.width = "0%";
  milestoneMarker.style.left = "0%";
  setTimeout(updateMilestone, 500);
  setTimeout(() => { animateNumber(daysEl, realDays, 3500); }, 500);
  setTimeout(() => {
    updateCounter();
    updateCountdowns();
    startGlobalTick();
  }, 4000);
});

const loveWords = ["喜欢你！", "贴贴~", "今天也很想你", "薛之谦！", "❤️", "抱抱", "喵", "￣3￣"];
const normalMarker = document.getElementById("milestone-marker");
const clockMarker = document.getElementById("clock-m-marker");

function jumpAndSpeak(markerEl, event) {
  if (!markerEl) return;
  markerEl.classList.remove("jump");
  void markerEl.offsetWidth;
  markerEl.classList.add("jump");
  const randomWord = loveWords[Math.floor(Math.random() * loveWords.length)];
  const bubble = document.createElement("div");
  bubble.textContent = randomWord;
  bubble.style.cssText = `
    position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
    background: var(--main); color: white; padding: 4px 10px; border-radius: 10px;
    font-size: 12px; white-space: nowrap; pointer-events: none;
    animation: bubblePop 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; z-index: 99;
  `;
  markerEl.appendChild(bubble);
  setTimeout(() => bubble.remove(), 1000);
}

if (normalMarker) normalMarker.addEventListener("click", () => jumpAndSpeak(normalMarker));
if (clockMarker) clockMarker.addEventListener("click", () => jumpAndSpeak(clockMarker));

/* ========== 8. 照片墙 ========== */
const wallPhotos = [
  "images/photowall/photo12.jpg", "images/photowall/photo11.jpg", "images/photowall/photo10.jpg",
  "images/photowall/photo9.jpg", "images/photowall/photo8.jpg", "images/photowall/photo7.jpg",
  "images/photowall/photo6.jpg", "images/photowall/photo5.jpg", "images/photowall/photo4.jpg",
  "images/photowall/photo3.jpg", "images/photowall/photo2.jpg", "images/photowall/photo1.jpg"
];

const photoWall = document.getElementById("photo-wall");
if (photoWall) {
  wallPhotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "我们的照片";
    img.addEventListener("click", () => openLightbox(img.src, img));
    photoWall.appendChild(img);
  });
}

/* ========== 9. 节点导航 ========== */
const jumpNav = document.getElementById("jump-nav");
const jumpNavBtn = document.getElementById("jump-nav-btn");
const jumpNavMenu = document.getElementById("jump-nav-menu");
const photoSection = document.querySelector(".photo-wall-section");
const endingEl = document.querySelector(".ending");
const yearGroups = document.querySelectorAll(".year-group");
const jumpTargets = [];

jumpTargets.push({ label: "顶部", getEl: () => document.querySelector("header") });
yearGroups.forEach(group => {
  const yearText = group.querySelector(".year-header span")?.textContent?.trim();
  if (yearText) jumpTargets.push({ label: yearText, getEl: () => group, isYear: true });
});
if (endingEl) {
  jumpTargets.push({
    label: "最近", isYear: true,
    getEl: () => {
      const allEvents = document.querySelectorAll(".timeline .event");
      return allEvents[allEvents.length - 1] || endingEl;
    }
  });
}
if (photoSection) jumpTargets.push({ label: "照片墙", getEl: () => photoSection });

const slotSection = document.querySelector(".slot-section");
if (slotSection) jumpTargets.push({ label: "游戏机", getEl: () => slotSection });

function renderJumpMenu() {
  if (!jumpNavMenu) return;
  jumpNavMenu.innerHTML = "";
  jumpTargets.forEach((target, index) => {
    const btn = document.createElement("button");
    btn.className = "jump-nav-item";
    btn.type = "button";
    btn.textContent = target.label;
    btn.dataset.index = index;
    btn.addEventListener("click", () => {
      const el = target.getEl();
      if (!el) return;
      if (target.isYear) {
        const group = el;
        if (group.classList.contains("collapsed")) group.querySelector(".year-header")?.click();
      }
      const targetTop = window.scrollY + el.getBoundingClientRect().top - 20;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      closeJumpMenu();
    });
    jumpNavMenu.appendChild(btn);
  });
}
renderJumpMenu();

function openJumpMenu() { jumpNav?.classList.add("open"); updateCurrentJumpItem(); }
function closeJumpMenu() { jumpNav?.classList.remove("open"); }

if (jumpNavBtn) {
  jumpNavBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    jumpNav.classList.contains("open") ? closeJumpMenu() : openJumpMenu();
  });
}

document.addEventListener("click", (e) => {
  if (jumpNav && jumpNav.classList.contains("open") && !jumpNav.contains(e.target)) closeJumpMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeJumpMenu();
});

function updateCurrentJumpItem() {
  if (!jumpNavMenu) return;
  const scrollPos = window.scrollY + window.innerHeight * 0.35;
  let activeIndex = 0;
  jumpTargets.forEach((target, index) => {
    const el = target.getEl();
    if (el && scrollPos >= window.scrollY + el.getBoundingClientRect().top) activeIndex = index;
  });
  jumpNavMenu.querySelectorAll(".jump-nav-item").forEach(btn => {
    btn.classList.toggle("current", Number(btn.dataset.index) === activeIndex);
  });
}
window.addEventListener("scroll", () => {
  if (jumpNav && jumpNav.classList.contains("open")) updateCurrentJumpItem();
});

/* ========== 10. 时钟模式 ========== */
const clockBtn = document.getElementById("clock-btn");
const clockOverlay = document.getElementById("clock-overlay");
const closeClockMobile = document.getElementById("close-clock-mobile");
const toggleBtn = document.getElementById("clock-toggle-btn");
const ampmDisplay = document.getElementById("clock-ampm");
const dateDisplay = document.getElementById("clock-date");
const dateToggleBtn = document.getElementById("clock-date-toggle-btn");

let is12HourFormat = localStorage.getItem("clockFormat") === "12";
if (is12HourFormat && toggleBtn) toggleBtn.textContent = "12小时制";

let dateFormatIndex = parseInt(localStorage.getItem("clockDateFormat") || "0");
if (dateToggleBtn) dateToggleBtn.textContent = "日期格式";

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    is12HourFormat = !is12HourFormat;
    toggleBtn.textContent = is12HourFormat ? "12小时制" : "24小时制";
    localStorage.setItem("clockFormat", is12HourFormat ? "12" : "24");
    updateClock();
  });
}

if (dateToggleBtn) {
  dateToggleBtn.addEventListener("click", () => {
    dateFormatIndex = (dateFormatIndex + 1) % 4;
    localStorage.setItem("clockDateFormat", String(dateFormatIndex));
    updateClock();
  });
}

function initFlipClock() {
  const flipClock = document.getElementById("flip-clock");
  if (!flipClock) return;
  flipClock.innerHTML = `
    <div class="flip-digit" id="clock-h1">0</div><div class="flip-digit" id="clock-h2">0</div>
    <div class="flip-colon">:</div>
    <div class="flip-digit" id="clock-m1">0</div><div class="flip-digit" id="clock-m2">0</div>
    <div class="flip-colon">:</div>
    <div class="flip-digit" id="clock-s1">0</div><div class="flip-digit" id="clock-s2">0</div>
  `;
}
initFlipClock();

function flipDigit(id, newValue) {
  const el = document.getElementById(id);
  if (!el || el.textContent === String(newValue)) return;
  el.style.opacity = "0.3";
  el.style.transform = "scaleY(0.8)";
  setTimeout(() => {
    el.textContent = newValue;
    el.style.opacity = "1";
    el.style.transform = "scaleY(1)";
  }, 150);
}

function formatDate(now) {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  if (dateFormatIndex === 0) return `${yyyy}-${mm}-${dd}`;
  if (dateFormatIndex === 1) return `${dd}/${mm}/${yyyy}`;
  if (dateFormatIndex === 2) return `${mm}/${dd}/${yyyy}`;
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${now.getDate()} ${monthsEn[now.getMonth()]} ${yyyy}`;
}

function setCdCard(boxEl, titleEl, cdValueContainerEl, isToday, titleHtml, normalTitle, days, todayEmoji) {
  if (!boxEl || !titleEl || !cdValueContainerEl) return;
  if (isToday) {
    boxEl.classList.add("is-today");
    titleEl.innerHTML = titleHtml;
    if (cdValueContainerEl.innerHTML !== `<span style="font-size:1.5rem;letter-spacing:2px;color:var(--main);font-weight:bold;">${todayEmoji}</span>`) {
      cdValueContainerEl.innerHTML = `<span style="font-size:1.5rem;letter-spacing:2px;color:var(--main);font-weight:bold;">${todayEmoji}</span>`;
    }
  } else {
    boxEl.classList.remove("is-today");
    titleEl.innerHTML = normalTitle;
    if (cdValueContainerEl.innerHTML.indexOf("天") === -1 || cdValueContainerEl.querySelector("span")?.textContent !== String(days)) {
      cdValueContainerEl.innerHTML = `<span>${days}</span> 天`;
    }
  }
}

function updateClock() {
  if (!clockOverlay.classList.contains("show")) return;
  const now = getMalaysiaNow();
  let hours = now.getHours();
  let ampm = "";
  if (is12HourFormat) {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    if(ampmDisplay) { ampmDisplay.textContent = ampm; ampmDisplay.style.opacity = "1"; }
  } else {
    if(ampmDisplay) { ampmDisplay.textContent = ""; ampmDisplay.style.opacity = "0"; }
  }
  if (dateDisplay) dateDisplay.textContent = formatDate(now);

  const hh = String(hours).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  flipDigit("clock-h1", hh[0]); flipDigit("clock-h2", hh[1]);
  flipDigit("clock-m1", mm[0]); flipDigit("clock-m2", mm[1]);
  flipDigit("clock-s1", ss[0]); flipDigit("clock-s2", ss[1]);

  const days = getCurrentDays();
  const clockDaysEl = document.getElementById("clock-days");
  if (clockDaysEl) clockDaysEl.textContent = days.toLocaleString();

  const today = getMalaysiaNow();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  const isTodayAnn = (today.getMonth() === ANNIVERSARY.month && today.getDate() === ANNIVERSARY.day);
  const isTodayHer = (today.getMonth() === HER_BIRTHDAY.month && today.getDate() === HER_BIRTHDAY.day);
  const isTodayHim = (today.getMonth() === HIS_BIRTHDAY.month && today.getDate() === HIS_BIRTHDAY.day);

  const clockBoxAnn = document.querySelector(".left-col .box-cd");
  const clockBoxHer = document.querySelector(".right-col .box-cd");
  const clockBoxHim = document.querySelector(".right-col .box-cd:last-child");

  let nextAnnYear = currentYear;
  if (today > new Date(currentYear, ANNIVERSARY.month, ANNIVERSARY.day)) nextAnnYear = currentYear + 1;
  const anniversaryCount = nextAnnYear - START_YEAR;
  const clockTitleAnn = document.getElementById("clock-title-ann");
  setCdCard(clockBoxAnn, clockTitleAnn, clockTitleAnn ? clockTitleAnn.nextElementSibling : null, isTodayAnn,
    `第 ${anniversaryCount} 周年<br>纪念日快乐`,
    anniversaryCount === 1 ? "距离 1 周年<br>纪念日" : `距离 ${anniversaryCount} 周年<br>纪念日`,
    getDaysUntil(ANNIVERSARY.month, ANNIVERSARY.day), "❤️❤️");

  let nextHerYear = currentYear;
  if (today > new Date(currentYear, HER_BIRTHDAY.month, HER_BIRTHDAY.day)) nextHerYear = currentYear + 1;
  const herAge = nextHerYear - HER_BIRTH_YEAR;
  const clockTitleHer = document.getElementById("clock-title-her");
  setCdCard(clockBoxHer, clockTitleHer, clockTitleHer ? clockTitleHer.nextElementSibling : null, isTodayHer,
    `Cindy<br>${herAge}岁生日快乐`, `距离Cindy<br>${herAge}岁生日`,
    getDaysUntil(HER_BIRTHDAY.month, HER_BIRTHDAY.day), "🎉🎂");

  let nextHimYear = currentYear;
  if (today > new Date(currentYear, HIS_BIRTHDAY.month, HIS_BIRTHDAY.day)) nextHimYear = currentYear + 1;
  const hisAge = nextHimYear - HIS_BIRTH_YEAR;
  const clockTitleHim = document.getElementById("clock-title-him");
  setCdCard(clockBoxHim, clockTitleHim, clockTitleHim ? clockTitleHim.nextElementSibling : null, isTodayHim,
    `Kai Peng<br>${hisAge}岁生日快乐`, `距离Kai Peng<br>${hisAge}岁生日`,
    getDaysUntil(HIS_BIRTHDAY.month, HIS_BIRTHDAY.day), "🎉🎂");

  const percent = Math.min((days / 3650) * 100, 100);
  const fillEl = document.getElementById("clock-m-fill");
  const markerEl = document.getElementById("clock-m-marker");
  if (fillEl) fillEl.style.width = percent + "%";
  if (markerEl) markerEl.style.left = percent + "%";

  const barContainer = document.querySelector(".clock-m-bar");
  const labelsContainer = document.getElementById("clock-m-labels");

  if (barContainer && labelsContainer && labelsContainer.children.length === 0) {
    for (let i = 0; i < 11; i++) {
      const day = Math.round((3650 / 10) * i);
      const p = (day / 3650) * 100;
      const node = document.createElement("div");
      node.className = "clock-m-node";
      node.style.left = p + "%";
      node.dataset.day = day;
      barContainer.appendChild(node);

      const lbl = document.createElement("div");
      lbl.className = "clock-m-label";
      lbl.style.left = p + "%";
      lbl.textContent = i === 0 ? "相遇" : (day / 365).toFixed(0) + "年";
      labelsContainer.appendChild(lbl);
    }
  }
  if (barContainer && labelsContainer) {
    const allNodes = barContainer.querySelectorAll(".clock-m-node");
    const allLabels = labelsContainer.querySelectorAll(".clock-m-label");
    allNodes.forEach((node, i) => {
      if (parseInt(node.dataset.day) <= days) {
        node.classList.add("passed"); if (allLabels[i]) allLabels[i].classList.add("passed");
      } else {
        node.classList.remove("passed"); if (allLabels[i]) allLabels[i].classList.remove("passed");
      }
    });
  }
}

let clockTimeout = null;
let hideButtonsTimer = null;

function clockTick() {
  if (!clockOverlay.classList.contains("show")) return;
  updateClock();
  clockTimeout = setTimeout(clockTick, 1000 - getMalaysiaNow().getMilliseconds());
}

function resetHideTimer() {
  if (!document.body.classList.contains("in-clock-mode")) return;
  document.body.classList.remove("hide-buttons");
  if (hideButtonsTimer) clearTimeout(hideButtonsTimer);
  hideButtonsTimer = setTimeout(() => {
    if (document.body.classList.contains("in-clock-mode")) document.body.classList.add("hide-buttons");
  }, 3000);
}

function toggleClock(enter) {
  if (enter) {
    clockOverlay.classList.add("show");
    document.body.classList.add("in-clock-mode");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    clockBtn.innerHTML = "❌";
    clockBtn.title = "退出时钟模式";
    if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    if (clockTimeout) { clearTimeout(clockTimeout); clockTimeout = null; }
    clockTick(); resetHideTimer();
  } else {
    clockOverlay.classList.remove("show");
    document.body.classList.remove("in-clock-mode");
    document.body.classList.remove("hide-buttons");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    clockBtn.innerHTML = "⏰";
    clockBtn.title = "进入时钟模式";
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    if (clockTimeout) { clearTimeout(clockTimeout); clockTimeout = null; }
    if (hideButtonsTimer) { clearTimeout(hideButtonsTimer); hideButtonsTimer = null; }
  }
}

clockBtn.addEventListener("click", () => {
  toggleClock(!clockOverlay.classList.contains("show"));
  if (typeof closeLayoutMenu === "function") closeLayoutMenu();
});
if (closeClockMobile) closeClockMobile.addEventListener("click", () => toggleClock(false));
clockOverlay.addEventListener("click", (e) => { if (!e.target.closest('.theme-btn')) resetHideTimer(); });
clockBtn.addEventListener("mouseenter", () => { if (hideButtonsTimer) clearTimeout(hideButtonsTimer); document.body.classList.remove("hide-buttons"); });
clockBtn.addEventListener("mouseleave", resetHideTimer);
themeBtn.addEventListener("mouseenter", () => { if (hideButtonsTimer) clearTimeout(hideButtonsTimer); document.body.classList.remove("hide-buttons"); });
themeBtn.addEventListener("mouseleave", resetHideTimer);

const layoutPicker = document.getElementById("layout-picker");
const layoutPickerToggle = document.getElementById("layout-picker-toggle");
const layoutPickerCurrent = document.getElementById("layout-picker-current");
const layoutOptions = document.querySelectorAll(".layout-option");
const clockContainer = document.querySelector(".clock-container");
const LAYOUT_NAMES = ["默认三列", "极简分屏", "上下结构", "纯粹时钟"];

let currentLayoutIndex = parseInt(localStorage.getItem("clockLayoutIndex")) || 0;
if (isNaN(currentLayoutIndex) || currentLayoutIndex < 0 || currentLayoutIndex > 3) currentLayoutIndex = 0;

function applyLayout() {
  if (!clockContainer) return;
  clockContainer.classList.remove("layout-minimal", "layout-stacked", "layout-pure");
  if (currentLayoutIndex === 1) clockContainer.classList.add("layout-minimal");
  else if (currentLayoutIndex === 2) clockContainer.classList.add("layout-stacked");
  else if (currentLayoutIndex === 3) clockContainer.classList.add("layout-pure");

  if (layoutPickerCurrent) layoutPickerCurrent.textContent = LAYOUT_NAMES[currentLayoutIndex];
  layoutOptions.forEach(opt => opt.classList.toggle("active", parseInt(opt.dataset.layout) === currentLayoutIndex));
  localStorage.setItem("clockLayoutIndex", currentLayoutIndex);
}

function openLayoutMenu() { if (layoutPicker) layoutPicker.classList.add("open"); }
function closeLayoutMenu() { if (layoutPicker) layoutPicker.classList.remove("open"); }

if (layoutPickerToggle) {
  layoutPickerToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    layoutPicker.classList.contains("open") ? closeLayoutMenu() : openLayoutMenu();
  });
}

layoutOptions.forEach(opt => {
  opt.addEventListener("click", (e) => {
    e.stopPropagation();
    const idx = parseInt(opt.dataset.layout);
    if (!isNaN(idx) && idx >= 0 && idx <= 3) {
      currentLayoutIndex = idx; applyLayout(); closeLayoutMenu();
    }
  });
});

document.addEventListener("click", (e) => {
  if (layoutPicker && layoutPicker.classList.contains("open") && !layoutPicker.contains(e.target)) closeLayoutMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && layoutPicker && layoutPicker.classList.contains("open")) closeLayoutMenu();
});
applyLayout();

let letterScrollLocked = false;
function preventLetterBgScroll(e) {
  if (!letterScrollLocked) return;
  if (!e.target.closest('.letter-paper') && e.cancelable) e.preventDefault();
}

function openLetter(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    letterScrollLocked = true;
    window.addEventListener('wheel', preventLetterBgScroll, { passive: false });
    window.addEventListener('touchmove', preventLetterBgScroll, { passive: false });
    document.body.classList.add('hide-buttons');
    setTimeout(() => modal.classList.add('show'), 10);
  }
}

function closeLetter(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('show');
    letterScrollLocked = false;
    window.removeEventListener('wheel', preventLetterBgScroll);
    window.removeEventListener('touchmove', preventLetterBgScroll);
    document.body.classList.remove('hide-buttons');
    setTimeout(() => modal.style.display = 'none', 400);
  }
}

/* ========== 完整功能的音乐播放器 ========== */
const bgm = document.getElementById("bgm");
const musicControls = document.getElementById("music-controls");
const musicToggleBtn = document.getElementById("music-toggle-btn");
const musicPrevBtn = document.getElementById("music-prev-btn");
const musicNextBtn = document.getElementById("music-next-btn");
const musicRandomBtn = document.getElementById("music-random-btn");
const musicListBtn = document.getElementById("music-list-btn");
const musicListContainer = document.getElementById("music-list");
const musicCurrentTitle = document.getElementById("music-current-title");

const MUSIC_PLAYLIST = [
  { title: "刻在我心底的名字", src: "music/kezaixindi.mp3" },
  { title: "任性", src: "music/renxing.mp3" },
  { title: "如果可以", src: "music/ruguokeyi.mp3" },
  { title: "想见你想见你想见你", src: "music/xiangjianni.mp3" },
  { title: "初爱-日", src: "music/firstlove.mp3" }
];

let currentTrackIndex = 0;
let isRandomMusic = false;
let isMusicEnabled = false;
let fadeInterval = null;
const MUSIC_VOLUME = 1;
let isHoveringMusic = false, isTouchingMusic = false, lastInteractionTime = 0;

function setMusicMutedState() {
  musicControls.classList.remove("state-collapsed");
  musicToggleBtn.title = "开启音乐";
  const expandedContent = document.querySelector(".music-expanded-content");
  if (expandedContent) { expandedContent.style.opacity = "0"; expandedContent.style.pointerEvents = "none"; }
}

function setMusicExpandedState() {
  musicControls.classList.remove("state-collapsed");
  musicToggleBtn.title = "暂停音乐";
  lastInteractionTime = Date.now();
  const expandedContent = document.querySelector(".music-expanded-content");
  if (expandedContent) { expandedContent.style.opacity = "1"; expandedContent.style.pointerEvents = "auto"; }
}

function setMusicCollapsedState() {
  if (!isMusicEnabled) return;
  musicControls.classList.add("state-collapsed");
  musicToggleBtn.title = "展开控制";
  const expandedContent = document.querySelector(".music-expanded-content");
  if (expandedContent) { expandedContent.style.opacity = "0"; expandedContent.style.pointerEvents = "none"; }
}

setInterval(() => {
  if (!isMusicEnabled || musicControls.classList.contains("state-collapsed") || musicControls.classList.contains("is-open")) return;
  if (isHoveringMusic || isTouchingMusic) return;
  if (Date.now() - lastInteractionTime > 2000) setMusicCollapsedState();
}, 500);

function renderMusicList() {
  if (!musicListContainer) return;
  musicListContainer.innerHTML = "";
  MUSIC_PLAYLIST.forEach((track, index) => {
    const btn = document.createElement("button");
    btn.className = "music-item" + (index === currentTrackIndex ? " active" : "");
    btn.textContent = track.title;
    btn.title = track.title;
    btn.addEventListener("click", () => {
      loadMusicTrack(index, isMusicEnabled);
      if (musicControls) musicControls.classList.remove("is-open");
      lastInteractionTime = Date.now();
    });
    musicListContainer.appendChild(btn);
  });
}

function updateMusicUI() {
  if (!musicControls || !musicToggleBtn) return;
  musicControls.classList.toggle("is-muted", !isMusicEnabled);
  if (musicCurrentTitle) {
    musicCurrentTitle.textContent = MUSIC_PLAYLIST[currentTrackIndex].title;
    musicCurrentTitle.classList.remove("scrolling");
    musicCurrentTitle.style.transform = "translateX(0)";
    musicCurrentTitle.style.removeProperty("--scroll-distance");
    setTimeout(() => {
      const containerWidth = musicCurrentTitle.parentElement.offsetWidth;
      const textWidth = musicCurrentTitle.scrollWidth;
      if (textWidth > containerWidth && containerWidth > 0) {
        const scrollDistance = textWidth - containerWidth + 10;
        musicCurrentTitle.style.setProperty("--scroll-distance", `-${scrollDistance}px`);
        const duration = Math.max(3, scrollDistance * 0.1);
        musicCurrentTitle.style.animationDuration = `${duration}s`;
        musicCurrentTitle.classList.add("scrolling");
      }
    }, 400);
  }
  if (musicRandomBtn) {
    musicRandomBtn.classList.toggle("active", isRandomMusic);
    musicRandomBtn.title = isRandomMusic ? "随机播放：开启" : "随机播放：关闭";
  }
  renderMusicList();
}

function fadeAudio(targetVolume, callback) {
  if (!bgm) return;
  clearInterval(fadeInterval);
  const step = 0.05, intervalTime = 50;
  fadeInterval = setInterval(() => {
    const currentVolume = bgm.volume;
    const nextVolume = currentVolume < targetVolume ? Math.min(currentVolume + step, targetVolume) : Math.max(currentVolume - step, targetVolume);
    bgm.volume = nextVolume;
    if (nextVolume === targetVolume) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      if (callback) callback();
    }
  }, intervalTime);
}

function loadMusicTrack(index, autoplay = false) {
  if (!bgm || !MUSIC_PLAYLIST.length) return;
  currentTrackIndex = (index + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length;
  const track = MUSIC_PLAYLIST[currentTrackIndex];
  lastInteractionTime = Date.now();
  if (isMusicEnabled && !bgm.paused) {
    fadeAudio(0, () => {
      bgm.pause(); bgm.src = track.src; bgm.load(); updateMusicUI();
      if (autoplay && isMusicEnabled) {
        bgm.volume = 0;
        bgm.play().then(() => { fadeAudio(MUSIC_VOLUME); setMusicExpandedState(); }).catch(() => {
          isMusicEnabled = false; updateMusicUI(); setMusicMutedState();
        });
      }
    });
  } else {
    bgm.pause(); bgm.src = track.src; bgm.load(); updateMusicUI();
    if (autoplay && isMusicEnabled) {
      bgm.volume = 0;
      bgm.play().then(() => { fadeAudio(MUSIC_VOLUME); setMusicExpandedState(); }).catch(() => {
        isMusicEnabled = false; updateMusicUI(); setMusicMutedState();
      });
    }
  }
}

function playNextTrack() {
  if (MUSIC_PLAYLIST.length <= 1) return;
  let nextIndex;
  if (isRandomMusic) { do { nextIndex = Math.floor(Math.random() * MUSIC_PLAYLIST.length); } while (nextIndex === currentTrackIndex); }
  else { nextIndex = (currentTrackIndex + 1) % MUSIC_PLAYLIST.length; }
  loadMusicTrack(nextIndex, isMusicEnabled);
}

function playPrevTrack() {
  if (MUSIC_PLAYLIST.length <= 1) return;
  let prevIndex;
  if (isRandomMusic) { do { prevIndex = Math.floor(Math.random() * MUSIC_PLAYLIST.length); } while (prevIndex === currentTrackIndex); }
  else { prevIndex = (currentTrackIndex - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length; }
  loadMusicTrack(prevIndex, isMusicEnabled);
}

musicToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  lastInteractionTime = Date.now();
  if (!isMusicEnabled) {
    isMusicEnabled = true;
    bgm.volume = 0;
    bgm.play().then(() => { updateMusicUI(); fadeAudio(MUSIC_VOLUME); setMusicExpandedState(); }).catch(() => {
      isMusicEnabled = false; setMusicMutedState();
    });
  } else if (musicControls.classList.contains("state-collapsed")) {
    setMusicExpandedState();
  } else {
    isMusicEnabled = false; updateMusicUI();
    fadeAudio(0, () => bgm.pause());
    setMusicMutedState(); musicControls.classList.remove("is-open");
  }
});

musicControls.addEventListener("click", (e) => {
  lastInteractionTime = Date.now();
  if (typeof resetHideTimer === "function" && document.body.classList.contains("in-clock-mode")) resetHideTimer();
  if (e.target.closest("#music-toggle-btn") || e.target.closest("#music-list-btn")) return;
  if (isMusicEnabled && !musicControls.classList.contains("state-collapsed")) setMusicExpandedState();
});

if (musicNextBtn) musicNextBtn.addEventListener("click", playNextTrack);
if (musicPrevBtn) musicPrevBtn.addEventListener("click", playPrevTrack);

if (musicRandomBtn) {
  musicRandomBtn.addEventListener("click", () => {
    isRandomMusic = !isRandomMusic; updateMusicUI();
    if (isRandomMusic && MUSIC_PLAYLIST.length > 1) playNextTrack();
  });
}

if (musicListBtn) {
  musicListBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    musicControls.classList.toggle("is-open");
    lastInteractionTime = Date.now();
  });
}

document.addEventListener("click", (e) => {
  if (musicControls && musicControls.classList.contains("is-open") && !musicControls.contains(e.target)) {
    musicControls.classList.remove("is-open");
    lastInteractionTime = Date.now();
  }
});

bgm.addEventListener("ended", () => { if (isMusicEnabled) playNextTrack(); });

musicControls.addEventListener("mouseenter", () => { isHoveringMusic = true; lastInteractionTime = Date.now(); if (typeof resetHideTimer === "function" && document.body.classList.contains("in-clock-mode")) resetHideTimer(); });
musicControls.addEventListener("mousemove", () => { lastInteractionTime = Date.now(); if (typeof resetHideTimer === "function" && document.body.classList.contains("in-clock-mode")) resetHideTimer(); });
musicControls.addEventListener("mouseleave", () => { isHoveringMusic = false; lastInteractionTime = Date.now(); });
musicControls.addEventListener("touchstart", () => { isTouchingMusic = true; lastInteractionTime = Date.now(); if (typeof resetHideTimer === "function" && document.body.classList.contains("in-clock-mode")) resetHideTimer(); }, { passive: true });
musicControls.addEventListener("touchend", () => { isTouchingMusic = false; lastInteractionTime = Date.now(); }, { passive: true });

bgm.volume = 0;
loadMusicTrack(0);
updateMusicUI();
setMusicMutedState();

/* ========== 加载遮罩层 ========== */
const loadingScreen = document.getElementById("loading-screen");
if (sessionStorage.getItem("hasVisited")) {
  if (loadingScreen) loadingScreen.style.display = "none";
} else {
  sessionStorage.setItem("hasVisited", "true");
  let progress = 0;
  const loaderBar = document.getElementById("loader-bar");
  const progressInterval = setInterval(() => {
    progress += Math.random() * 10 + 5;
    if (progress > 90) progress = 90;
    if (loaderBar) loaderBar.style.width = progress + "%";
  }, 200);
  window.addEventListener("load", () => {
    clearInterval(progressInterval);
    if (loaderBar) loaderBar.style.width = "100%";
    setTimeout(() => {
      if (loadingScreen) loadingScreen.classList.add("hidden");
      setTimeout(() => { if (loadingScreen) loadingScreen.remove(); }, 800);
    }, 300);
  });
}

/* =========================================================
   25. 老虎机（网页底部）—— 阶梯急刹 + 满屏彩带 + 6张浪漫图
   ========================================================= */
(function initSlotMachine() {
  const machine = document.getElementById("slot-machine");
  if (!machine) return;

  const reelEls = [
    document.getElementById("slot-reel-1"),
    document.getElementById("slot-reel-2"),
    document.getElementById("slot-reel-3")
  ];
  if (reelEls.some(el => !el)) return;

  const ITEM_SIZE = 120;
  const ITEM_SIZE_MOBILE = 86;
  const WINDOW_SIZE = 240;
  const WINDOW_SIZE_MOBILE = 172;

  function getItemSize() { return window.matchMedia("(max-width: 700px)").matches ? ITEM_SIZE_MOBILE : ITEM_SIZE; }
  function getWindowSize() { return window.matchMedia("(max-width: 700px)").matches ? WINDOW_SIZE_MOBILE : WINDOW_SIZE; }

  // 暗黑/搞笑模式（5张）
  const FUN_SLOT_IMAGES = [
    "images/machine/joker/bathjoker.png",
    "images/machine/joker/whitejoker.png",
    "images/machine/joker/studentjoker.png",
    "images/machine/joker/woffjoker.png",
    "images/machine/joker/pinkjoker.png"
  ];

  // ★ 浪漫模式（6 张图）
  const ROMANTIC_IMAGES = [
    "images/machine/romantic/desaru.png",
    "images/machine/romantic/genting.png",
    "images/machine/romantic/home.png",
    "images/machine/romantic/osoto.png",
    "images/machine/romantic/street.png",
    "images/machine/romantic/xiaod.png"
  ];

  function buildItemHTML(index) {
    if (document.body.classList.contains("theme-fun")) {
      return `<div class="slot-item"><img src="${FUN_SLOT_IMAGES[index % 5]}" alt=""></div>`;
    } else {
      return `<div class="slot-item"><img src="${ROMANTIC_IMAGES[index % 6]}" alt=""></div>`;
    }
  }

  const REPEAT = 20;
  const ICON_COUNT = 30;

  /* =========================================================
     ★ 性能优化版 applyCylinder
     - DOM 数量、顺序、索引、translateY 距离全部保持原样
     - 离窗口超过 windowSize * 0.75 的 item 只写一次样式后标记 released
     - 后续帧直接 continue 跳过，不再做 asin / 写 transform / opacity
     - 重新进入可视范围时清除标记，恢复逐帧渲染
     - 动画路径、圆柱透视、急刹效果完全不变
     ========================================================= */
  function applyCylinder(reel, itemSize, windowSize, currentY) {
    const items = reel.children;
    const R = 200;
    const RELEASE_RANGE = windowSize * 0.75;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemCenterY = i * itemSize + itemSize / 2 + currentY;
      const dy = itemCenterY - windowSize / 2;

      // ★ 已释放且仍在远处 → 直接跳过，不碰任何样式
      if (Math.abs(dy) > RELEASE_RANGE) {
        if (item.dataset.released !== "1") {
          const theta = Math.asin(Math.max(-1, Math.min(1, dy / R)));
          const yTranslate = Math.sin(theta) * R - dy;
          const rotateX = -theta * (180 / Math.PI);
          item.style.transform = `translateY(${yTranslate}px) translateZ(-100px) rotateX(${rotateX}deg) scaleY(0.1)`;
          item.style.opacity = "0";
          item.dataset.released = "1";
        }
        continue;
      }

      // ★ 重新进入可视范围 → 清除释放标记
      if (item.dataset.released === "1") {
        delete item.dataset.released;
      }

      const theta = Math.asin(Math.max(-1, Math.min(1, dy / R)));
      const yTranslate = Math.sin(theta) * R - dy;
      const zTranslate = Math.cos(theta) * R - R;
      const rotateX = -theta * (180 / Math.PI);
      const scaleY = Math.max(0.25, Math.cos(theta));
      const opacity = Math.max(0.4, 1 - Math.abs(theta) * 1.0);

      item.style.transform = `translateY(${yTranslate}px) translateZ(${zTranslate}px) rotateX(${rotateX}deg) scaleY(${scaleY})`;
      item.style.opacity = opacity;
    }
  }

  function fillReels() {
    reelEls.forEach(reel => {
      let html = "";
      for (let r = 0; r < REPEAT; r++) {
        for (let i = 0; i < ICON_COUNT; i++) {
          html += buildItemHTML(i);
        }
      }
      reel.innerHTML = html;

      const itemSize = getItemSize();
      const windowSize = getWindowSize();
      const randomCenterIndex = Math.floor(Math.random() * 200) + 50;
      const initY = (windowSize / 2) - (randomCenterIndex * itemSize + itemSize / 2);

      reel.style.transition = "none";
      reel.style.transform = `translateY(${initY}px)`;
      applyCylinder(reel, itemSize, windowSize, initY);
    });
  }

  fillReels();

  const themeBtnEl = document.getElementById("theme-btn");
  if (themeBtnEl) themeBtnEl.addEventListener("click", () => setTimeout(fillReels, 60));

  let isSpinning = false;

  // 满屏彩带效果
  function shootConfetti() {
    const isFun = document.body.classList.contains("theme-fun");
    const colors = isFun
      ? ["#c9a04a", "#e0b458", "#ffe08a", "#ffffff", "#8a7a68"]
      : ["#d98c8c", "#e8c4c4", "#ff9a9e", "#fecfef", "#ffd1dc", "#a1c4fd"];

    const shapes = ["square", "rect", "circle"];

    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.classList.add(shape);

        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + "vw";

        const tx = (Math.random() - 0.5) * 400 + "px";
        const ty = -(Math.random() * 800 + 400) + "px";
        const rot = (Math.random() * 1440 - 720) + "deg";

        confetti.style.setProperty("--tx", tx);
        confetti.style.setProperty("--ty", ty);
        confetti.style.setProperty("--rot", rot);

        confetti.style.animationDuration = (Math.random() * 1 + 2) + "s";

        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
      }, i * 20);
    }
  }

  function spin() {
    if (isSpinning) return;
    isSpinning = true;

    machine.classList.add("pulling");
    machine.classList.remove("jackpot");
    setTimeout(() => machine.classList.remove("pulling"), 320);

    const itemSize = getItemSize();
    const windowSize = getWindowSize();

    let isWin = Math.random() < 0.1;

    const currentTypeCount = document.body.classList.contains("theme-fun") ? 5 : 6;
    let winIndex = Math.floor(Math.random() * currentTypeCount);

    let results = [];
    let finished = 0;

    const globalStartTime = performance.now();

    reelEls.forEach((reel, idx) => {
      let stopIndex;
      if (isWin) {
        stopIndex = winIndex;
      } else {
        do {
          stopIndex = Math.floor(Math.random() * currentTypeCount);
        } while (stopIndex === winIndex);
        if (results.length === 2 && results[0] === results[1] && stopIndex === results[0]) {
          stopIndex = (stopIndex + 1) % currentTypeCount;
        }
      }
      results.push(stopIndex);

      const duration = 1200 + idx * 1000;
      const baseLoops = 8 + idx * 2;
      const totalItems = baseLoops * ICON_COUNT + stopIndex;

      const targetY = (windowSize / 2) - (totalItems * itemSize + itemSize / 2);
      const startY = (windowSize / 2) - (itemSize * 1 + itemSize / 2);

      reel.style.transition = "none";
      reel.style.transform = `translateY(${startY}px)`;
      applyCylinder(reel, itemSize, windowSize, startY);
      void reel.offsetWidth;

      function step(now) {
        const elapsed = now - globalStartTime;

        if (elapsed < duration) {
          const t = elapsed / duration;
          const eased = 1 - Math.pow(1 - t, 3);
          const y = startY + (targetY - startY) * eased;
          reel.style.transform = `translateY(${y}px)`;
          applyCylinder(reel, itemSize, windowSize, y);
          requestAnimationFrame(step);
        } else {
          reel.style.transition = "none";
          reel.style.transform = `translateY(${targetY}px)`;
          applyCylinder(reel, itemSize, windowSize, targetY);

          finished++;
          if (finished === reelEls.length) {
            isSpinning = false;
            if (isWin) {
              machine.classList.add("jackpot");
              setTimeout(() => machine.classList.remove("jackpot"), 700);
              shootConfetti();
            }
          }
        }
      }
      requestAnimationFrame(step);
    });
  }

  machine.addEventListener("click", spin);

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { fillReels(); isSpinning = false; }, 200);
  });
})();
