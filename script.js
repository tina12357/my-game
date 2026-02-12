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
      { text: "「效率至上」\n\n支持地方政府，認為數位化能節省行政人力，不適應者應學習數位工具以接軌國際。", score: 1 },
      { text: "「平等近用」\n\n反對強迫綁定，要求必須保留傳統驗證方式（如實體卡片、紙本），確保不願或無法使用手機的民眾權利。", score: 2 }
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
    text: "開發團隊表示現有技術已能達成「初步去識別化」，\n\n建議直接上線。但目前國內尚無針對數位皮夾的專屬法律（如歐盟 eIDAS）。",
    choices: [
      { text: "「技術萬能論」\n\n相信技術開發可以長成符合國際原則的樣子，法律等技術成熟後再補補丁，避免法律限制創新。", score: 1 },
      { text: "「法制先行」\n\n在全面推廣前，優先推動專法立法，明確界定個資最小化、嚴格限制發證單位取得使用者數位足跡。", score: 2 }
    ]
  },
  {
    text: "2026 年初，數位皮夾已進入超商取貨驗證階段，\n\n但台灣人權促進會（台權會）持續追討 2024 年至今的設計案與交付成果，輿論開始質疑政府隱瞞技術細節。",
    choices: [
      { text: "「技術優先」\n\n以開發尚未完全成熟、涉及資安敏感資訊為由，繼續延後公開交付成果，專注於優化 APP 功能。", score: 1 },
      { text: "「民主監督」\n\n響應 FOC 國際原則，主動公開階段性成果與技術架構，並舉辦公聽會接受公民團體監督。", score: 2 }
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

  if (totalScore <= 4) {
    matrixColor = "#00ff9c"; // 綠
    resultHTML = `
      <h2>【監控社會】🛠️</h2>
      <p>數位皮夾在缺乏法源與監督下迅速擴散，成為「隱形監控」的工具。\n\n雖然超商領貨很方便，但民眾發現不去註冊就無法進入公共圖書館或申請政府補助。由於數據二次利用缺乏界線，你的數位足跡被悄悄轉賣給第三方，導致網路實名制氾濫。這是一個便利卻喪失隱私與選擇權的監控社會。</p>
    `;
  } else if (totalScore <= 6) {
    matrixColor = "#ffd700"; // 黃
    resultHTML = `
      <h2>【缺乏法制基礎】⚖️</h2>
      <p>由於政策反覆且缺乏法制基礎，民眾對數位皮夾充滿不信任。\n\n推動過程不斷遭遇法律訴訟與抗爭，導致開發進度停擺，就像當年的 eID 數位身分證一樣。政府投入大量預算卻換來一場空，台灣在數位公共建設的轉型路上，因無法平衡人權與技術而原地踏步。</p>
    `;
  } else {
    matrixColor = "#ff4d4d"; // 紅
    resultHTML = `
      <h2>【韌性數位社會】🧠</h2>
      <p>你成功推動了比照歐盟標準的數位法制，確立了「數位皮夾專法」。\n\n雖然開發速度較慢，但因為落實了 FOC 原則，保障了民眾「選擇不使用」的權利，並透過法律畫清了發證單位與服務商的權限界線。數位皮夾成為安全、透明且受到公眾信任的基礎建設，台灣成為國際數位人權的標竿。</p>
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



