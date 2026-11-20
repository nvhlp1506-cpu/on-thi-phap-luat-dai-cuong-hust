// ==========================================================================
// CỔNG ÔN THI KẾT THÚC HỌC PHẦN PHÁP LUẬT ĐẠI CƯƠNG - ĐH BÁCH KHOA HÀ NỘI
// Mã học phần: SSH1131 • SSH1130 • EM3211
// Logic điều khiển toàn diện 4 modules: Trắc nghiệm, Tra cứu, Sổ tay, Flashcard
// ==========================================================================

// Global State
let currentTab = 'quiz';
let quizMode = 'practice'; // 'practice' | 'exam'
let currentCategory = 'all';
let currentExamCode = 'HUST-KTPH-401';
let currentExamSize = 40;
let currentExamType = 'exam_set_1';

// Question Sets & Indices
let activeQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // { [qId]: optionIndex }
let markedForReview = new Set(); // Set of flagged qIds
let bookmarkedIds = new Set(); // Set of bookmarked qIds
let mistakeIds = new Set(); // Set of question IDs answered incorrectly

// Exam Timing & Status
let examTimer = null;
let examDurationSeconds = 45 * 60; // 45 minutes
let examTimeLeft = 45 * 60;
let isSubmitted = false;

// Interactive Matrix Filter & Sound FX State
let matrixFilter = 'all'; // 'all' | 'unanswered' | 'flagged'

class QuizSoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('hust_sound_enabled') !== 'false';
  }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }
  play(type) {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'select') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(560, t);
        osc.frequency.exponentialRampToValueAtTime(780, t + 0.06);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.start(t);
        osc.stop(t + 0.06);
      } else if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, t);
        osc.frequency.setValueAtTime(659.25, t + 0.08);
        osc.frequency.setValueAtTime(783.99, t + 0.16);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.linearRampToValueAtTime(180, t + 0.15);
        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
      } else if (type === 'finish') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(554.37, t + 0.1);
        osc.frequency.setValueAtTime(659.25, t + 0.2);
        osc.frequency.setValueAtTime(880, t + 0.3);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.start(t);
        osc.stop(t + 0.6);
      }
    } catch (e) {}
  }
}
const soundEngine = new QuizSoundFX();


// Search State
let activeSearchTab = 'all'; // 'all' | 'bookmarks' | 'mistakes'

// Flashcards Data (16 Core HUST concepts from Slides & Books)
const FLASHCARDS = [
  {
    term: "Nguyên nhân ra đời Nhà nước (Quan điểm Mác - Lênin)",
    desc: "Nhà nước ra đời do 02 nguyên nhân kinh tế và xã hội:\n• Kinh tế: Sự xuất hiện chế độ tư hữu về tư liệu sản xuất.\n• Xã hội: Xã hội phân chia thành các giai cấp đối kháng gay gắt và mâu thuẫn giai cấp không thể điều hòa được."
  },
  {
    term: "05 Đặc trưng cơ bản của Nhà nước",
    desc: "1. Thiết lập quyền lực công cộng đặc biệt (quân đội, cảnh sát, nhà tù...).\n2. Quản lý dân cư theo lãnh thổ (không phụ thuộc huyết thống).\n3. Nắm giữ chủ quyền quốc gia (quyết định tối cao trong nước và độc lập đối ngoại).\n4. Ban hành pháp luật và quản lý xã hội bằng pháp luật.\n5. Quy định và thực hiện thu thuế bắt buộc."
  },
  {
    term: "Cơ cấu 03 bộ phận của Quy phạm pháp luật",
    desc: "• Giả định (Nếu...): Xác định chủ thể, hoàn cảnh, điều kiện chịu sự điều chỉnh của QPPL.\n• Quy định (Thì...): Mô hình hành vi — được làm gì, phải làm gì hoặc không được làm gì.\n• Chế tài (Mà không làm thì...): Biện pháp tác động bất lợi của Nhà nước khi chủ thể vi phạm QPPL."
  },
  {
    term: "Sự kiện pháp lý: Sự biến vs Hành vi",
    desc: "• Sự biến: Hiện tượng tự nhiên khách quan phát sinh không phụ thuộc vào ý chí con người nhưng pháp luật gắn hậu quả pháp lý (thiên tai, sét đánh, sinh ra, chết tự nhiên).\n• Hành vi: Xảy ra phụ thuộc trực tiếp vào ý chí của con người (hành động hoặc không hành động)."
  },
  {
    term: "Năng lực pháp luật vs Năng lực hành vi",
    desc: "• Năng lực pháp luật: Khả năng hưởng quyền và nghĩa vụ theo quy định pháp luật (có từ khi sinh ra và chấm dứt khi chết).\n• Năng lực hành vi: Khả năng bằng chính hành vi của mình xác lập, thực hiện quyền và nghĩa vụ (phụ thuộc vào độ tuổi, khả năng nhận thức và làm chủ hành vi)."
  },
  {
    term: "04 Loại lỗi trong Vi phạm pháp luật",
    desc: "1. Cố ý trực tiếp: Thấy trước hậu quả nguy hại + Mong muốn hậu quả xảy ra.\n2. Cố ý gián tiếp: Thấy trước hậu quả + Không mong muốn nhưng có ý thức để mặc cho hậu quả xảy ra.\n3. Vô ý vì quá tự tin: Thấy trước hậu quả + Tin rằng hậu quả không xảy ra hoặc có thể ngăn chặn được.\n4. Vô ý do cẩu thả: Không thấy trước hậu quả mặc dù buộc phải thấy và có thể thấy trước."
  },
  {
    term: "Phân loại 04 loại tội phạm (Điều 9 BLHS 2015)",
    desc: "• Tội phạm ít nghiêm trọng: Khung phạt cao nhất đến 03 năm tù.\n• Tội phạm nghiêm trọng: Khung phạt cao nhất từ trên 03 năm đến 07 năm tù.\n• Tội phạm rất nghiêm trọng: Khung phạt cao nhất từ trên 07 năm đến 15 năm tù.\n• Tội phạm đặc biệt nghiêm trọng: Khung phạt từ trên 15 năm tù, tù chung thân hoặc tử hình."
  },
  {
    term: "Tuổi chịu trách nhiệm hình sự (Điều 12 BLHS)",
    desc: "• Từ đủ 16 tuổi trở lên: Chịu trách nhiệm hình sự về MỌI tội phạm.\n• Từ đủ 14 tuổi đến dưới 16 tuổi: CHỈ phải chịu trách nhiệm hình sự về tội RẤT NGHIÊM TRỌNG do cố ý hoặc ĐẶC BIỆT NGHIÊM TRỌNG thuộc 28 tội danh cụ thể được liệt kê tại Khoản 2 Điều 12 BLHS."
  },
  {
    term: "Thừa kế không phụ thuộc nội dung di chúc (Điều 644 BLDS)",
    desc: "Những người sau vẫn được hưởng phần di sản bằng 2/3 một suất của một người thừa kế theo pháp luật (nếu không được người lập di chúc cho hưởng hoặc chỉ cho hưởng dưới 2/3 suất):\n1. Con chưa thành niên, cha, mẹ, vợ, chồng.\n2. Con thành niên mà không có khả năng lao động."
  },
  {
    term: "03 Hàng thừa kế theo pháp luật (Điều 651 BLDS 2015)",
    desc: "• Hàng 1: Vợ, chồng, cha đẻ, mẹ đẻ, cha nuôi, mẹ nuôi, con đẻ, con nuôi của người chết.\n• Hàng 2: Ông nội, bà nội, ông ngoại, bà ngoại, anh ruột, chị ruột, em ruột của người chết; cháu ruột của người chết mà người chết là ông/bà nội/ngoại.\n• Hàng 3: Cụ nội, cụ ngoại; bác, chú, cậu, cô, dì ruột; cháu ruột gọi người chết là bác/chú/cậu/cô/dì; chắt ruột gọi người chết là cụ nội/ngoại."
  },
  {
    term: "Thừa kế thế vị (Điều 652 BLDS 2015)",
    desc: "Trường hợp con của người để lại di sản chết trước hoặc cùng thời điểm với người để lại di sản thì cháu được hưởng phần di sản mà cha hoặc mẹ của cháu được hưởng nếu còn sống.\nNếu cháu cũng chết trước hoặc cùng thời điểm thì chắt được hưởng."
  },
  {
    term: "Civil Law vs Common Law",
    desc: "• Civil Law (Pháp điển / Lục địa / Pháp, Đức, VN): Nguồn luật chủ yếu là Văn bản quy phạm pháp luật thành văn; Thẩm phán áp dụng luật; Tố tụng thẩm vấn.\n• Common Law (Thông luật / Anh - Mỹ): Nguồn luật chủ yếu là Tiền lệ pháp (Án lệ - Precedent); Thẩm phán sáng tạo luật; Tố tụng tranh tụng."
  },
  {
    term: "Thời hạn bảo hộ Sáng chế & Giải pháp hữu ích",
    desc: "Theo Luật Sở hữu trí tuệ Việt Nam:\n• Bằng độc quyền sáng chế: Có hiệu lực 20 năm kể từ ngày nộp đơn (không được gia hạn).\n• Bằng độc quyền giải pháp hữu ích: Có hiệu lực 10 năm kể từ ngày nộp đơn (không được gia hạn)."
  },
  {
    term: "Thời hạn bảo hộ Kiểu dáng công nghiệp",
    desc: "Bằng độc quyền kiểu dáng công nghiệp có hiệu lực 05 năm kể từ ngày nộp đơn, có thể gia hạn 02 lần liên tiếp, mỗi lần 05 năm (Tối đa 15 năm)."
  },
  {
    term: "Bảo hộ Quyền tác giả Phần mềm máy tính",
    desc: "Chương trình máy tính được bảo hộ như tác phẩm văn học.\nQuyền nhân thân (đặt tên, đứng tên, bảo vệ sự toàn vẹn) được bảo hộ vô thời hạn.\nQuyền tài sản và quyền công bố được bảo hộ suốt cuộc đời tác giả và 50 năm tiếp theo năm tác giả qua đời."
  },
  {
    term: "Nguyên tắc Nộp đơn đầu tiên (First to File)",
    desc: "Trong xác lập quyền sở hữu công nghiệp (Sáng chế, Kiểu dáng, Nhãn hiệu...): Khi có nhiều người nộp đơn đăng ký cho cùng một sáng chế/kiểu dáng hoặc các nhãn hiệu trùng/tương tự, văn bằng bảo hộ CHỈ được cấp cho đơn hợp lệ có NGÀY NỘP ĐƠN hoặc NGÀY ƯU TIÊN SỚM NHẤT."
  }
];

let currentFlashcardIndex = 0;

// ==========================================
// DOM READY INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadStoredData();
  initTabNavigation();
  initQuizModule();
  initSearchModule();
  initFlashcardModule();
  initGlobalKeyboard();
  initMatrixFilters();
  initSoundEngine();
  initFullscreen();
  initRetryMistakesButton();
  checkAndRestoreSession();
});

// Load persistent data from LocalStorage
function loadStoredData() {
  try {
    const savedBookmarks = localStorage.getItem('hust_pldc_bookmarks');
    if (savedBookmarks) {
      bookmarkedIds = new Set(JSON.parse(savedBookmarks));
    }
    const savedMistakes = localStorage.getItem('hust_pldc_mistakes');
    if (savedMistakes) {
      mistakeIds = new Set(JSON.parse(savedMistakes));
    }
  } catch (err) {
    console.error("Lỗi khi tải LocalStorage:", err);
  }
}

function saveBookmarks() {
  try {
    localStorage.setItem('hust_pldc_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
  } catch (err) {
    console.error(err);
  }
}

function saveMistakes() {
  try {
    localStorage.setItem('hust_pldc_mistakes', JSON.stringify(Array.from(mistakeIds)));
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// MODULE 1: TAB NAVIGATION
// ==========================================
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      switchMainTab(target);
    });
  });
}

function switchMainTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
  const activeContent = document.getElementById(`tab-${tabId}`);
  if (activeContent) activeContent.classList.remove('hidden');

  // Update navbar button styles (Desktop and Mobile)
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    const isTarget = btn.getAttribute('data-tab') === tabId;
    btn.classList.toggle('active', isTarget);
  });

  if (tabId === 'search') {
    renderSearchResults();
  } else if (tabId === 'flashcard') {
    renderCurrentFlashcard();
  }
}

// ==========================================
// MODULE 2: TRẮC NGHIỆM & THI THỬ HUST
// ==========================================
function initQuizModule() {
  // Generate initial exam with 50 questions
  generateNewExam(40, false);

  // Exam Type (Official Terms / Trap Master) listener
  const typeSelect = document.getElementById('select-exam-type');
  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      currentExamType = e.target.value;
      const sizeVal = parseInt(document.getElementById('select-exam-size')?.value, 10) || 50;
      generateNewExam(sizeVal, true);
    });
  }

  // Exam Size change listener
  const sizeSelect = document.getElementById('select-exam-size');
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10) || 50;
      generateNewExam(val, true);
    });
  }

  // Shuffle exam button
  const shuffleBtn = document.getElementById('btn-shuffle-exam');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      const sizeVal = parseInt(document.getElementById('select-exam-size')?.value, 10) || 50;
      generateNewExam(sizeVal, true);
    });
  }

  // Mode buttons: Practice vs Exam
  document.getElementById('btn-mode-practice').addEventListener('click', () => {
    setQuizMode('practice');
  });
  document.getElementById('btn-mode-exam').addEventListener('click', () => {
    setQuizMode('exam');
  });

  // Chapter filter listener (Practice mode only)
  const catSelect = document.getElementById('quiz-category-select');
  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      filterQuestionsByCategory();
    });
  }

  // Next / Prev buttons
  document.getElementById('btn-prev-q').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderCurrentQuestion();
    }
  });

  document.getElementById('btn-next-q').addEventListener('click', () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      currentQuestionIndex++;
      renderCurrentQuestion();
    }
  });

  // Flag for review button
  document.getElementById('btn-flag-review').addEventListener('click', () => {
    const q = activeQuestions[currentQuestionIndex];
    if (!q) return;
    if (markedForReview.has(q.id)) {
      markedForReview.delete(q.id);
    } else {
      markedForReview.add(q.id);
    }
    updateFlagButton();
    renderQuestionMatrix();
  });

  // Bookmark button
  document.getElementById('btn-bookmark-q').addEventListener('click', () => {
    const q = activeQuestions[currentQuestionIndex];
    if (!q) return;
    if (bookmarkedIds.has(q.id)) {
      bookmarkedIds.delete(q.id);
      showToast(`⭐ Đã bỏ lưu câu số ${currentQuestionIndex + 1}`);
    } else {
      bookmarkedIds.add(q.id);
      showToast(`⭐ Đã lưu câu số ${currentQuestionIndex + 1} vào danh sách ôn lại!`);
    }
    saveBookmarks();
    updateBookmarkButton();
  });

  // Reset exam button
  document.getElementById('btn-reset-quiz').addEventListener('click', () => {
    if (confirm("Bạn có chắc chắn muốn làm lại từ đầu bộ đề hiện tại? Toàn bộ kết quả đã chọn sẽ được xóa.")) {
      userAnswers = {};
      markedForReview.clear();
      isSubmitted = false;
      currentQuestionIndex = 0;
      if (quizMode === 'exam') {
        startExamTimer();
      }
      renderCurrentQuestion();
      renderQuestionMatrix();
      updateStatusHeader();
    }
  });

  // Submit buttons
  document.getElementById('btn-submit-exam').addEventListener('click', handleExamSubmission);
  const modalSubmitShortcut = document.getElementById('btn-modal-submit-exam');
  if (modalSubmitShortcut) {
    modalSubmitShortcut.addEventListener('click', handleExamSubmission);
  }

  // Result modal buttons
  document.getElementById('btn-close-modal-review').addEventListener('click', () => {
    document.getElementById('modal-result').classList.add('hidden');
    // In review mode, show question with answers
    renderCurrentQuestion();
    renderQuestionMatrix();
  });

  document.getElementById('btn-modal-new-exam').addEventListener('click', () => {
    document.getElementById('modal-result').classList.add('hidden');
    const sizeVal = parseInt(document.getElementById('select-exam-size')?.value, 10) || 50;
    generateNewExam(sizeVal, true);
    if (quizMode === 'exam') {
      startExamTimer();
    }
  });
}

// Generate New Exam with balanced matrix across all 7 HUST Chapters
function generateNewExam(size = 40, notify = true) {
  const pool = (typeof QUIZ_BANK !== 'undefined' && QUIZ_BANK.length > 0) ? QUIZ_BANK : QUIZ_DATA;
  currentExamSize = size;

  // 1. IF SELECTING PRE-PACKAGED OFFICIAL SET (100% NON-OVERLAPPING 40-QUESTION EXAMS)
  if (typeof OFFICIAL_SETS_DATA !== 'undefined' && OFFICIAL_SETS_DATA[currentExamType]) {
    const selectedSet = OFFICIAL_SETS_DATA[currentExamType];
    currentExamCode = selectedSet.code;
    activeQuestions = [...selectedSet.questions];
    currentExamSize = activeQuestions.length;

    // Update UI badge
    const examCodeBadge = document.getElementById('current-exam-code');
    if (examCodeBadge) {
      examCodeBadge.innerText = `MÃ ĐỀ: ${currentExamCode}`;
    }

    userAnswers = {};
    markedForReview.clear();
    currentQuestionIndex = 0;
    isSubmitted = false;

    renderCurrentQuestion();
    renderQuestionMatrix();
    updateStatusHeader();

    if (quizMode === 'exam') {
      startExamTimer();
    }

    if (notify) {
      showToast(`🎯 Đã mở ${currentExamCode} (${activeQuestions.length} câu / 45 phút - Không trùng lặp)!`);
    }
    return;
  }

  // 2. IF SELECTING RANDOM EXAM GENERATOR (OR CUSTOM EXAM)
  currentExamCode = `HUST-RAND-${Math.floor(400 + Math.random() * 99)}`;
  const examCodeBadge = document.getElementById('current-exam-code');
  if (examCodeBadge) {
    examCodeBadge.innerText = `MÃ ĐỀ: ${currentExamCode}`;
  }

  // Get recently seen question IDs from sessionStorage to prevent repeating questions across multiple exams
  let seenIds = [];
  try {
    const raw = sessionStorage.getItem('hust_seen_random_ids');
    if (raw) seenIds = JSON.parse(raw);
  } catch (e) { seenIds = []; }
  const seenSet = new Set(seenIds);

  // If user has seen more than 75% of the total bank, reset the seen tracker so questions cycle cleanly
  if (seenSet.size > pool.length * 0.75) {
    seenSet.clear();
  }

  // Chapter weights matching standard HUST final exam matrix (40 questions in 45 minutes)
  const chapterKeys = [
    { cat: 'ch1_intro', weight: 0.05 },
    { cat: 'ch2_state', weight: 0.15 },
    { cat: 'ch3_apparatus', weight: 0.15 },
    { cat: 'ch4_law', weight: 0.25 },
    { cat: 'ch5_world', weight: 0.05 },
    { cat: 'ch6_vn_law', weight: 0.20 },
    { cat: 'ch7_ip', weight: 0.15 }
  ];

  let sampled = [];
  const chosenIds = new Set();

  chapterKeys.forEach((item) => {
    const catPool = pool.filter(q => q.category === item.cat);
    const targetCatCount = Math.max(1, Math.round(size * item.weight));
    if (catPool.length > 0) {
      // Prioritize questions not yet seen in this session
      const unseen = catPool.filter(q => !seenSet.has(q.id));
      const candidateList = (unseen.length >= targetCatCount) ? unseen : catPool;
      const shuffledCat = [...candidateList].sort(() => 0.5 - Math.random());

      let added = 0;
      for (const q of shuffledCat) {
        if (!chosenIds.has(q.id)) {
          sampled.push(q);
          chosenIds.add(q.id);
          seenSet.add(q.id);
          added++;
          if (added >= targetCatCount) break;
        }
      }
    }
  });

  // Strict non-duplication filler if below target size
  if (sampled.length < size) {
    const remaining = pool.filter(q => !chosenIds.has(q.id)).sort(() => 0.5 - Math.random());
    for (const q of remaining) {
      sampled.push(q);
      chosenIds.add(q.id);
      seenSet.add(q.id);
      if (sampled.length >= size) break;
    }
  } else if (sampled.length > size) {
    sampled = sampled.slice(0, size);
  }

  // Save back updated seen tracker
  try {
    sessionStorage.setItem('hust_seen_random_ids', JSON.stringify(Array.from(seenSet)));
  } catch (e) {}

  // Final shuffle of active questions with 100% uniqueness guaranteed
  activeQuestions = sampled.sort(() => 0.5 - Math.random());

  // Reset state
  userAnswers = {};
  markedForReview.clear();
  currentQuestionIndex = 0;
  isSubmitted = false;

  // Filter if practice mode has active category
  if (quizMode === 'practice' && currentCategory !== 'all') {
    filterQuestionsByCategory();
  } else {
    renderCurrentQuestion();
    renderQuestionMatrix();
    updateStatusHeader();
  }

  if (quizMode === 'exam') {
    startExamTimer();
  }

  if (notify) {
    showToast(`🎲 Đã tạo đề thi ngẫu nhiên mới: ${currentExamCode} (${activeQuestions.length} câu)`);
  }
}

function filterQuestionsByCategory() {
  const pool = (typeof QUIZ_BANK !== 'undefined' && QUIZ_BANK.length > 0) ? QUIZ_BANK : QUIZ_DATA;
  if (currentCategory === 'all') {
    const sizeVal = parseInt(document.getElementById('select-exam-size')?.value, 10) || 50;
    generateNewExam(sizeVal, false);
    return;
  }

  const catQuestions = pool.filter(q => q.category === currentCategory);
  if (catQuestions.length === 0) {
    showToast("Không tìm thấy câu hỏi thuộc chuyên đề này!");
    return;
  }

  // Sample distinct questions from this category with 100% uniqueness
  const shuffledCat = [...catQuestions].sort(() => 0.5 - Math.random());
  activeQuestions = shuffledCat.slice(0, Math.min(40, shuffledCat.length));
  userAnswers = {};
  markedForReview.clear();
  currentQuestionIndex = 0;
  isSubmitted = false;

  renderCurrentQuestion();
  renderQuestionMatrix();
  updateStatusHeader();
  showToast(`📚 Đã nạp ${activeQuestions.length} câu hỏi chuyên đề`);
}

function setQuizMode(mode) {
  quizMode = mode;
  userAnswers = {};
  markedForReview.clear();
  currentQuestionIndex = 0;
  isSubmitted = false;

  const btnPractice = document.getElementById('btn-mode-practice');
  const btnExam = document.getElementById('btn-mode-exam');
  const timerBadge = document.getElementById('exam-timer-badge');
  const filterContainer = document.getElementById('quiz-filter-container');
  const submitBtn = document.getElementById('btn-submit-exam');
  const modalSubmitShortcut = document.getElementById('btn-modal-submit-exam');

  if (mode === 'practice') {
    btnPractice.className = "px-3.5 py-1.5 rounded-lg font-bold text-xs sm:text-sm bg-red-700 text-white shadow-xs transition flex items-center gap-1.5";
    btnExam.className = "px-3.5 py-1.5 rounded-lg font-bold text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5";
    timerBadge.classList.add('hidden');
    timerBadge.classList.remove('flex');
    filterContainer.classList.remove('opacity-40', 'pointer-events-none');
    submitBtn.classList.add('hidden');
    if (modalSubmitShortcut) modalSubmitShortcut.classList.add('hidden');
    if (examTimer) clearInterval(examTimer);
  } else {
    btnExam.className = "px-3.5 py-1.5 rounded-lg font-bold text-xs sm:text-sm bg-red-700 text-white shadow-xs transition flex items-center gap-1.5";
    btnPractice.className = "px-3.5 py-1.5 rounded-lg font-bold text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5";
    timerBadge.classList.remove('hidden');
    timerBadge.classList.add('flex');
    filterContainer.classList.add('opacity-40', 'pointer-events-none');
    submitBtn.classList.remove('hidden');
    if (modalSubmitShortcut) modalSubmitShortcut.classList.remove('hidden');

    const sizeVal = parseInt(document.getElementById('select-exam-size')?.value, 10) || 40;
    generateNewExam(sizeVal, false);
    startExamTimer();
  }

  renderCurrentQuestion();
  renderQuestionMatrix();
  updateStatusHeader();
}

function startExamTimer() {
  if (examTimer) clearInterval(examTimer);
  // Chuẩn thi Kết thúc học phần HUST: 40 câu trong 45 phút (2700 giây)
  if (currentExamSize === 40) examDurationSeconds = 45 * 60;
  else if (currentExamSize === 25) examDurationSeconds = 30 * 60;
  else if (currentExamSize === 50) examDurationSeconds = 55 * 60;
  else if (currentExamSize === 60) examDurationSeconds = 65 * 60;
  else if (currentExamSize === 100) examDurationSeconds = 100 * 60;
  else examDurationSeconds = 45 * 60;

  examTimeLeft = examDurationSeconds;
  updateTimerDisplay();

  examTimer = setInterval(() => {
    examTimeLeft--;
    updateTimerDisplay();
    if (examTimeLeft <= 0) {
      clearInterval(examTimer);
      alert("⏰ ĐÃ HẾT GIỜ LÀM BÀI! Hệ thống đang tự động chấm điểm và kết xuất kết quả thi.");
      handleExamSubmission();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(examTimeLeft / 60);
  const s = examTimeLeft % 60;
  const timerCount = document.getElementById('timer-count');
  if (timerCount) {
    timerCount.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}

// Render the active question card
function renderCurrentQuestion() {
  if (activeQuestions.length === 0) return;

  const q = activeQuestions[currentQuestionIndex];
  const qNum = currentQuestionIndex + 1;
  const total = activeQuestions.length;

  // Header badges
  document.getElementById('current-q-index').innerText = qNum;
  document.getElementById('total-q-count').innerText = total;
  document.getElementById('current-q-chapter').innerText = q.chapter;

  // Question Text
  document.getElementById('question-text').innerText = q.question;

  // Options
  const container = document.getElementById('options-container');
  container.innerHTML = '';
  const alphabet = ['A', 'B', 'C', 'D'];
  const userAns = userAnswers[q.id];
  const isAns = userAns !== undefined;

  q.options.forEach((optText, idx) => {
    const optDiv = document.createElement('div');
    optDiv.className = "quiz-option";

    // Style logic:
    // 1. In Practice mode after answering OR In Exam mode AFTER submission:
    //    Show green on correct answer, red on user's wrong answer.
    // 2. In Exam mode BEFORE submission:
    //    Highlight user's selected choice in theme color.
    let statusClass = "";
    const showAnswers = (quizMode === 'practice' && isAns) || isSubmitted;

    if (showAnswers) {
      if (idx === q.answer) {
        statusClass = "correct";
      } else if (idx === userAns && userAns !== q.answer) {
        statusClass = "incorrect";
      }
    } else {
      if (idx === userAns) {
        statusClass = "selected";
      }
    }

    if (statusClass) {
      optDiv.classList.add(statusClass);
    }

    optDiv.innerHTML = `
      <span class="opt-letter-badge">
        ${alphabet[idx]}
      </span>
      <div class="text-sm sm:text-base leading-relaxed pt-0.5 flex-1 font-semibold text-slate-800">
        ${optText}
      </div>
      ${showAnswers && idx === q.answer ? '<i class="fa-solid fa-circle-check text-emerald-600 text-xl pt-0.5"></i>' : ''}
      ${showAnswers && idx === userAns && userAns !== q.answer ? '<i class="fa-solid fa-circle-xmark text-red-600 text-xl pt-0.5"></i>' : ''}
    `;

    optDiv.addEventListener('click', () => {
      if (isSubmitted) return; // Locked in review mode
      if (quizMode === 'practice' && isAns) return; // Prevent changing after answer revealed in practice mode

      selectOption(q.id, idx);
    });

    container.appendChild(optDiv);
  });

  // Explanation Box
  const expBox = document.getElementById('explanation-box');
  const expText = document.getElementById('explanation-text');
  const showExp = (quizMode === 'practice' && isAns) || isSubmitted;

  if (showExp) {
    expBox.classList.remove('hidden');
    const isCorrect = userAns === q.answer;
    expText.innerHTML = `
      <div class="mb-2 font-bold ${isCorrect ? 'text-emerald-800' : 'text-red-800'}">
        ${isCorrect ? '✓ Bạn đã trả lời CHÍNH XÁC!' : '✕ Chưa chính xác! Đáp án đúng là ' + alphabet[q.answer]}
      </div>
      <div class="text-slate-700 leading-relaxed font-normal">${q.explanation}</div>
    `;
  } else {
    expBox.classList.add('hidden');
  }

  // Prev / Next button state
  document.getElementById('btn-prev-q').disabled = currentQuestionIndex === 0;
  document.getElementById('btn-next-q').disabled = currentQuestionIndex === total - 1;

  updateFlagButton();
  updateBookmarkButton();
}

function selectOption(qId, optIdx) {
  userAnswers[qId] = optIdx;

  const q = activeQuestions.find(item => item.id === qId);
  if (q) {
    if (optIdx !== q.answer) {
      mistakeIds.add(qId);
      saveMistakes();
      if (quizMode === 'practice') soundEngine.play('wrong');
      else soundEngine.play('select');
    } else {
      if (quizMode === 'practice') soundEngine.play('correct');
      else soundEngine.play('select');
    }
  }

  saveActiveSession();
  renderCurrentQuestion();
  renderQuestionMatrix();
  updateStatusHeader();
}

function updateFlagButton() {
  const q = activeQuestions[currentQuestionIndex];
  const btn = document.getElementById('btn-flag-review');
  if (!q || !btn) return;

  const isFlagged = markedForReview.has(q.id);
  if (isFlagged) {
    btn.className = "px-2.5 py-1.5 rounded-xl text-amber-700 bg-amber-50 text-xs font-bold flex items-center gap-1 transition border border-amber-300 shadow-xs";
    btn.innerHTML = `<i class="fa-solid fa-flag text-amber-600"></i> <span class="hidden sm:inline">Đã cắm cờ</span> <span class="text-[10px] text-amber-600 font-mono hidden md:inline">[F]</span>`;
  } else {
    btn.className = "px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 text-xs font-bold flex items-center gap-1 transition border border-slate-200/80";
    btn.innerHTML = `<i class="fa-solid fa-flag"></i> <span class="hidden sm:inline">Cắm cờ</span> <span class="text-[10px] text-slate-400 font-mono hidden md:inline">[F]</span>`;
  }
}

function updateBookmarkButton() {
  const q = activeQuestions[currentQuestionIndex];
  const btn = document.getElementById('btn-bookmark-q');
  if (!q || !btn) return;

  const isBookmarked = bookmarkedIds.has(q.id);
  if (isBookmarked) {
    btn.className = "px-2.5 py-1.5 rounded-xl text-amber-700 bg-amber-50 text-xs font-bold flex items-center gap-1 transition border border-amber-300 shadow-xs";
    btn.innerHTML = `<i class="fa-solid fa-star text-amber-500"></i> <span class="hidden sm:inline">Đã đánh dấu</span> <span class="text-[10px] text-amber-600 font-mono hidden md:inline">[S]</span>`;
  } else {
    btn.className = "px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 text-xs font-bold flex items-center gap-1 transition border border-slate-200/80";
    btn.innerHTML = `<i class="fa-regular fa-star"></i> <span class="hidden sm:inline">Đánh dấu</span> <span class="text-[10px] text-slate-400 font-mono hidden md:inline">[S]</span>`;
  }
}

function updateStatusHeader() {
  const total = activeQuestions.length;
  const answered = Object.keys(userAnswers).filter(id => activeQuestions.some(q => q.id === parseInt(id, 10))).length;
  const badge = document.getElementById('answered-count-badge');
  if (badge) {
    badge.innerText = `Đã làm: ${answered}/${total}`;
  }
}

// Render the right-side question matrix (Buttons 1..N)
function renderQuestionMatrix() {
  const grid = document.getElementById('question-matrix-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const total = activeQuestions.length;
  let answeredCount = 0;
  let flaggedCount = 0;

  activeQuestions.forEach(q => {
    if (userAnswers[q.id] !== undefined) answeredCount++;
    if (markedForReview.has(q.id)) flaggedCount++;
  });
  const unansweredCount = total - answeredCount;

  // Update filter counters
  const cAll = document.getElementById('count-mat-all');
  const cUnans = document.getElementById('count-mat-unanswered');
  const cFlag = document.getElementById('count-mat-flagged');
  if (cAll) cAll.innerText = total;
  if (cUnans) cUnans.innerText = unansweredCount;
  if (cFlag) cFlag.innerText = flaggedCount;

  const badge = document.getElementById('answered-count-badge');
  if (badge) {
    badge.innerText = `Đã làm: ${answeredCount}/${total}`;
  }

  // Update Progress Track
  const pText = document.getElementById('progress-text');
  const pPercent = document.getElementById('progress-percent');
  const pFill = document.getElementById('progress-fill');
  const pct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
  if (pText) pText.innerText = `Tiến độ hoàn thành: ${answeredCount}/${total} câu`;
  if (pPercent) pPercent.innerText = `${pct}%`;
  if (pFill) pFill.style.width = `${pct}%`;

  activeQuestions.forEach((q, idx) => {
    const isCurrent = idx === currentQuestionIndex;
    const isAns = userAnswers[q.id] !== undefined;
    const isFlagged = markedForReview.has(q.id);

    // Apply matrixFilter
    if (matrixFilter === 'unanswered' && isAns) return;
    if (matrixFilter === 'flagged' && !isFlagged) return;

    const btn = document.createElement('button');
    btn.className = "q-matrix-btn";
    btn.innerText = idx + 1;

    if (isSubmitted || (quizMode === 'practice' && isAns)) {
      if (isAns) {
        if (userAnswers[q.id] === q.answer) {
          btn.style.backgroundColor = '#10b981';
          btn.style.color = '#ffffff';
          btn.style.borderColor = '#10b981';
        } else {
          btn.style.backgroundColor = '#ef4444';
          btn.style.color = '#ffffff';
          btn.style.borderColor = '#ef4444';
        }
      }
    } else {
      if (isAns) {
        btn.classList.add('answered');
      }
    }

    if (isCurrent) {
      btn.classList.add('current');
    }

    if (isFlagged) {
      btn.classList.add('flagged');
    }

    btn.addEventListener('click', () => {
      currentQuestionIndex = idx;
      renderCurrentQuestion();
      renderQuestionMatrix();
    });

    grid.appendChild(btn);
  });
}

// Exam Submission & Grading
function handleExamSubmission() {
  if (isSubmitted) {
    showToast("Bài thi đã được nộp!");
    return;
  }

  const total = activeQuestions.length;
  const answeredCount = Object.keys(userAnswers).filter(id => activeQuestions.some(q => q.id === parseInt(id, 10))).length;
  const unansweredCount = total - answeredCount;

  if (unansweredCount > 0 && quizMode === 'exam') {
    const confirmSubmit = confirm(`Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài ngay bây giờ không?`);
    if (!confirmSubmit) return;
  }

  if (examTimer) clearInterval(examTimer);
  isSubmitted = true;

  let correctCount = 0;
  let wrongCount = 0;

  activeQuestions.forEach(q => {
    const userAns = userAnswers[q.id];
    if (userAns !== undefined) {
      if (userAns === q.answer) {
        correctCount++;
      } else {
        wrongCount++;
        mistakeIds.add(q.id);
      }
    }
  });

  saveMistakes();

  // Score on 10
  const score10 = Number(((correctCount / total) * 10).toFixed(1));
  let letterGrade = "F";
  let gradeText = "Chưa đạt (Học lại)";
  let gradeColor = "bg-red-700";

  if (score10 >= 9.0) {
    letterGrade = "A+";
    gradeText = "Học lực Xuất sắc (A+)";
    gradeColor = "bg-emerald-600";
  } else if (score10 >= 8.5) {
    letterGrade = "A";
    gradeText = "Học lực Giỏi (A)";
    gradeColor = "bg-emerald-600";
  } else if (score10 >= 8.0) {
    letterGrade = "B+";
    gradeText = "Học lực Khá giỏi (B+)";
    gradeColor = "bg-blue-600";
  } else if (score10 >= 7.0) {
    letterGrade = "B";
    gradeText = "Học lực Khá (B)";
    gradeColor = "bg-blue-600";
  } else if (score10 >= 6.5) {
    letterGrade = "C+";
    gradeText = "Học lực Trung bình khá (C+)";
    gradeColor = "bg-amber-600";
  } else if (score10 >= 5.5) {
    letterGrade = "C";
    gradeText = "Học lực Trung bình (C)";
    gradeColor = "bg-amber-600";
  } else if (score10 >= 5.0) {
    letterGrade = "D+";
    gradeText = "Học lực Trung bình yếu (D+)";
    gradeColor = "bg-amber-700";
  } else if (score10 >= 4.0) {
    letterGrade = "D";
    gradeText = "Đạt yêu cầu tối thiểu (D)";
    gradeColor = "bg-orange-600";
  }

  // Populate Result Modal
  document.getElementById('res-exam-code').innerText = `KẾT QUẢ ĐỀ THI: ${currentExamCode}`;
  document.getElementById('res-score-10').innerText = score10.toString();
  const letterBadge = document.getElementById('res-grade-letter');
  letterBadge.innerText = letterGrade;
  letterBadge.className = `px-3 py-1 rounded-lg ${gradeColor} text-white font-black text-xl`;
  document.getElementById('res-grade-text').innerText = gradeText;

  const elapsedSec = examDurationSeconds - examTimeLeft;
  const elMin = Math.floor(elapsedSec / 60);
  const elSec = elapsedSec % 60;
  const timeStr = `${elMin} phút ${elSec} giây`;

  document.getElementById('res-score-detail').innerText = 
    `Đúng: ${correctCount} / ${total} câu • Sai: ${wrongCount} câu • Chưa làm: ${unansweredCount} câu • Thời gian làm bài: ${timeStr}`;

  // COMPUTE CHAPTER-BY-CHAPTER ANALYTICS (TAILIEUHUST STYLE)
  const categoryNames = {
    'ch1_intro': 'Chương 1: Nhập môn PLĐC',
    'ch2_state': 'Chương 2: Cơ bản về Nhà nước',
    'ch3_apparatus': 'Chương 3: Bộ máy Nhà nước VN',
    'ch4_law': 'Chương 4: Pháp luật & Lỗi vi phạm',
    'ch5_world': 'Chương 5: Các hệ thống PL thế giới',
    'ch6_vn_law': 'Chương 6: Thừa kế & Hình sự',
    'ch7_ip': 'Chương 7: Sở hữu trí tuệ & KH-CN'
  };

  const catStats = {};
  Object.keys(categoryNames).forEach(k => {
    catStats[k] = { total: 0, correct: 0 };
  });

  activeQuestions.forEach(q => {
    const cat = q.category || 'ch4_law';
    if (!catStats[cat]) catStats[cat] = { total: 0, correct: 0 };
    catStats[cat].total++;
    if (userAnswers[q.id] === q.answer) {
      catStats[cat].correct++;
    }
  });

  const breakdownContainer = document.getElementById('modal-chapter-breakdown');
  if (breakdownContainer) {
    breakdownContainer.innerHTML = '';
    let lowestCat = null;
    let lowestPct = 101;

    Object.keys(categoryNames).forEach(catKey => {
      const stat = catStats[catKey];
      if (stat.total > 0) {
        const pct = Math.round((stat.correct / stat.total) * 100);
        if (pct < lowestPct) {
          lowestPct = pct;
          lowestCat = categoryNames[catKey];
        }

        const barColor = pct >= 80 ? 'bg-emerald-600' : (pct >= 50 ? 'bg-amber-500' : 'bg-red-600');
        const badgeColor = pct >= 80 ? 'text-emerald-700 bg-emerald-50' : (pct >= 50 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50');

        const row = document.createElement('div');
        row.className = "space-y-1";
        row.innerHTML = `
          <div class="flex items-center justify-between text-[11px] font-semibold text-slate-700">
            <span class="truncate max-w-[240px]">${categoryNames[catKey]}</span>
            <span class="px-2 py-0.5 rounded font-bold ${badgeColor}">${stat.correct}/${stat.total} câu (${pct}%)</span>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="${barColor} h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
          </div>
        `;
        breakdownContainer.appendChild(row);
      }
    });

    const adviceBox = document.getElementById('modal-exam-advice');
    if (adviceBox) {
      if (lowestCat && lowestPct < 80) {
        adviceBox.innerHTML = `<i class="fa-solid fa-lightbulb text-amber-600"></i> <strong>Chiến thuật đạt điểm A+:</strong> Bạn đang làm chưa tốt ở <strong>${lowestCat}</strong> (đạt ${lowestPct}%). Hãy chuyển sang <strong>Tab 5: 10 Bẫy Đề Thi</strong> và <strong>Tab 3: Sổ Tay 13 Bảng</strong> để củng cố các dạng bài tập này trước khi thi lại!`;
      } else {
        adviceBox.innerHTML = `<i class="fa-solid fa-trophy text-emerald-600"></i> <strong>Tuyệt vời!</strong> Bạn nắm rất đều và vững toàn bộ 7 chương học phần. Tự tin bước vào phòng thi chính thức để giành điểm A+!`;
      }
    }
  }

  document.getElementById('modal-result').classList.remove('hidden');

  renderCurrentQuestion();
  renderQuestionMatrix();
}

// ==========================================
// MODULE 3: TRA CỨU & LUYỆN LẠI (SEARCH & REVIEW)
// ==========================================
function initSearchModule() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderSearchResults();
    });
  }

  // Filter sub-tabs
  document.getElementById('search-tab-all').addEventListener('click', () => {
    setActiveSearchTab('all');
  });
  document.getElementById('search-tab-bookmarks').addEventListener('click', () => {
    setActiveSearchTab('bookmarks');
  });
  document.getElementById('search-tab-mistakes').addEventListener('click', () => {
    setActiveSearchTab('mistakes');
  });

  // Clear mistakes button
  document.getElementById('btn-clear-mistakes').addEventListener('click', () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử các câu làm sai không?")) {
      mistakeIds.clear();
      saveMistakes();
      renderSearchResults();
      showToast("🗑️ Đã làm sạch danh sách câu làm sai!");
    }
  });
}

function setActiveSearchTab(tab) {
  activeSearchTab = tab;
  const allBtn = document.getElementById('search-tab-all');
  const bookBtn = document.getElementById('search-tab-bookmarks');
  const mistBtn = document.getElementById('search-tab-mistakes');

  [allBtn, bookBtn, mistBtn].forEach(b => {
    b.className = "search-filter-btn px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition";
  });

  if (tab === 'all') {
    allBtn.className = "search-filter-btn px-4 py-1.5 rounded-xl text-xs font-bold bg-red-700 text-white shadow-xs transition";
  } else if (tab === 'bookmarks') {
    bookBtn.className = "search-filter-btn px-4 py-1.5 rounded-xl text-xs font-bold bg-red-700 text-white shadow-xs transition";
  } else if (tab === 'mistakes') {
    mistBtn.className = "search-filter-btn px-4 py-1.5 rounded-xl text-xs font-bold bg-red-700 text-white shadow-xs transition";
  }

  renderSearchResults();
}

function renderSearchResults() {
  const pool = (typeof QUIZ_BANK !== 'undefined' && QUIZ_BANK.length > 0) ? QUIZ_BANK : QUIZ_DATA;
  const searchInput = document.getElementById('search-input');
  const rawQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

  // Update badge counts
  document.getElementById('count-bookmarks').innerText = bookmarkedIds.size;
  document.getElementById('count-mistakes').innerText = mistakeIds.size;

  let baseList = [];
  if (activeSearchTab === 'bookmarks') {
    baseList = pool.filter(q => bookmarkedIds.has(q.id));
  } else if (activeSearchTab === 'mistakes') {
    baseList = pool.filter(q => mistakeIds.has(q.id));
  } else {
    baseList = pool;
  }

  let filtered = baseList;
  if (rawQuery) {
    filtered = baseList.filter(q => {
      const inQ = q.question.toLowerCase().includes(rawQuery);
      const inExp = q.explanation && q.explanation.toLowerCase().includes(rawQuery);
      const inOpts = q.options && q.options.some(opt => opt.toLowerCase().includes(rawQuery));
      return inQ || inExp || inOpts;
    });
  }

  document.getElementById('count-all-matches').innerText = filtered.length;

  const container = document.getElementById('search-results-container');
  if (!container) return;
  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl">
          <i class="fa-solid fa-folder-open"></i>
        </div>
        <h4 class="text-base font-bold text-slate-800">Không tìm thấy câu hỏi phù hợp</h4>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">
          ${activeSearchTab === 'bookmarks' ? 'Bạn chưa đánh dấu lưu lại câu hỏi nào.' :
            activeSearchTab === 'mistakes' ? 'Chúc mừng! Danh sách câu làm sai đang trống.' :
            'Hãy thử tìm kiếm với các từ khóa ngắn gọn hơn như: "thừa kế", "sáng chế", "14 tuổi", "án treo"...'}
        </p>
      </div>
    `;
    return;
  }

  // Display top 50 matches to keep browser DOM responsive
  const displaySlice = filtered.slice(0, 50);
  const alphabet = ['A', 'B', 'C', 'D'];

  displaySlice.forEach((q, idx) => {
    const isBookmarked = bookmarkedIds.has(q.id);
    const isMistake = mistakeIds.has(q.id);

    const card = document.createElement('div');
    card.className = "bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition card-print";

    card.innerHTML = `
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-xs font-black uppercase text-red-700 bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-200">
            Câu #${q.id}
          </span>
          <span class="text-xs text-slate-500 font-semibold truncate max-w-md">
            ${q.chapter}
          </span>
          ${isMistake ? '<span class="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full"><i class="fa-solid fa-circle-exclamation"></i> Từng làm sai</span>' : ''}
        </div>

        <button onclick="toggleBookmarkInSearch(${q.id})" class="text-xs font-bold px-3 py-1 rounded-xl transition ${isBookmarked ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
          <i class="fa-${isBookmarked ? 'solid' : 'regular'} fa-star text-amber-500"></i>
          <span>${isBookmarked ? 'Đã lưu' : 'Lưu lại'}</span>
        </button>
      </div>

      <h4 class="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
        ${q.question}
      </h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm">
        ${q.options.map((opt, optIdx) => `
          <div class="p-3 rounded-xl border flex items-start gap-2.5 ${optIdx === q.answer ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-700'}">
            <span class="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${optIdx === q.answer ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}">
              ${alphabet[optIdx]}
            </span>
            <span class="pt-0.5">${opt}</span>
            ${optIdx === q.answer ? '<i class="fa-solid fa-check text-emerald-600 text-sm ml-auto pt-1"></i>' : ''}
          </div>
        `).join('')}
      </div>

      <div class="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-slate-700 space-y-1">
        <div class="font-bold text-amber-900 flex items-center gap-1.5">
          <i class="fa-solid fa-book-bookmark text-amber-600"></i> Cơ sở pháp lý & Giải thích chi tiết:
        </div>
        <p class="leading-relaxed text-slate-800">${q.explanation}</p>
      </div>
    `;

    container.appendChild(card);
  });

  if (filtered.length > 50) {
    const notice = document.createElement('div');
    notice.className = "text-center text-xs text-slate-500 py-3 font-medium";
    notice.innerText = `Đang hiển thị 50 kết quả đầu tiên trong tổng số ${filtered.length} câu hỏi. Hãy gõ thêm từ khóa để thu hẹp tìm kiếm.`;
    container.appendChild(notice);
  }
}

// Global toggle bookmark helper for search view
window.toggleBookmarkInSearch = function(qId) {
  if (bookmarkedIds.has(qId)) {
    bookmarkedIds.delete(qId);
    showToast(`⭐ Đã bỏ lưu câu hỏi #${qId}`);
  } else {
    bookmarkedIds.add(qId);
    showToast(`⭐ Đã lưu câu hỏi #${qId}`);
  }
  saveBookmarks();
  renderSearchResults();
  updateBookmarkButton();
};

// ==========================================
// MODULE 4: FLASHCARD 3D
// ==========================================
function initFlashcardModule() {
  const flashcardBox = document.getElementById('flashcard-box');
  if (flashcardBox) {
    flashcardBox.addEventListener('click', () => {
      flashcardBox.classList.toggle('flipped');
    });
  }

  const flipBtn = document.getElementById('btn-fc-flip');
  if (flipBtn) {
    flipBtn.addEventListener('click', () => {
      flashcardBox.classList.toggle('flipped');
    });
  }

  const prevBtn = document.getElementById('btn-fc-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        renderCurrentFlashcard();
      }
    });
  }

  const nextBtn = document.getElementById('btn-fc-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentFlashcardIndex < FLASHCARDS.length - 1) {
        currentFlashcardIndex++;
        renderCurrentFlashcard();
      }
    });
  }
}

function renderCurrentFlashcard() {
  const card = FLASHCARDS[currentFlashcardIndex];
  if (!card) return;

  const box = document.getElementById('flashcard-box');
  if (box) box.classList.remove('flipped');

  document.getElementById('fc-current-idx').innerText = currentFlashcardIndex + 1;
  document.getElementById('fc-total-count').innerText = FLASHCARDS.length;

  document.getElementById('fc-front-term').innerText = card.term;
  document.getElementById('fc-back-desc').innerText = card.desc;

  document.getElementById('btn-fc-prev').disabled = currentFlashcardIndex === 0;
  document.getElementById('btn-fc-next').disabled = currentFlashcardIndex === FLASHCARDS.length - 1;
}

// ==========================================
// GLOBAL KEYBOARD SHORTCUTS & TOAST
// ==========================================
function initGlobalKeyboard() {
  document.addEventListener('keydown', (e) => {
    // If typing in input or textarea, ignore
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    if (currentTab === 'quiz') {
      if (e.key === 'ArrowLeft') {
        document.getElementById('btn-prev-q').click();
      } else if (e.key === 'ArrowRight') {
        document.getElementById('btn-next-q').click();
      } else if (['1', 'a', 'A'].includes(e.key)) {
        handleKeyboardOption(0);
      } else if (['2', 'b', 'B'].includes(e.key)) {
        handleKeyboardOption(1);
      } else if (['3', 'c', 'C'].includes(e.key)) {
        handleKeyboardOption(2);
      } else if (['4', 'd', 'D'].includes(e.key)) {
        handleKeyboardOption(3);
      }
    } else if (currentTab === 'flashcard') {
      if (e.code === 'Space') {
        e.preventDefault();
        document.getElementById('btn-fc-flip').click();
      } else if (e.key === 'ArrowLeft') {
        document.getElementById('btn-fc-prev').click();
      } else if (e.key === 'ArrowRight') {
        document.getElementById('btn-fc-next').click();
      }
    }
  });
}

function handleKeyboardOption(optIdx) {
  const q = activeQuestions[currentQuestionIndex];
  if (!q || isSubmitted) return;
  if (quizMode === 'practice' && userAnswers[q.id] !== undefined) return;
  selectOption(q.id, optIdx);
}

function showToast(msg) {
  let toast = document.getElementById('hust-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'hust-toast';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 transition-all duration-300 transform pointer-events-none opacity-0 translate-y-3';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-graduation-cap text-amber-400"></i> ${msg}`;
  toast.classList.remove('opacity-0', 'translate-y-3');
  toast.classList.add('opacity-100', 'translate-y-0');

  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-3');
  }, 2200);
}

// ==========================================
// MODULE 5: POWER FEATURES & SMOOTH UX
// ==========================================

function initMatrixFilters() {
  const btnAll = document.getElementById('matrix-filter-all');
  const btnUnans = document.getElementById('matrix-filter-unanswered');
  const btnFlag = document.getElementById('matrix-filter-flagged');

  function setMatrixFilter(filter) {
    matrixFilter = filter;
    [btnAll, btnUnans, btnFlag].forEach(b => {
      if (!b) return;
      b.className = "matrix-filter-btn flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-center transition";
    });
    if (filter === 'all' && btnAll) btnAll.className = "matrix-filter-btn flex-1 py-1.5 rounded-lg bg-white text-slate-900 font-bold shadow-xs text-center transition";
    if (filter === 'unanswered' && btnUnans) btnUnans.className = "matrix-filter-btn flex-1 py-1.5 rounded-lg bg-white text-red-700 font-bold shadow-xs text-center transition";
    if (filter === 'flagged' && btnFlag) btnFlag.className = "matrix-filter-btn flex-1 py-1.5 rounded-lg bg-white text-amber-700 font-bold shadow-xs text-center transition";
    renderQuestionMatrix();
  }

  if (btnAll) btnAll.addEventListener('click', () => setMatrixFilter('all'));
  if (btnUnans) btnUnans.addEventListener('click', () => setMatrixFilter('unanswered'));
  if (btnFlag) btnFlag.addEventListener('click', () => setMatrixFilter('flagged'));
}

function initSoundEngine() {
  const btn = document.getElementById('btn-toggle-sound');
  const icon = document.getElementById('sound-icon');
  if (btn) {
    if (!soundEngine.enabled && icon) {
      icon.className = "fa-solid fa-volume-xmark text-slate-400";
    }
    btn.addEventListener('click', () => {
      soundEngine.enabled = !soundEngine.enabled;
      localStorage.setItem('hust_sound_enabled', String(soundEngine.enabled));
      if (soundEngine.enabled) {
        soundEngine.play('select');
        if (icon) icon.className = "fa-solid fa-volume-high text-emerald-600";
        showToast("🔊 Đã BẬT âm thanh hiệu ứng");
      } else {
        if (icon) icon.className = "fa-solid fa-volume-xmark text-slate-400";
        showToast("🔇 Đã TẮT âm thanh");
      }
    });
  }
}

function initFullscreen() {
  const btn = document.getElementById('btn-fullscreen');
  if (btn) {
    btn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        btn.innerHTML = `<i class="fa-solid fa-compress text-red-700"></i>`;
        showToast("⛶ Đã bật chế độ phòng thi toàn màn hình!");
      } else {
        document.exitFullscreen().catch(() => {});
        btn.innerHTML = `<i class="fa-solid fa-expand"></i>`;
        showToast("Đã thoát chế độ toàn màn hình.");
      }
    });
  }
}

function initRetryMistakesButton() {
  const btn = document.getElementById('btn-retry-mistakes-now');
  if (btn) {
    btn.addEventListener('click', () => {
      const wrongQuestions = activeQuestions.filter(q => {
        const uAns = userAnswers[q.id];
        return uAns !== undefined && uAns !== q.answer;
      });

      if (wrongQuestions.length === 0) {
        showToast("🎉 Xuất sắc! Bạn không làm sai câu nào trong đề thi này!");
        return;
      }

      document.getElementById('modal-result').classList.add('hidden');
      activeQuestions = [...wrongQuestions];
      currentExamSize = activeQuestions.length;
      currentExamCode = `HUST-SAI-${activeQuestions.length}Q`;
      const codeBadge = document.getElementById('current-exam-code');
      if (codeBadge) codeBadge.innerText = `MÃ ĐỀ: ${currentExamCode}`;

      // Switch to practice mode for direct feedback
      setQuizMode('practice');
      showToast(`🎯 Đang luyện lại ${activeQuestions.length} câu làm sai!`);
    });
  }
}

function saveActiveSession() {
  try {
    if (isSubmitted || activeQuestions.length === 0) {
      localStorage.removeItem('hust_pldc_active_session');
      return;
    }
    const session = {
      examCode: currentExamCode,
      examType: currentExamType,
      quizMode: quizMode,
      activeIds: activeQuestions.map(q => q.id),
      userAnswers: userAnswers,
      markedForReview: Array.from(markedForReview),
      currentQuestionIndex: currentQuestionIndex,
      examTimeLeft: examTimeLeft,
      timestamp: Date.now()
    };
    localStorage.setItem('hust_pldc_active_session', JSON.stringify(session));
  } catch (err) {}
}

function checkAndRestoreSession() {
  try {
    const raw = localStorage.getItem('hust_pldc_active_session');
    if (!raw) return;
    const session = JSON.parse(raw);
    const ageMinutes = (Date.now() - session.timestamp) / 60000;
    if (ageMinutes < 90 && Object.keys(session.userAnswers || {}).length > 0) {
      const restore = confirm(`Hệ thống phát hiện bài thi chưa hoàn tất (${session.examCode}, đã làm ${Object.keys(session.userAnswers).length} câu, còn khoảng ${Math.floor(session.examTimeLeft / 60)} phút).\n\nBạn có muốn khôi phục và tiếp tục làm bài thi này không?`);
      if (restore) {
        const pool = (typeof QUIZ_BANK !== 'undefined' && QUIZ_BANK.length > 0) ? QUIZ_BANK : QUIZ_DATA;
        const restoredQuestions = session.activeIds.map(id => pool.find(q => q.id === id)).filter(Boolean);
        if (restoredQuestions.length > 0) {
          activeQuestions = restoredQuestions;
          currentExamCode = session.examCode;
          currentExamType = session.examType;
          userAnswers = session.userAnswers || {};
          markedForReview = new Set(session.markedForReview || []);
          currentQuestionIndex = session.currentQuestionIndex || 0;
          examTimeLeft = session.examTimeLeft || (45 * 60);

          const codeBadge = document.getElementById('current-exam-code');
          if (codeBadge) codeBadge.innerText = `MÃ ĐỀ: ${currentExamCode}`;

          setQuizMode(session.quizMode || 'practice');
          showToast(`⚡ Đã khôi phục thành công bài thi ${currentExamCode}!`);
        }
      } else {
        localStorage.removeItem('hust_pldc_active_session');
      }
    }
  } catch (err) {}
}
