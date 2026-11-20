// ==========================================================================
// ĐẤU TRƯỜNG TRI THỨC - GAME ENGINE & BATTLE CONTROLLER
// Complete State Machine, Combat Mechanics, Turn/Buzz Management
// ==========================================================================

class KnowledgeArenaEngine {
  constructor() {
    this.currentScreen = "screen-home";
    this.gameMode = "campaign"; // Khóa cố định chế độ Vượt Ải Diệt Quái 24 Hùng Ải
    this.aiDifficulty = "medium";
    this.isCameraEnabled = false;

    // Selected state
    this.team1Hero = null;
    this.team2Hero = null;
    this.selectedMap = null;
    this.activeHeroSlot = "team1";

    // Battle State
    this.team1State = { hp: 100, maxHp: 100, energy: 0, combo: 0, correctCount: 0, totalDmg: 0 };
    this.team2State = { hp: 100, maxHp: 100, energy: 0, combo: 0, correctCount: 0, totalDmg: 0 };
    this.activeQuestion = null;
    this.questionList = [];
    this.questionIndex = 0;
    this.turnTimer = 25;
    this.timerInterval = null;
    this.buzzedTeam = null; // null | 1 | 2
    this.isAnsweringAllowed = false;
    this.isQuestionResolved = false;
    this.currentTurn = 1; // For turn-based mode

    // Question Bank State: Mặc định là Toàn bộ 4,800+ câu Pháp luật đại cương HUST
    this.activePackId = "hust_all";
    this.customPacks = [];

    // Cơ chế Điều Phối Linh Hoạt & Chống Trùng Lặp Thông Minh (Tuyệt đối không trùng câu hỏi)
    this.sessionSeenKeys = new Set();
    this.seenQuestionIds = new Set();
    this.hustDataIntegrated = false;
    this.questionFlowMode = "balanced"; // "balanced" (Cân bằng 7 chương) | "unseen" (100% câu mới) | "random" (Ngẫu nhiên) | "trap" (Bẫy & Điểm A+)
    this.shuffleOptionsEnabled = true; // Xáo trộn ngẫu nhiên 4 đáp án A, B, C, D
    this.totalHustQuestionsCount = 4803;

    // --- CAMPAIGN (VƯỢT ẢI DIỆT QUÁI - 24 HÙNG ẢI) STATE ---
    this.isCampaignMode = true; // Mặc định và vĩnh viễn là Chiến dịch Vượt Ải Diệt Quái
    this.currentCampaignStage = 1;
    this.unlockedStageMax = 1;
    this.totalCampaignStages = 24;
    this.activeCampaignRealm = "all";
    this.campaignScore = 0;
    this.campaignMaxCombo = 0;

    // --- QUIZ RPG INVENTORY & COMBAT MECHANICS ---
    this.campaignItems = { potion: 2, banish: 1, shield: 1, freeze: 1 };
    this.activeShield = false;
    this.campaignRelics = [];
    this.monsterRage = 0;
    this.isMonsterEnraged = false;
    this.monsterIsStunned = false;

    // --- LEADERBOARD (BẢNG XẾP HẠNG ĐUA TOP) STATE ---
    this.leaderboardData = [];
    this.activeLeaderboardFilter = "all";

    this.init();
  }

  init() {
    // Load custom packs from localStorage if present
    this.loadSavedPacks();

    // Load persistent seen questions & flow preferences
    this.loadSeenQuestions();
    this.loadFlowSettings();

    // Default picks
    this.team1Hero = HEROES_DATA.find(h => h.id === "ngokhong") || HEROES_DATA[0];
    this.team2Hero = HEROES_DATA.find(h => h.id === "daisu") || HEROES_DATA[1];
    this.selectedMap = MAPS_DATA[0];

    // Merge HUST Law data from workspace if available
    this.integrateHustLawData();

    // Setup global keyboard hotkeys
    this.bindKeyboardShortcuts();

    // Load campaign progression and leaderboard data
    this.loadCampaignProgress();
    this.loadLeaderboard();
  }

  // --- DYNAMIC QUESTION ENGINE & ANTI-DUPLICATION HELPERS ---
  getQuestionKey(q) {
    if (!q) return "";
    const raw = String(q.question || "").trim().toLowerCase();
    return raw
      .replace(/^(câu\s*\d+\s*[:.]|bài\s*\d+\s*[:.]|\d+\s*[:.])/gi, "")
      .replace(/[“”"']/g, "")
      .replace(/[.,:;?!…_()\-–—\/\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 110);
  }

  loadSeenQuestions() {
    try {
      const saved = localStorage.getItem("DAU_TRUONG_SEEN_QUESTIONS");
      if (saved) {
        const arr = JSON.parse(saved);
        this.seenQuestionIds = new Set(arr);
      }
    } catch (e) {
      this.seenQuestionIds = new Set();
    }
  }

  saveSeenQuestions() {
    try {
      const arr = Array.from(this.seenQuestionIds);
      const trimmed = arr.length > 600 ? arr.slice(arr.length - 600) : arr;
      localStorage.setItem("DAU_TRUONG_SEEN_QUESTIONS", JSON.stringify(trimmed));
    } catch (e) {}
  }

  resetSeenQuestionsWithConfirm() {
    if (confirm("Bạn có chắc chắn muốn làm mới toàn bộ lịch sử câu hỏi đã xem để bắt đầu lại chu kỳ mới từ đầu không?")) {
      this.seenQuestionIds.clear();
      this.saveSeenQuestions();
      this.updateSeenProgressUI();
      if (window.gameAudio && typeof window.gameAudio.playShuffle === "function") {
        window.gameAudio.playShuffle();
      }
      alert("Đã làm mới kho câu hỏi thành công! Tất cả 4,800+ câu hỏi đã sẵn sàng cho chu kỳ mới.");
    }
  }

  loadFlowSettings() {
    try {
      const mode = localStorage.getItem("DAU_TRUONG_FLOW_MODE");
      if (mode) this.questionFlowMode = mode;
      const shuf = localStorage.getItem("DAU_TRUONG_SHUFFLE_OPTIONS");
      if (shuf !== null) this.shuffleOptionsEnabled = (shuf === "true");
    } catch (e) {}
  }

  setQuestionFlowMode(mode) {
    this.questionFlowMode = mode;
    try {
      localStorage.setItem("DAU_TRUONG_FLOW_MODE", mode);
    } catch (e) {}
    this.updateFlowButtonsUI();
    this.updateSeenProgressUI();
    if (window.gameAudio) window.gameAudio.playSelect();
  }

  toggleShuffleOptions(enabled) {
    this.shuffleOptionsEnabled = enabled;
    try {
      localStorage.setItem("DAU_TRUONG_SHUFFLE_OPTIONS", String(enabled));
    } catch (e) {}
    if (window.gameAudio) window.gameAudio.playSelect();
  }

  updateFlowButtonsUI() {
    const modes = ["balanced", "unseen", "random", "trap"];
    modes.forEach(m => {
      const btn = document.getElementById(`flow-btn-${m}`);
      if (btn) {
        if (this.questionFlowMode === m) {
          btn.className = "px-2.5 py-1 rounded-lg font-bold transition-all text-xs bg-amber-500 text-slate-950 shadow";
        } else {
          btn.className = "px-2.5 py-1 rounded-lg font-bold transition-all text-xs text-slate-400 hover:text-white";
        }
      }
    });

    const chk = document.getElementById("chk-shuffle-options");
    if (chk) chk.checked = this.shuffleOptionsEnabled;
  }

  updateSeenProgressUI() {
    const total = this.totalHustQuestionsCount || 4803;
    const count = this.seenQuestionIds.size;
    const pct = Math.min(100, Math.round((count / total) * 100));

    // Update in Questions Manager
    const mgrCount = document.getElementById("mgr-seen-count");
    if (mgrCount) mgrCount.textContent = count;
    const mgrPct = document.getElementById("mgr-seen-pct");
    if (mgrPct) mgrPct.textContent = `${pct}%`;

    // Update in Battle Question Card
    const battleSeenCount = document.getElementById("seen-count-text");
    if (battleSeenCount) battleSeenCount.textContent = count;

    // Update unseen badge text
    const unseenBadgeText = document.getElementById("arena-unseen-text");
    if (unseenBadgeText) {
      if (this.questionFlowMode === "balanced") {
        unseenBadgeText.textContent = "Cân Bằng 7 Chương";
      } else if (this.questionFlowMode === "unseen") {
        unseenBadgeText.textContent = "100% Câu Mới";
      } else if (this.questionFlowMode === "trap") {
        unseenBadgeText.textContent = "Bẫy & Điểm A+";
      } else {
        unseenBadgeText.textContent = "Ngẫu Nhiên";
      }
    }
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Load question packs from localStorage
  loadSavedPacks() {
    try {
      const saved = localStorage.getItem("DAU_TRUONG_CUSTOM_PACKS");
      if (saved) {
        this.customPacks = JSON.parse(saved);
      }
    } catch (e) {}
  }

  saveCustomPacks() {
    try {
      localStorage.setItem("DAU_TRUONG_CUSTOM_PACKS", JSON.stringify(this.customPacks));
    } catch (e) {}
  }

  // TÍCH HỢP TOÀN BỘ 650+ CÂU HỎI TỪ data_bank.js & data.js (CHỐNG TRÙNG LẶP & ĐẢM BẢO DỮ LIỆU LUÔN TƯƠI MỚI)
  ensureHustLawData() {
    if (this.masterQuestionPool && this.masterQuestionPool.length >= 600) {
      return;
    }

    const bank = (typeof window !== "undefined" && window.QUIZ_BANK && window.QUIZ_BANK.length > 0)
      ? window.QUIZ_BANK
      : (typeof QUIZ_BANK !== "undefined" && Array.isArray(QUIZ_BANK) && QUIZ_BANK.length > 0 ? QUIZ_BANK : null);

    const sets = (typeof window !== "undefined" && window.OFFICIAL_SETS_DATA)
      ? window.OFFICIAL_SETS_DATA
      : (typeof OFFICIAL_SETS_DATA !== "undefined" ? OFFICIAL_SETS_DATA : null);

    const coreQuiz = (typeof window !== "undefined" && window.QUIZ_DATA && window.QUIZ_DATA.length > 0)
      ? window.QUIZ_DATA
      : (typeof QUIZ_DATA !== "undefined" && Array.isArray(QUIZ_DATA) && QUIZ_DATA.length > 0 ? QUIZ_DATA : null);

    const fallbacks = (typeof window !== "undefined" && window.FALLBACK_HUST_QUESTIONS && window.FALLBACK_HUST_QUESTIONS.length > 0)
      ? window.FALLBACK_HUST_QUESTIONS
      : (typeof FALLBACK_HUST_QUESTIONS !== "undefined" && Array.isArray(FALLBACK_HUST_QUESTIONS) ? FALLBACK_HUST_QUESTIONS : []);

    const masterPool = [];
    const masterSeenKeys = new Set();

    const addQuestionSafely = (q, srcTag) => {
      if (!q || !q.question || !Array.isArray(q.options) || q.options.length < 2) return;
      const key = this.getQuestionKey(q);
      if (!key || key.length < 4 || masterSeenKeys.has(key)) return;
      masterSeenKeys.add(key);
      masterPool.push({
        ...q,
        _qKey: key,
        _sourceTag: srcTag
      });
    };

    // 1. Kho QUIZ_BANK
    if (bank && bank.length > 0) {
      bank.forEach(q => addQuestionSafely(q, "bank"));
    }

    // 2. Các Đề thi chuẩn HUST từ OFFICIAL_SETS_DATA
    if (sets) {
      for (const setKey in sets) {
        if (sets[setKey] && Array.isArray(sets[setKey].questions)) {
          sets[setKey].questions.forEach(q => addQuestionSafely(q, setKey));
        }
      }
    }

    // 3. Kho chuẩn 40 câu kết thúc học phần
    if (coreQuiz && coreQuiz.length > 0) {
      coreQuiz.forEach(q => addQuestionSafely(q, "core_quiz"));
    }

    // 4. Dự phòng cơ sở
    if (fallbacks && fallbacks.length > 0) {
      fallbacks.forEach(q => addQuestionSafely(q, "fallback"));
    }

    this.masterQuestionPool = masterPool;
    this.totalHustQuestionsCount = masterPool.length;

    // 1. Pack "hust_all" - Toàn bộ kho câu hỏi tổng
    const packAll = QUESTION_PACKS.find(p => p.id === "hust_all");
    if (packAll) {
      packAll.questions = [...masterPool];
    }

    // 2. Các Đề thi chuẩn HUST từ OFFICIAL_SETS_DATA
    const examMapping = {
      "hust_exam_1": "exam_set_1",
      "hust_exam_2": "exam_set_2",
      "hust_exam_3": "exam_set_3",
      "hust_exam_5": "exam_set_5",
      "hust_exam_trap": "exam_set_trap"
    };

    for (let packId in examMapping) {
      const p = QUESTION_PACKS.find(pk => pk.id === packId);
      const setKey = examMapping[packId];
      if (p) {
        if (sets && sets[setKey] && sets[setKey].questions && sets[setKey].questions.length > 0) {
          p.questions = [...sets[setKey].questions];
        } else if (p.questions.length === 0) {
          p.questions = masterPool.slice(0, 40);
        }
      }
    }

    // 3. Phân loại theo từng Chương từ kho tổng masterPool (Chương 2 -> 7)
    const chapterMapping = {
      "hust_ch2": "Chương 2",
      "hust_ch3": "Chương 3",
      "hust_ch4": "Chương 4",
      "hust_ch5": "Chương 5",
      "hust_ch6": "Chương 6",
      "hust_ch7": "Chương 7"
    };

    for (let packId in chapterMapping) {
      const p = QUESTION_PACKS.find(pk => pk.id === packId);
      const chPrefix = chapterMapping[packId];
      if (p) {
        const chQuestions = masterPool.filter(q => q && q.chapter && (q.chapter.includes(chPrefix) || q.chapter.toLowerCase().includes(chPrefix.toLowerCase())));
        p.questions = chQuestions.length > 0 ? chQuestions : masterPool.slice(0, 40);
      }
    }

    this.hustDataIntegrated = true;
  }

  integrateHustLawData() {
    this.ensureHustLawData();
  }

  // Screen Navigation
  showScreen(screenId) {
    document.querySelectorAll(".game-screen").forEach(el => el.classList.add("hidden"));

    // Tự động đóng tất cả các cửa sổ popup / overlay / modals khi chuyển màn hình
    const allModals = [
      "modal-relic-pick",
      "modal-stage-clear",
      "modal-game-over",
      "modal-save-score",
      "modal-rules"
    ];
    allModals.forEach(mId => {
      const el = document.getElementById(mId);
      if (el) el.classList.add("hidden");
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove("hidden");
      this.currentScreen = screenId;
    }

    if (window.gameAudio) {
      window.gameAudio.playSelect();
      if (screenId === "screen-battle") {
        window.gameAudio.startBGM();
      } else {
        window.gameAudio.stopBGM();
      }
    }

    // Refresh views on screen open
    if (screenId === "screen-hero-select") {
      this.renderHeroSelectionGrid();
      this.updateHeroCardsUI();
    } else if (screenId === "screen-map-select") {
      this.renderMapGrid();
    } else if (screenId === "screen-questions-manager") {
      this.renderQuestionsManager();
      this.updateFlowButtonsUI();
      this.updateSeenProgressUI();
    } else if (screenId === "screen-campaign-select") {
      this.renderCampaignStagesMap();
    } else if (screenId === "screen-leaderboard") {
      this.renderLeaderboard();
    }
  }

  // Điều hướng an toàn về Bản Đồ Ải (đóng sạch tất cả modal, dừng nhạc trận đấu, cập nhật tiến trình)
  returnToCampaignMap() {
    const allModals = [
      "modal-relic-pick",
      "modal-stage-clear",
      "modal-game-over",
      "modal-save-score",
      "modal-rules"
    ];
    allModals.forEach(mId => {
      const el = document.getElementById(mId);
      if (el) el.classList.add("hidden");
    });

    if (this.timerInterval) clearInterval(this.timerInterval);
    if (window.gameAudio) window.gameAudio.stopBGM();

    this.showScreen("screen-campaign-select");
    this.renderCampaignStagesMap();
  }

  // --- HERO SELECTION LOGIC (DŨNG SĨ ĐỒNG HÀNH) ---
  renderHeroSelectionGrid(filterRole = "all") {
    const grid = document.getElementById("hero-selection-grid");
    if (!grid) return;

    grid.innerHTML = "";
    const filtered = filterRole === "all" ? HEROES_DATA : HEROES_DATA.filter(h => h.role.includes(filterRole));

    filtered.forEach(hero => {
      const isSelected = this.team1Hero && this.team1Hero.id === hero.id;

      const card = document.createElement("div");
      card.className = `hero-grid-item relative p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center select-none group ${
        isSelected
          ? "border-amber-400 bg-amber-500/25 shadow-lg shadow-amber-500/25 scale-105 ring-2 ring-amber-400"
          : "border-slate-700/80 bg-slate-800/80 hover:border-slate-500 hover:bg-slate-700/70 hover:scale-102"
      }`;

      card.innerHTML = `
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-slate-600 mb-2 relative shadow-md">
          <img src="${hero.avatar}" alt="${hero.name}" class="w-full h-full object-cover rounded-full filter drop-shadow">
          ${isSelected ? `<span class="absolute -top-1 -left-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase shadow">ĐÃ CHỌN</span>` : ""}
        </div>
        <div class="font-black text-sm text-slate-100 tracking-tight leading-tight">${hero.name}</div>
        <div class="text-[11px] text-amber-400/90 font-medium">${hero.role}</div>
      `;

      card.onclick = () => {
        this.selectHero(hero);
      };

      grid.appendChild(card);
    });
  }

  selectHero(hero) {
    this.team1Hero = hero;
    if (window.gameAudio) window.gameAudio.playSelect();
    this.renderHeroSelectionGrid();
    this.updateHeroCardsUI();
  }

  updateHeroCardsUI() {
    // Cập nhật thẻ dũng sĩ của người chơi
    if (this.team1Hero) {
      const elName = document.getElementById("team1-hero-name");
      const elTitle = document.getElementById("team1-hero-title");
      const elRole = document.getElementById("team1-hero-role");
      const elAvatar = document.getElementById("team1-hero-avatar");
      const elPassive = document.getElementById("team1-hero-passive");
      const elUlt = document.getElementById("team1-hero-ultimate");

      if (elName) elName.textContent = this.team1Hero.name;
      if (elTitle) elTitle.textContent = this.team1Hero.title;
      if (elRole) elRole.textContent = this.team1Hero.role;
      if (elAvatar) elAvatar.src = this.team1Hero.avatar;
      if (elPassive) elPassive.textContent = this.team1Hero.passive;
      if (elUlt) elUlt.textContent = `${this.team1Hero.ultimateName}: ${this.team1Hero.ultimateDesc}`;
    }
  }

  // --- MAP SELECTION LOGIC ---
  renderMapGrid() {
    const grid = document.getElementById("map-selection-grid");
    if (!grid) return;
    grid.innerHTML = "";

    MAPS_DATA.forEach(map => {
      const isSelected = this.selectedMap && this.selectedMap.id === map.id;
      const card = document.createElement("div");
      card.className = `p-4 rounded-2xl border transition-all cursor-pointer select-none relative overflow-hidden group ${
        isSelected
          ? "border-amber-400 ring-2 ring-amber-400/80 shadow-xl shadow-amber-500/20 scale-102"
          : "border-slate-800 bg-slate-900/90 hover:border-slate-600 hover:scale-101"
      }`;

      card.style.background = map.gradient;

      card.innerHTML = `
        <div class="relative z-10 flex flex-col justify-between h-36">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black tracking-wider px-2.5 py-1 rounded-full bg-black/60 text-amber-300 border border-amber-400/30">
              ${map.badge}
            </span>
            ${isSelected ? `<i class="fa-solid fa-circle-check text-amber-400 text-lg"></i>` : ""}
          </div>
          <div>
            <h4 class="text-lg font-black text-white group-hover:text-amber-300 transition-colors">${map.name}</h4>
            <p class="text-xs text-slate-300 line-clamp-2 mt-1 opacity-90">${map.desc}</p>
          </div>
        </div>
      `;

      card.onclick = () => {
        this.selectedMap = map;
        if (window.gameAudio) window.gameAudio.playSelect();
        this.renderMapGrid();
      };

      grid.appendChild(card);
    });
  }

  // --- START VERSUS TRANSITION ---
  enterVersusTransition() {
    this.showScreen("screen-versus");

    // Populate VS elements
    document.getElementById("vs-team1-name").textContent = this.team1Hero.name;
    document.getElementById("vs-team1-title").textContent = this.team1Hero.title;
    document.getElementById("vs-team1-avatar").src = this.team1Hero.avatar;
    document.getElementById("vs-team1-quote").textContent = `"${this.team1Hero.quote}"`;

    document.getElementById("vs-team2-name").textContent = this.team2Hero.name;
    document.getElementById("vs-team2-title").textContent = this.team2Hero.title;
    document.getElementById("vs-team2-avatar").src = this.team2Hero.avatar;
    document.getElementById("vs-team2-quote").textContent = `"${this.team2Hero.quote}"`;

    const t1Badge = document.getElementById("vs-team1-badge");
    if (t1Badge) {
      t1Badge.textContent = this.isCampaignMode ? "DŨNG SĨ CHIẾN ĐẤU" : "ĐỘI 1";
    }
    const t2Badge = document.getElementById("vs-team2-badge");
    if (t2Badge) {
      t2Badge.textContent = this.isCampaignMode ? `MA THÚ ẢI ${this.currentCampaignStage}` : "ĐỘI 2";
    }

    if (window.gameAudio) {
      if (this.isCampaignMode && typeof window.gameAudio.playBossRoar === "function") {
        window.gameAudio.playBossRoar();
      } else {
        window.gameAudio.playBuzz();
        setTimeout(() => window.gameAudio.playCrit(), 300);
      }
    }
  }

  // --- START BATTLE ARENA ---
  startBattle() {
    this.ensureHustLawData();
    this.showScreen("screen-battle");

    // In standard PvP / AI mode, reset HP to hero defaults
    if (!this.isCampaignMode) {
      this.team1State = { hp: this.team1Hero.hp, maxHp: this.team1Hero.hp, energy: 0, combo: 0, correctCount: 0, totalDmg: 0 };
      this.team2State = { hp: this.team2Hero.hp, maxHp: this.team2Hero.hp, energy: 0, combo: 0, correctCount: 0, totalDmg: 0 };
    }

    this.questionIndex = 0;
    this.currentTurn = 1;

    // Apply arena map styling
    const arenaEl = document.getElementById("battle-stage-container");
    if (arenaEl && this.selectedMap) {
      arenaEl.style.background = this.selectedMap.gradient;
      document.getElementById("battle-map-badge").textContent = this.selectedMap.badge + " - " + this.selectedMap.name;
    }

    // Toggle Campaign RPG Bar vs 1v1 Buzzer Bar
    const buzzerBar = document.getElementById("buzzers-action-bar");
    const rpgBar = document.getElementById("campaign-rpg-bar");
    const intentContainer = document.getElementById("monster-intent-container");
    const relicsRibbon = document.getElementById("campaign-relics-ribbon");

    if (this.isCampaignMode) {
      if (buzzerBar) buzzerBar.classList.add("hidden");
      if (rpgBar) rpgBar.classList.remove("hidden");
      if (intentContainer) intentContainer.classList.remove("hidden");
      if (relicsRibbon) relicsRibbon.classList.remove("hidden");
      this.updateCampaignItemsUI();
      this.renderRelicsUI();
    } else {
      if (buzzerBar) buzzerBar.classList.remove("hidden");
      if (rpgBar) rpgBar.classList.add("hidden");
      if (intentContainer) intentContainer.classList.add("hidden");
      if (relicsRibbon) relicsRibbon.classList.add("hidden");
    }

    // Prepare questions list (shuffle & anti-repeat flow)
    this.prepareQuestions();

    // Setup Combatants Visuals
    this.setupCombatantsVisuals();

    // Update Initial HUD & Seen progress
    this.updateBattleHUD();
    this.updateSeenProgressUI();

    // Load first question
    this.nextQuestion();
  }

  // --- SMART & DYNAMIC QUESTION ENGINE (MULTI-TIER ZERO DUPLICATION) ---
  prepareQuestions() {
    this.ensureHustLawData();

    let pool = [];
    const builtIn = QUESTION_PACKS.find(p => p.id === this.activePackId);
    if (builtIn && builtIn.questions && builtIn.questions.length > 0) {
      pool = [...builtIn.questions];
    } else {
      const custom = this.customPacks.find(p => p.id === this.activePackId);
      if (custom && custom.questions && custom.questions.length > 0) {
        pool = [...custom.questions];
      } else {
        const fallbackPack = QUESTION_PACKS.find(p => p.id === "hust_all") || QUESTION_PACKS[0];
        pool = (fallbackPack && fallbackPack.questions && fallbackPack.questions.length > 0)
          ? [...fallbackPack.questions]
          : [];
      }
    }

    if (pool.length === 0) {
      pool = (typeof window !== "undefined" && window.FALLBACK_HUST_QUESTIONS && window.FALLBACK_HUST_QUESTIONS.length > 0)
        ? [...window.FALLBACK_HUST_QUESTIONS]
        : ((typeof FALLBACK_HUST_QUESTIONS !== "undefined" && Array.isArray(FALLBACK_HUST_QUESTIONS)) ? [...FALLBACK_HUST_QUESTIONS] : []);
    }

    // TẦNG 1: Loại bỏ 100% câu đã xuất hiện trong PHIÊN CHƠI HIỆN TẠI (sessionSeenKeys)
    let sessionUnseen = pool.filter(q => !this.sessionSeenKeys.has(this.getQuestionKey(q)));

    // TẦNG 1.5: TIẾP VIỆN XUYÊN CHƯƠNG KHI GÓI CÒN ÍT CÂU CHƯA GẶP
    // Tuyệt đối không xóa sessionSeenKeys; bổ sung câu hỏi mới tinh từ kho masterQuestionPool!
    if (sessionUnseen.length < 15 && this.masterQuestionPool && this.masterQuestionPool.length > 0) {
      const globalUnseen = this.masterQuestionPool.filter(q => !this.sessionSeenKeys.has(this.getQuestionKey(q)));
      this.shuffleArray(globalUnseen);
      const needed = 25 - sessionUnseen.length;
      const supplement = globalUnseen.slice(0, needed);
      sessionUnseen = [...sessionUnseen, ...supplement];
    }

    // Chỉ khi người chơi đã trả lời gần như toàn bộ kho đề (>= 85% master pool), mới reset chu kỳ mới!
    if (sessionUnseen.length === 0) {
      if (this.sessionSeenKeys.size >= (this.masterQuestionPool.length * 0.85)) {
        this.sessionSeenKeys.clear();
        sessionUnseen = [...pool];
      } else {
        const globalUnseen = this.masterQuestionPool.filter(q => !this.sessionSeenKeys.has(this.getQuestionKey(q)));
        sessionUnseen = globalUnseen.length > 0 ? globalUnseen : [...pool];
      }
    }

    // TẦNG 2: Ưu tiên lọc tiếp các câu chưa từng làm qua các phiên trước (seenQuestionIds trong localStorage)
    const crossSessionUnseen = sessionUnseen.filter(q => !this.seenQuestionIds.has(this.getQuestionKey(q)));

    let candidatePool = [];
    if (crossSessionUnseen.length >= 15) {
      candidatePool = crossSessionUnseen;
    } else if (sessionUnseen.length > 0) {
      const pastSeen = sessionUnseen.filter(q => this.seenQuestionIds.has(this.getQuestionKey(q)));
      this.shuffleArray(pastSeen);
      candidatePool = [...crossSessionUnseen, ...pastSeen];
    } else {
      candidatePool = [...pool];
    }

    // TẦNG 3: Áp dụng luồng sắp xếp câu hỏi linh hoạt (Flow Mode)
    let finalOrder = [];

    if (this.questionFlowMode === "balanced" && candidatePool.length >= 12) {
      // Chế độ Cân Bằng 7 Chương (Balanced Multi-Chapter Interleaving)
      const chapterBuckets = {
        "Chương 2": [],
        "Chương 3": [],
        "Chương 4": [],
        "Chương 5": [],
        "Chương 6": [],
        "Chương 7": [],
        "other": []
      };

      candidatePool.forEach(q => {
        let matched = false;
        if (q && q.chapter) {
          for (const ch in chapterBuckets) {
            if (ch !== "other" && q.chapter.startsWith(ch)) {
              chapterBuckets[ch].push(q);
              matched = true;
              break;
            }
          }
        }
        if (!matched) chapterBuckets["other"].push(q);
      });

      for (const ch in chapterBuckets) {
        this.shuffleArray(chapterBuckets[ch]);
      }

      const chapterCycle = ["Chương 2", "Chương 4", "Chương 3", "Chương 6", "Chương 5", "Chương 7"];
      let hasMore = true;
      while (hasMore) {
        hasMore = false;
        for (const ch of chapterCycle) {
          if (chapterBuckets[ch].length > 0) {
            finalOrder.push(chapterBuckets[ch].pop());
            hasMore = true;
          }
        }
        if (chapterBuckets["other"].length > 0) {
          finalOrder.push(chapterBuckets["other"].pop());
          hasMore = true;
        }
      }
    } else if (this.questionFlowMode === "trap") {
      const trapKeywords = ["say rượu", "năng lực hành vi", "chế tài", "án lệ", "hình sự", "dân sự", "độ tuổi", "bắt buộc", "vi phạm", "xử phạt"];
      const traps = [];
      const normals = [];

      candidatePool.forEach(q => {
        const text = ((q.question || "") + " " + (q.explanation || "")).toLowerCase();
        if (trapKeywords.some(kw => text.includes(kw))) {
          traps.push(q);
        } else {
          normals.push(q);
        }
      });

      this.shuffleArray(traps);
      this.shuffleArray(normals);

      while (traps.length > 0 || normals.length > 0) {
        if (traps.length > 0) finalOrder.push(traps.pop());
        if (traps.length > 0) finalOrder.push(traps.pop());
        if (normals.length > 0) finalOrder.push(normals.pop());
      }
    } else {
      finalOrder = [...candidatePool];
      this.shuffleArray(finalOrder);
    }

    // TẦNG 4: KHỬ TRÙNG LẶP TUYỆT ĐỐI TRONG DANH SÁCH BẬC CUỐI (Deduplication Guarantee)
    const deduplicated = [];
    const usedInBatch = new Set();
    for (const q of finalOrder) {
      const key = this.getQuestionKey(q);
      if (!usedInBatch.has(key)) {
        usedInBatch.add(key);
        deduplicated.push(q);
      }
    }

    this.questionList = deduplicated;
    this.questionIndex = 0;
    this.updateSeenProgressUI();
  }

  // Chuẩn bị câu hỏi kèm xáo trộn 4 đáp án A, B, C, D ngẫu nhiên an toàn
  prepareQuestionWithShuffledOptions(rawQ) {
    if (!this.shuffleOptionsEnabled || !rawQ || !rawQ.options || rawQ.options.length < 2) {
      return { ...rawQ };
    }

    // Kiểm tra an toàn: Nếu đáp án có nhắc trực tiếp tới chữ cái A, B, C hoặc "đáp án trên/dưới"
    const hasLetterRef = rawQ.options.some(opt =>
      /\b(cả\s+[A-D]|A\s*và\s*[B-D]|B\s*và\s*[C-D]|A,\s*B|đáp án\s+[A-D]|đáp án trên|đáp án dưới|tất cả các đáp án trên|tất cả đều)/i.test(opt)
    );

    if (hasLetterRef) {
      return { ...rawQ };
    }

    // Đánh dấu đáp án đúng ban đầu
    const items = rawQ.options.map((text, idx) => ({
      text: text,
      isCorrect: idx === rawQ.answer
    }));

    // Xáo trộn ngẫu nhiên 4 đáp án
    this.shuffleArray(items);

    const newOptions = items.map(it => it.text);
    const newAnswer = items.findIndex(it => it.isCorrect);

    return {
      ...rawQ,
      options: newOptions,
      answer: newAnswer >= 0 ? newAnswer : 0,
      isOptionsShuffled: true
    };
  }

  // Đổi câu hỏi linh hoạt ngay trong trận đấu (Phím R)
  rerollQuestion() {
    if (this.currentScreen !== "screen-battle" || this.isQuestionResolved) return;

    if (window.gameAudio && typeof window.gameAudio.playShuffle === "function") {
      window.gameAudio.playShuffle();
    } else if (window.gameAudio) {
      window.gameAudio.playSelect();
    }

    if (this.activeQuestion) {
      const qKey = this.getQuestionKey(this.activeQuestion);
      this.sessionSeenKeys.add(qKey);
      this.seenQuestionIds.add(qKey);
      this.saveSeenQuestions();
    }

    // Hiển thị thông báo đổi câu
    const banner = document.getElementById("combat-feedback-banner");
    if (banner) {
      banner.classList.remove("hidden");
      banner.className = "py-1.5 px-4 rounded-xl bg-indigo-950/90 text-indigo-200 border border-indigo-500 font-bold text-center text-xs animate-fadeIn";
      banner.innerHTML = `<i class="fa-solid fa-shuffle mr-1"></i> ĐÃ ĐỔI SANG CÂU HỎI MỚI TỪ KHO ĐỀ TRI THỨC!`;
      setTimeout(() => {
        if (!this.isQuestionResolved) banner.classList.add("hidden");
      }, 2000);
    }

    // Bốc câu tiếp theo
    this.nextQuestion();
  }

  setupCombatantsVisuals() {
    // Team 1 Sprite & HUD
    if (document.getElementById("t1-fighter-img")) document.getElementById("t1-fighter-img").src = this.team1Hero.avatar;
    if (document.getElementById("t1-fighter-name")) document.getElementById("t1-fighter-name").textContent = this.team1Hero.name;
    if (document.getElementById("t1-battle-sprite")) document.getElementById("t1-battle-sprite").src = this.team1Hero.avatar;

    // Team 2 Sprite & HUD
    if (document.getElementById("t2-fighter-img")) document.getElementById("t2-fighter-img").src = this.team2Hero.avatar;
    if (document.getElementById("t2-fighter-name")) document.getElementById("t2-fighter-name").textContent = this.team2Hero.name;
    if (document.getElementById("t2-battle-sprite")) document.getElementById("t2-battle-sprite").src = this.team2Hero.avatar;
  }

  updateBattleHUD() {
    // Team 1 HP
    const t1Pct = Math.max(0, Math.min(100, (this.team1State.hp / this.team1State.maxHp) * 100));
    document.getElementById("t1-hp-fill").style.width = `${t1Pct}%`;
    document.getElementById("t1-hp-text").textContent = `${this.team1State.hp}/${this.team1State.maxHp} HP`;
    document.getElementById("t1-energy-fill").style.width = `${this.team1State.energy}%`;
    document.getElementById("t1-energy-text").textContent = `${this.team1State.energy}%`;

    const t1UltBadge = document.getElementById("t1-ult-badge");
    if (this.team1State.energy >= 100) {
      t1UltBadge.classList.remove("hidden");
    } else {
      t1UltBadge.classList.add("hidden");
    }

    // Team 2 HP
    const t2Pct = Math.max(0, Math.min(100, (this.team2State.hp / this.team2State.maxHp) * 100));
    document.getElementById("t2-hp-fill").style.width = `${t2Pct}%`;
    document.getElementById("t2-hp-text").textContent = `${this.team2State.hp}/${this.team2State.maxHp} HP`;
    document.getElementById("t2-energy-fill").style.width = `${this.team2State.energy}%`;
    document.getElementById("t2-energy-text").textContent = `${this.team2State.energy}%`;

    const t2UltBadge = document.getElementById("t2-ult-badge");
    if (this.team2State.energy >= 100) {
      t2UltBadge.classList.remove("hidden");
    } else {
      t2UltBadge.classList.add("hidden");
    }

    // Combo Badges
    const t1ComboEl = document.getElementById("t1-combo-badge");
    if (this.team1State.combo >= 2) {
      t1ComboEl.classList.remove("hidden");
      t1ComboEl.textContent = `🔥 COMBO x${this.team1State.combo}`;
    } else {
      t1ComboEl.classList.add("hidden");
    }

    // Low HP Near-Death State Check (Sự Hưng Phấn & Nghịch Cảnh)
    const vignetteEl = document.getElementById("low-hp-vignette");
    const clutchBadge = document.getElementById("t1-clutch-badge");
    const isLowHp = this.team1State.hp > 0 && t1Pct <= 25;
    if (vignetteEl) {
      if (isLowHp) {
        vignetteEl.classList.remove("opacity-0");
        vignetteEl.classList.add("opacity-100", "animate-pulse-vignette");
      } else {
        vignetteEl.classList.remove("opacity-100", "animate-pulse-vignette");
        vignetteEl.classList.add("opacity-0");
      }
    }
    if (clutchBadge) {
      if (isLowHp) {
        clutchBadge.classList.remove("hidden");
      } else {
        clutchBadge.classList.add("hidden");
      }
    }

    const t2ComboEl = document.getElementById("t2-combo-badge");
    if (this.team2State.combo >= 2) {
      t2ComboEl.classList.remove("hidden");
      t2ComboEl.textContent = `🔥 COMBO x${this.team2State.combo}`;
    } else {
      t2ComboEl.classList.add("hidden");
    }
  }

  // --- NEXT QUESTION CYCLE (ABSOLUTE FRESHNESS GUARANTEE) ---
  nextQuestion() {
    this.ensureHustLawData();

    if (this.questionIndex >= this.questionList.length) {
      this.prepareQuestions();
      this.questionIndex = 0;
    }

    if (this.questionList.length === 0) {
      this.prepareQuestions();
    }

    const rawQuestion = this.questionList[this.questionIndex];
    this.questionIndex++;
    this.isQuestionResolved = false;
    this.buzzedTeam = null;

    // Ghi nhận câu hỏi vào cả bộ nhớ phiên (session) và bộ nhớ thiết bị (localStorage)
    if (rawQuestion) {
      const qKey = this.getQuestionKey(rawQuestion);
      this.sessionSeenKeys.add(qKey);
      this.seenQuestionIds.add(qKey);
      this.saveSeenQuestions();
      this.updateSeenProgressUI();
    }

    // Chuẩn bị câu hỏi kèm hoán đổi 4 đáp án A/B/C/D ngẫu nhiên (nếu bật)
    this.activeQuestion = this.prepareQuestionWithShuffledOptions(rawQuestion);

    // Update Monster Intent & Rage in Campaign Mode
    if (this.isCampaignMode) {
      if (this.monsterIsStunned) {
        this.monsterRage = 0;
        this.isMonsterEnraged = false;
        this.monsterIsStunned = false;
      } else {
        const rageIncrement = this.currentCampaignStage >= 6 ? 35 : 25;
        this.monsterRage = Math.min(100, this.monsterRage + rageIncrement);
        if (this.monsterRage >= 100) {
          this.isMonsterEnraged = true;
        }
      }
      this.updateMonsterIntentUI();

      // Update Relics ribbon status
      const stBadge = document.getElementById("battle-campaign-stage-badge");
      const scBadge = document.getElementById("battle-campaign-score-badge");
      if (stBadge) stBadge.textContent = `${this.currentCampaignStage}/${this.totalCampaignStages || 24}`;
      if (scBadge) scBadge.textContent = `${this.campaignScore.toLocaleString()} PTS`;
    }

    // Reset UI banners
    document.getElementById("question-explanation-box").classList.add("hidden");
    document.getElementById("buzz-notification-banner").classList.add("hidden");
    document.getElementById("combat-feedback-banner").classList.add("hidden");

    // Render Question & 4 Options
    document.getElementById("arena-question-text").textContent = this.activeQuestion.question;
    document.getElementById("arena-round-number").textContent = `Câu hỏi #${this.questionIndex}`;
    
    // Display Chapter badge if present
    const chapterBadge = document.getElementById("arena-question-chapter");
    if (chapterBadge) {
      chapterBadge.textContent = this.activeQuestion.chapter || "Pháp Luật Đại Cương HUST";
    }

    const optionLetters = ["A", "B", "C", "D"];
    const optionColors = [
      "border-rose-500/60 hover:bg-rose-500/20 text-rose-200",
      "border-sky-500/60 hover:bg-sky-500/20 text-sky-200",
      "border-amber-500/60 hover:bg-amber-500/20 text-amber-200",
      "border-emerald-500/60 hover:bg-emerald-500/20 text-emerald-200"
    ];

    const optionsContainer = document.getElementById("arena-options-grid");
    optionsContainer.innerHTML = "";

    this.activeQuestion.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.className = `option-btn w-full p-3.5 rounded-xl border bg-slate-900/80 transition-all font-semibold text-left flex items-start gap-3 group select-none ${optionColors[idx]}`;
      btn.dataset.index = idx;
      btn.innerHTML = `
        <span class="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center font-black text-sm shrink-0 border border-white/20 group-hover:scale-110 transition-transform">
          ${optionLetters[idx]}
        </span>
        <span class="text-sm sm:text-base leading-snug">${optText}</span>
      `;

      btn.onclick = () => {
        this.handleAnswerSelection(idx);
      };

      optionsContainer.appendChild(btn);
    });

    // Handle Modes (Chiến Dịch Vượt Ải vs Giành Quyền vs Luân Phiên vs AI)
    if (this.isCampaignMode) {
      this.buzzedTeam = 1;
      this.isAnsweringAllowed = true;
      const banner = document.getElementById("buzz-notification-banner");
      if (banner) {
        banner.classList.remove("hidden");
        const stageConfig = this.activeStageConfig || {};
        const threatDesc = stageConfig.threatDesc || `Phạt sai: -${this.team2Hero.atk} HP`;
        const threatLevel = stageConfig.threatLevel || 'DỄ';
        const threatColor = stageConfig.threatColor || 'text-amber-400';
        banner.className = "py-2 px-4 rounded-xl bg-gradient-to-r from-rose-950/80 via-amber-950/60 to-rose-950/80 border border-amber-400/80 text-amber-300 font-bold text-center text-xs sm:text-sm animate-pulse flex items-center justify-center gap-2";
        banner.innerHTML = `
          <i class="fa-solid fa-skull-crossbones text-rose-400"></i>
          <span>ẢI ${this.currentCampaignStage}: ${(this.team2Hero.name || "MA THÚ").toUpperCase()} [${this.team2State.hp}/${this.team2State.maxHp} HP]</span>
          <span class="text-[11px] font-black ${threatColor}">[${threatLevel} • ${threatDesc}]</span>
        `;
      }
      const b1 = document.getElementById("btn-buzz-team1");
      const b2 = document.getElementById("btn-buzz-team2");
      if (b1) b1.disabled = true;
      if (b2) b2.disabled = true;
    } else if (this.gameMode === "buzz" || this.gameMode === "ai") {
      this.isAnsweringAllowed = false;
      this.showBuzzPrompt();
    } else {
      // Turn-based
      this.buzzedTeam = this.currentTurn;
      this.isAnsweringAllowed = true;
      this.showTurnPrompt();
      this.currentTurn = this.currentTurn === 1 ? 2 : 1;
    }

    // Start Timer
    this.startTurnTimer();
  }

  // --- BUZZ-IN MECHANISM ---
  showBuzzPrompt() {
    const banner = document.getElementById("buzz-notification-banner");
    banner.classList.remove("hidden");
    banner.className = "py-2 px-4 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-bold text-center text-sm sm:text-base animate-pulse flex items-center justify-center gap-2";
    banner.innerHTML = `
      <i class="fa-solid fa-bell text-amber-400 animate-bounce"></i>
      <span>BẤM CHUÔNG ĐỂ GIÀNH QUYỀN TRẢ LỜI!</span>
      <span class="text-xs text-amber-200 opacity-80">(Đội 1: phím W | Đội 2: phím P)</span>
    `;

    // Enable Buzzer Buttons
    document.getElementById("btn-buzz-team1").disabled = false;
    document.getElementById("btn-buzz-team2").disabled = false;

    // AI Trigger if in AI mode
    if (this.gameMode === "ai") {
      this.scheduleAiBuzz();
    }
  }

  showTurnPrompt() {
    const hero = this.buzzedTeam === 1 ? this.team1Hero : this.team2Hero;
    const banner = document.getElementById("buzz-notification-banner");
    banner.classList.remove("hidden");
    banner.className = `py-2 px-4 rounded-xl font-bold text-center text-sm sm:text-base ${
      this.buzzedTeam === 1
        ? "bg-amber-500/20 border border-amber-400 text-amber-300"
        : "bg-cyan-500/20 border border-cyan-400 text-cyan-300"
    }`;
    banner.innerHTML = `
      <span>LƯỢT CỦA: <strong>ĐỘI ${this.buzzedTeam} (${hero.name})</strong></span>
    `;
  }

  // Buzz triggered by Team 1 or 2
  triggerBuzz(teamNumber) {
    if (this.isQuestionResolved || this.buzzedTeam !== null) return;

    this.buzzedTeam = teamNumber;
    this.isAnsweringAllowed = true;

    // Sound effect
    if (window.gameAudio) window.gameAudio.playBuzz();

    // Disable Buzzer Buttons
    document.getElementById("btn-buzz-team1").disabled = true;
    document.getElementById("btn-buzz-team2").disabled = true;

    // Announce buzz banner
    const hero = teamNumber === 1 ? this.team1Hero : this.team2Hero;
    const banner = document.getElementById("buzz-notification-banner");
    banner.classList.remove("hidden");
    banner.className = `py-2.5 px-5 rounded-xl font-black text-center text-base sm:text-lg animate-bounce shadow-lg ${
      teamNumber === 1
        ? "bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 border-2 border-amber-300"
        : "bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 border-2 border-cyan-300"
    }`;
    banner.innerHTML = `
      ⭐ ĐỘI ${teamNumber} (${hero.name}) ĐÃ GIÀNH ĐƯỢC LƯỢT!
    `;

    // Reset timer to 15s for the answering player
    this.turnTimer = 15;
    this.updateTimerDisplay();

    // If Team 2 is AI, schedule AI answer
    if (this.gameMode === "ai" && teamNumber === 2) {
      this.scheduleAiAnswer();
    }
  }

  // AI Behavior
  scheduleAiBuzz() {
    // Delay depends on difficulty
    const delay = this.aiDifficulty === "easy" ? 4000 + Math.random() * 3000
                : this.aiDifficulty === "hard" ? 1200 + Math.random() * 1500
                : 2200 + Math.random() * 2000;

    setTimeout(() => {
      if (!this.isQuestionResolved && this.buzzedTeam === null && this.currentScreen === "screen-battle") {
        this.triggerBuzz(2);
      }
    }, delay);
  }

  scheduleAiAnswer() {
    setTimeout(() => {
      if (!this.isQuestionResolved && this.buzzedTeam === 2 && this.currentScreen === "screen-battle") {
        // AI chooses answer (probability of being correct based on difficulty)
        const correctProb = this.aiDifficulty === "easy" ? 0.5 : this.aiDifficulty === "hard" ? 0.9 : 0.75;
        const isCorrect = Math.random() < correctProb;
        let chosenIdx = this.activeQuestion.answer;
        if (!isCorrect) {
          const wrongIndices = [0, 1, 2, 3].filter(i => i !== this.activeQuestion.answer);
          chosenIdx = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
        }
        this.handleAnswerSelection(chosenIdx);
      }
    }, 1500 + Math.random() * 1200);
  }

  // --- TIMER MANAGEMENT (DYNAMIC BASED ON STAGE DIFFICULTY) ---
  startTurnTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.turnTimer = (this.isCampaignMode && this.activeStageConfig && this.activeStageConfig.turnTimer)
      ? this.activeStageConfig.turnTimer
      : 25;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.turnTimer--;
      this.updateTimerDisplay();

      if (this.turnTimer <= 5 && this.turnTimer > 0) {
        if (window.gameAudio) window.gameAudio.playTick(true);
      }

      if (this.turnTimer <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeOut();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const timerEl = document.getElementById("arena-timer-value");
    if (timerEl) {
      timerEl.textContent = this.turnTimer;
      if (this.turnTimer <= 5) {
        timerEl.className = "text-xl font-black text-rose-500 animate-ping";
      } else {
        timerEl.className = "text-xl font-black text-amber-400";
      }
    }
  }

  handleTimeOut() {
    if (this.isQuestionResolved) return;
    this.isQuestionResolved = true;

    if (window.gameAudio) window.gameAudio.playWrong();

    if (this.isCampaignMode) {
      this.team1State.combo = 0;

      // Check if Divine Shield blocks timeout punishment
      if (this.activeShield) {
        this.activeShield = false;
        if (window.gameAudio && typeof window.gameAudio.playShield === "function") {
          window.gameAudio.playShield();
        }
        const banner = document.getElementById("combat-feedback-banner");
        if (banner) {
          banner.classList.remove("hidden");
          banner.className = "py-2.5 px-5 rounded-xl bg-amber-950 text-amber-300 border-2 border-amber-400 font-bold text-center text-xs sm:text-sm";
          banner.innerHTML = `<i class="fa-solid fa-shield-halved mr-1 text-amber-400"></i> HẾT GIỜ! KHIÊN KIM CANG ĐÃ CHẶN ĐỨNG PHẢN KÍCH CỦA ${this.team2Hero.name}! (0 SÁT THƯƠNG)`;
        }
        this.updateCampaignItemsUI();
        this.showExplanation();
        setTimeout(() => this.checkMatchEndOrNext(), 3000);
        return;
      }

      let monsterDmg = this.team2Hero.atk || 14;
      if (this.hasRelic("relic_armor")) {
        monsterDmg = Math.max(5, Math.round(monsterDmg * 0.70));
      }
      this.team1State.hp = Math.max(0, this.team1State.hp - monsterDmg);

      if (this.currentCampaignStage >= 4) {
        this.triggerScreenShake();
      }

      const banner = document.getElementById("combat-feedback-banner");
      if (banner) {
        banner.classList.remove("hidden");
        if (this.team1State.hp <= 0) {
          banner.className = "py-3 px-6 rounded-xl bg-red-950 text-white border-2 border-red-500 font-black text-center animate-bounce text-sm sm:text-base shadow-2xl shadow-red-900";
          banner.innerHTML = `<i class="fa-solid fa-skull-crossbones text-rose-300 mr-1.5"></i> HẾT THỜI GIAN & BỊ HẠ SÁT TỨC THÌ! Đòn trừng phạt -${monsterDmg} HP của ${this.team2Hero.name} đã kết liễu bạn!`;
        } else {
          banner.className = (this.currentCampaignStage >= 5)
            ? "py-2.5 px-5 rounded-xl bg-rose-950 text-rose-200 border-2 border-rose-500 font-black text-center animate-bounce text-sm shadow-xl shadow-rose-900/50"
            : "py-2 px-4 rounded-xl bg-rose-950 text-rose-300 border border-rose-600 font-bold text-center text-xs sm:text-sm";
          banner.innerHTML = `⏰ HẾT THỜI GIAN! ẢI ${this.currentCampaignStage}: ${this.team2Hero.name} TRỪNG PHẠT TÀN BẠO: -${monsterDmg} HP!`;
        }
      }

      this.playHurtAnimation(1, this.currentCampaignStage >= 4);
      this.spawnFloatingDamage(1, monsterDmg, this.currentCampaignStage >= 5);
      this.updateBattleHUD();
      this.showExplanation();

      setTimeout(() => {
        this.checkMatchEndOrNext();
      }, 3000);
    } else {
      const banner = document.getElementById("combat-feedback-banner");
      if (banner) {
        banner.classList.remove("hidden");
        banner.className = "py-2 px-4 rounded-xl bg-rose-950 text-rose-300 border border-rose-600 font-bold text-center";
        banner.textContent = "⏰ HẾT THỜI GIAN SUY NGHĨ! KHÔNG AI GHI ĐƯỢC ĐIỂM.";
      }

      this.showExplanation();

      setTimeout(() => {
        this.nextQuestion();
      }, 3000);
    }
  }

  // --- ANSWER SELECTION & COMBAT EXECUTION ---
  handleAnswerSelection(chosenIdx) {
    if (this.isQuestionResolved || !this.isAnsweringAllowed || this.buzzedTeam === null) {
      return;
    }

    this.isQuestionResolved = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    const isCorrect = chosenIdx === this.activeQuestion.answer;
    const attackingTeamNum = this.buzzedTeam;
    const defendingTeamNum = attackingTeamNum === 1 ? 2 : 1;
    const attackerHero = attackingTeamNum === 1 ? this.team1Hero : this.team2Hero;
    const defenderHero = defendingTeamNum === 1 ? this.team1Hero : this.team2Hero;
    const attackerState = attackingTeamNum === 1 ? this.team1State : this.team2State;
    const defenderState = defendingTeamNum === 1 ? this.team1State : this.team2State;

    // Highlight Buttons
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, idx) => {
      if (idx === this.activeQuestion.answer) {
        btn.className = "option-btn w-full p-3.5 rounded-xl border-2 border-emerald-400 bg-emerald-500/30 text-emerald-100 font-bold text-left flex items-start gap-3 shadow-lg shadow-emerald-500/20";
      } else if (idx === chosenIdx && !isCorrect) {
        btn.className = "option-btn w-full p-3.5 rounded-xl border-2 border-rose-500 bg-rose-500/30 text-rose-200 font-bold text-left flex items-start gap-3 shadow-lg shadow-rose-500/20";
      } else {
        btn.classList.add("opacity-40");
      }
    });

    if (isCorrect) {
      // Success!
      attackerState.correctCount++;
      attackerState.combo++;
      attackerState.energy = Math.min(100, attackerState.energy + 25);

      // Kill-Streak Announcer (Sự Hưng Phấn Tột Đỉnh)
      if (attackingTeamNum === 1 && attackerState.combo >= 2) {
        this.showComboAnnouncer(attackerState.combo);
      }

      if (this.isCampaignMode) {
        // Relic Score Multiplier
        const scoreMult = this.hasRelic("relic_eye") ? 1.5 : 1.0;
        const basePts = 120;
        const comboBonus = (attackerState.combo - 1) * 35;
        const speedBonus = this.turnTimer >= 15 ? 80 : (this.turnTimer >= 10 ? 40 : 10);
        this.campaignScore += Math.round((basePts + comboBonus + speedBonus) * scoreMult);
        this.campaignMaxCombo = Math.max(this.campaignMaxCombo, attackerState.combo);

        // Relic Speed Heal (Gia Tốc Tri Thức)
        if (this.hasRelic("relic_speed") && this.turnTimer >= 10) {
          this.team1State.hp = Math.min(this.team1State.maxHp, this.team1State.hp + 10);
          this.spawnFloatingDamage(1, "+10 HP 💖", true);
        }

        // Relic Core Energy Boost
        if (this.hasRelic("relic_core")) {
          attackerState.energy = Math.min(100, attackerState.energy + 10);
        }

        // Check if Monster was Enraged -> TRIGGER BREAK STUN!
        if (this.isMonsterEnraged) {
          this.monsterRage = 0;
          this.isMonsterEnraged = false;
          this.monsterIsStunned = true;
          this.triggerScreenShake();
          if (window.gameAudio && typeof window.gameAudio.playBreak === "function") {
            window.gameAudio.playBreak();
          }
          this.spawnFloatingDamage(2, "⚡ BREAK STUN!", true);
        }
      }

      if (window.gameAudio) window.gameAudio.playCorrect();

      // Check Ultimate
      const isUltimate = attackerState.energy >= 100;
      if (isUltimate) {
        attackerState.energy = 0; // Reset after firing
        this.executeUltimateAttack(attackingTeamNum, defendingTeamNum, attackerHero, defenderHero, attackerState, defenderState);
      } else {
        this.executeNormalAttack(attackingTeamNum, defendingTeamNum, attackerHero, defenderHero, attackerState, defenderState);
      }
    } else {
      // Failed / Ăn hành!
      attackerState.combo = 0;
      if (window.gameAudio) window.gameAudio.playWrong();

      if (this.isCampaignMode) {
        // Check if Divine Shield is active
        if (this.activeShield) {
          this.activeShield = false;
          if (window.gameAudio && typeof window.gameAudio.playShield === "function") {
            window.gameAudio.playShield();
          }
          const banner = document.getElementById("combat-feedback-banner");
          if (banner) {
            banner.classList.remove("hidden");
            banner.className = "py-2.5 px-5 rounded-xl bg-amber-950 text-amber-300 border-2 border-amber-400 font-bold text-center text-xs sm:text-sm";
            banner.innerHTML = `<i class="fa-solid fa-shield-halved mr-1 text-amber-400"></i> KHIÊN KIM CANG ĐÃ CHẶN ĐỨNG PHẢN KÍCH CỦA ${this.team2Hero.name}! (0 SÁT THƯƠNG)`;
          }
          this.updateCampaignItemsUI();
          this.showExplanation();
          setTimeout(() => this.checkMatchEndOrNext(), 3000);
          return;
        }

        // Calculate Monster Counter-attack Damage (Enraged or Normal)
        let baseDmg = this.team2Hero.atk || 14;
        let isEnragedHit = this.isMonsterEnraged;
        if (isEnragedHit) {
          baseDmg = Math.round(baseDmg * (this.currentCampaignStage >= 5 ? 1.8 : 2.0));
          this.monsterRage = 0;
          this.isMonsterEnraged = false;
          this.triggerScreenShake();
        }

        // Apply Relic Armor Damage Reduction (-30%)
        if (this.hasRelic("relic_armor")) {
          baseDmg = Math.max(5, Math.round(baseDmg * 0.70));
        }

        this.team1State.hp = Math.max(0, this.team1State.hp - baseDmg);

        // Shake screen on heavy damage or high stages
        if (this.currentCampaignStage >= 4 || isEnragedHit) {
          this.triggerScreenShake();
        }

        // Increase monster rage on wrong answer
        this.monsterRage = Math.min(100, this.monsterRage + (this.currentCampaignStage >= 5 ? 40 : 30));
        if (this.monsterRage >= 100) {
          this.isMonsterEnraged = true;
        }

        const stageThreatNotice = this.currentCampaignStage >= 6 
          ? "💀 TRỪNG PHẠT ÁC MỘNG! CHỈ CẦN 1-2 LỖI LÀ TỬ VONG!"
          : this.currentCampaignStage >= 4
          ? "⚠️ CẢNH BÁO NGUY HIỂM! MA THÚ TRẢ ĐÒN CHÍ TỬ!"
          : "TRẢ LỜI SAI!";

        const banner = document.getElementById("combat-feedback-banner");
        if (banner) {
          banner.classList.remove("hidden");
          if (this.team1State.hp <= 0) {
            banner.className = "py-3 px-6 rounded-xl bg-red-950 text-white border-2 border-red-500 font-black text-center animate-bounce text-sm sm:text-base shadow-2xl shadow-red-900";
            banner.innerHTML = `<i class="fa-solid fa-skull-crossbones text-rose-300 mr-1.5"></i> BỊ TIÊU DIỆT TỨC THÌ! Đòn trừng phạt -${baseDmg} HP của ${this.team2Hero.name} đã kết liễu bạn!`;
          } else {
            banner.className = (isEnragedHit || this.currentCampaignStage >= 5)
              ? "py-2.5 px-5 rounded-xl bg-rose-950 text-rose-200 border-2 border-rose-500 font-black text-center animate-bounce text-xs sm:text-sm shadow-xl shadow-rose-900/50"
              : "py-2.5 px-5 rounded-xl bg-rose-950 text-rose-300 border-2 border-rose-600 font-bold text-center text-xs sm:text-sm";
            banner.innerHTML = isEnragedHit
              ? `<i class="fa-solid fa-skull-crossbones mr-1 text-rose-400"></i> NỘ KHÍ BỘC PHÁ! ${this.team2Hero.name} TÙNG ĐÒN HỦY DIỆT: -${baseDmg} HP!`
              : `<i class="fa-solid fa-triangle-exclamation mr-1 text-rose-400"></i> ${stageThreatNotice} ${this.team2Hero.name} PHẢN KÍCH: -${baseDmg} HP!`;
          }
        }

        this.playHurtAnimation(1, this.currentCampaignStage >= 4 || isEnragedHit);
        this.spawnFloatingDamage(1, baseDmg, isEnragedHit || this.currentCampaignStage >= 5);
        this.updateBattleHUD();
        this.showExplanation();

        setTimeout(() => {
          this.checkMatchEndOrNext();
        }, 3000);
      } else {
        const banner = document.getElementById("combat-feedback-banner");
        if (banner) {
          banner.classList.remove("hidden");
          banner.className = "py-2 px-4 rounded-xl bg-rose-950 text-rose-300 border border-rose-600 font-bold text-center";
          banner.textContent = `❌ ĐỘI ${attackingTeamNum} TRẢ LỜI SAI! BỊ ĂN HÀNH RỒI!`;
        }

        // Defending hero counter-flinch or small penalty
        this.playHurtAnimation(attackingTeamNum);
        this.updateBattleHUD();
        this.showExplanation();

        setTimeout(() => {
          this.checkMatchEndOrNext();
        }, 3000);
      }
    }
  }

  // Normal Attack Calculation
  executeNormalAttack(attTeam, defTeam, attHero, defHero, attState, defState) {
    let damage = attHero.atk;
    let label = "ĐÒN ĐÁNH CƠ BẢN!";

    // Speed bonus if answered in <= 5s
    const isSpeedy = this.turnTimer >= 10;
    if (isSpeedy) {
      damage += 4;
      label = "🚀 NHANH NHƯ CHỚP!";
    }

    // Apply Relic Attack Boost
    if (attTeam === 1 && this.hasRelic("relic_pen_a")) {
      damage = Math.round(damage * 1.25);
    }

    // Apply Break Stun +50% Bonus
    if (defTeam === 2 && this.monsterIsStunned) {
      damage = Math.round(damage * 1.5);
      label = "💥 PHÁ CHIÊU SÁT THƯƠNG KHỦNG!";
    }

    // Critical roll (augmented by relic_scale)
    const critBonus = (attTeam === 1 && this.hasRelic("relic_scale")) ? 30 : 0;
    const isCrit = Math.random() * 100 < (attHero.crit + critBonus);
    if (isCrit) {
      damage = Math.round(damage * 1.5);
      label = "⚡ CHÍ MẠNG TỐC ĐỘ!";
    }

    // Combo escalation bonus (Sự Hưng Phấn: đúng liên tiếp nhân sát thương x1.2 -> x2.0!)
    if (attState.combo >= 6) {
      damage = Math.round(damage * 2.0);
      label = "💥 THẦN THÁNH BÁCH KHOA (x2.0)!";
    } else if (attState.combo === 5) {
      damage = Math.round(damage * 1.8);
      label = "👑 NGŨ LÔI PHÁN XÉT (x1.8)!";
    } else if (attState.combo === 4) {
      damage = Math.round(damage * 1.6);
      label = "🌪️ TỨ ĐOÁN XUẤT THẦN (x1.6)!";
    } else if (attState.combo === 3) {
      damage = Math.round(damage * 1.4);
      label = "⚡ TAM KÍCH TUYỆT ĐỈNH (x1.4)!";
    } else if (attState.combo === 2) {
      damage = Math.round(damage * 1.2);
      label = "🔥 SONG SÁT TRI THỨC (x1.2)!";
    }

    // Clutch Boost: "Nghịch Cảnh Sinh Anh Hùng" (khi máu người chơi <= 25%)
    const isClutch = attTeam === 1 && (this.team1State.hp / this.team1State.maxHp) <= 0.25;
    if (isClutch) {
      damage = Math.round(damage * 1.4);
      const lifesteal = 15;
      this.team1State.hp = Math.min(this.team1State.maxHp, this.team1State.hp + lifesteal);
      this.spawnFloatingDamage(1, `+${lifesteal} HP 💖`, true);
      label = "🔥 NGHỊCH CẢNH PHẢN KÍCH (+40% DMG & HÚT MÁU)!";
      this.flashGoldenScreen();
      if (window.gameAudio && typeof window.gameAudio.playClutchComeback === "function") {
        window.gameAudio.playClutchComeback();
      }
    }

    // Apply Monster Armor reduction in high campaign stages (Độ Khó Tăng Cao: Cần trả lời đúng nhiều câu hơn để hạ quái)
    if (defTeam === 2 && this.isCampaignMode && this.activeStageConfig) {
      const monsterArmor = this.activeStageConfig.monsterArmor || 0;
      if (monsterArmor > 0) {
        damage = Math.max(6, Math.round(damage * (1 - monsterArmor)));
      }
    }

    // Apply damage
    defState.hp = Math.max(0, defState.hp - damage);
    attState.totalDmg += damage;

    // Display combat banner
    const banner = document.getElementById("combat-feedback-banner");
    banner.classList.remove("hidden");
    banner.className = `py-2.5 px-5 rounded-xl font-black text-center text-base sm:text-lg animate-bounce ${
      isCrit ? "bg-amber-500 text-slate-950 border-2 border-white" : "bg-cyan-500 text-slate-950"
    }`;
    banner.textContent = `${label} -${damage} HP!`;

    // Animations & SFX
    this.playAttackAnimation(attTeam);
    setTimeout(() => {
      this.playHurtAnimation(defTeam);
      this.spawnFloatingDamage(defTeam, damage, isCrit);
      if (window.gameAudio) {
        if (isCrit) window.gameAudio.playCrit();
        else window.gameAudio.playHit();
      }
      this.updateBattleHUD();
      this.showExplanation();

      setTimeout(() => {
        this.checkMatchEndOrNext();
      }, 3000);
    }, 400);
  }

  // Ultimate Skill Attack
  executeUltimateAttack(attTeam, defTeam, attHero, defHero, attState, defState) {
    let damage = attHero.ultimateDmg || 32;
    // Apply Monster Armor reduction in high campaign stages
    if (defTeam === 2 && this.isCampaignMode && this.activeStageConfig) {
      const monsterArmor = this.activeStageConfig.monsterArmor || 0;
      if (monsterArmor > 0) {
        damage = Math.max(15, Math.round(damage * (1 - monsterArmor)));
      }
    }
    defState.hp = Math.max(0, defState.hp - damage);
    attState.totalDmg += damage;

    // Cinematic Anime Banner
    const ultBanner = document.getElementById("ultimate-cinematic-banner");
    ultBanner.classList.remove("hidden");
    ultBanner.innerHTML = `
      <div class="ultimate-anime-splash text-center animate-pulse">
        <div class="text-xs sm:text-sm font-black text-amber-300 tracking-widest uppercase">TUYỆT KỸ TỐI THƯỢNG</div>
        <div class="text-2xl sm:text-4xl font-black text-white drop-shadow-md">🔥 TUYỆT KỸ CỦA ${attHero.name.toUpperCase()}! 🔥</div>
        <div class="text-sm sm:text-base text-amber-200 mt-1 font-bold">"${attHero.ultimateName}"</div>
      </div>
    `;

    if (window.gameAudio) window.gameAudio.playUltimate();

    this.playAttackAnimation(attTeam, true);

    setTimeout(() => {
      ultBanner.classList.add("hidden");
      this.playHurtAnimation(defTeam, true);
      this.spawnFloatingDamage(defTeam, damage, true);
      this.updateBattleHUD();
      this.showExplanation();

      setTimeout(() => {
        this.checkMatchEndOrNext();
      }, 3200);
    }, 1400);
  }

  // --- ANIMATIONS & VISUAL FX ---
  playAttackAnimation(teamNum, isUlt = false) {
    const fighterEl = document.getElementById(teamNum === 1 ? "t1-fighter-card" : "t2-fighter-card");
    if (!fighterEl) return;
    const animClass = teamNum === 1 ? "animate-attack-right" : "animate-attack-left";
    fighterEl.classList.add(animClass);
    setTimeout(() => fighterEl.classList.remove(animClass), 600);
  }

  playHurtAnimation(teamNum, isHeavy = false) {
    const fighterEl = document.getElementById(teamNum === 1 ? "t1-fighter-card" : "t2-fighter-card");
    if (!fighterEl) return;
    fighterEl.classList.add("animate-hurt");
    setTimeout(() => fighterEl.classList.remove("animate-hurt"), 600);
  }

  spawnFloatingDamage(teamNum, dmg, isCrit = false) {
    const container = document.getElementById(teamNum === 1 ? "t1-fighter-card" : "t2-fighter-card");
    if (!container) return;

    const dmgEl = document.createElement("div");
    dmgEl.className = `floating-dmg absolute -top-10 font-black text-2xl sm:text-3xl select-none pointer-events-none z-30 ${
      isCrit ? "text-amber-300 scale-125 drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]" : "text-rose-400 drop-shadow"
    }`;
    dmgEl.textContent = `-${dmg} HP`;

    container.appendChild(dmgEl);
    setTimeout(() => dmgEl.remove(), 1200);
  }

  showExplanation() {
    if (!this.activeQuestion) return;
    const box = document.getElementById("question-explanation-box");
    if (!box) return;
    box.classList.remove("hidden");

    const letters = ["A", "B", "C", "D"];
    const correctLetter = letters[this.activeQuestion.answer] || "A";
    const correctText = this.activeQuestion.options[this.activeQuestion.answer] || "";
    const expText = this.activeQuestion.explanation || "Căn cứ theo giáo trình và ngân hàng đề thi trắc nghiệm Pháp luật đại cương ĐHBK Hà Nội.";

    const expContent = document.getElementById("question-explanation-text");
    if (expContent) {
      expContent.innerHTML = `<span class="text-emerald-400 font-bold">[Đáp án đúng: ${correctLetter}. ${correctText}]</span> — ${expText}`;
    }
  }

  // Check Match End
  checkMatchEndOrNext() {
    if (this.isCampaignMode) {
      if (this.team2State.hp <= 0) {
        this.handleCampaignStageClear();
        return;
      } else if (this.team1State.hp <= 0) {
        this.handleCampaignGameOver();
        return;
      } else {
        this.nextQuestion();
        return;
      }
    }

    if (this.team1State.hp <= 0 || this.team2State.hp <= 0) {
      this.triggerMatchVictory();
    } else {
      this.nextQuestion();
    }
  }

  // --- VICTORY & K.O. ---
  triggerMatchVictory() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const winnerTeam = this.team1State.hp > 0 ? 1 : 2;
    const winnerHero = winnerTeam === 1 ? this.team1Hero : this.team2Hero;
    const loserHero = winnerTeam === 1 ? this.team2Hero : this.team1Hero;

    if (window.gameAudio) {
      window.gameAudio.stopBGM();
      window.gameAudio.playKO();
      setTimeout(() => window.gameAudio.playVictory(), 800);
    }

    this.showScreen("screen-victory");

    document.getElementById("victory-team-badge").textContent = `CHIẾN THẮNG: ĐỘI ${winnerTeam}`;
    document.getElementById("victory-hero-name").textContent = winnerHero.name;
    document.getElementById("victory-hero-title").textContent = winnerHero.title;
    document.getElementById("victory-hero-avatar").src = winnerHero.avatar;
    document.getElementById("victory-hero-quote").textContent = `"${winnerHero.quote}"`;

    // Stats
    document.getElementById("stat-t1-correct").textContent = this.team1State.correctCount;
    document.getElementById("stat-t1-dmg").textContent = this.team1State.totalDmg;
    document.getElementById("stat-t2-correct").textContent = this.team2State.correctCount;
    document.getElementById("stat-t2-dmg").textContent = this.team2State.totalDmg;
  }

  // --- GLOBAL SHORTCUTS (CAMPAIGN BATTLE CONTROLS) ---
  bindKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // In battle
      if (this.currentScreen === "screen-battle") {
        // Option Keys: 1, 2, 3, 4 or a, b, c, d
        if (["1", "a", "A"].includes(e.key)) this.handleAnswerSelection(0);
        if (["2", "b", "B"].includes(e.key)) this.handleAnswerSelection(1);
        if (["3", "c", "C"].includes(e.key)) this.handleAnswerSelection(2);
        if (["4", "d", "D"].includes(e.key)) this.handleAnswerSelection(3);

        // RPG Items Hotkeys
        if (["q", "Q", "h", "H"].includes(e.key)) this.useItemPotion();
        if (["e", "E"].includes(e.key)) this.useItemBanish();
        if (["s", "S", "w", "W"].includes(e.key)) this.useItemShield();
        if (["t", "T"].includes(e.key)) this.useItemFreeze();

        // Phím R: Đổi câu hỏi khác linh hoạt tránh trùng lặp
        if (["r", "R"].includes(e.key) && !this.isQuestionResolved) {
          this.rerollQuestion();
        }
      }
    });
  }

  // --- QUESTIONS MANAGER ("BÍ TỊCH TRI THỨC") ---
  renderQuestionsManager() {
    const listContainer = document.getElementById("pack-list-container");
    if (!listContainer) return;
    listContainer.innerHTML = "";

    // All packs: built-in + custom
    const allPacks = [...QUESTION_PACKS, ...this.customPacks];

    allPacks.forEach(pack => {
      const isSelected = pack.id === this.activePackId;
      const card = document.createElement("div");
      card.className = `p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
        isSelected
          ? "border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10"
          : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
      }`;

      card.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}">
            <i class="fa-solid ${pack.icon || 'fa-book-bookmark'}"></i>
          </div>
          <div>
            <div class="font-bold text-slate-100 flex items-center gap-2">
              <span>${pack.name}</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                ${pack.questions.length} câu
              </span>
            </div>
            <div class="text-xs text-slate-400 line-clamp-1">${pack.desc || 'Bộ câu hỏi thi đấu'}</div>
          </div>
        </div>
        <div>
          ${isSelected ? `<span class="px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-xs font-bold">ĐANG CHỌN</span>` : `<button class="text-xs text-slate-400 group-hover:text-amber-400 font-medium">Chọn bộ này</button>`}
        </div>
      `;

      card.onclick = () => {
        this.activePackId = pack.id;
        const homePackEl = document.getElementById("home-pack-name");
        if (homePackEl) homePackEl.textContent = pack.name;
        if (window.gameAudio) window.gameAudio.playSelect();
        this.renderQuestionsManager();
      };

      listContainer.appendChild(card);
    });

    // Render questions list of active pack
    this.renderActivePackQuestions();
  }

  renderActivePackQuestions() {
    const activePack = [...QUESTION_PACKS, ...this.customPacks].find(p => p.id === this.activePackId) || QUESTION_PACKS[0];
    const previewContainer = document.getElementById("active-pack-questions-list");
    if (!previewContainer) return;
    previewContainer.innerHTML = "";

    document.getElementById("active-pack-title").textContent = activePack.name;
    document.getElementById("active-pack-count").textContent = `${activePack.questions.length} câu hỏi`;

    activePack.questions.forEach((q, idx) => {
      const item = document.createElement("div");
      item.className = "p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs space-y-1.5";
      item.innerHTML = `
        <div class="font-bold text-slate-200">#${idx + 1}: ${q.question}</div>
        <div class="grid grid-cols-2 gap-1 text-slate-400">
          <div class="${q.answer === 0 ? 'text-emerald-400 font-bold' : ''}">A. ${q.options[0]}</div>
          <div class="${q.answer === 1 ? 'text-emerald-400 font-bold' : ''}">B. ${q.options[1]}</div>
          <div class="${q.answer === 2 ? 'text-emerald-400 font-bold' : ''}">C. ${q.options[2]}</div>
          <div class="${q.answer === 3 ? 'text-emerald-400 font-bold' : ''}">D. ${q.options[3]}</div>
        </div>
      `;
      previewContainer.appendChild(item);
    });
  }

  // Add individual custom question
  addCustomQuestion(questionText, optA, optB, optC, optD, answerIdx, explanation) {
    let customPack = this.customPacks.find(p => p.id === "user_custom_pack");
    if (!customPack) {
      customPack = {
        id: "user_custom_pack",
        name: "Bộ Câu Hỏi Tự Tạo Của Bạn",
        desc: "Các câu hỏi do bạn trực tiếp bổ sung và thiết kế",
        icon: "fa-feather",
        questions: []
      };
      this.customPacks.push(customPack);
    }

    customPack.questions.unshift({
      question: questionText,
      options: [optA, optB, optC, optD],
      answer: parseInt(answerIdx),
      explanation: explanation || "Đáp án chính xác theo ngân hàng câu hỏi."
    });

    this.activePackId = "user_custom_pack";
    this.saveCustomPacks();
    this.renderQuestionsManager();
  }

  // Bulk Import Questions from Text
  importBulkQuestions(rawText) {
    try {
      // Try JSON first
      if (rawText.trim().startsWith("[") || rawText.trim().startsWith("{")) {
        const parsed = JSON.parse(rawText);
        const list = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        if (list.length > 0) {
          this.createCustomPackFromList("Bộ nhập từ JSON (" + list.length + " câu)", list);
          return list.length;
        }
      }

      // Parse structured text: Question followed by A., B., C., D. and Answer
      const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      const parsedList = [];
      let currentQ = null;

      for (let line of lines) {
        if (line.match(/^(Câu\s*\d+|Q\d+|\d+[\.\:])/i)) {
          if (currentQ && currentQ.options.length >= 4) {
            parsedList.push(currentQ);
          }
          currentQ = {
            question: line.replace(/^(Câu\s*\d+|Q\d+|\d+[\.\:])\s*/i, ""),
            options: [],
            answer: 0,
            explanation: ""
          };
        } else if (currentQ && line.match(/^[A-D][\.\:\)]/i)) {
          currentQ.options.push(line.replace(/^[A-D][\.\:\)]\s*/i, ""));
        } else if (currentQ && line.match(/^(Đáp án|Key|Ans)[\:\s]+([A-D])/i)) {
          const match = line.match(/^(Đáp án|Key|Ans)[\:\s]+([A-D])/i);
          const letter = match[2].toUpperCase();
          currentQ.answer = letter === "A" ? 0 : letter === "B" ? 1 : letter === "C" ? 2 : 3;
        }
      }

      if (currentQ && currentQ.options.length >= 4) {
        parsedList.push(currentQ);
      }

      if (parsedList.length > 0) {
        this.createCustomPackFromList("Bộ nhập từ văn bản (" + parsedList.length + " câu)", parsedList);
        return parsedList.length;
      }
      return 0;
    } catch (e) {
      console.error("Import error:", e);
      return 0;
    }
  }

  createCustomPackFromList(name, questions) {
    const newPack = {
      id: "pack_" + Date.now(),
      name: name,
      desc: "Bộ câu hỏi tạo lúc " + new Date().toLocaleTimeString("vi-VN"),
      icon: "fa-folder-plus",
      questions: questions
    };
    this.customPacks.unshift(newPack);
    this.activePackId = newPack.id;
    this.saveCustomPacks();
    this.renderQuestionsManager();
  }

  // ==========================================================================
  // CHIẾN DỊCH VƯỢT ẢI DIỆT QUÁI (CAMPAIGN BOSS RAID CONTROLLER)
  // ==========================================================================

  loadCampaignProgress() {
    try {
      const saved = localStorage.getItem("hust_arena_campaign_progress");
      if (saved) {
        const data = JSON.parse(saved);
        this.unlockedStageMax = data.unlockedStage || 1;
        this.campaignScore = data.maxScore || 0;
      }
    } catch (e) {
      this.unlockedStageMax = 1;
    }
  }

  saveCampaignProgress() {
    try {
      localStorage.setItem("hust_arena_campaign_progress", JSON.stringify({
        unlockedStage: this.unlockedStageMax,
        maxScore: this.campaignScore
      }));
    } catch (e) {}
  }

  showLeaderboardScreen() {
    this.showScreen("screen-leaderboard");
  }

  startCampaignFlow() {
    this.isCampaignMode = true;
    if (!this.team1Hero) {
      this.team1Hero = (typeof HEROES_DATA !== "undefined" && HEROES_DATA.length > 0)
        ? HEROES_DATA[0]
        : { id: "bachkhoa", name: "Chiến Binh Bách Khoa", title: "Hộ Vệ Kỷ Cương & Pháp Chế Bách Khoa", role: "Đỡ Đòn & Kiến Thức Chuẩn", avatar: "assets/avatars/bachkhoa.jpg", hp: 100, atk: 12, crit: 20 };
    }
    this.showScreen("screen-campaign-select");
    this.renderCampaignStagesMap();
  }

  renderCampaignStagesMap(filterRealm = null) {
    if (filterRealm) {
      this.activeCampaignRealm = filterRealm;
    }

    // 1. Update Hero Status Card
    if (this.team1Hero) {
      const avatarEl = document.getElementById("campaign-hero-avatar");
      const nameEl = document.getElementById("campaign-hero-name");
      const titleEl = document.getElementById("campaign-hero-title");
      const roleEl = document.getElementById("campaign-hero-role");
      if (avatarEl) avatarEl.src = this.team1Hero.avatar;
      if (nameEl) nameEl.textContent = this.team1Hero.name;
      if (titleEl) titleEl.textContent = this.team1Hero.title;
      if (roleEl) roleEl.textContent = this.team1Hero.role;
    }

    const unBadge = document.getElementById("campaign-unlocked-badge");
    const scoreBadge = document.getElementById("campaign-total-score-badge");
    const comboBadge = document.getElementById("campaign-max-combo-badge");
    if (unBadge) unBadge.textContent = `${this.unlockedStageMax} / ${this.totalCampaignStages || 24}`;
    if (scoreBadge) scoreBadge.textContent = `${this.campaignScore.toLocaleString()} PTS`;
    if (comboBadge) comboBadge.textContent = `x${this.campaignMaxCombo}`;

    // 2. Update Realm Filter Tabs UI
    const filterIds = ["all", "realm_1", "realm_2", "realm_3", "realm_4", "realm_5", "realm_6", "realm_7"];
    filterIds.forEach(fid => {
      const btn = document.getElementById("campaign-filter-" + fid);
      if (btn) {
        if (this.activeCampaignRealm === fid) {
          btn.className = "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-amber-500 text-slate-950 shadow-md transition-all";
        } else {
          btn.className = "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all";
        }
      }
    });

    // 3. Render 24 Stage Cards
    const container = document.getElementById("campaign-stages-container");
    if (!container) return;
    container.innerHTML = "";

    const allStages = (typeof window !== "undefined" && window.CAMPAIGN_STAGES)
      ? window.CAMPAIGN_STAGES
      : (typeof CAMPAIGN_STAGES !== "undefined" ? CAMPAIGN_STAGES : []);

    let filteredStages = [...allStages];
    if (this.activeCampaignRealm && this.activeCampaignRealm.startsWith("realm_")) {
      const rNum = Number(this.activeCampaignRealm.replace("realm_", ""));
      filteredStages = filteredStages.filter(s => s.realm === rNum);
    }

    filteredStages.forEach(st => {
      const isCleared = st.stage < this.unlockedStageMax;
      const isCurrent = st.stage === this.unlockedStageMax;
      const isLocked = st.stage > this.unlockedStageMax;

      const card = document.createElement("div");
      card.className = `p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden select-none ${
        isCurrent
          ? "border-amber-400/90 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400"
          : isCleared
          ? "border-emerald-500/50 bg-slate-900/90 shadow-md"
          : "border-slate-800 bg-slate-950/60 opacity-60 filter grayscale"
      }`;

      card.innerHTML = `
        <div>
          <!-- Top Badges -->
          <div class="flex items-center justify-between mb-2.5 flex-wrap gap-1">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                isCurrent ? "bg-amber-500 text-slate-950" : isCleared ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-slate-800 text-slate-400"
              }">
                ${st.badge}
              </span>
              <span class="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-amber-300 shadow-sm">
                ${st.clearRateText || "Thử thách"}
              </span>
            </div>
            <span class="text-xs font-bold ${isCleared ? "text-emerald-400" : isCurrent ? "text-amber-400 animate-pulse" : "text-slate-500"}">
              ${isCleared ? '<i class="fa-solid fa-check-circle mr-1"></i>ĐÃ DIỆT' : isCurrent ? '<i class="fa-solid fa-fire mr-1"></i>HIỆN TẠI' : '<i class="fa-solid fa-lock mr-1"></i>KHÓA'}
            </span>
          </div>

          <!-- Monster Avatar & Info -->
          <div class="flex items-center gap-3 mb-3">
            <div class="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden p-1 bg-slate-900 border ${
              isCurrent ? "border-amber-400/80 shadow-md shadow-amber-500/20" : isCleared ? "border-emerald-500/40" : "border-slate-800"
            } shrink-0">
              <img src="${st.monster.avatar}" alt="${st.monster.name}" class="w-full h-full object-cover rounded-xl filter drop-shadow">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h4 class="font-black text-sm sm:text-base text-white tracking-tight leading-snug truncate group-hover:text-amber-300">${st.monster.name}</h4>
                <span class="text-[9px] font-black px-1.5 py-0.5 rounded ${st.threatColor || 'text-amber-400'} border border-slate-700 bg-slate-950">${st.threatLevel || 'DỄ'}</span>
              </div>
              <p class="text-[11px] text-amber-400/90 font-medium truncate mt-0.5">${st.monster.title}</p>
              <div class="text-[10px] text-slate-300 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>❤️ HP: <strong class="text-rose-400 font-bold">${st.monster.hp}</strong></span>
                <span>🎯 Cần: <strong class="text-emerald-400 font-bold">~${st.requiredQuestions || Math.ceil(st.monster.hp / 18)} câu đúng</strong></span>
                <span class="text-rose-400 font-bold">⚠️ Phạt sai: -${st.monster.atk} HP</span>
                ${st.monsterArmor ? `<span class="text-indigo-300 font-bold">🛡️ Giáp: -${Math.round(st.monsterArmor * 100)}%</span>` : ''}
                <span class="text-cyan-300">⏱️ ${st.turnTimer || 25}s/câu</span>
              </div>
              ${st.stage >= 16 ? `
                <div class="mt-1.5 px-2 py-0.5 rounded-lg bg-rose-950/90 border border-rose-500/60 text-[10px] font-black text-rose-300 flex items-center gap-1 shadow-sm">
                  <i class="fa-solid fa-skull-crossbones text-rose-400"></i>
                  <span>${st.stage === 24 ? '☠️ SAI 1 CÂU DUY NHẤT LÀ BAY MÀU TỨC THÌ!' : st.stage === 23 ? '☠️ SAI 1 CÂU MẤT 96% MÁU - HẤP HỐI!' : '💀 SAI 2 CÂU = K.O. TỨC THÌ!'}</span>
                </div>
              ` : st.stage >= 10 ? `
                <div class="mt-1.5 px-2 py-0.5 rounded-lg bg-amber-950/90 border border-amber-500/60 text-[10px] font-black text-amber-300 flex items-center gap-1 shadow-sm">
                  <i class="fa-solid fa-triangle-exclamation text-amber-400"></i>
                  <span>⚠️ SAI 3 CÂU LÀ TỬ TRẬN!</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Chapter Topic -->
          <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 mb-3">
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">${st.chapter}:</div>
            <div class="font-bold text-amber-300 truncate">${st.chapterName}</div>
          </div>
        </div>

        <!-- Card Bottom Action -->
        <div class="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
          <div class="text-[10px] text-slate-400 font-bold">
            Thưởng: <span class="text-amber-400 font-black">+${st.bonusScore.toLocaleString()} PTS</span>
          </div>
          ${
            isLocked
              ? `<button disabled class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-500 cursor-not-allowed">
                  <i class="fa-solid fa-lock mr-1"></i>Khóa
                </button>`
              : `<button onclick="arenaEngine.startCampaignStage(${st.stage})" class="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md ${
                  isCurrent
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:scale-105 shadow-amber-500/20"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }">
                  ${isCleared ? 'Đấu Lại' : '⚔️ Quyết Đấu'}
                </button>`
          }
        </div>
      `;

      container.appendChild(card);
    });
  }

  startCampaignStage(stageNum) {
    this.ensureHustLawData();
    this.isCampaignMode = true;
    this.currentCampaignStage = stageNum;
    this.gameMode = "campaign";

    const stages = (typeof window !== "undefined" && window.CAMPAIGN_STAGES)
      ? window.CAMPAIGN_STAGES
      : (typeof CAMPAIGN_STAGES !== "undefined" ? CAMPAIGN_STAGES : []);

    const stage = stages.find(s => s.stage === stageNum) || stages[0];
    this.activeStageConfig = stage;
    this.currentStageTurnTime = stage.turnTimer || 25;

    // Apply Max HP relic bonus
    const maxHp = this.hasRelic("relic_heart") ? 135 : 100;
    this.team1State.maxHp = maxHp;

    // Reset scores if starting a fresh run from stage 1
    if (stageNum === 1) {
      this.campaignScore = 0;
      this.campaignMaxCombo = 0;
      this.team1State.hp = maxHp;
    } else {
      // Retain HP with a safety baseline and bonus heal (+35 HP between stages)
      this.team1State.hp = Math.min(maxHp, Math.max(50, (this.team1State.hp || 100) + 35));
    }

    // Configure Monster combatant (Team 2)
    this.team2Hero = {
      id: stage.monster.id,
      name: stage.monster.name,
      title: stage.monster.title,
      role: `Ma Thú ${stage.chapter}`,
      avatar: stage.monster.avatar,
      hp: stage.monster.hp,
      atk: stage.monster.atk,
      crit: 15,
      ultimateName: stage.monster.title,
      ultimateDesc: "Đòn phản kích cuồng nộ hủy diệt điểm số!",
      ultimateDmg: Math.round(stage.monster.atk * 1.8),
      quote: stage.monster.quote,
      defeatQuote: stage.monster.defeatQuote
    };

    // Configure Stage Map
    this.selectedMap = {
      id: stage.id,
      name: stage.name,
      gradient: stage.bgGradient,
      badge: stage.badge,
      desc: stage.chapterName
    };

    // Configure Question Pack for this chapter
    this.activePackId = stage.packId || "hust_all";

    // Restock consumables for this stage (with relic buffs)
    const hasClover = this.hasRelic("relic_clover");
    this.campaignItems = {
      potion: 2 + (hasClover ? 1 : 0),
      banish: 1 + (hasClover ? 1 : 0),
      shield: 1,
      freeze: 1
    };
    this.activeShield = false;
    this.monsterRage = 0;
    this.isMonsterEnraged = false;
    this.monsterIsStunned = false;

    // Set combat state
    this.team1State.energy = 0;
    this.team1State.combo = 0;
    this.team1State.correctCount = 0;
    this.team1State.totalDmg = 0;

    this.team2State = {
      hp: stage.monster.hp,
      maxHp: stage.monster.hp,
      energy: 0,
      combo: 0,
      correctCount: 0,
      totalDmg: 0
    };

    // Close any open modals
    const mClear = document.getElementById("modal-stage-clear");
    const mOver = document.getElementById("modal-game-over");
    if (mClear) mClear.classList.add("hidden");
    if (mOver) mOver.classList.add("hidden");

    // Transition into Versus Screen
    this.enterVersusTransition();
  }

  retryCurrentCampaignStage() {
    const mOver = document.getElementById("modal-game-over");
    if (mOver) mOver.classList.add("hidden");
    this.team1State.hp = 100;
    this.startCampaignStage(this.currentCampaignStage);
  }

  proceedToNextStage() {
    const mClear = document.getElementById("modal-stage-clear");
    if (mClear) mClear.classList.add("hidden");
    const nextStage = this.currentCampaignStage + 1;
    if (nextStage <= (this.totalCampaignStages || 24)) {
      this.startCampaignStage(nextStage);
    } else {
      this.returnToCampaignMap();
    }
  }

  handleCampaignStageClear() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const stages = (typeof window !== "undefined" && window.CAMPAIGN_STAGES)
      ? window.CAMPAIGN_STAGES
      : (typeof CAMPAIGN_STAGES !== "undefined" ? CAMPAIGN_STAGES : []);

    const stage = stages.find(s => s.stage === this.currentCampaignStage) || stages[0];

    // Fanfare & SFX
    if (window.gameAudio) {
      window.gameAudio.stopBGM();
      if (typeof window.gameAudio.playStageClear === "function") {
        window.gameAudio.playStageClear();
      } else {
        window.gameAudio.playVictory();
      }
    }

    // Scoring & Heal bonus
    this.campaignScore += stage.bonusScore;
    this.team1State.hp = Math.min(100, this.team1State.hp + 35);

    // Progression Unlock (up to 24 stages)
    const maxStages = this.totalCampaignStages || 24;
    if (this.currentCampaignStage >= this.unlockedStageMax) {
      this.unlockedStageMax = Math.min(maxStages, this.currentCampaignStage + 1);
      this.saveCampaignProgress();
    }

    // Check if player cleared Stage 24 (Ultimate Grand Clear!)
    if (this.currentCampaignStage >= maxStages) {
      alert("🎉 ĐẠI PHÁ ĐẢO TOÀN DIỆN 24 ẢI BÁCH KHOA! BẠN CHÍNH THỨC TRỞ THÀNH ĐỆ NHẤT THỦ KHOA PHÁP LUẬT ĐẠI CƯƠNG TOÀN KHÓA ĐHBK HÀ NỘI!");
      this.openSaveScoreModal("campaign");
      return;
    }

    // Trigger Relic Pick modal before stage clear summary
    this.openRelicPickModal();
    return;

    // Populate and open stage clear modal
    const avatarEl = document.getElementById("stage-clear-monster-avatar");
    const nameEl = document.getElementById("stage-clear-monster-name");
    const quoteEl = document.getElementById("stage-clear-monster-quote");
    const bonusEl = document.getElementById("stage-clear-bonus-pts");
    const totalEl = document.getElementById("stage-clear-total-pts");

    if (avatarEl) avatarEl.src = stage.monster.avatar;
    if (nameEl) nameEl.textContent = stage.monster.name;
    if (quoteEl) quoteEl.textContent = `"${stage.monster.defeatQuote || stage.monster.quote}"`;
    if (bonusEl) bonusEl.textContent = `+${stage.bonusScore} PTS`;
    if (totalEl) totalEl.textContent = `${this.campaignScore.toLocaleString()} PTS`;

    const modal = document.getElementById("modal-stage-clear");
    if (modal) modal.classList.remove("hidden");
  }

  handleCampaignGameOver() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const stages = (typeof window !== "undefined" && window.CAMPAIGN_STAGES)
      ? window.CAMPAIGN_STAGES
      : (typeof CAMPAIGN_STAGES !== "undefined" ? CAMPAIGN_STAGES : []);

    const stage = stages.find(s => s.stage === this.currentCampaignStage) || stages[0];

    // Audio: Taunt & Defeat SFX
    if (window.gameAudio) {
      window.gameAudio.stopBGM();
      if (typeof window.gameAudio.playTaunt === "function") {
        window.gameAudio.playTaunt();
      }
      setTimeout(() => {
        if (typeof window.gameAudio.playGameOver === "function") {
          window.gameAudio.playGameOver();
        } else {
          window.gameAudio.playWrong();
        }
      }, 500);
    }

    // Ego taunts (Kích thích tính hiếu thắng cực độ của sinh viên HUST)
    const egoTaunts = [
      "Mới Ải 1 về Nguồn gốc Nhà nước mà đã ngã ngựa? Có dám đứng lên phục thù không?",
      "Quốc hội và Chính phủ ai to hơn còn chưa phân biệt được? Quay về thư viện đọc lại đi!",
      "Vi phạm pháp luật thì phải chịu chế tài nghiêm khắc! Điểm F đang vẫy chào bạn kìa!",
      "Khổng lồ Án lệ quá cứng đúng không? Common Law không dành cho kẻ yếu tim!",
      "Tội phạm đặc biệt nghiêm trọng đã kết liễu bạn! Có bản lĩnh thì bấm PHỤC THÙ ngay!",
      "Toàn bộ tri thức của bạn đã bị sao chép lậu và xóa sổ! Thất bại cay đắng chưa?",
      "Chỉ còn một bước nữa là bạn trở thành THỦ KHOA HUST, vậy mà lại gục ngã trước Ma Vương Điểm F! Cực kỳ cay cú đúng không? Phục thù ngay!"
    ];
    const tauntText = egoTaunts[this.currentCampaignStage - 1] || stage.monster.quote;

    // Populate and open game over modal
    const avatarEl = document.getElementById("gameover-monster-avatar");
    const nameEl = document.getElementById("gameover-monster-name");
    const quoteEl = document.getElementById("gameover-monster-quote");
    const stageEl = document.getElementById("gameover-stage-reached");
    const scoreEl = document.getElementById("gameover-total-score");
    const comboEl = document.getElementById("gameover-max-combo");

    if (avatarEl) avatarEl.src = stage.monster.avatar;
    if (nameEl) nameEl.textContent = stage.monster.name;
    if (quoteEl) quoteEl.textContent = `"${tauntText}"`;
    if (stageEl) stageEl.textContent = `Ải ${this.currentCampaignStage} - ${stage.chapter}`;
    if (scoreEl) scoreEl.textContent = `${this.campaignScore.toLocaleString()} PTS`;
    if (comboEl) comboEl.textContent = `x${this.campaignMaxCombo}`;

    const modal = document.getElementById("modal-game-over");
    if (modal) modal.classList.remove("hidden");
  }

  // ==========================================================================
  // SỰ HƯNG PHẤN & TÍNH HIẾU THẮNG (COMBO ANNOUNCER, CLUTCH & CHALLENGE SHARE)
  // ==========================================================================

  showComboAnnouncer(combo) {
    if (combo < 2) return;
    const announcerEl = document.getElementById("combo-streak-announcer");
    const titleEl = document.getElementById("combo-streak-title");
    const subtitleEl = document.getElementById("combo-streak-subtitle");
    if (!announcerEl || !titleEl) return;

    let title = "DOUBLE KILL!";
    let subtitle = "🔥 SONG SÁT TRI THỨC (+20% DMG)!";
    let colorClass = "text-amber-300 drop-shadow-[0_0_25px_rgba(251,191,36,0.9)]";

    if (combo === 2) {
      title = "DOUBLE KILL!";
      subtitle = "🔥 SONG SÁT TRI THỨC (+20% DMG)!";
    } else if (combo === 3) {
      title = "TRIPLE KILL!";
      subtitle = "⚡ TAM KÍCH TUYỆT ĐỈNH (+40% DMG)!";
      colorClass = "text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.9)]";
    } else if (combo === 4) {
      title = "QUADRA KILL!";
      subtitle = "🌪️ TỨ ĐOÁN XUẤT THẦN (+60% DMG)!";
      colorClass = "text-orange-400 drop-shadow-[0_0_35px_rgba(251,146,60,0.9)]";
    } else if (combo === 5) {
      title = "PENTA KILL!";
      subtitle = "👑 NGŨ LÔI PHÁN XÉT (+80% DMG)!";
      colorClass = "text-rose-400 drop-shadow-[0_0_40px_rgba(251,113,133,0.95)]";
    } else if (combo >= 6) {
      title = "GODLIKE!";
      subtitle = "💥 THẦN THÁNH BÁCH KHOA (SÁT THƯƠNG x2.0)!";
      colorClass = "text-purple-300 drop-shadow-[0_0_50px_rgba(216,180,254,1)]";
    }

    titleEl.className = `text-4xl sm:text-6xl md:text-7xl font-black font-arcade uppercase tracking-wider stroke-text ${colorClass}`;
    titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;

    announcerEl.classList.remove("hidden");
    if (window.gameAudio && typeof window.gameAudio.playComboStreak === "function") {
      window.gameAudio.playComboStreak(combo);
    }

    if (this.comboAnnouncerTimeout) clearTimeout(this.comboAnnouncerTimeout);
    this.comboAnnouncerTimeout = setTimeout(() => {
      announcerEl.classList.add("hidden");
    }, 1200);
  }

  flashGoldenScreen() {
    const flashEl = document.getElementById("screen-flash-overlay");
    if (!flashEl) return;
    flashEl.classList.remove("opacity-0");
    flashEl.classList.add("opacity-100");
    setTimeout(() => {
      flashEl.classList.remove("opacity-100");
      flashEl.classList.add("opacity-0");
    }, 300);
  }

  copyShareChallengeText(type = "stageclear") {
    const isStageClear = type === "stageclear";
    const stages = (typeof window !== "undefined" && window.CAMPAIGN_STAGES)
      ? window.CAMPAIGN_STAGES
      : (typeof CAMPAIGN_STAGES !== "undefined" ? CAMPAIGN_STAGES : []);
    const stage = stages.find(s => s.stage === this.currentCampaignStage) || stages[0];

    const shareUrl = "https://dau-truong-tri-thuc-hust.netlify.app/game";
    let text = "";

    if (isStageClear) {
      const isBoss = this.currentCampaignStage >= 7;
      text = isBoss
        ? `👑 [ĐẤU TRƯỜNG TRI THỨC HUST - BẢNG VÀNG THỦ KHOA]\nTôi vừa ĐẠI PHÁ MA VƯƠNG ĐIỂM F tại Đấu Trường Tri Thức HUST với ${this.campaignScore.toLocaleString()} PTS!\n👉 Đố bạn vượt qua kỷ lục này: ${shareUrl}`
        : `🔥 [ĐẤU TRƯỜNG TRI THỨC HUST - THÁCH ĐẤU ĐUA TOP]\nTôi vừa chém gục ${stage.monster.name} tại Ải ${this.currentCampaignStage} (${stage.chapterName}) với ${this.campaignScore.toLocaleString()} PTS (Combo x${this.campaignMaxCombo})!\n👉 Bạn có dám vào hạ gục kỷ lục của tôi không: ${shareUrl}`;
    } else {
      text = `🆘 [ĐẤU TRƯỜNG TRI THỨC HUST - CẦN VIỆN BINH BÁCH KHOA]\nTôi vừa bị ${stage.monster.name} hạ sát cay đắng tại Ải ${this.currentCampaignStage}!\n👉 Có ai đủ bản lĩnh vào báo thù giúp tôi không: ${shareUrl}`;
    }

    const nav = (typeof window !== "undefined" && window.navigator) 
      ? window.navigator 
      : (typeof navigator !== "undefined" ? navigator : null);

    if (nav && nav.clipboard && nav.clipboard.writeText) {
      nav.clipboard.writeText(text).then(() => {
        alert("✨ Đã sao chép lời thách đấu vào bộ nhớ tạm!\nHãy dán (Ctrl+V) vào nhóm Zalo / Facebook / Messenger để rủ bạn bè vào đua top!");
      }).catch(() => {
        if (typeof prompt !== "undefined") prompt("Sao chép lời thách đấu dưới đây để gửi bạn bè:", text);
      });
    } else if (typeof prompt !== "undefined") {
      prompt("Sao chép lời thách đấu dưới đây để gửi bạn bè:", text);
    }
    return text;
  }

  // ==========================================================================
  // BẢNG XẾP HẠNG ĐUA TOP (LEADERBOARD CONTROLLER - REAL USERS ONLY)
  // ==========================================================================

  getOrCreateDeviceId() {
    try {
      let id = localStorage.getItem("HUST_ARENA_DEVICE_ID");
      if (!id) {
        id = "dev_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
        localStorage.setItem("HUST_ARENA_DEVICE_ID", id);
      }
      return id;
    } catch (e) {
      return "dev_guest";
    }
  }

  loadLeaderboard() {
    const fakeNames = ["Nguyễn Minh Trí", "Trần Thu Hà", "Lê Quốc Bảo", "Hoàng Anh Tuấn", "Đặng Thùy Dung"];
    try {
      const saved = localStorage.getItem("hust_arena_leaderboard");
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Strictly eliminate any mock/seed data and any 1v1 PvP records
          this.leaderboardData = parsed.filter(r => 
            r && 
            r.id && 
            !String(r.id).startsWith("lead_") && 
            !fakeNames.includes(String(r.name).trim()) &&
            r.mode !== "pvp"
          );
        } else {
          this.leaderboardData = [];
        }
      } else {
        this.leaderboardData = [];
      }
      this.saveLeaderboard();
    } catch (e) {
      this.leaderboardData = [];
    }

    // Also fetch online real user leaderboard from serverless API
    this.fetchOnlineLeaderboard();
  }

  getLeaderboardApiUrl() {
    if (typeof window !== "undefined") {
      if (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "https://dau-truong-tri-thuc-hust.netlify.app/api/leaderboard";
      }
    }
    return "/api/leaderboard";
  }

  async fetchOnlineLeaderboard() {
    try {
      const res = await fetch(this.getLeaderboardApiUrl(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        let remoteScores = [];
        if (Array.isArray(data)) {
          remoteScores = data;
        } else if (data && Array.isArray(data.leaderboard)) {
          remoteScores = data.leaderboard;
          if (data.clientIp) this.currentClientIp = data.clientIp;
          if (data.clientIpFull) this.currentClientIpFull = data.clientIpFull;
          if (data.myIpStats) this.myIpStats = data.myIpStats;
        }

        if (Array.isArray(remoteScores)) {
          const fakeNames = ["Nguyễn Minh Trí", "Trần Thu Hà", "Lê Quốc Bảo", "Hoàng Anh Tuấn", "Đặng Thùy Dung"];
          const validRemote = remoteScores.filter(s => 
            s && 
            s.id && 
            !String(s.id).startsWith("lead_") && 
            !fakeNames.includes(String(s.name).trim()) &&
            s.mode !== "pvp"
          );
          
          const map = new Map();
          (this.leaderboardData || []).forEach(item => {
            if (item && item.id) map.set(item.id, item);
          });
          validRemote.forEach(item => {
            if (item && item.id) map.set(item.id, item);
          });

          this.leaderboardData = Array.from(map.values()).sort((a, b) => (b.score || 0) - (a.score || 0));
          if (this.leaderboardData.length > 50) {
            this.leaderboardData = this.leaderboardData.slice(0, 50);
          }
          this.saveLeaderboard();
          this.renderLeaderboard();
        }
      }
    } catch (e) {
      // Offline fallback
    }
  }

  saveLeaderboard() {
    try {
      localStorage.setItem("hust_arena_leaderboard", JSON.stringify(this.leaderboardData || []));
    } catch (e) {}
  }

  addLeaderboardRecord(name, className) {
    const fakeNames = ["Nguyễn Minh Trí", "Trần Thu Hà", "Lê Quốc Bảo", "Hoàng Anh Tuấn", "Đặng Thùy Dung"];
    const realName = (name || "").trim() || "Dũng Sĩ HUST";
    if (fakeNames.includes(realName)) {
      alert("Hệ thống chỉ ghi nhận dữ liệu từ người chơi thực tế, không sử dụng tên mẫu!");
      return;
    }

    const finalScore = this.campaignScore || Math.round((this.team1State.correctCount * 380) + (this.team1State.totalDmg * 15));
    const totalQ = Math.max(1, this.questionIndex);
    const accPct = Math.min(100, Math.round((this.team1State.correctCount / totalQ) * 100));

    const stageMax = this.totalCampaignStages || 24;
    const isCompleted = this.currentCampaignStage >= stageMax;
    const myDeviceId = this.getOrCreateDeviceId();

    const record = {
      id: "rec_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: realName,
      className: (className || "").trim() || "HUST",
      heroId: this.team1Hero ? this.team1Hero.id : "bachkhoa",
      heroName: this.team1Hero ? this.team1Hero.name : "Học Thần HUST",
      heroAvatar: this.team1Hero ? this.team1Hero.avatar : "assets/avatars/bachkhoa.jpg",
      mode: "campaign",
      modeName: "Vượt Ải",
      stageReached: this.currentCampaignStage || 1,
      stageName: isCompleted ? `Ải ${this.currentCampaignStage} (Đại Phá Đảo)` : `Ải ${this.currentCampaignStage}`,
      score: Math.max(500, finalScore),
      maxCombo: this.campaignMaxCombo || this.team1State.combo,
      correctCount: this.team1State.correctCount,
      accuracy: `${accPct}%`,
      deviceId: myDeviceId,
      date: new Date().toLocaleDateString("vi-VN")
    };

    if (!Array.isArray(this.leaderboardData)) {
      this.leaderboardData = [];
    }

    // Cơ chế bảo vệ bất biến: Nếu người chơi đã có tên trên Bảng Vàng, chỉ cập nhật khi đạt ĐIỂM CAO HƠN
    const existingIndex = this.leaderboardData.findIndex(r => 
      r && r.name && r.name.toLowerCase() === realName.toLowerCase() &&
      String(r.className || '').trim().toLowerCase() === String(className || '').trim().toLowerCase()
    );

    if (existingIndex !== -1) {
      const existing = this.leaderboardData[existingIndex];
      if (record.score > existing.score) {
        record.id = existing.id; // Bảo lưu định danh
        this.leaderboardData[existingIndex] = record;
      } else {
        alert(`Kỷ lục trước đó của bạn (${existing.score.toLocaleString()} PTS) cao hơn điểm số trận này (${record.score.toLocaleString()} PTS). Hệ thống luôn bảo lưu thành tích cao nhất của bạn!`);
        return;
      }
    } else {
      this.leaderboardData.push(record);
    }

    this.leaderboardData.sort((a, b) => b.score - a.score);
    if (this.leaderboardData.length > 100) {
      this.leaderboardData = this.leaderboardData.slice(0, 100);
    }
    this.saveLeaderboard();
    this.renderLeaderboard();

    // Đồng bộ lên máy chủ Netlify Blobs theo IP và thiết bị
    fetch(this.getLeaderboardApiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    })
    .then(r => r.json())
    .then(data => {
      if (data && data.success) {
        if (data.myIpStats) {
          this.myIpStats = data.myIpStats;
        }
        if (data.isHigher) {
          if (window.gameAudio && typeof window.gameAudio.playVictory === "function") {
            window.gameAudio.playVictory();
          }
          alert("🎉 ĐỒNG BỘ THÀNH CÔNG THEO IP MÁY!\n" + data.message);
        }
        this.fetchOnlineLeaderboard();
      }
    })
    .catch(() => {});
  }

  openSaveScoreModal(mode = null) {
    const avatarEl = document.getElementById("save-score-hero-avatar");
    const nameEl = document.getElementById("save-score-hero-name");
    const modeBadge = document.getElementById("save-score-mode-badge");
    const ptsBadge = document.getElementById("save-score-pts-badge");
    const stageBadge = document.getElementById("save-score-stage-badge");
    const comboBadge = document.getElementById("save-score-combo-badge");
    const accBadge = document.getElementById("save-score-acc-badge");

    const hero = this.team1Hero || (HEROES_DATA && HEROES_DATA[0]);
    if (avatarEl && hero) avatarEl.src = hero.avatar;
    if (nameEl && hero) nameEl.textContent = hero.name;

    const finalScore = this.campaignScore || Math.round((this.team1State.correctCount * 380) + (this.team1State.totalDmg * 15));
    const totalQ = Math.max(1, this.questionIndex);
    const accPct = Math.min(100, Math.round((this.team1State.correctCount / totalQ) * 100));

    if (modeBadge) modeBadge.textContent = "Chế độ: Vượt Ải Diệt Quái";
    if (ptsBadge) ptsBadge.textContent = `${Math.max(500, finalScore).toLocaleString()} PTS`;
    if (stageBadge) stageBadge.textContent = this.currentCampaignStage >= (this.totalCampaignStages || 24) ? `Ải ${this.currentCampaignStage} (Phá Đảo)` : `Ải ${this.currentCampaignStage} / ${this.totalCampaignStages || 24}`;
    if (comboBadge) comboBadge.textContent = `x${this.campaignMaxCombo}`;
    if (accBadge) accBadge.textContent = `${accPct}%`;

    const modal = document.getElementById("modal-save-score");
    if (modal) modal.classList.remove("hidden");
  }

  renderLeaderboard(filter = null) {
    const fakeNames = ["Nguyễn Minh Trí", "Trần Thu Hà", "Lê Quốc Bảo", "Hoàng Anh Tuấn", "Đặng Thùy Dung"];
    let records = (this.leaderboardData || []).filter(r => 
      r && 
      r.id && 
      !String(r.id).startsWith("lead_") && 
      !fakeNames.includes(String(r.name).trim()) &&
      r.mode !== "pvp"
    );
    records.sort((a, b) => (b.score || 0) - (a.score || 0));

    const countEl = document.getElementById("lb-records-count");
    if (countEl) countEl.textContent = `Đang hiển thị: ${records.length} kỷ lục thật`;

    // Cập nhật thông số thiết bị / IP hiện tại
    const ipTextEl = document.getElementById("lb-client-ip-text");
    const myBestEl = document.getElementById("lb-my-best-score");
    const myRunsEl = document.getElementById("lb-my-total-runs");

    if (ipTextEl) ipTextEl.textContent = this.currentClientIp || "Đã kết nối";
    if (myBestEl) {
      if (this.myIpStats && this.myIpStats.bestScore) {
        myBestEl.textContent = `${this.myIpStats.bestScore.toLocaleString()} PTS`;
      } else {
        const myDevId = this.getOrCreateDeviceId();
        const myRec = (this.leaderboardData || []).find(r => r && (r.deviceId === myDevId || (r.ipMasked && r.ipMasked === this.currentClientIp)));
        myBestEl.textContent = myRec ? `${myRec.score.toLocaleString()} PTS` : "Chưa có";
      }
    }
    if (myRunsEl) {
      myRunsEl.textContent = this.myIpStats && this.myIpStats.totalRuns ? `${this.myIpStats.totalRuns} trận` : "1 trận";
    }

    // 1. Render Top 3 Podium
    const podiumEl = document.getElementById("leaderboard-podium");
    if (podiumEl) {
      const top1 = records[0] || null;
      const top2 = records[1] || null;
      const top3 = records[2] || null;

      // Card Rank 2 (Silver)
      const rank2Html = top2 ? `
        <div class="order-2 md:order-1 p-3.5 rounded-2xl bg-gradient-to-t from-slate-900 to-slate-800/90 border border-slate-600/60 shadow-lg text-center flex flex-col items-center">
          <div class="w-7 h-7 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-black text-xs shadow mb-2">2</div>
          <div class="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-slate-400 to-slate-200 border-2 border-slate-300 shadow-md mb-2">
            <img src="${top2.heroAvatar}" alt="${top2.name}" class="w-full h-full object-cover rounded-full">
          </div>
          <div class="font-black text-sm text-slate-100 truncate max-w-[180px]">${top2.name}</div>
          <div class="text-[11px] text-slate-400 truncate max-w-[180px]">${top2.className || 'HUST'}</div>
          <div class="mt-2 text-base font-black text-slate-200 font-arcade">${top2.score.toLocaleString()} PTS</div>
          <div class="text-[10px] text-slate-400 mt-0.5">${top2.stageName} • ${top2.accuracy || '100%'}</div>
        </div>
      ` : `
        <div class="order-2 md:order-1 p-3.5 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 shadow-md text-center flex flex-col items-center opacity-70">
          <div class="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-black text-xs mb-2">2</div>
          <div class="w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed border-slate-600 bg-slate-800/50 text-slate-500 text-xl mb-2">
            <i class="fa-solid fa-medal"></i>
          </div>
          <div class="font-bold text-xs text-slate-400">Chờ Dũng Sĩ #2</div>
          <div class="text-[10px] text-slate-500">Chưa có người chơi</div>
          <div class="mt-2 text-sm font-bold text-slate-500 font-arcade">--- PTS</div>
          <div class="text-[10px] text-slate-600 mt-0.5">Vị trí mở</div>
        </div>
      `;

      // Card Rank 1 (Gold - Elevated)
      const rank1Html = top1 ? `
        <div class="order-1 md:order-2 p-4 rounded-3xl bg-gradient-to-t from-amber-950/80 via-slate-900 to-amber-900/40 border-2 border-amber-400 shadow-2xl shadow-amber-500/25 text-center flex flex-col items-center relative -translate-y-2">
          <div class="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
            👑 QUÁN QUÂN BẢNG VÀNG
          </div>
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg mb-2 mt-2">1</div>
          <div class="w-20 h-20 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 border-2 border-white shadow-xl shadow-amber-500/40 mb-2">
            <img src="${top1.heroAvatar}" alt="${top1.name}" class="w-full h-full object-cover rounded-full">
          </div>
          <div class="font-black text-base text-amber-300 truncate max-w-[200px]">${top1.name}</div>
          <div class="text-xs text-amber-200/80 truncate max-w-[200px]">${top1.className || 'HUST'}</div>
          <div class="mt-2 text-xl font-black text-amber-400 font-arcade neon-text-gold">${top1.score.toLocaleString()} PTS</div>
          <div class="text-[11px] text-emerald-400 font-bold mt-0.5">${top1.stageName} • Đúng: ${top1.accuracy || '100%'}</div>
        </div>
      ` : `
        <div class="order-1 md:order-2 p-4 rounded-3xl bg-slate-900/70 border-2 border-dashed border-amber-500/40 shadow-xl text-center flex flex-col items-center relative -translate-y-2">
          <div class="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black text-[10px] uppercase tracking-wider shadow">
            👑 ĐANG CHỜ THỦ KHOA
          </div>
          <div class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm mb-2 mt-2">1</div>
          <div class="w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed border-amber-400/60 bg-amber-500/10 text-amber-400 text-3xl mb-2">
            <i class="fa-solid fa-crown"></i>
          </div>
          <div class="font-bold text-sm text-amber-300">Chờ Quán Quân Đầu Tiên</div>
          <div class="text-xs text-slate-400">Hãy thi đấu để ghi danh #1!</div>
          <div class="mt-2 text-lg font-black text-amber-500/60 font-arcade">--- PTS</div>
          <div class="text-[11px] text-amber-400/70 mt-0.5">Dành cho người chơi thật</div>
        </div>
      `;

      // Card Rank 3 (Bronze)
      const rank3Html = top3 ? `
        <div class="order-3 md:order-3 p-3.5 rounded-2xl bg-gradient-to-t from-slate-900 to-slate-800/90 border border-amber-700/60 shadow-lg text-center flex flex-col items-center">
          <div class="w-7 h-7 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-black text-xs shadow mb-2">3</div>
          <div class="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-700 to-amber-600 border-2 border-amber-600 shadow-md mb-2">
            <img src="${top3.heroAvatar}" alt="${top3.name}" class="w-full h-full object-cover rounded-full">
          </div>
          <div class="font-black text-sm text-slate-100 truncate max-w-[180px]">${top3.name}</div>
          <div class="text-[11px] text-slate-400 truncate max-w-[180px]">${top3.className || 'HUST'}</div>
          <div class="mt-2 text-base font-black text-amber-500 font-arcade">${top3.score.toLocaleString()} PTS</div>
          <div class="text-[10px] text-slate-400 mt-0.5">${top3.stageName} • ${top3.accuracy || '100%'}</div>
        </div>
      ` : `
        <div class="order-3 md:order-3 p-3.5 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 shadow-md text-center flex flex-col items-center opacity-70">
          <div class="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-black text-xs mb-2">3</div>
          <div class="w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed border-slate-600 bg-slate-800/50 text-slate-500 text-xl mb-2">
            <i class="fa-solid fa-award"></i>
          </div>
          <div class="font-bold text-xs text-slate-400">Chờ Dũng Sĩ #3</div>
          <div class="text-[10px] text-slate-500">Chưa có người chơi</div>
          <div class="mt-2 text-sm font-bold text-slate-500 font-arcade">--- PTS</div>
          <div class="text-[10px] text-slate-600 mt-0.5">Vị trí mở</div>
        </div>
      `;

      podiumEl.innerHTML = rank2Html + rank1Html + rank3Html;
    }

    // 2. Render Leaderboard Table Body
    const tbody = document.getElementById("leaderboard-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (records.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-12 px-4 text-center">
            <div class="flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-3">
              <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl shadow-lg shadow-amber-500/10">
                <i class="fa-solid fa-trophy"></i>
              </div>
              <div class="text-base font-bold text-slate-200">Chưa có kỷ lục nào từ người dùng thật</div>
              <p class="text-xs text-slate-400 leading-relaxed">
                Hệ thống chỉ chấp nhận dữ liệu thi đấu thực tế từ người chơi.<br>
                Hãy chiến đấu ngay để trở thành dũng sĩ đầu tiên vinh danh trên Bảng Vàng!
              </p>
              <button onclick="arenaEngine.startCampaignFlow()" class="mt-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-lg shadow-rose-900/30 transition-all flex items-center gap-2">
                <i class="fa-solid fa-dragon"></i> VÀO CHIẾN DỊCH VƯỢT ẢI ĐỂ GHI DANH
              </button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    records.forEach((rec, idx) => {
      const rank = idx + 1;
      const rankBadge = rank === 1 ? '🥇 #1' : rank === 2 ? '🥈 #2' : rank === 3 ? '🥉 #3' : `#${rank}`;
      const rankColor = rank === 1 ? 'text-amber-400 font-black' : rank === 2 ? 'text-slate-300 font-black' : rank === 3 ? 'text-amber-600 font-black' : 'text-slate-400';

      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-800/40 transition-colors";
      const myDevId = this.getOrCreateDeviceId();
      const isMyMachine = (rec.deviceId && rec.deviceId === myDevId) || (rec.ipMasked && this.currentClientIp && rec.ipMasked === this.currentClientIp);

      tr.innerHTML = `
        <td class="py-3 px-3 text-center ${rankColor}">${rankBadge}</td>
        <td class="py-3 px-3">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-slate-100 text-xs sm:text-sm">${rec.name}</span>
            ${isMyMachine ? '<span class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-xs">⭐ Máy Của Bạn</span>' : ''}
          </div>
          <div class="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
            <span>${rec.className || 'HUST'}</span>
            <span class="text-[10px] text-slate-500 font-mono inline-flex items-center gap-1">
              <i class="fa-solid fa-network-wired text-[9px] text-slate-600"></i> ${rec.ipMasked || 'IP Thật'}
            </span>
          </div>
        </td>
        <td class="py-3 px-3">
          <div class="flex items-center gap-2">
            <img src="${rec.heroAvatar}" alt="${rec.heroName}" class="w-6 h-6 rounded-full object-cover border border-slate-700">
            <span class="text-xs text-slate-300 font-medium hidden sm:inline">${rec.heroName}</span>
          </div>
        </td>
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            ${rec.stageName || 'Vượt Ải'}
          </span>
          <span class="text-[11px] text-slate-400 ml-1.5 hidden md:inline">Đúng: ${rec.accuracy || '100%'} (x${rec.maxCombo || 0})</span>
        </td>
        <td class="py-3 px-3 text-right font-black font-arcade text-amber-400 text-sm">
          ${rec.score.toLocaleString()}
        </td>
        <td class="py-3 px-3 text-center text-slate-500 text-[11px]">
          ${rec.date || '---'}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ==========================================================================
  // QUIZ RPG ITEMS, RELICS & SCREEN SHAKE METHODS
  // ==========================================================================

  hasRelic(relicId) {
    return this.campaignRelics && this.campaignRelics.some(r => r.id === relicId);
  }

  useItemPotion() {
    if (this.currentScreen !== "screen-battle" || this.campaignItems.potion <= 0) return;
    if (this.team1State.hp >= this.team1State.maxHp) {
      this.showCombatToast("💖 Máu của bạn đã đầy!", "amber");
      return;
    }

    this.campaignItems.potion--;
    this.team1State.hp = Math.min(this.team1State.maxHp, this.team1State.hp + 35);

    if (window.gameAudio && typeof window.gameAudio.playHeal === "function") {
      window.gameAudio.playHeal();
    }

    this.spawnFloatingDamage(1, "+35 HP 💖", true);
    this.updateBattleHUD();
    this.updateCampaignItemsUI();
    this.showCombatToast("🧪 Đã uống Bình Dược: Hồi phục +35 HP!", "emerald");
  }

  useItemBanish() {
    if (this.currentScreen !== "screen-battle" || this.isQuestionResolved || this.campaignItems.banish <= 0) return;
    if (!this.activeQuestion) return;

    this.campaignItems.banish--;

    // Identify wrong options
    const correctIdx = this.activeQuestion.answer;
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
    this.shuffleArray(wrongIndices);
    const toBanish = wrongIndices.slice(0, 2);

    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, idx) => {
      if (toBanish.includes(idx)) {
        btn.classList.add("opacity-20", "pointer-events-none", "line-through");
        btn.style.filter = "grayscale(1)";
      }
    });

    if (window.gameAudio && typeof window.gameAudio.playShield === "function") {
      window.gameAudio.playShield();
    }

    this.updateCampaignItemsUI();
    this.showCombatToast("🔮 Kính Chiếu Yêu đã triệt tiêu 2 đáp án sai!", "purple");
  }

  useItemShield() {
    if (this.currentScreen !== "screen-battle" || this.isQuestionResolved || this.campaignItems.shield <= 0 || this.activeShield) return;

    this.campaignItems.shield--;
    this.activeShield = true;

    if (window.gameAudio && typeof window.gameAudio.playShield === "function") {
      window.gameAudio.playShield();
    }

    // Glow effect on hero card
    const fighterEl = document.getElementById("t1-fighter-card");
    if (fighterEl) {
      fighterEl.classList.add("animate-shield");
    }

    this.updateCampaignItemsUI();
    this.showCombatToast("🛡️ Kim Cang Hộ Thể kích hoạt! Chặn 100% phản kích nếu sai câu này!", "amber");
  }

  useItemFreeze() {
    if (this.currentScreen !== "screen-battle" || this.isQuestionResolved || this.campaignItems.freeze <= 0) return;

    this.campaignItems.freeze--;
    this.turnTimer += 15;
    this.updateTimerDisplay();

    if (window.gameAudio && typeof window.gameAudio.playShuffle === "function") {
      window.gameAudio.playShuffle();
    }

    this.updateCampaignItemsUI();
    this.showCombatToast("⏳ Thời Gian Ngưng Đọng: Thêm +15 giây suy nghĩ!", "cyan");
  }

  updateCampaignItemsUI() {
    const pCount = document.getElementById("item-count-potion");
    const bCount = document.getElementById("item-count-banish");
    const sCount = document.getElementById("item-count-shield");
    const fCount = document.getElementById("item-count-freeze");

    if (pCount) pCount.textContent = this.campaignItems.potion;
    if (bCount) bCount.textContent = this.campaignItems.banish;
    if (sCount) sCount.textContent = this.campaignItems.shield;
    if (fCount) fCount.textContent = this.campaignItems.freeze;

    const btnP = document.getElementById("btn-item-potion");
    const btnB = document.getElementById("btn-item-banish");
    const btnS = document.getElementById("btn-item-shield");
    const btnF = document.getElementById("btn-item-freeze");

    if (btnP) btnP.disabled = this.campaignItems.potion <= 0;
    if (btnB) btnB.disabled = this.campaignItems.banish <= 0;
    if (btnS) btnS.disabled = this.campaignItems.shield <= 0 || this.activeShield;
    if (btnF) btnF.disabled = this.campaignItems.freeze <= 0;
  }

  updateMonsterIntentUI() {
    const iconEl = document.getElementById("monster-intent-icon");
    const textEl = document.getElementById("monster-intent-text");
    const badgeEl = document.getElementById("monster-intent-badge");
    const fillEl = document.getElementById("monster-rage-fill");
    const rageTextEl = document.getElementById("monster-rage-text");
    const monsterCard = document.getElementById("t2-fighter-card");

    if (fillEl) fillEl.style.width = `${this.monsterRage}%`;
    if (rageTextEl) rageTextEl.textContent = `${this.monsterRage}%`;

    if (this.isMonsterEnraged) {
      if (iconEl) iconEl.textContent = "⚠️";
      if (textEl) textEl.textContent = `NỘ KHÍ ĐỈNH ĐIỂM: Đòn Cuồng Nộ x2 (~26 HP)!`;
      if (badgeEl) {
        badgeEl.className = "px-3 py-1 rounded-xl bg-rose-950 border-2 border-rose-500 text-rose-200 text-xs font-black shadow-2xl flex items-center gap-1.5 animate-bounce";
      }
      if (monsterCard) monsterCard.classList.add("animate-rage");
    } else {
      if (iconEl) iconEl.textContent = "🗡️";
      if (textEl) textEl.textContent = `Ý đồ: Tấn công ~${this.team2Hero ? this.team2Hero.atk : 10} HP`;
      if (badgeEl) {
        badgeEl.className = "px-3 py-1 rounded-xl bg-slate-950/95 border border-slate-700 text-slate-200 text-xs font-bold shadow-lg flex items-center gap-1.5 animate-fadeIn";
      }
      if (monsterCard) monsterCard.classList.remove("animate-rage");
    }
  }

  triggerScreenShake() {
    const stage = document.getElementById("battle-stage-container") || document.getElementById("screen-battle");
    if (!stage) return;
    stage.classList.add("animate-shake");
    setTimeout(() => stage.classList.remove("animate-shake"), 500);
  }

  showCombatToast(msg, color = "amber") {
    const banner = document.getElementById("combat-feedback-banner");
    if (!banner) return;
    banner.classList.remove("hidden");
    const colorClasses = {
      emerald: "bg-emerald-950 text-emerald-300 border-emerald-500",
      purple: "bg-purple-950 text-purple-300 border-purple-500",
      amber: "bg-amber-950 text-amber-300 border-amber-500",
      cyan: "bg-cyan-950 text-cyan-300 border-cyan-500",
      rose: "bg-rose-950 text-rose-300 border-rose-500"
    };
    banner.className = `py-2 px-4 rounded-xl border font-bold text-center text-xs animate-fadeIn ${colorClasses[color] || colorClasses.amber}`;
    banner.innerHTML = msg;
    setTimeout(() => {
      if (!this.isQuestionResolved) banner.classList.add("hidden");
    }, 2500);
  }

  // --- RELIC SELECTION MODAL LOGIC (ROGUELIKE LOOT) ---
  openRelicPickModal() {
    const modal = document.getElementById("modal-relic-pick");
    const grid = document.getElementById("relic-choices-grid");
    if (!modal || !grid) {
      this.openStageClearSummaryModal();
      return;
    }

    const allRelics = (typeof window !== "undefined" && window.CAMPAIGN_RELICS)
      ? window.CAMPAIGN_RELICS
      : (typeof CAMPAIGN_RELICS !== "undefined" ? CAMPAIGN_RELICS : []);

    // Filter relics player does not yet own
    const available = allRelics.filter(r => !this.hasRelic(r.id));
    if (available.length < 3) {
      // If player already owns most, just open summary
      this.openStageClearSummaryModal();
      return;
    }

    this.shuffleArray(available);
    const choices = available.slice(0, 3);

    grid.innerHTML = "";
    choices.forEach(relic => {
      const card = document.createElement("div");
      card.className = `p-4 rounded-2xl border-2 ${relic.border} bg-gradient-to-b from-slate-900 to-slate-950 shadow-xl hover:scale-102 transition-all cursor-pointer flex flex-col justify-between group`;
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[9px] font-black px-2 py-0.5 rounded bg-slate-800 text-amber-300 uppercase tracking-widest">${relic.tag}</span>
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr ${relic.color} flex items-center justify-center text-white shadow-md text-base">
              <i class="fa-solid ${relic.icon}"></i>
            </div>
          </div>
          <h4 class="font-black text-sm text-white group-hover:text-amber-300 transition-colors">${relic.name}</h4>
          <p class="text-xs text-slate-300 mt-1.5 leading-relaxed opacity-90">${relic.desc}</p>
        </div>
        <button onclick="arenaEngine.selectRelic('${relic.id}')" class="mt-4 w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:bg-amber-400 shadow-md transition-all">
          Chọn Cổ Vật Này
        </button>
      `;
      grid.appendChild(card);
    });

    modal.classList.remove("hidden");
  }

  selectRelic(relicId) {
    const allRelics = (typeof window !== "undefined" && window.CAMPAIGN_RELICS)
      ? window.CAMPAIGN_RELICS
      : (typeof CAMPAIGN_RELICS !== "undefined" ? CAMPAIGN_RELICS : []);

    const relic = allRelics.find(r => r.id === relicId);
    if (relic) {
      this.campaignRelics.push(relic);

      // Instant buff effects
      if (relic.type === "max_hp") {
        this.team1State.maxHp = 135;
        this.team1State.hp = 135;
      } else if (relic.type === "item_restock") {
        this.campaignItems.potion += 1;
        this.campaignItems.banish += 1;
      }

      if (window.gameAudio && typeof window.gameAudio.playChestOpen === "function") {
        window.gameAudio.playChestOpen();
      }
    }

    const modal = document.getElementById("modal-relic-pick");
    if (modal) modal.classList.add("hidden");

    this.renderRelicsUI();
    this.openStageClearSummaryModal();
  }

  renderRelicsUI() {
    const container = document.getElementById("campaign-relics-list");
    if (!container) return;
    container.innerHTML = "";

    if (this.campaignRelics.length === 0) {
      container.innerHTML = `<span class="text-[10px] text-slate-500 italic">Chưa có cổ vật</span>`;
      return;
    }

    this.campaignRelics.forEach(r => {
      const badge = document.createElement("span");
      badge.className = "px-2 py-0.5 rounded-lg bg-slate-900 border border-amber-400/50 text-amber-300 text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-default";
      badge.title = `${r.name}: ${r.desc}`;
      badge.innerHTML = `<i class="fa-solid ${r.icon} text-amber-400"></i><span>${r.name}</span>`;
      container.appendChild(badge);
    });
  }

  openStageClearSummaryModal() {
    const stages = (typeof window !== "undefined" && window.CAMPAIGN_STAGES)
      ? window.CAMPAIGN_STAGES
      : (typeof CAMPAIGN_STAGES !== "undefined" ? CAMPAIGN_STAGES : []);

    const stage = stages.find(s => s.stage === this.currentCampaignStage) || stages[0];

    const avatarEl = document.getElementById("stage-clear-monster-avatar");
    const nameEl = document.getElementById("stage-clear-monster-name");
    const quoteEl = document.getElementById("stage-clear-monster-quote");
    const bonusEl = document.getElementById("stage-clear-bonus-pts");
    const totalEl = document.getElementById("stage-clear-total-pts");

    if (avatarEl) avatarEl.src = stage.monster.avatar;
    if (nameEl) nameEl.textContent = stage.monster.name;
    if (quoteEl) quoteEl.textContent = `"${stage.monster.defeatQuote || stage.monster.quote}"`;
    if (bonusEl) bonusEl.textContent = `+${stage.bonusScore} PTS`;
    if (totalEl) totalEl.textContent = `${this.campaignScore.toLocaleString()} PTS`;

    const modal = document.getElementById("modal-stage-clear");
    if (modal) modal.classList.remove("hidden");
  }

  // KHÓA BẢO VỆ DỮ LIỆU BẤT BIẾN: Không cho phép xóa hoặc chỉnh sửa dữ liệu Bảng Xếp Hạng
  clearLeaderboardWithConfirm() {
    alert("🔒 BẢO MẬT BẤT BIẾN: Dữ liệu Bảng Xếp Hạng Đua Top Bách Khoa được bảo vệ vĩnh viễn trên máy chủ, không ai có quyền xóa bỏ hay thay đổi dữ liệu thi đấu thật!");
  }

  refreshLeaderboard() {
    this.loadLeaderboard();
    this.renderLeaderboard();
  }

  resetLeaderboardWithConfirm() {
    this.clearLeaderboardWithConfirm();
  }
}

// Global engine instance
if (typeof window !== "undefined") {
  window.KnowledgeArenaEngine = KnowledgeArenaEngine;
  window.arenaEngine = new KnowledgeArenaEngine();
}
if (typeof globalThis !== "undefined") {
  globalThis.KnowledgeArenaEngine = KnowledgeArenaEngine;
}
