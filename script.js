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


/* ========== 2. 默认主题（永远浪漫） ========== */
const themeBtn = document.getElementById("theme-btn");
themeBtn.textContent = "🌸";

/* ========== 3. 掉落物 ========== */
const sakuraContainer = document.getElementById("sakura");
const PETAL_COUNT = 25;
const PETAL_INTERVAL = 1500;
const MAX_PETALS = 25;

const FUN_ICONS = ["🐺", "🦁", "🐯", "👑", "⚔️"];
const USE_IMAGE = false;

function createPetal(instant) {
  if (sakuraContainer.children.length >= MAX_PETALS) return;

  const isFun = document.body.classList.contains("theme-fun");

  const petal = document.createElement("div");
  petal.className = "petal";

  const size = Math.random() * 12 + 8;

  if (isFun) {
    petal.classList.add("img-petal");
    const pick = FUN_ICONS[Math.floor(Math.random() * FUN_ICONS.length)];

    if (USE_IMAGE) {
      petal.style.width = (size + 12) + "px";
      petal.style.height = (size + 12) + "px";
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

  const duration = Math.random() * 8 + 8; // 8~16 秒
  petal.style.animationDuration = duration + "s";

  if (instant) {
    petal.style.animationDelay = (-Math.random() * duration) + "s";
  } else {
    petal.style.animationDelay = Math.random() * 2 + "s";
  }

  petal.style.opacity = Math.random() * 0.5 + 0.4;

  // 动画结束删掉
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

// 用一个变量存定时器
let petalTimer = setInterval(() => createPetal(false), PETAL_INTERVAL);

// 监听页面可见性（切换标签页/切后台）
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
  let nowEvent = null; // 用来存“现在”那一项

  rawEvents.forEach(event => {
    const dateText = event.querySelector(".date").textContent.trim();
    // 如果是“现在”，单独拎出来，不参与年份分组
    if (dateText === "现在") {
      nowEvent = event;
      return;
    }
    
    // 否则提取前 4 位年份
    const year = dateText.substring(0, 4); 
    if (!yearsData[year]) yearsData[year] = [];
    yearsData[year].push(event);
  });

  // 清空原容器
  timelineContainer.innerHTML = "";

  // 遍历年份，生成折叠面板
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

    // ★ 初始化时，设置为展开状态的高度
    setTimeout(() => {
      content.style.maxHeight = content.scrollHeight + "px";
    }, 100);

    // ★ 点击事件（丝滑展开/收缩）
    header.addEventListener("click", () => {
      if (groupWrapper.classList.contains("collapsed")) {
        // 要展开
        groupWrapper.classList.remove("collapsed");
        content.style.maxHeight = content.scrollHeight + "px";
        
        // 动画结束后解除高度限制，防止图片加载后内容被截断
        setTimeout(() => {
          if (!groupWrapper.classList.contains("collapsed")) {
            content.style.maxHeight = "none";
          }
        }, 600);
        
      } else {
        // 要收缩
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

  // 把“现在”直接放到最后，不折叠
  if (nowEvent) {
    timelineContainer.appendChild(nowEvent);
  }
}

// 滚动淡入 + 淡出
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

/* ========== 6. 主题切换 ========== */
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("theme-fun");
  const isFun = document.body.classList.contains("theme-fun");
  themeBtn.textContent = isFun ? "👑" : "🌸";
  fillPetals();
});

/* ========== 7. 里程碑进度条 ========== */
const TOTAL_DAYS = 3650;   // 10 年
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
  const currentYear = now.getFullYear();

  const cdAnniversary = document.getElementById("cd-anniversary");
  const cdHer = document.getElementById("cd-her");
  const cdHim = document.getElementById("cd-him");
  
  const titleAnniversary = document.getElementById("title-anniversary");
  const titleHer = document.getElementById("title-her");
  const titleHim = document.getElementById("title-him");

  if (cdAnniversary) cdAnniversary.textContent = getDaysUntil(ANNIVERSARY.month, ANNIVERSARY.day);
  if (cdHer) cdHer.textContent = getDaysUntil(HER_BIRTHDAY.month, HER_BIRTHDAY.day);
  if (cdHim) cdHim.textContent = getDaysUntil(HIS_BIRTHDAY.month, HIS_BIRTHDAY.day);

  let nextAnnYear = currentYear;
  let annDateThisYear = new Date(currentYear, ANNIVERSARY.month, ANNIVERSARY.day);
  if (now > annDateThisYear) nextAnnYear = currentYear + 1;
  
  const anniversaryCount = nextAnnYear - START_YEAR;
  if (titleAnniversary) {
    titleAnniversary.textContent = anniversaryCount === 1 ? "距离 1 周年纪念" : `距离 ${anniversaryCount} 周年纪念`;
  }

  let nextHerYear = currentYear;
  let herDateThisYear = new Date(currentYear, HER_BIRTHDAY.month, HER_BIRTHDAY.day);
  if (now > herDateThisYear) nextHerYear = currentYear + 1;
  
  const herAge = nextHerYear - HER_BIRTH_YEAR;
  if (titleHer) {
    titleHer.textContent = `距离Cindy ${herAge}岁生日`;
  }

  let nextHimYear = currentYear;
  let himDateThisYear = new Date(currentYear, HIS_BIRTHDAY.month, HIS_BIRTHDAY.day);
  if (now > himDateThisYear) nextHimYear = currentYear + 1;
  
  const hisAge = nextHimYear - HIS_BIRTH_YEAR;
  if (titleHim) {
    titleHim.textContent = `距离Tang ${hisAge}岁生日`;
  }
}

updateCountdowns();
setInterval(updateCountdowns, 1000 * 60 * 60);  

/* ========== 8. 照片墙自动生成 ========== */
const wallPhotos = [
  "images/photo1.jpg",
  "images/photo2.jpg",
  "images/photo3.jpg",
  "images/photo4.jpg",
  "images/photo5.jpg",
  "images/photo6.jpg"
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
      window.scrollTo({ top: photoSection.offsetTop + 350, behavior: "smooth" });
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

let is12HourFormat = false;

if (localStorage.getItem("clockFormat") === "12") {
  is12HourFormat = true;
  if(toggleBtn) toggleBtn.textContent = "12小时制";
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    is12HourFormat = !is12HourFormat;
    toggleBtn.textContent = is12HourFormat ? "12小时制" : "24小时制";
    localStorage.setItem("clockFormat", is12HourFormat ? "12" : "24");
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
  document.getElementById("clock-days").textContent = days.toLocaleString();

  document.getElementById("clock-title-ann").textContent = document.getElementById("title-anniversary").textContent;
  document.getElementById("clock-cd-ann").textContent = document.getElementById("cd-anniversary").textContent;
  
  document.getElementById("clock-title-her").textContent = document.getElementById("title-her").textContent;
  document.getElementById("clock-cd-her").textContent = document.getElementById("cd-her").textContent;
  
  document.getElementById("clock-title-him").textContent = document.getElementById("title-him").textContent;
  document.getElementById("clock-cd-him").textContent = document.getElementById("cd-him").textContent;

  const totalDays = 3650;
  const percent = Math.min((days / totalDays) * 100, 100);
  document.getElementById("clock-m-fill").style.width = percent + "%";
  document.getElementById("clock-m-marker").style.left = percent + "%";
  
  const barContainer = document.querySelector(".clock-m-bar");
  const labelsContainer = document.getElementById("clock-m-labels");
  
  if (labelsContainer.children.length === 0) {
    const NODE_COUNT = 11;
    for (let i = 0; i < NODE_COUNT; i++) {
      const day = Math.round((totalDays / (NODE_COUNT - 1)) * i);
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

let clockTimer = null;
let hideButtonsTimer = null; 

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
    
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    
    updateClock();
    clockTimer = setInterval(updateClock, 1000);
    
    clockBtn.textContent = "❌";
    clockBtn.title = "退出时钟模式";

    resetHideTimer(); 
  } else {
    clockOverlay.classList.remove("show");
    document.body.classList.remove("in-clock-mode");
    document.body.classList.remove("hide-buttons"); 
    document.body.style.overflow = ""; 
    document.documentElement.style.overflow = ""; 
    
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    
    if (clockTimer) {
      clearInterval(clockTimer);
      clockTimer = null;
    }
    if (hideButtonsTimer) { 
      clearTimeout(hideButtonsTimer);
    }
    
    clockBtn.textContent = "⏰";
    clockBtn.title = "进入时钟模式";
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
