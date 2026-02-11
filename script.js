/***********************
 * Matrix 背景
 ***********************/
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const letters = "01數位人權這樣好嗎OMG█▓▒░";
const fontSize = 16;
let matrixColor = "#00ff9c";

let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

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
 * 測驗本體
 ***********************/
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");

function typeText(el, text) {
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, 30);
}

const questions = [
  {
    text: "你對 AI 改寫人類文字的看法是？",
    choices: [
      { text: "這是工具，人類還是主體", score: 1 },
      { text: "AI 正在取代人類創作", score: 2 }
    ]
  },
  {
    text: "你更在意科技的哪一面？",
    choices: [
      { text: "效率與便利", score: 1 },
      { text: "權力與控制", score: 2 }
    ]
  },
  {
    text: "如果演算法推薦內容，你會？",
    choices: [
      { text: "接受，省時間", score: 1 },
      { text: "懷疑，想自己選", score: 2 }
    ]
  }
];

let currentQuestion = 0;
let totalScore = 0;

function showQuestion() {
  const q = questions[currentQuestion];
  typeText(questionEl, q.text);
  choicesEl.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.addEventListener("click", () => {
      totalScore += choice.score;
      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion();
      } else {
        showResult();
      }
    });
    choicesEl.appendChild(btn);
  });
}

function rebootSystem() {
  currentQuestion = 0;
  totalScore = 0;
  matrixColor = "#00ff9c";
  showQuestion();
}

function showResult() {
  let resultHTML = "";

  if (totalScore <= 3) {
    matrixColor = "#00ff9c"; // 綠
    resultHTML = `
      <h2>【理性工具派】🛠️</h2>
      <p>你將 AI 視為輔助工具，<br>重點仍在人類責任與判斷。</p>
    `;
  } else if (totalScore <= 6) {
    matrixColor = "#ffd700"; // 黃
    resultHTML = `
      <h2>【務實調和派】⚖️</h2>
      <p>你同時看見效率與風險，<br>關鍵在制度與使用方式。</p>
    `;
  } else {
    matrixColor = "#ff4d4d"; // 紅
    resultHTML = `
      <h2>【批判反思派】🧠</h2>
      <p>你關注權力、演算法偏見與不平等，<br>在乎「誰設計、為誰服務」。</p>
    `;
  }

  typeText(questionEl, ">> SYSTEM ANALYSIS COMPLETE");

  choicesEl.innerHTML = `
    <div style="margin-top:20px;">
      ${resultHTML}
      <button id="rebootBtn">⟳ REBOOT SYSTEM</button>
    </div>
  `;

  document
    .getElementById("rebootBtn")
    .addEventListener("click", rebootSystem);
}

// 🚀 啟動
showQuestion();
