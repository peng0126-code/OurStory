<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <!-- ★ 密码保护（送之前把这几行删掉即可） -->
  <script>
    if (prompt("输入测试") !== "6544") {
      document.write("请刷新重试");
      window.stop(); 
    }
  </script>
  <!-- ★ 密码保护（送之前把这几行删掉即可） -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>我们的故事</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<!-- 掉落物容器 -->
<div id="sakura"></div>

<!-- 照片墙导航按钮 -->
<button id="photo-nav-btn" class="theme-btn photo-nav-btn" title="前往照片墙">📸</button>

<!-- 主题切换按钮 -->
<button id="theme-btn" class="theme-btn">🌸</button>

<!-- 时钟模式按钮 (最上层，永远显示) -->
<button id="clock-btn" class="theme-btn clock-btn" title="进入时钟模式">⏰</button>

<header>
  <h1>我们的故事</h1>
  <p>从遇见你开始，每一刻都值得记住</p>
</header>

<!-- 计数器 -->
<div class="counter">
  <div class="label">我们已经在一起</div>
  <div>
    <span class="number" id="days">0</span>
    <span class="unit">天</span>
  </div>
  <div class="detail">
    <span class="num" id="y">0</span> 年
    <span class="num" id="mo">0</span> 月
    <span class="num" id="d">0</span> 天
    <span class="num" id="h">0</span> 小时
    <span class="num" id="mi">0</span> 分
    <span class="num" id="s">0</span> 秒
  </div>
  <div class="since">从 2023 年 1 月 5 日 至今</div>
</div>

<!-- 里程碑进度条 -->
<div class="milestone">
  <div class="milestone-title">我们的 10 年</div>
  <div class="milestone-bar">
    <div class="milestone-line"></div>
    <div class="milestone-fill" id="milestone-fill"></div>
    <div class="milestone-marker" id="milestone-marker">
      <img src="images/walking.gif" alt="walking">
    </div>
  </div>
  <div class="milestone-labels" id="milestone-labels"></div>
</div>

<!-- 倒计时区域 -->
<div class="countdown-section">
  <div class="countdown-card">
    <div class="countdown-title" id="title-anniversary">距离周年纪念</div>
    <div class="countdown-value"><span id="cd-anniversary">--</span> 天</div>
    <div class="countdown-date">05 Jan</div>
  </div>
  <div class="countdown-card">
    <div class="countdown-title" id="title-her">距离Cindy生日</div>
    <div class="countdown-value"><span id="cd-her">--</span> 天</div>
    <div class="countdown-date">03 Jun</div>
  </div>
  <div class="countdown-card">
    <div class="countdown-title" id="title-him">距离Tang生日</div>
    <div class="countdown-value"><span id="cd-him">--</span> 天</div>
    <div class="countdown-date">26 Jan</div>
  </div>
</div>

<!-- 时间线 -->
<div class="timeline">
  <div class="event right">
    <div class="date">2022 年 12 月</div>
    <div class="card"><h3>Soul的相遇</h3><p>我们在Soul匹配到了，开始了我们的故事</p></div>
  </div>
  <div class="event left">
    <div class="date">2023 年 1 月 5 日</div>
    <div class="card"><h3>故事开始</h3><p>那一天，我们决定在一起了。从网友变成情侣的关系，现在看回去还是会觉得挺突然。</p></div>
  </div>
  <div class="event right">
    <div class="date">2023 年 1 月</div>
    <div class="card"><h3>第一次见面</h3><p>我驱车从新山到永平，第一次驾远路去见一个人。玩了一趟Batu Pahat后，送你到家前我们在车上聊了很久。</p></div>
  </div>
  <div class="event left">
    <div class="date">2023 年 2 月</div>
    <div class="card"><h3>数学补习</h3><p>我开始线上帮你补课数学，帮你准备应考SPM。</p></div>
  </div>
  <div class="event right">
    <div class="date">2023 年 4 月</div>
    <div class="card"><h3>你第一次来新山</h3><p>你第一次和朋友从永平打巴士下来玩，也是我第一次接触你的好朋友之一。</p></div>
  </div>
  <div class="event left">
    <div class="date">2023 年 6 月 3 日</div>
    <div class="card"><h3>Cindy的生日</h3><p>我去到永平和你的闺蜜们一起在韩式餐馆帮你庆祝生日。那也是我第一次接触你中学的闺蜜们</p><img src="images/cindybirthday2023.jpg"></div>
  </div>
  <div class="event right">
    <div class="date">2023 年 6 月</div>
    <div class="card"><h3>第一次小Trip</h3><p>我们和你的朋友一起驾老白去居銮玩，然后落宿在一家修车厂楼上的酒店。那时窗外一直传来噪音，你还帮驾车累了的我盖着耳朵入睡。</p></div>
  </div>
  <div class="event left">
    <div class="date">2023 年 10 月 29 日</div>
    <div class="card"><h3>去云顶咯</h3><p>我们一起去云顶玩，一起坐缆车，逛清水寺，晚上还买了自热火锅配茶仙子在房间里吃。冷冷的天配上这个真的是绝了！</p><img src="images/genting.jpg"></div>
  </div>
  <div class="event right">
    <div class="date">2023 年 12 月</div>
    <div class="card"><h3>日常</h3><p>每次去找你的隔天早上，其实都很想去你家对面的公园玩秋千。</p></div>
  </div>
  <div class="event left">
    <div class="date">2024 年 1 月 5 日</div>
    <div class="card"><h3>相恋一周年</h3><p>你特地去定制了很可爱的小蛋糕一起庆祝，上面还有我们的名字缩写。</p><img src="images/1stanniversary.jpg"></div>
  </div>
  <div class="event right">
    <div class="date">2024 年 2 月 16 日</div>
    <div class="card"><h3>我倒下了</h3><p>便血入院，医生检查后说是可能肿瘤。手术前一天你从永平独自一人搭巴士下来医院看我</p><img src="images/hospitalemergency.jpg"></div>
  </div>
  <div class="event left">
    <div class="date">2024 年 3 月</div>
    <div class="card"><h3>我出院了</h3><p>虽然你已经回永平工作了，但还是每天陪着我，帮我转移注意力。所幸检查报告出来不是肿瘤，但我这一生需要和克罗恩战斗了，谢谢你也没有因此而把我视作累赘。</p><img src="images/aftersurgical.jpg"></div>
  </div>
  <div class="event right">
    <div class="date">2024 年 3 月 25 日</div>
    <div class="card"><h3>你搬来和我一起</h3><p>你收拾行李离开了从小住到大的家，来到这里和我一起生活。</p></div>
  </div>
  <div class="event left">
    <div class="date">2024 年 4 月</div>
    <div class="card"><h3>康复后的普陀村</h3><p>我爸妈带我们去普陀村逛逛，那是在我康复后第一次去外面走走。</p><img src="images/putuovillage.jpg"></div>
  </div>
  <div class="event right">
    <div class="date">2024 年 5 月</div>
    <div class="card"><h3>你来到这里的第一份工作</h3><p>因为当时又没交通，你也不熟附近的路线。所以最后选择进入和我一样的公司。就这样从这天起，我们一起上下班。刚开始的几天，不懂电脑的你还因为倍感压力而落泪了，我一直相信你一定可以学会的。</p></div>
  </div>
  <div class="event left">
    <div class="date">2025 年 1 月 5 日</div>
    <div class="card"><h3>相恋二周年</h3><p>你亲手用扭扭棒做了一个蛋糕，打开里面还有我们一路来的合照。这份礼物真的看得出你很用心了，到现在我们还摆在桌上。</p><img src="images/2ndanniversary.jpg"></div>
  </div>
  <div class="event right">
    <div class="date">2025 年 1 月 26 日</div>
    <div class="card"><h3>Kai Peng生日</h3><p>因为病后不能吃太多奶油之类不消化的食物，所以你和我家人带了一个果冻蛋糕给我。对于我们家里生日就是买水果蛋糕这个传统持续了20多年的我来说，很新鲜哈哈哈。</p><img src="images/jellycake.jpg"></div>
  </div>
  <div class="event left">
    <div class="date">2025 年 2 月 15 日</div>
    <div class="card"><h3>我开始找你了！</h3><p>去到新加坡见薛之谦，我们都是第一次看演唱会。很幸运看的是薛之谦的《天外来物》，你也从此开启了谦友的身份，去认识了很多一样喜欢薛之谦的人，交了很多朋友。</p><img src="images/tianwailaiwu.jpg"></div>
  </div>
  <div class="event right">
    <div class="date">2025 年 7 月 17 日</div>
    <div class="card"><h3>大屏合照薛之谦</h3><p>这是老薛的生日，谦友出巨资的波底的mall里放大屏为他庆生，我们也去凑了一波热闹。</p><img src="images/jokerbirthday.jpg"></div>
  </div>
  <div class="event left">
    <div class="date">2025 年 12 月</div>
    <div class="card"><h3>去波底见大明星</h3><p>去见Dior大颖，但当天人流量真的太可怕了，要进去要出去都难。虽然其实我主要是去看BBK的Lucas和Jia Wen哈哈哈。</p></div>
  </div>
  <div class="event right">
    <div class="date">2026 年 2 月</div>
    <div class="card"><h3>辞职！！</h3><p>因为薪水和待遇问题，再加上你亲戚的推波助澜，你选择从这间公司离职，去到新加坡打工。看房时还是和我这家公司的同事Darren & Yu Wei 去看的，最后选择了一间性价比最高的，房东人看起来也很不错。虽然持续的时间不长，但你能独自进出新加坡，独自上下班，对我来说你就很厉害了。</p></div>
  </div>
  <div class="event left">
    <div class="date">2026 年 3 月</div>
    <div class="card"><h3>Cindy 入职</h3><p>你入职了一家音响公司做客服，薪水有质的飞跃，公司待遇也不错，看到你这样我也很为你开心。虽然傻逼顾客无处不在，但公司上下一致对外，至少不用搞办公室政治还是挺好的。</p></div>
  </div>
  <div class="event right">
    <div class="date">2026 年 4 月</div>
    <div class="card"><h3>体验泡澡</h3><p>为了庆祝你换了新工作，我定了OSOTO让我们两个一起放松一下。</p><img src="images/osoto.jpg"></div>
  </div>
  <div class="event left">
    <div class="date">2026 年 7 月 27 日</div>
    <div class="card"><h3>提新车啦！</h3><p>因为车不够用，我们决定出一辆便宜的新车作为代步工具，开始了我们的车奴身份。我对号码没有要求，所以听你的选择了老薛生日的数字 1707。</p><img src="images/1707.jpg"></div>
  </div>
  <div class="event right">
    <div class="date">2026 年 10 月</div>
    <div class="card"><h3>久违的猫咖</h3><p>Kai Le下来新山庆祝生日，我们私心安排了一个猫咪爱好者的天堂。真的太多喵了。</p><img src="images/catcafe.jpg"></div>
  </div>
</div>

<div class="ending">❤ 未完待续 ❤</div>

<!-- 照片墙 -->
<div class="photo-wall-section">
  <div class="photo-wall-title">我们的时光</div>
  <div class="photo-wall" id="photo-wall"></div>
</div>

<!-- ================= 时钟模式遮罩层 ================= -->
<div id="clock-overlay" class="clock-overlay">
  <!-- 竖屏手机提示 -->
  <div class="rotate-hint">
    <div class="rotate-icon">📱</div>
    <p>请将手机横屏以体验时钟模式</p>
    <button id="close-clock-mobile" class="btn">退出</button>
  </div>

  <!-- 横屏/电脑端布局 -->
  <div class="clock-container">
    <div class="clock-top">
      
      <!-- 左侧列：天数 + 周年 -->
      <div class="clock-column left-col">
        <div class="clock-box box-days">
          <div class="c-label">在一起</div>
          <div class="c-value"><span id="clock-days">0</span> <span class="c-unit">天</span></div>
        </div>
        <div class="clock-box box-cd">
          <div class="c-cd-title" id="clock-title-ann">距离周年</div>
          <div class="c-cd-value"><span id="clock-cd-ann">--</span> 天</div>
        </div>
      </div>
      
      <!-- 中间列：时钟 -->
      <div class="clock-column center-col">
        <div class="clock-box box-time">
          <!-- 顶部留白：显示 AM/PM -->
          <div class="clock-ampm" id="clock-ampm"></div>
          
          <!-- 中间核心时钟 -->
          <div class="flip-clock" id="flip-clock"></div>
          
          <!-- 底部留白：放切换按钮 -->
          <button class="clock-toggle-btn" id="clock-toggle-btn">24小时制</button>
        </div>
      </div>

      <!-- 右侧列：Cindy + Tang -->
      <div class="clock-column right-col">
        <div class="clock-box box-cd">
          <div class="c-cd-title" id="clock-title-her">距离Cindy</div>
          <div class="c-cd-value"><span id="clock-cd-her">--</span> 天</div>
        </div>
        <div class="clock-box box-cd">
          <div class="c-cd-title" id="clock-title-him">距离Tang</div>
          <div class="c-cd-value"><span id="clock-cd-him">--</span> 天</div>
        </div>
      </div>

    </div>

    <!-- 底部里程碑 -->
    <div class="clock-bottom">
      <div class="clock-milestone">
        <div class="clock-m-bar">
          <div class="clock-m-fill" id="clock-m-fill"></div>
          <div class="clock-m-marker" id="clock-m-marker">
            <img src="images/walking.gif" alt="walking">
          </div>
        </div>
        <div class="clock-m-labels" id="clock-m-labels"></div>
      </div>
    </div>
  </div>
</div>

<div id="lightbox" class="lightbox">
  <img id="lightbox-img" src="" alt="">
</div>

<script src="script.js"></script>
</body>
</html>
