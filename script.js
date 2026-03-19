/***********************
 * Matrix 背景
 ***********************/
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

let columns;
let drops;

const letters = "01數位人權這樣好嗎OMGYEAHHHHHHHHH█▓▒░";
const fontSize = 16;
let matrixColor = "#00ff9c";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / fontSize);
  drops = Array(columns).fill(1);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawMatrix() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = matrixColor;
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 50);


/***********************
 * DOM
 ***********************/
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");

let typingTimer = null;

/***********************
 * 打字機（修正版：可 callback）
 ***********************/
function typeText(el, text, callback) {
  if (typingTimer) clearInterval(typingTimer);

  el.textContent = "";
  let i = 0;

  typingTimer = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
    } else {
      clearInterval(typingTimer);
      if (callback) callback(); // ⭐ 關鍵：打完後執行下一步
    }
  }, 25);
}


/***********************
 * 問題資料
 ***********************/
const questions = [
  {
    text: "某地方政府為了衝高數位化政績，\n\n提議將公共服務全面改為數位皮夾驗證。",
    choices: [
      { text: "支持效率優先", effect: { efficiency: 1, rights: 0 }},
      { text: "要求保留替代方案", effect: { efficiency: 0, rights: 1 }}
    ]
  },
  {
    text: "你更在意科技的哪一面？",
    choices: [
      { text: "效率與便利", effect: { efficiency: 1, rights: 0 }},
      { text: "權力與控制", effect: { efficiency: 0, rights: 1 }}
    ]
  },
  {
    text: "政府尚未制定專法，但系統已準備上線。",
    choices: [
      { text: "先上線再補法", effect: { efficiency: 1, rights: 0 }},
      { text: "先立法再推動", effect: { efficiency: 0, rights: 1 }}
    ]
  },
  {
    text: "民間要求公開技術細節。",
    choices: [
      { text: "延後公開", effect: { efficiency: 1, rights: 0 }},
      { text: "全面公開", effect: { efficiency: 0, rights: 1 }}
    ]
  }
];


/***********************
 * 狀態
 ***********************/
let currentQuestion = 0;
let efficiencyScore = 0;
let rightsScore = 0;


/***********************
 * 顯示問題
 ***********************/
function showQuestion() {
  const q = questions[currentQuestion];

  typeText(questionEl, q.text);

  choicesEl.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = choice.text;

    btn.onclick = () => {
      efficiencyScore += choice.effect.efficiency;
      rightsScore += choice.effect.rights;
      currentQuestion++;

      if (currentQuestion < questions.length) {
        showQuestion();
      } else {
        showResult();
      }
    };

    choicesEl.appendChild(btn);
  });
}


/***********************
 * 結果
 ***********************/
function showResult() {

  let title = "";
  let text = "";

  if (efficiencyScore >= 3 && rightsScore <= 1) {
    matrixColor = "#00ff9c";
    title = "【監控型科技國家】";
    text = "便利快速，但監控無所不在。";

  } else if (rightsScore >= 3) {
    matrixColor = "#4da6ff";
    title = "【人權優先社會】";
    text = "發展較慢，但制度透明且受信任。";

  } else {
    matrixColor = "#ffd700";
    title = "【平衡模型】";
    text = "效率與權利取得一定平衡。";
  }

  typeText(questionEl, ">> SYSTEM ANALYSIS COMPLETE");

  choicesEl.innerHTML = `
    <div class="result-card">
      <h2>${title}</h2>
      <p>${text}</p>
      <button id="rebootBtn" class="reboot-btn">⟳ RESTART</button>
    </div>
  `;

  document.getElementById("rebootBtn").onclick = rebootSystem;
}


/***********************
 * 開始畫面
 ***********************/
function showStartScreen() {
  questionEl.innerHTML = `
    <div style="text-align:center;">
      <h1>數位人權測驗</h1>
      <p style="opacity:0.7;">你準備好做出選擇了嗎？</p>
    </div>
  `;

  choicesEl.innerHTML = `
    <div style="text-align:center;">
      <button id="startBtn" class="reboot-btn">▶ START</button>
    </div>
  `;

  document.getElementById("startBtn").onclick = showQuestion;
}


/***********************
 * 開場動畫
 ***********************/
function bootSequence() {
  typeText(
    questionEl,
    "SYSTEM BOOTING...\nLoading scenario...\nInjecting user...",
    showStartScreen // ⭐ 打完直接跳開始畫面
  );
}


/***********************
 * 重啟
 ***********************/
function rebootSystem() {
  currentQuestion = 0;
  efficiencyScore = 0;
  rightsScore = 0;
  matrixColor = "#00ff9c";
  showStartScreen();
}


/***********************
 * 啟動
 ***********************/
bootSequence();
