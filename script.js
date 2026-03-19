/***********************
 * Matrix 背景
 ***********************/
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

let columns;
let drops;

const letters = "01數位人權這樣好嗎OMGYEAHHHHHHHHHCOOLLLL█▓▒░";
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
 * 打字機（保留但不影響流程）
 ***********************/
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
  }, 20);
}


/***********************
 * 題目（你的原版內容）
 ***********************/
const questions = [
  {
    text: "某地方政府為了衝高數位化政績，\n\n提議將圖書館借書、領取育兒津貼等公共服務「全數轉為」僅限數位皮夾驗證。",
    choices: [
      {
        text: "「效率至上」\n\n支持地方政府，認為數位化能節省行政人力，不適應者應學習數位工具以接軌國際。",
        effect: { efficiency: 1, rights: 0 }
      },
      {
        text: "「平等近用」\n\n反對強迫綁定，要求必須保留傳統驗證方式（如實體卡片、紙本），確保不願或無法使用手機的民眾權利。",
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
    text: "開發團隊表示現有技術已能達成「初步去識別化」，建議直接上線。\n\n但目前國內尚無針對數位皮夾的專屬法律（如歐盟 eIDAS）。",
    choices: [
      {
        text: "「技術萬能論」\n\n相信技術開發可以長成符合國際原則的樣子，法律等技術成熟後再補補丁，避免法律限制創新。",
        effect: { efficiency: 1, rights: 0 }
      },
      {
        text: "「法制先行」\n\n在全面推廣前，優先推動專法立法，明確界定個資最小化、嚴格限制發證單位取得使用者數位足跡。",
        effect: { efficiency: 0, rights: 1 }
      }
    ]
  },
  {
    text: "\n\n2026 年初，數位皮夾已進入超商取貨驗證階段，\n\n但台灣人權促進會（台權會）持續追討 2024 年至今的設計案與交付成果，輿論開始質疑政府隱瞞技術細節。",
    choices: [
      {
        text: "「技術優先」\n\n以開發尚未完全成熟、涉及資安敏感資訊為由，繼續延後公開交付成果，專注於優化 APP 功能。",
        effect: { efficiency: 1, rights: 0 }
      },
      {
        text: "「民主監督」\n\n響應 FOC 國際原則，主動公開階段性成果與技術架構，並舉辦公聽會接受公民團體監督。",
        effect: { efficiency: 0, rights: 1 }
      }
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
 * 顯示題目
 ***********************/
function showQuestion() {
  const q = questions[currentQuestion];

  typeText(questionEl, q.text);

  choicesEl.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";

    btn.innerText = choice.text; // ⭐ 保證換行

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
 * 結果（保留你原邏輯）
 ***********************/
function showResult() {

  let title = "";
  let text = "";

  if (efficiencyScore >= 3 && rightsScore <= 1) {
    matrixColor = "#00ff9c";
    title = "【監控社會】";
    text = "便利與監控只剩一線之隔。";

  } else if (efficiencyScore <= 1 && rightsScore >= 3) {
    matrixColor = "#4da6ff";
    title = "【人權優先社會】";
    text = "制度與監督成為核心。";

  } else if (efficiencyScore >= 2 && rightsScore >= 2) {
    matrixColor = "#ffd700";
    title = "【平衡韌性模型】";
    text = "科技與制度同步前進。";

  } else {
    matrixColor = "#ff4d4d";
    title = "【停滯轉型】";
    text = "政策與技術拉扯。";
  }

  typeText(questionEl, ">> SYSTEM ANALYSIS COMPLETE");

  choicesEl.innerHTML = `
    <div class="result-card">
      <h2>${title}</h2>
      <p>${text}</p>
      <button onclick="restartGame()" class="reboot-btn">再玩一次</button>
    </div>
  `;
}


/***********************
 * 開場（你的版本）
 ***********************/
function showStartScreen() {
  questionEl.innerHTML = `
    <div style="text-align:center;">
      <h1>數位人權測驗</h1>
      <p>你將面對一連串關於科技與權力的選擇</p>
    </div>
  `;

  choicesEl.innerHTML = `
    <button onclick="showQuestion()" class="reboot-btn">開始測驗</button>
  `;
}

function restartGame() {
  currentQuestion = 0;
  efficiencyScore = 0;
  rightsScore = 0;
  showStartScreen();
}


/***********************
 * 啟動（修正不卡）
 ***********************/
function bootSequence() {
  typeText(questionEl, "SYSTEM BOOTING...\nLoading scenario...\nInjecting user...");

  setTimeout(showStartScreen, 2000);
}

bootSequence();
