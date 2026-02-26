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

const letters = "01數位人權這樣好嗎OMGYEAHHHHHHHHH█▓▒░";
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
    text: "某地方政府為了衝高數位化政績，\n\n提議將圖書館借書、領取育兒津貼等公共服務「全數轉為」僅限數位皮夾驗證。",
    choices: [
      { text: "「效率至上」\n\n支持地方政府，認為數位化能節省行政人力，不適應者應學習數位工具以接軌國際。", effect: { efficiency: 1, rights: 0 }
      },
      { text: "「平等近用」\n\n反對強迫綁定，要求必須保留傳統驗證方式（如實體卡片、紙本），確保不願或無法使用手機的民眾權利。",  effect: { efficiency: 0, rights: 1 }
}
    ]
  },
  {
    text: "你更在意科技的哪一面？",
    choices: [
      { text: "效率與便利",  effect: { efficiency: 1, rights: 0 }
},
      { text: "權力與控制",  effect: { efficiency: 0, rights: 1 } }
    ]
  },
  {
    text: "開發團隊表示現有技術已能達成「初步去識別化」，建議直接上線。\n\n但目前國內尚無針對數位皮夾的專屬法律（如歐盟 eIDAS）。",
    choices: [
      { text: "「技術萬能論」\n\n相信技術開發可以長成符合國際原則的樣子，法律等技術成熟後再補補丁，避免法律限制創新。", effect: { efficiency: 1, rights: 0 } },
      { text: "「法制先行」\n\n在全面推廣前，優先推動專法立法，明確界定個資最小化、嚴格限制發證單位取得使用者數位足跡。", effect: { efficiency: 0, rights: 1 }
 }
    ]
  },
  {
    text: "\n\n2026年初，數位皮夾已進入超商取貨驗證階段，\n\n但台灣人權促進會（台權會）持續追討 2024 年至今的設計案與交付成果，輿論開始質疑政府隱瞞技術細節。",
    choices: [
      { text: "「技術優先」\n\n以開發尚未完全成熟、涉及資安敏感資訊為由，繼續延後公開交付成果，專注於優化 APP 功能。",  effect: { efficiency: 1, rights: 0 }},
      { text: "「民主監督」\n\n響應 FOC 國際原則，主動公開階段性成果與技術架構，並舉辦公聽會接受公民團體監督。", effect: { efficiency: 0, rights: 1 } }
    ]
  }
];

let currentQuestion = 0;
let efficiencyScore = 0;
let rightsScore = 0;

function showQuestion() {
  const q = questions[currentQuestion];
  typeText(questionEl, q.text);
  choicesEl.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.addEventListener("click", () => {
      efficiencyScore += choice.effect.efficiency;
rightsScore += choice.effect.rights;
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

  console.log("Efficiency:", efficiencyScore);
  console.log("Rights:", rightsScore);

  let title = "";
  let text = "";

  if (efficiencyScore >= 3 && rightsScore <= 1) {

    matrixColor = "#00ff9c";
    title = "【監控型科技國家】";
    text = "你高度重視效率，但較少考慮監督與權利保障。\n\n在缺乏法制與透明機制下，數位皮夾快速擴散，便利與監控只剩一線之隔。";

  } else if (efficiencyScore <= 1 && rightsScore >= 3) {

    matrixColor = "#4da6ff";
    title = "【人權優先社會】";
    text = "你將權利保障置於首位。\n\n雖然發展較慢，但透過制度與監督，科技成為公民信任的工具。";

  } else if (efficiencyScore >= 2 && rightsScore >= 2) {

    matrixColor = "#ffd700";
    title = "【平衡韌性模型】";
    text = "你試圖在效率與權利之間取得平衡。\n\n科技與制度同步前進，建立可被質疑、也可被信任的數位基礎建設。";

  } else {

    matrixColor = "#ff4d4d";
    title = "【停滯轉型】";
    text = "政策方向反覆，既未建立法制，也未達成效率優化。\n\n數位轉型陷入政治與行政拉扯。";
  }

  typeText(questionEl, ">> SYSTEM ANALYSIS COMPLETE");

  choicesEl.innerHTML = `
    <div class="result-card">
      <h2>${title}</h2>
      <p>${text}</p>
      <button id="rebootBtn">⟳ REBOOT SYSTEM</button>
    </div>
  `;
  .result-card {
  margin-top: 30px;
  padding: 28px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.15);
  color: #ffffff;
  line-height: 1.8;
}

.result-card h2 {
  margin-bottom: 16px;
  font-size: 22px;
}

.result-card p {
  font-size: 16px;
  white-space: pre-line;
}

  document
    .getElementById("rebootBtn")
    .addEventListener("click", rebootSystem);
}
// 🚀 啟動
showQuestion();

















