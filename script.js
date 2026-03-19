document.addEventListener("DOMContentLoaded", () => {

/***********************
 * Matrix 背景
 ***********************/
const canvas = document.getElementById("matrix");

let ctx = null;
let columns = 0;
let drops = [];

const letters = "01數位人權這樣好嗎OMGYEAHHHHHHHHH█▓▒░";
const fontSize = 16;
let matrixColor = "#00ff9c";

if (canvas) {
  ctx = canvas.getContext("2d");

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
}


/***********************
 * 測驗本體
 ***********************/
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");

if (!questionEl || !choicesEl) {
  console.error("❌ 找不到 #question 或 #choices");
  return;
}

let typingTimer = null;

function typeText(el, text) {
  if (typingTimer) clearInterval(typingTimer);

  el.textContent = "";
  let i = 0;

  typingTimer = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
    } else {
      clearInterval(typingTimer);
    }
  }, 25);
}

const questions = [
  {
    text: "某地方政府推動數位皮夾全面取代傳統服務。",
    choices: [
      { text: "支持效率優先", effect: { efficiency: 1, rights: 0 }},
      { text: "要求保留傳統方式", effect: { efficiency: 0, rights: 1 }}
    ]
  },
  {
    text: "你更在意？",
    choices: [
      { text: "效率", effect: { efficiency: 1, rights: 0 }},
      { text: "權利", effect: { efficiency: 0, rights: 1 }}
    ]
  }
];

let currentQuestion = 0;
let efficiencyScore = 0;
let rightsScore = 0;


/***********************
 * 題目
 ***********************/
function showQuestion() {
  const q = questions[currentQuestion];
  typeText(questionEl, q.text);
  choicesEl.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;

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

  if (efficiencyScore > rightsScore) {
    matrixColor = "#00ff9c";
    title = "效率導向";
    text = "你重視效率。";
  } else {
    matrixColor = "#4da6ff";
    title = "權利導向";
    text = "你重視權利。";
  }

  typeText(questionEl, ">> COMPLETE");

  choicesEl.innerHTML = `
    <div style="background: rgba(0,0,0,0.85); padding:20px; border-radius:12px;">
      <h2>${title}</h2>
      <p>${text}</p>
      <button id="rebootBtn">重新開始</button>
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
      <h1>>> SYSTEM INIT</h1>
      <p>Press start</p>
    </div>
  `;

  choicesEl.innerHTML = `
    <div style="text-align:center;">
      <button id="startBtn">START</button>
    </div>
  `;

  document.getElementById("startBtn").onclick = showQuestion;
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
showStartScreen();

});
