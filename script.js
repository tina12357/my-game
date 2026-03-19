const canvas = document.getElementById("matrix");

if (!canvas) {
  console.error("Canvas not found");
}

const ctx = canvas ? canvas.getContext("2d") : null;

(() => {

document.addEventListener("DOMContentLoaded", () => {

  (() => {

  // ===== 你原本全部 code 그대로貼在這裡 =====

/***********************
 * Matrix（優化）
 ***********************/
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const letters = "01數位人權這樣好嗎OMGYEAHHHHHHHHH█▓▒░";
const fontSize = 16;

let columns = 0;
let drops = [];
let matrixColor = "#00ff9c";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  columns = Math.floor(canvas.width / fontSize);
  drops = Array.from({ length: columns }, () => Math.random() * canvas.height);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawMatrix() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = matrixColor;
  ctx.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, y);

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    } else {
      const speed = 0.5;
      drops[i] = y + fontSize * speed;
    }
  });

  requestAnimationFrame(drawMatrix);
}

drawMatrix();


/***********************
 * UI
 ***********************/
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");


/***********************
 * 打字效果（優化）
 ***********************/
let typingTimer;

function typeText(el, text) {
  clearInterval(typingTimer);
  el.textContent = "";

  let i = 0;

  typingTimer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(typingTimer);
  }, 20);
}


/***********************
 * 題目
 ***********************/

const questions = [
  {
    text: "某地方政府為了衝高數位化政績，\n\n提議將圖書館借書、領取育兒津貼等公共服務「全數轉為」僅限數位皮夾驗證。",
    choices: [
      {
        text: "「效率至上」\n\n支持地方政府，認為數位化能節省行政人力。",
        effect: { efficiency: 1, rights: 0 }
      },
      {
        text: "「平等近用」\n\n反對強迫綁定，要求保留傳統驗證方式。",
        effect: { efficiency: 0, rights: 1 }
      }
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
    text: "開發團隊表示技術已成熟，但尚無專法。",
    choices: [
      { text: "「技術萬能論」", effect: { efficiency: 1, rights: 0 }},
      { text: "「法制先行」", effect: { efficiency: 0, rights: 1 }}
    ]
  },
  {
    text: "民間團體要求公開技術架構。",
    choices: [
      { text: "延後公開", effect: { efficiency: 1, rights: 0 }},
      { text: "主動公開", effect: { efficiency: 0, rights: 1 }}
    ]
  }
];

let currentQuestion = 0;
let efficiencyScore = 0;
let rightsScore = 0;



/***********************
 * Render
 ***********************/
function renderQuestion() {
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

      currentQuestion < questions.length ? renderQuestion() : renderResult();
    };

    choicesEl.appendChild(btn);
  });
}


/***********************
 * Result
 ***********************/
function renderResult() {
  let resultText = "";

  if (efficiencyScore > rightsScore) {
    resultText = ">> EFFICIENCY-ORIENTED SYSTEM DETECTED";
  } else if (rightsScore > efficiencyScore) {
    resultText = ">> RIGHTS-ORIENTED SYSTEM DETECTED";
  } else {
    resultText = ">> BALANCED SYSTEM DETECTED";
  }

  typeText(questionEl, resultText);

  choicesEl.innerHTML = `
    <div class="result-card">
      <h2>分析結果</h2>
      <p>Efficiency: ${efficiencyScore}</p>
      <p>Rights: ${rightsScore}</p>
      <button class="reboot-btn" onclick="location.reload()">REBOOT</button>
    </div>
  `;
}

/***********************
 * Start
 ***********************/
renderQuestion();

});
})();
