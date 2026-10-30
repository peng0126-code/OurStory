/* ========== 1. 天数 + 年月日时分秒 ========== */
const startDate = new Date("2023-01-05T00:00:00");

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
  const now = new Date();

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

// 打开页面时，天数从 0 滚到真实值
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

// 先算出真实天数
const now = new Date();
const realDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

// 从 0 开始滚
const daysEl = document.getElementById("days");
daysEl.textContent = "0";
setTimeout(() => {
  animateNumber(daysEl, realDays, 3500);
}, 300);

// 之后每秒更新（但不再滚动，直接显示真实值）
setTimeout(() => {
  updateCounter();
  setInterval(updateCounter, 1000);
}, 3800);


/* ========== 2. 读取保存的主题状态 ========== */
const themeBtn = document.getElementById("theme-btn");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "fun") {
  // 如果本地存的是万兽之王，就恢复它
  document.body.classList.add("theme-fun");
  themeBtn.textContent = "👑";
} else {
  // 否则默认是浪漫主题
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
    
    let pick;
    if (USE_IMAGE) {
      pick = FUN_IMAGES[Math.floor(Math.random() * FUN_IMAGES.length)];
    } else {
      pick = FUN_EMOJIS[Math.floor(Math.random() * FUN_EMOJIS.length)];
    }

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

  if (instant) {
    petal.style.animationDelay = (-Math.random() * duration) + "s";
  } else {
    petal.style.animationDelay = Math.random() * 2 + "s";
  }

  petal.style.opacity = Math.random() * 0.5 + 0.4;

  petal.addEventListener("animationend", () => {
    petal.remove();
  });

  sakuraContainer.appendChild(petal);
}

function fillPetals() {
  sakuraContainer.innerHTML = "";
  for (let i = 0; i < PETAL_COUNT; i++) {
    createPetal(true);
  }
}

fillPetals();

let petalTimer = setInterval(() => createPetal(false), PETAL_INTERVAL);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(petalTimer);
  } else {
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

    setTimeout(() => {
      content.style.maxHeight = content.scrollHeight + "px";
    }, 100);

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
          if (!groupWrapper.classList.contains("collapsed")) {
            content.style.maxHeight = "none";
          }
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

  if (nowEvent) {
    timelineContainer.appendChild(nowEvent);
  }
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
}, {
  threshold: 0,
  rootMargin: "-50px 0px -50px 0px"
});

document.querySelectorAll(".event").forEach(event => observer.observe(event));

/* ========== 5. 图片点击放大 ========== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

document.querySelectorAll(".event .card img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("show");
  });
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("show");
});

/* ========== 6. 主题切换并保存状态 ========== */
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("theme-fun");
  const isFun = document.body.classList.contains("theme-fun");
  themeBtn.textContent = isFun ? "👑" : "🌸";
  
  // 将当前状态存入浏览器本地
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
  if (i === 0) {
    label.textContent = "相遇";
  } else {
    label.textContent = (day / 365).toFixed(0) + "年";
  }
  milestoneLabels.appendChild(label);
}

function getCurrentDays() {
  const now = new Date();
  const diff = now - startDate;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
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
      const nodeDay = parseInt(node.dataset.day);

      if (nodeDay <= currentDay) {
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

window.addEventListener("load", () => {
  milestoneFill.style.width = "0%";
  milestoneMarker.style.left = "0%";
  setTimeout(updateMilestone, 300);
});

/* ========== 倒计时逻辑 ========== */
const START_YEAR = 2023;       
const HER_BIRTH_YEAR = 2005;   
const HIS_BIRTH_YEAR = 2001;   

const HER_BIRTHDAY = { month: 5, day: 3 };   
const HIS_BIRTHDAY = { month: 0, day: 26 };  
const ANNIVERSARY = { month: 0, day: 5 };    

function getDaysUntil(targetMonth, targetDay) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let target = new Date(now.getFullYear(), targetMonth, targetDay);

  if (target < now) {
    target = new Date(now.getFullYear() + 1, targetMonth, targetDay);
  }

  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function updateCountdowns() {
  const now = new Date();
  now.setHours(0, 0, 0, 0); 
  const currentYear = now.getFullYear();

  const cdAnniversary = document.getElementById("cd-anniversary");
  const cdHer = document.getElementById("cd-her");
  const cdHim = document.getElementById("cd-him");
  
  const titleAnniversary = document.getElementById("title-anniversary");
  const titleHer = document.getElementById("title-her");
  const titleHim = document.getElementById("title-him");

  const cardAnn = document.getElementById("card-anniversary");
  const cardHer = document.getElementById("card-her");
  const cardHim = document.getElementById("card-him");

  let nextAnnYear = currentYear;
  let annDateThisYear = new Date(currentYear, ANNIVERSARY.month, ANNIVERSARY.day);
  if (now > annDateThisYear) nextAnnYear = currentYear + 1;
  const anniversaryCount = nextAnnYear - START_YEAR;

  let nextHerYear = currentYear;
  let herDateThisYear = new Date(currentYear, HER_BIRTHDAY.month, HER_BIRTHDAY.day);
  if (now > herDateThisYear) nextHerYear = currentYear + 1;
  const herAge = nextHerYear - HER_BIRTH_YEAR;

  let nextHimYear = currentYear;
  let himDateThisYear = new Date(currentYear, HIS_BIRTHDAY.month, HIS_BIRTHDAY.day);
  if (now > himDateThisYear) nextHimYear = currentYear + 1;
  const hisAge = nextHimYear - HIS_BIRTH_YEAR;

  const isTodayAnn = (now.getMonth() === ANNIVERSARY.month && now.getDate() === ANNIVERSARY.day);
  const isTodayHer = (now.getMonth() === HER_BIRTHDAY.month && now.getDate() === HER_BIRTHDAY.day);
  const isTodayHim = (now.getMonth() === HIS_BIRTHDAY.month && now.getDate() === HIS_BIRTHDAY.day);

  if (isTodayAnn) {
    cardAnn.classList.add("is-today");
    titleAnniversary.innerHTML = `第 ${anniversaryCount} 周年<br>纪念日快乐`;
    cdAnniversary.parentElement.innerHTML = `<span style="font-size:1.5rem;letter-spacing:2px;color:var(--main);font-weight:bold;">❤️❤️</span>`;
  } else {
    cardAnn.classList.remove("is-today");
    titleAnniversary.textContent = anniversaryCount === 1 ? "距离 1 周年纪念" : `距离 ${anniversaryCount} 周年纪念`;
    cdAnniversary.parentElement.innerHTML = `<span id="cd-anniversary">${getDaysUntil(ANNIVERSARY.month, ANNIVERSARY.day)}</span> 天`;
  }

  if (isTodayHer) {
    cardHer.classList.add("is-today");
    titleHer.innerHTML = `Cindy<br>${herAge}岁生日快乐`;
    cdHer.parentElement.innerHTML = `<span style="font-size:1.5rem;letter-spacing:2px;color:var(--main);font-weight:bold;">🎉🎂</span>`;
  } else {
    cardHer.classList.remove("is-today");
    titleHer.textContent = `距离Cindy ${herAge}岁生日`;
    cdHer.parentElement.innerHTML = `<span id="cd-her">${getDaysUntil(HER_BIRTHDAY.month, HER_BIRTHDAY.day)}</span> 天`;
  }

  if (isTodayHim) {
    cardHim.classList.add("is-today");
    titleHim.innerHTML = `Kai Peng<br>${hisAge}岁生日快乐`;
    cdHim.parentElement.innerHTML = `<span style="font-size:1.5rem;letter-spacing:2px;color:var(--main);font-weight:bold;">🎉🎂</span>`;
  } else {
    cardHim.classList.remove("is-today");
    titleHim.textContent = `距离Kai Peng ${hisAge}岁生日`;
    cdHim.parentElement.innerHTML = `<span id="cd-him">${getDaysUntil(HIS_BIRTHDAY.month, HIS_BIRTHDAY.day)}</span> 天`;
  }
}

updateCountdowns(); 
setInterval(updateCountdowns, 1000 * 60 * 60); 


const loveWords = ["喜欢你！", "贴贴~", "今天也很想你", "薛之谦！", "❤️", "抱抱", "喵", "￣3￣"];
const normalMarker = document.getElementById("milestone-marker");
const clockMarker = document.getElementById("clock-m-marker");

function jumpAndSpeak(markerEl, event) {
  if (!markerEl) return;
  
  // 1. 跳跃
  markerEl.classList.remove("jump");
  void markerEl.offsetWidth;
  markerEl.classList.add("jump");

  // 2. 简单弹出一个原生提示（或者以后你可以自己写个好看的DOM气泡）
  const randomWord = loveWords[Math.floor(Math.random() * loveWords.length)];
  
  // 创建一个小气泡
  const bubble = document.createElement("div");
  bubble.textContent = randomWord;
  bubble.style.cssText = `
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--main);
    color: white;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    animation: bubblePop 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    z-index: 99;
  `;
  
  markerEl.appendChild(bubble);

  // 动画结束后移除气泡
  setTimeout(() => bubble.remove(), 1000);
}

// 顺便在 style.css 加个气泡向上的动画
/*
@keyframes fadeUp {
  0% { opacity: 0; transform: translate(-50%, 10px); }
  20% { opacity: 1; transform: translate(-50%, 0); }
  80% { opacity: 1; transform: translate(-50%, -10px); }
  100% { opacity: 0; transform: translate(-50%, -20px); }
}
*/

if (normalMarker) normalMarker.addEventListener("click", () => jumpAndSpeak(normalMarker));
if (clockMarker) clockMarker.addEventListener("click", () => jumpAndSpeak(clockMarker));

/* ========== 8. 照片墙自动生成 ========== */
const wallPhotos = [
  "images/photowall/photo12.jpg",
  "images/photowall/photo11.jpg",
  "images/photowall/photo10.jpg",
  "images/photowall/photo9.jpg",
  "images/photowall/photo8.jpg",
  "images/photowall/photo7.jpg",
  "images/photowall/photo6.jpg",
  "images/photowall/photo5.jpg",
  "images/photowall/photo4.jpg",
  "images/photowall/photo3.jpg",
  "images/photowall/photo2.jpg",
  "images/photowall/photo1.jpg"
];

const photoWall = document.getElementById("photo-wall");
if (photoWall) {
  wallPhotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "我们的照片";
    
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.classList.add("show");
    });

    photoWall.appendChild(img);
  });
}

/* ========== 9. 照片墙导航按钮 ========== */
const photoNavBtn = document.getElementById("photo-nav-btn");
const photoSection = document.querySelector(".photo-wall-section");
const photoTitle = document.querySelector(".photo-wall-title"); 

function checkPhotoSectionPosition() {
  if (!photoSection || !photoNavBtn) return;
  
  const rect = photoTitle.getBoundingClientRect();
  
  if (rect.top < window.innerHeight * 0.4) {
    photoNavBtn.textContent = "⬆️";
    photoNavBtn.title = "回到顶部";
  } else {
    photoNavBtn.textContent = "📸";
    photoNavBtn.title = "前往照片墙";
  }
}

window.addEventListener("scroll", checkPhotoSectionPosition);

if (photoNavBtn && photoSection) {
  photoNavBtn.addEventListener("click", () => {
    const rect = photoTitle.getBoundingClientRect();
    
    if (rect.top < window.innerHeight * 0.4) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: photoSection.offsetTop - 5, behavior: "smooth" });
    }
  });
  
  checkPhotoSectionPosition();
}

/* ========== 10. 时钟模式逻辑 ========== */
const clockBtn = document.getElementById("clock-btn");
const clockOverlay = document.getElementById("clock-overlay");
const closeClockMobile = document.getElementById("close-clock-mobile");
const toggleBtn = document.getElementById("clock-toggle-btn");
const ampmDisplay = document.getElementById("clock-ampm");
const dateDisplay = document.getElementById("clock-date");
const dateToggleBtn = document.getElementById("clock-date-toggle-btn");

let is12HourFormat = false;

if (localStorage.getItem("clockFormat") === "12") {
  is12HourFormat = true;
  if(toggleBtn) toggleBtn.textContent = "12小时制";
}

let dateFormatIndex = 0;
if (localStorage.getItem("clockDateFormat") === "1") dateFormatIndex = 1;
if (localStorage.getItem("clockDateFormat") === "2") dateFormatIndex = 2;
if (localStorage.getItem("clockDateFormat") === "3") dateFormatIndex = 3;

if (dateToggleBtn) {
  dateToggleBtn.textContent = "切换日期格式";
}

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
    <div class="flip-digit" id="clock-h1">0</div>
    <div class="flip-digit" id="clock-h2">0</div>
    <div class="flip-colon">:</div>
    <div class="flip-digit" id="clock-m1">0</div>
    <div class="flip-digit" id="clock-m2">0</div>
    <div class="flip-colon">:</div>
    <div class="flip-digit" id="clock-s1">0</div>
    <div class="flip-digit" id="clock-s2">0</div>
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
  
  if (dateFormatIndex === 0) {
    return `${yyyy}-${mm}-${dd}`;
  }
  if (dateFormatIndex === 1) {
    return `${dd}/${mm}/${yyyy}`;
  }
  if (dateFormatIndex === 2) {
    return `${mm}/${dd}/${yyyy}`;
  }
  
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthEn = monthsEn[now.getMonth()];
  return `${now.getDate()} ${monthEn} ${yyyy}`;
}

/* 安全地设置倒计时卡片内容：只改文本和子结构，避免退出再进入后元素引用失效 */
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
    // ★ 关键修改：按标题传入不同格式，利用 <br> 换行
    titleEl.innerHTML = normalTitle;
    
    const newHtml = `<span>${days}</span> 天`;
    if (cdValueContainerEl.innerHTML.indexOf("天") === -1 || cdValueContainerEl.querySelector("span")?.textContent !== String(days)) {
      cdValueContainerEl.innerHTML = newHtml;
    }
  }
}

function updateClock() {
  if (!clockOverlay.classList.contains("show")) return;
  
  const now = new Date();
  
  let hours = now.getHours();
  let ampm = "";
  
  if (is12HourFormat) {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    if(ampmDisplay) {
      ampmDisplay.textContent = ampm;
      ampmDisplay.style.opacity = "1";
    }
  } else {
    if(ampmDisplay) {
      ampmDisplay.textContent = "";
      ampmDisplay.style.opacity = "0";
    }
  }

  if (dateDisplay) {
    dateDisplay.textContent = formatDate(now);
  }
  
  const hh = String(hours).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  
  flipDigit("clock-h1", hh[0]);
  flipDigit("clock-h2", hh[1]);
  flipDigit("clock-m1", mm[0]);
  flipDigit("clock-m2", mm[1]);
  flipDigit("clock-s1", ss[0]);
  flipDigit("clock-s2", ss[1]);

  const days = getCurrentDays();
  const clockDaysEl = document.getElementById("clock-days");
  if (clockDaysEl) clockDaysEl.textContent = days.toLocaleString();

  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const currentYear = today.getFullYear();

  const isTodayAnn = (today.getMonth() === ANNIVERSARY.month && today.getDate() === ANNIVERSARY.day);
  const isTodayHer = (today.getMonth() === HER_BIRTHDAY.month && today.getDate() === HER_BIRTHDAY.day);
  const isTodayHim = (today.getMonth() === HIS_BIRTHDAY.month && today.getDate() === HIS_BIRTHDAY.day);

  const clockBoxAnn = document.querySelector(".left-col .box-cd"); 
  const clockBoxHer = document.querySelector(".right-col .box-cd"); 
  const clockBoxHim = document.querySelector(".right-col .box-cd:last-child"); 

  // 1. 纪念日卡片
  let nextAnnYear = currentYear;
  if (today > new Date(currentYear, ANNIVERSARY.month, ANNIVERSARY.day)) nextAnnYear = currentYear + 1;
  const anniversaryCount = nextAnnYear - START_YEAR;

  const clockTitleAnn = document.getElementById("clock-title-ann");
  const clockCdAnnContainer = clockTitleAnn ? clockTitleAnn.nextElementSibling : null;
  
  setCdCard(
    clockBoxAnn,
    clockTitleAnn,
    clockCdAnnContainer,
    isTodayAnn,
    `第 ${anniversaryCount} 周年<br>纪念日快乐`,
    anniversaryCount === 1 ? "距离 1 周年<br>纪念日" : `距离 ${anniversaryCount} 周年<br>纪念日`,
    getDaysUntil(ANNIVERSARY.month, ANNIVERSARY.day),
    "❤️❤️"
  );

  // 2. Cindy 卡片
  let nextHerYear = currentYear;
  if (today > new Date(currentYear, HER_BIRTHDAY.month, HER_BIRTHDAY.day)) nextHerYear = currentYear + 1;
  const herAge = nextHerYear - HER_BIRTH_YEAR;

  const clockTitleHer = document.getElementById("clock-title-her");
  const clockCdHerContainer = clockTitleHer ? clockTitleHer.nextElementSibling : null;
  
  setCdCard(
    clockBoxHer,
    clockTitleHer,
    clockCdHerContainer,
    isTodayHer,
    `Cindy<br>${herAge}岁生日快乐`,
    `距离Cindy<br>${herAge}岁生日`,
    getDaysUntil(HER_BIRTHDAY.month, HER_BIRTHDAY.day),
    "🎉🎂"
  );

  // 3. Kai Peng 卡片
  let nextHimYear = currentYear;
  if (today > new Date(currentYear, HIS_BIRTHDAY.month, HIS_BIRTHDAY.day)) nextHimYear = currentYear + 1;
  const hisAge = nextHimYear - HIS_BIRTH_YEAR;

  const clockTitleHim = document.getElementById("clock-title-him");
  const clockCdHimContainer = clockTitleHim ? clockTitleHim.nextElementSibling : null;
  
  setCdCard(
    clockBoxHim,
    clockTitleHim,
    clockCdHimContainer,
    isTodayHim,
    `Kai Peng<br>${hisAge}岁生日快乐`,
    `距离Kai Peng<br>${hisAge}岁生日`,
    getDaysUntil(HIS_BIRTHDAY.month, HIS_BIRTHDAY.day),
    "🎉🎂"
  );

  // ================= 更新底部进度条 =================
  const totalDays = 3650;
  const percent = Math.min((days / totalDays) * 100, 100);
  const fillEl = document.getElementById("clock-m-fill");
  const markerEl = document.getElementById("clock-m-marker");
  if (fillEl) fillEl.style.width = percent + "%";
  if (markerEl) markerEl.style.left = percent + "%";
  
  const barContainer = document.querySelector(".clock-m-bar");
  const labelsContainer = document.getElementById("clock-m-labels");
  
  if (barContainer && labelsContainer && labelsContainer.children.length === 0) {
    const NODE_COUNT_CLOCK = 11;
    for (let i = 0; i < NODE_COUNT_CLOCK; i++) {
      const day = Math.round((totalDays / (NODE_COUNT_CLOCK - 1)) * i);
      const p = (day / totalDays) * 100;
      
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
        node.classList.add("passed");
        if (allLabels[i]) allLabels[i].classList.add("passed");
      } else {
        node.classList.remove("passed");
        if (allLabels[i]) allLabels[i].classList.remove("passed");
      }
    });
  }
}

/* ================= 新的时钟定时器逻辑 ================= */
let clockTimeout = null;
let hideButtonsTimer = null; 

function clockTick() {
  if (!clockOverlay.classList.contains("show")) return;
  
  updateClock();

  const now = new Date();
  const delay = 1000 - now.getMilliseconds();

  clockTimeout = setTimeout(clockTick, delay);
}

function resetHideTimer() {
  if (!document.body.classList.contains("in-clock-mode")) return;

  document.body.classList.remove("hide-buttons");

  if (hideButtonsTimer) {
    clearTimeout(hideButtonsTimer);
  }

  hideButtonsTimer = setTimeout(() => {
    if (document.body.classList.contains("in-clock-mode")) {
      document.body.classList.add("hide-buttons");
    }
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

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    
    if (clockTimeout) {
      clearTimeout(clockTimeout);
      clockTimeout = null;
    }
    clockTick();
    resetHideTimer(); 
  } else {
    clockOverlay.classList.remove("show");
    document.body.classList.remove("in-clock-mode");
    document.body.classList.remove("hide-buttons"); 
    document.body.style.overflow = ""; 
    document.documentElement.style.overflow = ""; 
    
    clockBtn.innerHTML = "⏰";
    clockBtn.title = "进入时钟模式";

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    
    if (clockTimeout) {
      clearTimeout(clockTimeout);
      clockTimeout = null;
    }
    if (hideButtonsTimer) { 
      clearTimeout(hideButtonsTimer);
      hideButtonsTimer = null;
    }
  }
}

clockBtn.addEventListener("click", () => {
  const isShowing = clockOverlay.classList.contains("show");
  toggleClock(!isShowing);
});

if (closeClockMobile) {
  closeClockMobile.addEventListener("click", () => {
    toggleClock(false);
  });
}

clockOverlay.addEventListener("click", (e) => {
  if (e.target.closest('.theme-btn')) return;
  resetHideTimer();
});

clockBtn.addEventListener("mouseenter", () => {
  if (hideButtonsTimer) clearTimeout(hideButtonsTimer);
  document.body.classList.remove("hide-buttons");
});
clockBtn.addEventListener("mouseleave", () => {
  resetHideTimer();
});

themeBtn.addEventListener("mouseenter", () => {
  if (hideButtonsTimer) clearTimeout(hideButtonsTimer);
  document.body.classList.remove("hide-buttons");
});
themeBtn.addEventListener("mouseleave", () => {
  resetHideTimer();
});

/* ========== 11. 彩蛋信件交互 ========== */
function openLetter(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }
}

function closeLetter(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 400);
  }
}

/* ========== 右上角音乐播放逻辑（渐入渐出） ========== */
const bgm = document.getElementById("bgm");
const musicToggleBtn = document.getElementById("music-toggle-btn");

let fadeInterval = null;

// 渐入渐出的核心函数
function fadeAudio(targetVolume, callback) {
  clearInterval(fadeInterval);
  
  // 步进值：每次改变 0.05 的音量
  const step = 0.05;
  // 每 50 毫秒执行一次（0.05 * (1000/50) = 1，即 1 秒内从 0 到 1）
  const intervalTime = 50; 

  fadeInterval = setInterval(() => {
    let currentVolume = bgm.volume;
    let nextVolume = currentVolume;

    if (currentVolume < targetVolume) {
      nextVolume = Math.min(currentVolume + step, targetVolume);
    } else if (currentVolume > targetVolume) {
      nextVolume = Math.max(currentVolume - step, targetVolume);
    }

    bgm.volume = nextVolume;

    // 如果到达了目标音量，清除定时器
    if (nextVolume === targetVolume) {
      clearInterval(fadeInterval);
      if (callback) callback();
    }
  }, intervalTime);
}

if (musicToggleBtn && bgm) {
  // 初始音量设为 0
  bgm.volume = 0;

  musicToggleBtn.addEventListener("click", () => {
    if (bgm.paused) {
      // 播放并渐入
      bgm.play().then(() => {
        musicToggleBtn.textContent = "🎵";
        fadeAudio(1); // 目标音量为 1（最大）
      }).catch((err) => {
        console.log("播放失败:", err);
      });
    } else {
      // 渐出并在结束后暂停
      musicToggleBtn.textContent = "🔇";
      fadeAudio(0, () => {
        bgm.pause();
      });
    }
  });
}
