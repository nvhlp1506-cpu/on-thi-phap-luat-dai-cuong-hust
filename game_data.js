// ==========================================================================
// ĐẤU TRƯỜNG TRI THỨC - CUỘC CHIẾN ĐA VŨ TRỤ
// GAME DATA: HEROES, MAPS, PRESET QUESTION PACKS
// NGUỒN CÂU HỎI: 100% KHO ĐỀ ÔN THI PHÁP LUẬT ĐẠI CƯƠNG HUST (4,800+ CÂU)
// ==========================================================================

// 20 HEROES ROSTER VỚI AVATAR CHÂN THỰC THEO ĐÚNG TÊN NHÂN VẬT
const HEROES_DATA = [
  {
    id: "bachkhoa",
    name: "Học Thần HUST",
    title: "Thủ Khoa Bách Khoa",
    role: "Học Thần Tri Thức",
    type: "knight",
    color1: "#b71c1c",
    color2: "#ffebee",
    accent: "#d32f2f",
    avatar: "assets/avatars/bachkhoa.jpg",
    hp: 110,
    atk: 15,
    speed: 98,
    crit: 35,
    passive: "Đặc Sản Bách Khoa: Đạt điểm A tuyệt đối, nhân đôi sát thương với câu hỏi khó Pháp luật đại cương.",
    ultimateName: "Bản Án Pháp Luật Tối Thượng",
    ultimateDesc: "Tung đòn tổng lực từ 7 Chương Pháp Luật Đại Cương gây 36 sát thương cực đại.",
    ultimateDmg: 36,
    quote: "Nắm vững 7 chương Pháp luật đại cương thì mọi đối thủ đều phải tâm phục khẩu phục!"
  },
  {
    id: "ngokhong",
    name: "Ngộ Không",
    title: "Tề Thiên Đại Thánh",
    role: "Đấu Sĩ Tốc Độ",
    type: "wukong",
    color1: "#f57c00",
    color2: "#ffd54f",
    accent: "#ff9100",
    avatar: "assets/avatars/ngokhong.jpg",
    hp: 100,
    atk: 12,
    speed: 95,
    crit: 25,
    passive: "Nhanh Như Chớp: Trả lời đúng trong 5s đầu cộng thêm +4 sát thương.",
    ultimateName: "Cân Đẩu Vân Bão Kích",
    ultimateDesc: "Tung gậy Như Ý gây 30 sát thương cực lớn và hồi 10 HP.",
    ultimateDmg: 30,
    quote: "Đấu trường này là của Lão Tôn!"
  },
  {
    id: "daisu",
    name: "Đại Sư",
    title: "Kim Cang Pháp Sư",
    role: "Hộ Vệ Trí Huệ",
    type: "monk",
    color1: "#d84315",
    color2: "#ffb300",
    accent: "#ff6f00",
    avatar: "assets/avatars/daisu.jpg",
    hp: 115,
    atk: 10,
    speed: 80,
    crit: 15,
    passive: "Kim Cang Bất Hoại: Giảm 20% sát thương phải nhận.",
    ultimateName: "Phật Quang Phổ Chiếu",
    ultimateDesc: "Chưởng xuất Phật Ấn gây 28 sát thương và tạo khiên 15 HP.",
    ultimateDmg: 28,
    quote: "Tâm tĩnh thì trí tuệ pháp lý tự khắc sáng tỏ."
  },
  {
    id: "phanphapquan",
    name: "Thánh Phán Quan",
    title: "Cán Cân Công Lý",
    role: "Hộ Pháp Trọng Tài",
    type: "knight",
    color1: "#ffd600",
    color2: "#fff9c4",
    accent: "#ffab00",
    avatar: "assets/avatars/phanphapquan.jpg",
    hp: 112,
    atk: 13,
    speed: 88,
    crit: 25,
    passive: "Phán Quyết Nghiêm Minh: Đối phương trả lời sai bị trừ thêm 5 HP phạt.",
    ultimateName: "Búa Phán Xét Tối Cao",
    ultimateDesc: "Giáng búa công lý gây 32 sát thương không thể cản phá.",
    ultimateDmg: 32,
    quote: "Pháp luật nghiêm minh, công lý bất diệt!"
  },
  {
    id: "thuytinh",
    name: "Thủy Tinh",
    title: "Chúa Tể Thủy Tộc",
    role: "Pháp Sư Khống Chế",
    type: "water",
    color1: "#0277bd",
    color2: "#4fc3f7",
    accent: "#00b0ff",
    avatar: "assets/avatars/thuytinh.jpg",
    hp: 95,
    atk: 13,
    speed: 88,
    crit: 20,
    passive: "Thủy Triều Dâng: Mỗi lần trả lời đúng hút 3 HP của đối phương.",
    ultimateName: "Đại Hồng Thủy Phẫn Nộ",
    ultimateDesc: "Cuộn sóng thần khổng lồ gây 32 sát thương hủy diệt.",
    ultimateDmg: 32,
    quote: "Nước có thể nâng thuyền, cũng có thể dìm chết ngươi!"
  },
  {
    id: "sontinh",
    name: "Sơn Tinh",
    title: "Chúa Ngàn Tản Viên",
    role: "Đỡ Đòn Bền Bỉ",
    type: "mountain",
    color1: "#2e7d32",
    color2: "#a5d6a7",
    accent: "#00e676",
    avatar: "assets/avatars/sontinh.webp",
    hp: 120,
    atk: 9,
    speed: 70,
    crit: 10,
    passive: "Dời Non Lấp Biển: Khi máu dưới 40%, tăng 50% sức phòng thủ.",
    ultimateName: "Địa Chấn Vạn Sơn",
    ultimateDesc: "Đập nát mặt đất gây 26 sát thương và làm choáng đối thủ.",
    ultimateDmg: 26,
    quote: "Núi Tản sừng sững, tri thức ngàn đời vững chãi!"
  },
  {
    id: "thanvuong",
    name: "Thần Vương",
    title: "Bá Chủ Thần Tộc",
    role: "Chiến Thần Đa Vũ Trụ",
    type: "godking",
    color1: "#6a1b9a",
    color2: "#ea80fc",
    accent: "#d500f9",
    avatar: "assets/avatars/thanvuong.jpg",
    hp: 105,
    atk: 14,
    speed: 90,
    crit: 30,
    passive: "Thần Quyền Bạo Liệt: Tỉ lệ chí mạng 30% x2 sát thương.",
    ultimateName: "Sấm Sét Thần Phạt",
    ultimateDesc: "Triệu hồi thiên lôi trút 35 sát thương cực hạn.",
    ultimateDmg: 35,
    quote: "Trước mặt Thần Vương, mọi đối thủ đều phải cúi đầu!"
  },
  {
    id: "hama",
    name: "Hama",
    title: "Thiềm Thừ Kim Tiền",
    role: "Sát Thủ Tốc Độ",
    type: "monk",
    color1: "#00695c",
    color2: "#80cbc4",
    accent: "#1de9b6",
    avatar: "assets/avatars/hama.jpg",
    hp: 90,
    atk: 15,
    speed: 98,
    crit: 35,
    passive: "Chí Mạng Tốc Độ: Đòn đánh chớp nhoáng có cơ hội -16 HP.",
    ultimateName: "Cóc Vàng Thần Công",
    ultimateDesc: "Tung tuyệt kỹ thần tốc gây 34 sát thương liên hoàn.",
    ultimateDmg: 34,
    quote: "Chưa kịp nhìn đã thua rồi!"
  },
  {
    id: "naruto",
    name: "Naruto",
    title: "Cửu Vĩ Anh Hùng",
    role: "Đấu Sĩ Bùng Nổ",
    type: "ninja",
    color1: "#e65100",
    color2: "#ffeb3b",
    accent: "#ff6d00",
    avatar: "assets/avatars/naruto.jpg",
    hp: 100,
    atk: 12,
    speed: 85,
    crit: 22,
    passive: "Ý Chí Hokage: Càng ít máu sát thương gây ra càng mạnh.",
    ultimateName: "Rasengan Siêu To Khổng Lồ",
    ultimateDesc: "Quả cầu xoắn ốc năng lượng cực đại gây 31 sát thương.",
    ultimateDmg: 31,
    quote: "Đó là nhẫn đạo của ta! Ta sẽ không bao giờ bỏ cuộc!"
  },
  {
    id: "satoru",
    name: "Satoru",
    title: "Chú Thuật Sư Mạnh Nhất",
    role: "Pháp Sư Không Gian",
    type: "godking",
    color1: "#1565c0",
    color2: "#e0f7fa",
    accent: "#00b0ff",
    avatar: "assets/avatars/satoru.jpg",
    hp: 95,
    atk: 16,
    speed: 92,
    crit: 28,
    passive: "Vô Hạ Hạn: 25% né hoàn toàn đòn đánh khi đối thủ trả lời sai.",
    ultimateName: "Bành Trướng Lãnh Địa: Vô Lượng Không Xứ",
    ultimateDesc: "Giam cầm tâm trí đối phương gây 36 sát thương.",
    ultimateDmg: 36,
    quote: "Đừng lo, bởi vì ta là kẻ mạnh nhất!"
  },
  {
    id: "merlin",
    name: "Merlin",
    title: "Đại Pháp Sư Huyền Bí",
    role: "Pháp Sư Cổ Đại",
    type: "wizard",
    color1: "#4527a0",
    color2: "#b39ddb",
    accent: "#7c4dff",
    avatar: "assets/avatars/merlin.jpg",
    hp: 90,
    atk: 14,
    speed: 82,
    crit: 20,
    passive: "Minh Triết Ngàn Năm: Năng lượng Tuyệt Kỹ hồi nhanh gấp đôi.",
    ultimateName: "Bão Phép Sao Băng",
    ultimateDesc: "Triệu hồi mưa sao băng huyền thoại gây 33 sát thương.",
    ultimateDmg: 33,
    quote: "Ma thuật cổ xưa sẽ soi rọi chân lý."
  },
  {
    id: "fujitora",
    name: "Fujitora",
    title: "Hổ Tím Trọng Lực",
    role: "Đấu Sĩ Khống Chế",
    type: "ninja",
    color1: "#512da8",
    color2: "#d1c4e9",
    accent: "#673ab7",
    avatar: "assets/avatars/fujitora.jpg",
    hp: 110,
    atk: 11,
    speed: 75,
    crit: 18,
    passive: "Trọng Lực Đè Nén: Làm giảm tốc độ bấm chuông của đối thủ.",
    ultimateName: "Thiên Thạch Trụy Lạc",
    ultimateDesc: "Kéo thiên thạch ngoài không gian giáng xuống gây 30 sát thương.",
    ultimateDmg: 30,
    quote: "Đôi mắt tuy mù nhưng tâm can ta nhìn thấu lẽ phải."
  },
  {
    id: "roberts",
    name: "Roberts",
    title: "Hải Tặc Bách Thắng",
    role: "Xạ Thủ Tầm Xa",
    type: "pirate",
    color1: "#b71c1c",
    color2: "#ef9a9a",
    accent: "#ff1744",
    avatar: "assets/avatars/roberts.jpg",
    hp: 95,
    atk: 13,
    speed: 89,
    crit: 30,
    passive: "Bắn Tỉa Hải Tặc: Đòn chí mạng gây thêm hiệu ứng xuất huyết.",
    ultimateName: "Đại Bác Hắc Long",
    ultimateDesc: "Bắn pháo hạm đội liên thanh gây 30 sát thương.",
    ultimateDmg: 30,
    quote: "Châu báu lớn nhất chính là tri thức của kẻ thắng cuộc!"
  },
  {
    id: "jack",
    name: "Jack",
    title: "Lưỡi Hái Hắc Ám",
    role: "Sát Thủ Tử Thần",
    type: "pirate",
    color1: "#263238",
    color2: "#90a4ae",
    accent: "#00e676",
    avatar: "assets/avatars/jack.jpg",
    hp: 90,
    atk: 16,
    speed: 94,
    crit: 40,
    passive: "Đoạt Hồn: Khi đối thủ dưới 30% HP, đòn đánh tăng 50% sức mạnh.",
    ultimateName: "Trảm Đoán Hư Không",
    ultimateDesc: "Vung lưỡi hái bóng đêm gây 35 sát thương.",
    ultimateDmg: 35,
    quote: "Bóng tối sẽ nuốt chửng những kẻ trả lời sai..."
  },
  {
    id: "kysi",
    name: "Kỵ Sĩ",
    title: "Thánh Quang Hiệp Sĩ",
    role: "Đấu Sĩ Tiên Phong",
    type: "knight",
    color1: "#37474f",
    color2: "#cfd8dc",
    accent: "#ffd700",
    avatar: "assets/avatars/kysi.webp",
    hp: 110,
    atk: 11,
    speed: 80,
    crit: 15,
    passive: "Lật Kèo Phút Cuối: Tăng mạnh sát thương khi trận đấu kéo dài.",
    ultimateName: "Thánh Kiếm Công Lý",
    ultimateDesc: "Vung thanh kiếm ánh sáng tối thượng gây 29 sát thương.",
    ultimateDmg: 29,
    quote: "Thanh kiếm này chỉ phục vụ cho chân lý và sự thật!"
  },
  {
    id: "cybermecha",
    name: "Cyber Mecha",
    title: "Chiến Binh Số Hóa",
    role: "Công Nghệ Tương Lai",
    type: "cyber",
    color1: "#006064",
    color2: "#80deea",
    accent: "#00e5ff",
    avatar: "assets/avatars/cybermecha.webp",
    hp: 100,
    atk: 13,
    speed: 86,
    crit: 25,
    passive: "Quét Dữ Liệu: Tối ưu phản xạ bấm chuông và né đòn 20%.",
    ultimateName: "Chùm Hạt Plasma Tối Thượng",
    ultimateDesc: "Bắn pháo hủy diệt công nghệ cao gây 32 sát thương.",
    ultimateDmg: 32,
    quote: "Hệ thống đã nạp đủ dữ liệu chiến thắng!"
  },
  {
    id: "loithan",
    name: "Lôi Thần",
    title: "Cuồng Nộ Sấm Sét",
    role: "Đấu Sĩ Bão Tố",
    type: "godking",
    color1: "#fbc02d",
    color2: "#fff59d",
    accent: "#ffea00",
    avatar: "assets/avatars/loithan.webp",
    hp: 100,
    atk: 14,
    speed: 93,
    crit: 30,
    passive: "Tích Điện: Mỗi câu trả lời đúng tăng 10% tốc độ lượt sau.",
    ultimateName: "Bão Điện Thiên Đình",
    ultimateDesc: "Xé toạc bầu trời phóng điện giáng 32 sát thương.",
    ultimateDmg: 32,
    quote: "Sấm sét sẽ trừng phạt những câu trả lời ngớ ngẩn!"
  },
  {
    id: "bangnu",
    name: "Băng Nữ",
    title: "Nữ Hoàng Băng Giá",
    role: "Pháp Sư Khống Chế",
    type: "water",
    color1: "#00838f",
    color2: "#80deea",
    accent: "#00e5ff",
    avatar: "assets/avatars/bangnu.webp",
    hp: 95,
    atk: 13,
    speed: 84,
    crit: 22,
    passive: "Hàn Băng Thấu Xương: Đóng băng 3s thời gian suy nghĩ của đối phương.",
    ultimateName: "Bão Tuyết Vĩnh Cửu",
    ultimateDesc: "Đóng băng đấu trường gây 30 sát thương.",
    ultimateDmg: 30,
    quote: "Cái lạnh của tri thức sẽ làm nguội ngắt nhiệt huyết của ngươi!"
  },
  {
    id: "phuthuy",
    name: "Phù Thủy Tối Thượng",
    title: "Bậc Thầy Bí Thuật",
    role: "Pháp Sư Thời Gian",
    type: "wizard",
    color1: "#4a148c",
    color2: "#ce93d8",
    accent: "#ba68c8",
    avatar: "assets/avatars/phuthuy.webp",
    hp: 92,
    atk: 14,
    speed: 87,
    crit: 26,
    passive: "Dòng Chảy Thời Gian: Tự động cộng thêm 5 giây thời gian trả lời.",
    ultimateName: "Bẻ Cong Không Gian",
    ultimateDesc: "Đảo lộn thời không gây 33 sát thương.",
    ultimateDmg: 33,
    quote: "Ta đã thấy trước 14 triệu kết cục, và tất cả ngươi đều bại!"
  },
  {
    id: "ninja",
    name: "Ninja Ám Ảnh",
    title: "Huyền Thoại Bóng Đêm",
    role: "Sát Thủ Tàng Hình",
    type: "ninja",
    color1: "#212121",
    color2: "#757575",
    accent: "#ff1744",
    avatar: "assets/avatars/ninja.webp",
    hp: 88,
    atk: 16,
    speed: 99,
    crit: 45,
    passive: "Nhất Kích Tất Sát: Tỉ lệ chí mạng lên tới 45%.",
    ultimateName: "Phi Đao Đoạt Mệnh",
    ultimateDesc: "Tung ám khí tử thần chớp nhoáng gây 36 sát thương.",
    ultimateDmg: 36,
    quote: "Kẻ thua cuộc sẽ không kịp nghe tiếng bước chân ta."
  }
];

// 8 BATTLE ARENAS / MAPS
const MAPS_DATA = [
  {
    id: "hust",
    name: "Học Viện Cyber Bách Khoa",
    desc: "Giảng đường công nghệ HUST rực sắc đỏ cờ hoa và tri thức pháp luật đỉnh cao",
    theme: "#330505",
    gradient: "linear-gradient(to top, #660000 0%, #200000 70%, #0a0000 100%)",
    bgClass: "bg-hust",
    badge: "🎓 BÁCH KHOA"
  },
  {
    id: "space",
    name: "Thiên Hà Không Gian",
    desc: "Vũ trụ vô tận với các vì sao lấp lánh và tinh vân huyền bí",
    theme: "#0b0c2a",
    gradient: "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)",
    bgClass: "bg-space",
    badge: "🌌 ĐA VŨ TRỤ"
  },
  {
    id: "lava",
    name: "Cung Điện Hỏa Diệm",
    desc: "Núi lửa rực cháy với nham thạch sôi trào và năng lượng cuồng nộ",
    theme: "#3e0a0a",
    gradient: "linear-gradient(to top, #4a0000 0%, #200000 50%, #0d0000 100%)",
    bgClass: "bg-lava",
    badge: "🌋 NÚI LỬA"
  },
  {
    id: "boxing",
    name: "Võ Đài Cyber Sport",
    desc: "Đấu trường thể thao hiện đại với ánh đèn laser và khán đài cuồng nhiệt",
    theme: "#1a1235",
    gradient: "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
    bgClass: "bg-boxing",
    badge: "🥊 VÕ ĐÀI"
  },
  {
    id: "temple",
    name: "Đền Thần Cổ Đại",
    desc: "Cung điện La Mã cổ kính với các cột đá thần thánh ngàn năm",
    theme: "#2d1b0d",
    gradient: "linear-gradient(to top, #3a2010 0%, #170d05 100%)",
    bgClass: "bg-temple",
    badge: "🏛️ ĐỀN THẦN"
  },
  {
    id: "frost",
    name: "Vực Thẳm Băng Giá",
    desc: "Vùng đất hàn băng vĩnh cửu với những tảng băng pha lê sắc nhọn",
    theme: "#072033",
    gradient: "linear-gradient(to top, #0b3c5d 0%, #04101c 100%)",
    bgClass: "bg-frost",
    badge: "❄️ HÀN BĂNG"
  },
  {
    id: "thunder",
    name: "Đỉnh Núi Lôi Điện",
    desc: "Đỉnh non cao sấm chớp rền vang, dòng sét cuộn trào",
    theme: "#211636",
    gradient: "linear-gradient(to top, #2d134d 0%, #110720 100%)",
    bgClass: "bg-thunder",
    badge: "⚡ LÔI ĐIỆN"
  },
  {
    id: "pagoda",
    name: "Chùa Mây Thần Võ",
    desc: "Lôi đài trên mây lơ lửng, nơi các cao thủ võ lâm tề tựu",
    theme: "#1f2d24",
    gradient: "linear-gradient(to top, #133926 0%, #08170f 100%)",
    bgClass: "bg-pagoda",
    badge: "🏯 THẦN VÕ"
  }
];

// PRESET QUESTION PACKS (100% PHÁP LUẬT ĐẠI CƯƠNG HUST)
const QUESTION_PACKS = [
  {
    id: "hust_all",
    name: "🏛️ Toàn Bộ 4,800+ Câu Pháp Luật Đại Cương HUST (Chuẩn Điểm A)",
    desc: "Kho tàng tổng hợp hơn 4,800 câu hỏi trắc nghiệm chuẩn bài giảng & giáo trình ĐHBK Hà Nội",
    icon: "fa-scale-balanced",
    questions: [] // Populated dynamically from QUIZ_BANK and QUIZ_DATA
  },
  {
    id: "hust_exam_1",
    name: "🎯 Đề số 01: Chuẩn KTPH 40 câu (Kỳ 2024.1 - Đề 401)",
    desc: "Bộ đề chuẩn ma trận kỳ gần đây nhất, phân bổ chuẩn xác 7 chương của bài giảng HUST",
    icon: "fa-file-circle-check",
    questions: []
  },
  {
    id: "hust_exam_2",
    name: "🎯 Đề số 02: Chuẩn KTPH 40 câu (Kỳ 2023.2 - Đề 402)",
    desc: "Bộ đề thi chính thức kỳ 2023.2 ĐHBK Hà Nội",
    icon: "fa-file-circle-check",
    questions: []
  },
  {
    id: "hust_exam_3",
    name: "🎯 Đề số 03: Chuẩn KTPH 40 câu (Kỳ 2023.1 - Đề 403)",
    desc: "Bộ đề thi chính thức kỳ 2023.1 ĐHBK Hà Nội",
    icon: "fa-file-circle-check",
    questions: []
  },
  {
    id: "hust_exam_5",
    name: "⭐ Đề số 05: Đề Tinh Hoa Điểm A+ HUST (Đề 405)",
    desc: "Tổng hợp các câu hỏi phân loại học lực A và A+ từ kho đề thi Bách Khoa",
    icon: "fa-award",
    questions: []
  },
  {
    id: "hust_exam_trap",
    name: "⚡ Đề số 06: Chuyên Đề 40 Câu Bẫy & Điểm Liệt HUST (Đề 406)",
    desc: "Tổng hợp các câu hỏi gài bẫy kinh điển về năng lực hành vi, say rượu, chế tài, án lệ...",
    icon: "fa-triangle-exclamation",
    questions: []
  },
  {
    id: "hust_ch2",
    name: "🏛️ Chương 2: Những Vấn Đề Cơ Bản Về Nhà Nước (621 câu)",
    desc: "Nguồn gốc, bản chất, kiểu, chức năng, hình thức nhà nước và bộ máy nhà nước",
    icon: "fa-landmark",
    questions: []
  },
  {
    id: "hust_ch3",
    name: "⚖️ Chương 3: Bộ Máy Nhà Nước CHXHCN Việt Nam (720 câu)",
    desc: "Quốc hội, Chủ tịch nước, Chính phủ, TAND, VKSND, HĐND & UBND",
    icon: "fa-building-columns",
    questions: []
  },
  {
    id: "hust_ch4",
    name: "📜 Chương 4: Những Vấn Đề Cơ Bản Về Pháp Luật (1,130 câu)",
    desc: "Nguồn gốc, quy phạm pháp luật (giả định - quy định - chế tài), quan hệ pháp luật, vi phạm pháp luật",
    icon: "fa-scroll",
    questions: []
  },
  {
    id: "hust_ch5",
    name: "🌍 Chương 5: Các Hệ Thống Pháp Luật Trên Thế Giới (409 câu)",
    desc: "Hệ thống Dân luật (Civil Law), Thông luật (Common Law), Pháp luật Hồi giáo, XHCN",
    icon: "fa-globe",
    questions: []
  },
  {
    id: "hust_ch6",
    name: "🇻🇳 Chương 6: Hệ Thống Pháp Luật Việt Nam (1,177 câu)",
    desc: "Ngành luật Hiến pháp, Hành chính, Hình sự, Dân sự, Hôn nhân gia đình, Lao động",
    icon: "fa-flag",
    questions: []
  },
  {
    id: "hust_ch7",
    name: "💡 Chương 7: Pháp Luật Sở Hữu Trí Tuệ & KH-CN (719 câu)",
    desc: "Quyền tác giả, quyền sở hữu công nghiệp (sáng chế, nhãn hiệu), chuyển giao công nghệ",
    icon: "fa-lightbulb",
    questions: []
  }
];

// Fallback legal questions in case files are loaded individually
const FALLBACK_HUST_QUESTIONS = [
  {
    "id": "fb_1",
    "chapter": "Chương 5: Các hệ thống pháp luật trên thế giới",
    "question": "Theo bảng so sánh tại Slide 6 Chương 5 HUST, đặc điểm nổi bật về thủ tục tố tụng và vai trò của Tòa án trong hệ thống Common Law là gì?",
    "options": [
      "Tố tụng tranh tụng; Tòa án là cơ quan làm luật lần thứ hai (sáng tạo ra án lệ); Thẩm phán và luật sư rất được coi trọng",
      "Tố tụng thẩm vấn / tố tụng viết; Tòa án chỉ áp dụng luật do Nghị viện ban hành",
      "Thẩm phán được đào tạo quy trình riêng và tuyệt đối không được giải thích luật",
      "Không có sự tham gia của luật sư trong các phiên tòa"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 6 Chương 5 HUST: Common Law áp dụng mô hình tố tụng tranh tụng, Tòa án là cơ quan làm luật lần thứ hai sáng tạo ra án lệ, thẩm phán và luật sư được chọn lọc danh tiếng và rất được coi trọng."
  },
  {
    "id": "fb_2",
    "chapter": "Chương 6: Hệ thống pháp luật của Việt Nam",
    "question": "Theo Slide 26 Chương 6 HUST, người phạm tội trong tình trạng say do dùng rượu hoặc chất kích thích mạnh khác thì trách nhiệm hình sự của họ như thế nào?",
    "options": [
      "Vẫn phải chịu trách nhiệm hình sự bình thường",
      "Được miễn trách nhiệm hình sự vì mất khả năng nhận thức tạm thời",
      "Được coi là tình tiết giảm nhẹ trách nhiệm hình sự",
      "Chuyển sang xử phạt vi phạm hành chính"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 26 Chương 6 HUST & Điều 13 BLHS: Người phạm tội trong tình trạng say do dùng rượu hoặc chất kích thích mạnh khác thì VẪN PHẢI CHỊU TRÁCH NHIỆM HÌNH SỰ (không được coi là tình tiết loại trừ trách nhiệm)."
  },
  {
    "id": "fb_3",
    "chapter": "Chương 1: Nhập môn Pháp luật đại cương",
    "question": "Các môn học: Khoa học điều tra hình sự, Tội phạm học, Y học tư pháp, Tâm lý học tư pháp thuộc tiểu hệ thống khoa học pháp lý nào?",
    "options": [
      "Các khoa học pháp lý cơ bản",
      "Các khoa học pháp lý chuyên ngành",
      "Các khoa học pháp lý quốc tế",
      "Các khoa học pháp lý ứng dụng – kỹ thuật"
    ],
    "answer": 3,
    "explanation": "Căn cứ Slide 7 Chương 1 HUST: Các KHPL ứng dụng - kỹ thuật sử dụng kết luận của các khoa học tự nhiên - kỹ thuật (vật lý, hóa học, y học, sinh học, toán...) để giải quyết vấn đề pháp lý (điều tra hình sự, tội phạm học, y học tư pháp, tâm lý tư pháp)."
  },
  {
    "id": "fb_4",
    "chapter": "Chương 2: Những vấn đề cơ bản về Nhà nước",
    "question": "Theo Slide bài giảng HUST, chính thể Cộng hòa quý tộc chủ nô từng xuất hiện điển hình ở những quốc gia nào trong lịch sử?",
    "options": [
      "Cộng hòa quý tộc chủ nô Spac (Sparta) ở Hy Lạp và Cộng hòa quý tộc La Mã",
      "Nhà nước Aten thời kỳ Pericles",
      "Vương quốc Anh và Vương quốc Tây Ban Nha",
      "Nhà nước phong kiến Trung Quốc thời Tần"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 24 Chương 2 HUST: Chính thể Cộng hòa quý tộc chỉ có tầng lớp quý tộc mới có quyền bầu cử để thành lập cơ quan quyền lực cao nhất; điển hình là Cộng hòa quý tộc chủ nô Spac ở Hy Lạp và Cộng hòa quý tộc La Mã."
  },
  {
    "id": "fb_5",
    "chapter": "Chương 7: Pháp luật Sở hữu trí tuệ & KH-CN",
    "question": "Theo Bảng xếp hạng Top 500 thương hiệu giá trị nhất thế giới 2021 (Brand Finance) trích trong Slide 7 Chương 7 HUST, thương hiệu xếp hạng 1 thế giới và đại diện duy nhất của Việt Nam lần lượt là:",
    "options": [
      "Apple (263,4 tỷ USD) và Viettel (hạng 325, giá trị 6,0 tỷ USD)",
      "Amazon và Vinamilk",
      "Google và Vietcombank",
      "Microsoft và FPT"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 7 Chương 7 HUST: Top 1 là Apple (Mỹ, 263,4 tỷ USD); Việt Nam có đại diện duy nhất là Viettel xếp thứ hạng 325 với giá trị 6,0 tỷ USD."
  },
  {
    "id": "fb_6",
    "chapter": "Chương 2: Những vấn đề cơ bản về Nhà nước",
    "question": "Đặc trưng cơ bản của công dân sinh sống trong một Nhà nước có hình thức cấu trúc Liên bang là gì?",
    "options": [
      "Chỉ có 01 quốc tịch duy nhất",
      "Có hai hệ thống nhà nước, hai hệ thống pháp luật và công dân có hai quốc tịch (quốc tịch bang và quốc tịch liên bang)",
      "Không có quyền bầu cử tổng thống",
      "Chỉ áp dụng tập quán pháp, không có hiến pháp"
    ],
    "answer": 1,
    "explanation": "Căn cứ Slide 25 Chương 2 HUST: Nhà nước liên bang có 2 hệ thống nhà nước, 2 hệ thống pháp luật và công dân có hai quốc tịch (quốc tịch bang và quốc tịch nhà nước liên bang)."
  },
  {
    "id": "fb_7",
    "chapter": "Chương 6: Hệ thống pháp luật Việt Nam",
    "question": "Tội phạm rất nghiêm trọng theo Điều 9 Bộ luật Hình sự Việt Nam có mức cao nhất của khung hình phạt là:",
    "options": [
      "Đến 03 năm tù",
      "Từ trên 03 năm đến 07 năm tù",
      "Từ trên 07 năm đến 15 năm tù",
      "Từ trên 15 năm đến 20 năm tù, tù chung thân hoặc tử hình"
    ],
    "answer": 2,
    "explanation": "Điều 9 BLHS: Tội phạm rất nghiêm trọng có mức cao nhất của khung hình phạt từ trên 07 năm đến 15 năm tù."
  },
  {
    "id": "fb_8",
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "question": "Tình huống Slide 92 Chương 4 HUST: \"Vụ xe khách bị lũ cuốn tại Hà Tĩnh năm 2010 làm 20 người thiệt mạng. Khi lái xe cố gắng điều khiển xe vượt qua đoạn đường có dòng nước lũ chảy xiết, tin tưởng rằng trọng lượng và công suất của xe có thể băng qua được\". Người lái xe đã phạm lỗi gì?",
    "options": [
      "Lỗi vô ý vì quá tự tin",
      "Lỗi vô ý do cẩu thả",
      "Lỗi cố ý trực tiếp",
      "Lỗi cố ý gián tiếp"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 92 Chương 4 HUST: Lỗi vô ý vì quá tự tin. Về lý trí: Lái xe thấy trước dòng nước chảy xiết nguy hiểm nhưng tin tưởng xe mình to, khỏe sẽ băng qua an toàn; Về ý chí: Hoàn toàn không mong muốn và không để mặc hậu quả chết người xảy ra."
  },
  {
    "id": "fb_9",
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "question": "Theo Slide bài giảng HUST, Quốc hội họp mỗi năm bao nhiêu kỳ thường kỳ?",
    "options": [
      "1 kỳ/năm",
      "2 kỳ/năm (thường kỳ)",
      "4 kỳ/năm",
      "Mỗi tháng 1 kỳ"
    ],
    "answer": 1,
    "explanation": "Căn cứ Slide 11 Chương 3 HUST: Quốc hội hoạt động chủ yếu thông qua các kỳ họp, thường lệ 2 kỳ/năm gọi là thường kỳ (ngoài ra có các kỳ họp bất thường)."
  },
  {
    "id": "fb_10",
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "question": "Theo Slide 64 Chương 4 HUST, người từ đủ 6 tuổi đến chưa đủ 18 tuổi thuộc nhóm năng lực hành vi nào?",
    "options": [
      "Người không có năng lực hành vi",
      "Người có năng lực hành vi chưa đầy đủ (một phần)",
      "Người có năng lực hành vi đầy đủ",
      "Người bị mất năng lực hành vi"
    ],
    "answer": 1,
    "explanation": "Căn cứ Slide 63-64 Chương 4 HUST: Dưới 6 tuổi: Không có NLHV; Từ đủ 6 tuổi đến chưa đủ 18 tuổi: Có NLHV chưa đầy đủ; Từ đủ 18 tuổi trở lên: Đầy đủ NLHV."
  },
  {
    "id": "fb_11",
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "question": "Theo thống kê tại Slide bài giảng Chương 3 HUST, Viện kiểm sát nhân dân cấp cao hiện có trụ sở đặt tại 03 thành phố nào?",
    "options": [
      "Hà Nội, Hải Phòng, Cần Thơ",
      "Hà Nội, Đà Nẵng và TP. Hồ Chí Minh",
      "Hà Nội, Huế, TP. Hồ Chí Minh",
      "Đà Nẵng, Nha Trang, Cần Thơ"
    ],
    "answer": 1,
    "explanation": "Căn cứ Slide 29 Chương 3 HUST: VKSND cấp cao hiện có tại 03 thành phố: Hà Nội, Đà Nẵng và TP. Hồ Chí Minh."
  },
  {
    "id": "fb_12",
    "chapter": "Chương 6: Hệ thống pháp luật của Việt Nam",
    "question": "Theo Slide 32 Chương 6 HUST và BLHS, người không tố giác tội phạm là ông, bà, cha, mẹ, con, cháu, anh chị em ruột, vợ hoặc chồng của người phạm tội CHỈ phải chịu trách nhiệm hình sự trong trường hợp nào?",
    "options": [
      "Chỉ khi không tố giác các tội xâm phạm an ninh quốc gia hoặc các tội khác là tội đặc biệt nghiêm trọng",
      "Phải chịu trách nhiệm hình sự về mọi tội phạm mà người thân thực hiện",
      "Hoàn toàn được miễn trách nhiệm hình sự trong mọi trường hợp do quan hệ huyết thống",
      "Chỉ phải chịu trách nhiệm đối với tội phạm về kinh tế và chức vụ"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 32 Chương 6 HUST & Điều 19 BLHS: Người không tố giác là người thân ruột thịt (ông bà, cha mẹ, con, cháu, anh chị em ruột, vợ/chồng) chỉ phải chịu TNHS trong trường hợp không tố giác các tội xâm phạm an ninh quốc gia hoặc các tội khác là tội đặc biệt nghiêm trọng."
  },
  {
    "id": "fb_13",
    "chapter": "Chương 5: Các hệ thống pháp luật trên thế giới",
    "question": "Hệ thống pháp luật Common Law (Anh - Mỹ / Thông luật) bao gồm hai bộ phận pháp luật cấu thành chủ yếu là gì theo Slide 2 Chương 5 HUST?",
    "options": [
      "Tiền lệ pháp luật (Common Law) và Luật công bình (Equity Law)",
      "Luật công (Public Law) và Luật tư (Private Law)",
      "Luật thành văn và Tập quán pháp",
      "Luật tôn giáo và Luật hình sự"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 2 Chương 5 HUST: Hệ thống pháp luật Common Law bao gồm hai bộ phận là Tiền lệ pháp luật (Common law) và Luật công bình (Equity law)."
  },
  {
    "id": "fb_14",
    "chapter": "Chương 6: Hệ thống pháp luật của Việt Nam",
    "question": "Theo Slide 48 Chương 6 HUST, hình thức di chúc bằng lời nói (di chúc miệng) chỉ được công nhận hợp pháp khi thỏa mãn điều kiện nào?",
    "options": [
      "Người lập di chúc tính mạng bị đe dọa không thể lập bằng văn bản, trước ít nhất 02 người làm chứng, trong 05 ngày phải ghi chép và công chứng/chứng thực; sau 3 tháng nếu còn sống minh mẫn thì mặc nhiên hủy bỏ",
      "Lập trước mặt công chứng viên và có video ghi âm bất kỳ lúc nào",
      "Chỉ cần có con trưởng hoặc người thừa kế làm chứng và ký tên",
      "Ghi âm vào điện thoại cá nhân mà không cần người làm chứng"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 48 Chương 6 HUST & BLDS 2015: Di chúc miệng chỉ được lập khi tính mạng bị cái chết đe dọa không thể lập văn bản; phải có ít nhất 2 người làm chứng; trong 05 ngày người làm chứng ghi chép, ký tên và công chứng/chứng thực; sau 3 tháng nếu người lập còn sống, minh mẫn thì di chúc miệng mặc nhiên bị hủy bỏ."
  },
  {
    "id": "fb_15",
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "question": "Theo Slide bài giảng HUST, Chính phủ làm việc theo chế độ nào và quyết định theo nguyên tắc nào?",
    "options": [
      "Làm việc theo chế độ thủ trưởng tuyệt đối, quyết định bởi Thủ tướng",
      "Làm việc theo chế độ tập thể, quyết định theo đa số",
      "Làm việc theo chế độ hội đồng cố vấn, quyết định theo đồng thuận 100%",
      "Làm việc theo sự chỉ đạo trực tiếp của Tòa án nhân dân tối cao"
    ],
    "answer": 1,
    "explanation": "Căn cứ Slide 21 Chương 3 HUST: Chính phủ làm việc theo chế độ tập thể, quyết định theo đa số."
  },
  {
    "id": "fb_16",
    "chapter": "Chương 6: Hệ thống pháp luật của Việt Nam",
    "question": "Theo Slide 27 Chương 6 HUST, giai đoạn chuẩn bị phạm tội thì người chuẩn bị phạm tội phải chịu trách nhiệm hình sự khi chuẩn bị thực hiện loại tội nào?",
    "options": [
      "Người chuẩn bị phạm tội rất nghiêm trọng hoặc tội đặc biệt nghiêm trọng",
      "Người chuẩn bị phạm mọi loại tội phạm kể cả tội ít nghiêm trọng",
      "Người chuẩn bị phạm tội nghiêm trọng trở lên",
      "Chuẩn bị phạm tội chưa gây ra hậu quả thực tế nên không bao giờ bị xử lý hình sự"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 27 Chương 6 HUST & Điều 14 BLHS: Người chuẩn bị phạm một tội rất nghiêm trọng hoặc một tội đặc biệt nghiêm trọng thì phải chịu trách nhiệm hình sự về tội định thực hiện."
  },
  {
    "id": "fb_17",
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "question": "Theo Hiến pháp năm 2013, cơ quan nào là 'Cơ quan đại biểu cao nhất của Nhân dân, cơ quan quyền lực nhà nước cao nhất của nước CHXHCN Việt Nam'?",
    "options": [
      "Chính phủ",
      "Chủ tịch nước",
      "Quốc hội",
      "Tòa án nhân dân tối cao"
    ],
    "answer": 2,
    "explanation": "Điều 69 Hiến pháp 2013: Quốc hội là cơ quan đại biểu cao nhất của Nhân dân, cơ quan quyền lực nhà nước cao nhất của nước Cộng hòa xã hội chủ nghĩa Việt Nam."
  },
  {
    "id": "fb_18",
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "question": "Tình huống thi kết thúc học phần Slide 105 Chương 4 HUST: \"A và B cùng học đại học. Do mâu thuẫn cãi vã, khi cùng đi qua cầu sông Hồng, biết B không biết bơi, A đã đẩy B xuống sông. A ngồi trên bờ nhìn B chìm dần và kêu cứu, khi B đã chìm hẳn thì A mới bỏ về\". Lỗi của A đối với cái chết của B là:",
    "options": [
      "Lỗi cố ý trực tiếp (hoặc cố ý gián tiếp đối với việc bỏ mặc nạn nhân chìm)",
      "Lỗi vô ý vì quá tự tin",
      "Lỗi vô ý do cẩu thả",
      "Phòng vệ chính đáng"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 104-105 Chương 4 HUST: Hành vi đẩy bạn xuống sông Hồng khi biết bạn không biết bơi và ngồi trên bờ nhìn nạn nhân chìm dần rồi bỏ về là hành vi có lỗi cố ý (thấy trước nạn nhân sẽ chết và mong muốn hoặc bỏ mặc cho hậu quả chết người xảy ra), cấu thành Tội giết người theo Bộ luật Hình sự."
  },
  {
    "id": "fb_19",
    "chapter": "Chương 6: Hệ thống pháp luật của Việt Nam",
    "question": "Hai loại hình phạt nào sau đây trong BLHS vừa có thể là hình phạt chính, vừa có thể được áp dụng là hình phạt bổ sung (khi không áp dụng là hình phạt chính)?",
    "options": [
      "Phạt tiền và Trục xuất",
      "Cảnh cáo và Tù có thời hạn",
      "Cải tạo không giam giữ và Quản chế",
      "Tịch thu tài sản và Tước quyền công dân"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 34 - 35 Chương 6 HUST & Điều 32 BLHS: Phạt tiền và Trục xuất có thể là hình phạt chính độc lập, hoặc là hình phạt bổ sung khi không được áp dụng là hình phạt chính."
  },
  {
    "id": "fb_20",
    "chapter": "Chương 6: Hệ thống pháp luật của Việt Nam",
    "question": "Theo Slide 34 Chương 6 HUST, nguyên tắc áp dụng hình phạt chính trong Bộ luật Hình sự Việt Nam là gì?",
    "options": [
      "Đối với mỗi tội phạm, người phạm tội chỉ bị áp dụng một hình phạt chính",
      "Tòa án có thể tuyên đồng thời 2 hình phạt chính như phạt tù và cải tạo không giam giữ",
      "Mỗi tội phạm phải có ít nhất 2 hình phạt chính",
      "Hình phạt chính luôn phải đi kèm với án tử hình"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 34 Chương 6 HUST: Hình phạt chính được tuyên độc lập; đối với mỗi tội phạm, người phạm tội CHỈ BỊ ÁP DỤNG MỘT HÌNH PHẠT CHÍNH."
  },
  {
    "id": "fb_21",
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "question": "Tình huống Slide 93 Chương 4 HUST: \"Một người đi bộ qua đường vô thức, không quan sát khiến 2 xe chạy ngược chiều do bất ngờ đánh lái tránh người này đã đâm vào nhau làm chết người\". Người đi bộ này vi phạm với hình thức lỗi nào?",
    "options": [
      "Lỗi vô ý do cẩu thả",
      "Lỗi vô ý vì quá tự tin",
      "Lỗi cố ý gián tiếp",
      "Sự kiện bất ngờ, không có lỗi"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 93 Chương 4 HUST: Lỗi vô ý do cẩu thả. Về lý trí: Người đi bộ do cẩu thả, khinh suất không thấy trước hậu quả nguy hiểm mặc dù khi tham gia giao thông buộc phải thấy và có thể thấy trước; Về ý chí: Không mong muốn hậu quả xảy ra."
  },
  {
    "id": "fb_22",
    "chapter": "Chương 7: Pháp luật Sở hữu trí tuệ & KH-CN",
    "question": "Theo Slide 27 Chương 7 HUST, Bằng bảo hộ giống cây trồng có thời hạn hiệu lực là bao nhiêu năm?",
    "options": [
      "25 năm đối với giống cây thân gỗ và cây nho; 20 năm đối với các giống cây trồng khác",
      "20 năm đối với mọi loại giống cây trồng",
      "10 năm và được gia hạn thêm 10 năm",
      "50 năm kể từ ngày được Bộ Nông nghiệp & PTNT cấp bằng"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 27 Chương 7 HUST & Luật SHTT: Bằng bảo hộ giống cây trồng có hiệu lực từ ngày cấp đến hết 25 năm đối với giống cây thân gỗ và cây nho; đến hết 20 năm đối với các giống cây trồng khác."
  },
  {
    "id": "fb_23",
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "question": "Theo Slide 64 Chương 4 HUST, trường hợp nào sau đây được coi là \"Người bị hạn chế năng lực hành vi\"?",
    "options": [
      "Người nghiện ma túy, nghiện các chất kích thích khác dẫn đến phá tán tài sản của gia đình (bị Tòa án tuyên bố)",
      "Người bị bệnh tâm thần bẩm sinh không thể nhận thức",
      "Người dưới 6 tuổi",
      "Người bị liệt toàn thân nhưng đầu óc hoàn toàn minh mẫn"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 64 Chương 4 HUST & BLDS 2015: Người nghiện ma túy, nghiện chất kích thích dẫn đến phá tán tài sản của gia đình theo yêu cầu của người có quyền lợi liên quan có thể bị Tòa án tuyên bố hạn chế năng lực hành vi."
  },
  {
    "id": "fb_24",
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "question": "Theo quy định của Hiến pháp 2013 và bài giảng HUST, bao nhiêu ngày trước khi Quốc hội hết nhiệm kỳ thì Quốc hội khóa mới phải được bầu xong?",
    "options": [
      "30 ngày",
      "60 ngày",
      "90 ngày",
      "45 ngày"
    ],
    "answer": 1,
    "explanation": "Căn cứ Slide 11 Chương 3 HUST & Hiến pháp 2013: Nhiệm kỳ mỗi khóa Quốc hội là 05 năm. 60 ngày trước khi Quốc hội hết nhiệm kỳ, Quốc hội khóa mới phải được bầu xong."
  },
  {
    "id": "fb_25",
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "question": "Tình huống Slide 91 Chương 4 HUST: \"Ông A kinh doanh vườn cây cảnh tiền tỷ. Để đề phòng bị trộm cắp, ông dùng dây điện trần nối nguồn điện bao quanh hàng rào từ tối đến sáng. Anh B đi ăn nhậu về vô ý ngã vào hàng rào nhà ông A và bị điện giật tử vong\". Ông A đã thực hiện hành vi vi phạm với hình thức lỗi nào?",
    "options": [
      "Lỗi cố ý trực tiếp",
      "Lỗi cố ý gián tiếp",
      "Lỗi vô ý vì quá tự tin",
      "Lỗi vô ý do cẩu thả"
    ],
    "answer": 1,
    "explanation": "Căn cứ Slide 91 Chương 4 HUST: Lỗi cố ý gián tiếp. Về lý trí: Ông A nhận thức rõ việc giăng dây điện trần là nguy hiểm đến tính mạng con người và thấy trước hậu quả có thể làm chết người; Về ý chí: Ông A không mong muốn ai chết nhưng có ý thức chấp nhận, để mặc cho hậu quả xảy ra."
  },
  {
    "id": "fb_26",
    "chapter": "Chương 6: Hệ thống pháp luật của Việt Nam",
    "question": "Theo Slide 29 Chương 6 HUST, chủ thể tự ý nửa chừng chấm dứt việc phạm tội (tự mình không thực hiện tội phạm đến cùng tuy không có gì ngăn cản) sẽ được pháp luật xử lý như thế nào?",
    "options": [
      "Được miễn trách nhiệm hình sự về tội định phạm (nếu hành vi thực tế đã thực hiện có đủ yếu tố cấu thành tội khác thì chịu TNHS về tội này)",
      "Vẫn bị truy cứu trách nhiệm hình sự bình thường như tội phạm hoàn thành",
      "Bị áp dụng hình phạt tù nhưng được giảm một nửa mức án",
      "Buộc phải bồi thường gấp đôi thiệt hại dự kiến"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 29 Chương 6 HUST & Điều 16 BLHS: Tự ý nửa chừng chấm dứt phạm tội được miễn trách nhiệm hình sự về tội định phạm; nếu hành vi thực tế đã thực hiện cấu thành một tội khác thì phải chịu TNHS về tội này."
  },
  {
    "id": "fb_27",
    "chapter": "Chương 2: Những vấn đề cơ bản về Nhà nước",
    "question": "Theo Slide bài giảng HUST, Nhà nước cổ đại nào ra đời trực tiếp từ những mâu thuẫn giai cấp đối kháng phát sinh sâu sắc trong lòng xã hội thị tộc?",
    "options": [
      "Nhà nước Aten",
      "Nhà nước La Mã",
      "Nhà nước Giéc Manh",
      "Nhà nước Ai Cập cổ đại"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 9 Chương 2 HUST: Nhà nước Aten ra đời trực tiếp từ những mâu thuẫn giai cấp đối kháng phát sinh trong lòng xã hội thị tộc; Nhà nước La Mã ra đời thúc đẩy bởi đấu tranh của thường dân chống quý tộc thị tộc La Mã; Nhà nước Giéc Manh ra đời sau khi xâm chiếm đế chế La Mã."
  },
  {
    "id": "fb_28",
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "question": "Điều 125 BLHS (Tội giết người trong trạng thái tinh thần bị kích động mạnh): \"Người nào giết người trong trạng thái tinh thần bị kích động mạnh do hành vi trái pháp luật nghiêm trọng của nạn nhân... thì bị phạt tù từ 06 tháng đến 03 năm\". Cấu trúc của quy phạm này bao gồm các bộ phận nào?",
    "options": [
      "Đầy đủ cả 3 bộ phận: Giả định, Quy định và Chế tài",
      "Chỉ có bộ phận Giả định và Chế tài (khuyết bộ phận Quy định)",
      "Chỉ có bộ phận Giả định và Quy định",
      "Chỉ có bộ phận Quy định và Chế tài"
    ],
    "answer": 1,
    "explanation": "Căn cứ Ví dụ 2 Slide 45 Chương 4 HUST: Phần Giả định: \"Người nào giết người trong trạng thái tinh thần bị kích động mạnh do hành vi trái pháp luật nghiêm trọng của nạn nhân...\"; Phần Chế tài: \"thì bị phạt tù từ 06 tháng đến 03 năm\". Mệnh lệnh cấm (Quy định) ẩn trong chế tài."
  },
  {
    "id": "fb_29",
    "chapter": "Chương 7: Pháp luật Sở hữu trí tuệ & KH-CN",
    "question": "Câu chuyện về Humphry Davy (1778 - 1829) phát minh ra đèn an toàn (đèn măng-xông) cho thợ mỏ nhưng không đăng ký sáng chế, dẫn đến việc các thương gia sản xuất đèn kém chất lượng gây nổ hầm lò. Bài học rút ra trong bài giảng HUST là gì?",
    "options": [
      "Bằng độc quyền sáng chế còn được dùng để bảo đảm chất lượng sản phẩm của nhà sản xuất đối với người tiêu dùng và xã hội",
      "Nhà khoa học không nên công bố phát minh khoa học",
      "Đèn măng-xông không đủ điều kiện có tính mới để cấp bằng sáng chế",
      "Chỉ có nhà nước mới có quyền sản xuất các thiết bị an toàn"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 16 Chương 7 HUST: Humphry Davy không xin cấp bằng sáng chế vì muốn đó là sáng chế cứu người, kết quả thương gia sản xuất tràn lan chất lượng thấp gây nổ hầm lò. Bài học: Bằng độc quyền sáng chế còn được dùng để bảo đảm chất lượng sản phẩm của nhà sản xuất."
  },
  {
    "id": "fb_30",
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "question": "Theo Điều 6 Nghị định 46/2016/NĐ-CP và Slide 52 Chương 4 HUST, hành vi nào sau đây của người điều khiển xe mô tô, xe gắn máy sẽ bị áp dụng biện pháp TỊCH THU XE?",
    "options": [
      "Buông cả 2 tay khi đang lái, dùng chân lái xe, nằm trên yên xe lái xe, lạng lách đánh võng",
      "Không đội mũ bảo hiểm hoặc đội mũ không cài quai đúng quy cách",
      "Chở quá 01 người lớn trên xe máy",
      "Không bật đèn chiếu sáng vào lúc 19 giờ"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 52 Chương 4 HUST: Tịch thu xe áp dụng đối với các hành vi đặc biệt nguy hiểm: buông cả 2 tay khi lái, dùng chân lái xe, ngồi về 1 bên, nằm trên yên xe lái, thay người lái khi xe đang chạy, quay người về phía sau/bịt mắt lái xe, lạng lách đánh võng, chạy bằng 1 bánh xe máy..."
  },
  {
    "id": "fb_31",
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "question": "Hội đồng nhân dân (HĐND) và Ủy ban nhân dân (UBND) ban hành các hình thức văn bản quy phạm pháp luật nào tương ứng?",
    "options": [
      "HĐND ban hành Nghị quyết; UBND ban hành Quyết định",
      "HĐND ban hành Quyết định; UBND ban hành Nghị quyết",
      "HĐND ban hành Pháp lệnh; UBND ban hành Chỉ thị",
      "Cả hai cơ quan đều ban hành Thông tư"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 29, 33, 37 Chương 3 HUST: Hội đồng nhân dân ban hành Nghị quyết; Ủy ban nhân dân ban hành Quyết định."
  },
  {
    "id": "fb_32",
    "chapter": "Chương 7: Pháp luật Sở hữu trí tuệ & KH-CN",
    "question": "Theo quy định tại Slide 19 Chương 7 HUST, Giấy chứng nhận đăng ký thiết kế bố trí mạch tích hợp bán dẫn có hiệu lực và chấm dứt vào ngày nào?",
    "options": [
      "Chấm dứt vào ngày sớm nhất trong số: (a) Kết thúc 10 năm từ ngày nộp đơn; (b) Kết thúc 10 năm từ ngày khai thác thương mại lần đầu; (c) Kết thúc 15 năm từ ngày tạo ra thiết kế bố trí",
      "Cố định 20 năm kể từ ngày nộp đơn không gia hạn",
      "Cố định 5 năm và được gia hạn 2 lần liên tiếp",
      "Bảo hộ vô thời hạn kể từ ngày cấp giấy chứng nhận"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 19 Chương 7 HUST & Luật SHTT: Thời hạn bảo hộ thiết kế bố trí mạch tích hợp bán dẫn chấm dứt vào ngày sớm nhất trong 3 thời điểm: (a) 10 năm kể từ ngày nộp đơn; (b) 10 năm kể từ ngày khai thác thương mại lần đầu; (c) 15 năm kể từ ngày tạo ra thiết kế bố trí."
  },
  {
    "id": "fb_33",
    "chapter": "Chương 2: Những vấn đề cơ bản về Nhà nước",
    "question": "Hiện nay trên thế giới có khoảng 28 nhà nước có hình thức cấu trúc liên bang. Nhóm quốc gia nào sau đây ĐỀU là nhà nước liên bang theo bài giảng HUST?",
    "options": [
      "Mỹ, Đức, Áo, Ấn Độ, Brazil, Argentina, Mexico",
      "Pháp, Anh, Italia, Việt Nam, Trung Quốc",
      "Việt Nam, Lào, Campuchia, Thái Lan",
      "Hàn Quốc, Nhật Bản, Singapore, New Zealand"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 25 Chương 2 HUST: Hiện nay có khoảng 28 nhà nước liên bang, điển hình như: Mỹ, Đức, Áo, Ấn Độ, Brazil, Argentina, Mê-hi-cô, I-rắc, Ê-ti-ô-pi-a, Liên hiệp Thụy Sĩ... Trong khi Pháp, Anh, Italia, Trung Quốc, Việt Nam là nhà nước đơn nhất."
  },
  {
    "id": "fb_34",
    "chapter": "Chương 7: Pháp luật Sở hữu trí tuệ & KH-CN",
    "question": "Theo Slide 28 Chương 7 HUST, cơ quan có thẩm quyền tiến hành thủ tục hành chính đăng ký quyền đối với Sở hữu công nghiệp và Quyền tác giả lần lượt là cơ quan nào?",
    "options": [
      "Cục Sở hữu trí tuệ (Bộ KH&CN) và Cục Bản quyền tác giả (Bộ VHTTDL)",
      "Cục Bản quyền tác giả và Tòa án nhân dân tối cao",
      "Cục Trồng trọt và Viện Kiểm sát nhân dân tối cao",
      "Sở Công thương và Sở Tư pháp các tỉnh thành"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 28 Chương 7 HUST: Sở hữu công nghiệp đăng ký tại Cục Sở hữu trí tuệ; Quyền tác giả và quyền liên quan đăng ký tại Cục Bản quyền tác giả; Giống cây trồng đăng ký tại Cục Trồng trọt (Bộ NN&PTNT)."
  },
  {
    "id": "fb_35",
    "chapter": "Chương 7: Pháp luật Sở hữu trí tuệ & KH-CN",
    "question": "Theo thống kê trong Slide 6 Chương 7 HUST, tỷ lệ giữa Tài sản vô hình (TSVH) và Tài sản hữu hình (TSHH) của các doanh nghiệp thuộc S&P 500 đã có sự thay đổi như thế nào từ năm 1975 đến nay?",
    "options": [
      "Năm 1975: TSHH/TSVH = 80/20%; Hiện nay ngược lại: TSVH/TSHH = 80/20%",
      "Năm 1975: TSVH chiếm 90%; Hiện nay giảm xuống còn 10%",
      "Tỷ lệ giữa tài sản hữu hình và vô hình luôn giữ nguyên 50/50%",
      "Năm 1975 tài sản vô hình chiếm 5%; Hiện nay chiếm 30%"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 6 Chương 7 HUST: Năm 1975, theo S&P 500: TSHH/TSVH = 80/20%. Hiện nay, ngược lại: TSVH/TSHH = 80/20% (Tài sản vô hình chiếm đến 80% giá trị doanh nghiệp)."
  },
  {
    "id": "fb_36",
    "chapter": "Chương 1: Nhập môn Pháp luật đại cương",
    "question": "Theo Slide bài giảng Chương 1 HUST, phương pháp nghiên cứu nào dựa trên cơ sở xử lý, phân loại, phân tích các quy phạm pháp luật và các bộ phận cấu thành để tìm hiểu những đặc trưng và mối liên hệ lôgíc?",
    "options": [
      "Phương pháp phân tích logic quy phạm",
      "Phương pháp quy nạp và diễn dịch",
      "Phương pháp xã hội học cụ thể",
      "Phương pháp so sánh pháp luật"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 10 Chương 1 HUST: Phương pháp phân tích logic quy phạm là phương pháp nghiên cứu dựa trên cơ sở xử lý, phân loại, phân tích các quy phạm pháp luật, các bộ phận cấu thành chúng để tìm hiểu những đặc trưng, mối liên hệ lôgíc."
  },
  {
    "id": "fb_37",
    "chapter": "Chương 2: Những vấn đề cơ bản về Nhà nước",
    "question": "Theo Slide bài giảng HUST, Nhà nước La Mã cổ đại xuất hiện được thúc đẩy chủ yếu bởi nguyên nhân nào?",
    "options": [
      "Cuộc đấu tranh của những người thường dân (bình dân) chống lại giới quý tộc của thị tộc La Mã",
      "Người Giéc Manh xâm chiếm lãnh thổ rộng lớn của đế chế",
      "Sự hòa tan tự nguyện không qua đấu tranh giai cấp",
      "Sự phân công lao động lần thứ nhất giữa trồng trọt và chăn nuôi"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 9 Chương 2 HUST: Nhà nước Rô Ma (La Mã) cổ đại xuất hiện được thúc đẩy bởi sự đấu tranh của những người thường dân chống lại giới quý tộc của thị tộc La Mã."
  },
  {
    "id": "fb_38",
    "chapter": "Chương 2: Những vấn đề cơ bản về Nhà nước",
    "question": "Theo quan điểm Mác - Lênin trong bài giảng HUST, lần phân công lao động xã hội lớn thứ ba trong chế độ cộng sản nguyên thủy là gì?",
    "options": [
      "Ngành chăn nuôi tách khỏi trồng trọt",
      "Thủ công nghiệp tách khỏi nông nghiệp",
      "Thương nghiệp (thương mại) phát triển và tách thành ngành độc lập",
      "Công nghiệp chế biến ra đời"
    ],
    "answer": 2,
    "explanation": "Căn cứ Slide 8 Chương 2 HUST: Ba lần phân công lao động xã hội lớn: Lần 1: Chăn nuôi tách khỏi trồng trọt; Lần 2: Thủ công nghiệp tách khỏi nông nghiệp; Lần 3: Thương mại (thương nghiệp) phát triển và xuất hiện tầng lớp thương nhân."
  },
  {
    "id": "fb_39",
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "question": "Điều 19 Nghị định 70/2001/NĐ-CP quy định: \"Trong trường hợp người được cấp dưỡng một lần lâm vào tình trạng khó khăn trầm trọng do bị tai nạn hoặc mắc bệnh hiểm nghèo... thì phải cấp dưỡng bổ sung theo yêu cầu của người được cấp dưỡng\". Quy phạm này có cấu trúc bộ phận nào?",
    "options": [
      "Chỉ gồm Giả định và Quy định (không có bộ phận Chế tài trực tiếp)",
      "Chỉ gồm Giả định và Chế tài",
      "Chỉ gồm Quy định và Chế tài",
      "Gồm cả 3 bộ phận Giả định, Quy định và Chế tài"
    ],
    "answer": 0,
    "explanation": "Căn cứ Ví dụ 4 Slide 47 Chương 4 HUST: Giả định là hoàn cảnh khó khăn trầm trọng; Quy định là nghĩa vụ \"phải cấp dưỡng bổ sung theo yêu cầu\". Không có chế tài trực tiếp trong điều văn bản này."
  },
  {
    "id": "fb_40",
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "question": "Khoản 1 Điều 87 Luật Giáo dục 2005 quy định: \"Người học các chương trình giáo dục đại học nếu được hưởng học bổng, chi phí đào tạo do Nhà nước cấp... thì sau khi tốt nghiệp, phải chấp hành sự điều động làm việc có thời hạn của Nhà nước. Trường hợp không chấp hành thì phải bồi hoàn học bổng, chi phí đào tạo\". Bộ phận CHẾ TÀI trong quy phạm này là:",
    "options": [
      "Người học các chương trình giáo dục đại học",
      "phải chấp hành sự điều động làm việc có thời hạn của Nhà nước",
      "phải bồi hoàn học bổng, chi phí đào tạo",
      "nếu được hưởng học bổng, chi phí đào tạo do Nhà nước cấp"
    ],
    "answer": 2,
    "explanation": "Căn cứ Ví dụ 1 Slide 44 Chương 4 HUST: Chế tài là biện pháp tác động bất lợi của nhà nước khi chủ thể không tuân thủ: \"phải bồi hoàn học bổng, chi phí đào tạo\"."
  }
];

if (typeof window !== "undefined") window.FALLBACK_HUST_QUESTIONS = FALLBACK_HUST_QUESTIONS;
if (typeof globalThis !== "undefined") globalThis.FALLBACK_HUST_QUESTIONS = FALLBACK_HUST_QUESTIONS;

// ==========================================================================
// 7 ẢI CHIẾN DỊCH VƯỢT ẢI DIỆT QUÁI (THE 7 LEGAL DUNGEONS & MONSTER BOSSES)
// ĐỘ KHÓ LEO THANG: CÀNG VỀ SAU CẦN ĐÚNG CÀNG NHIỀU CÂU ĐỂ HẠ QUÁI & SAI 1-2 CÂU BỊ TIÊU DIỆT NGAY!
// ==========================================================================
const CAMPAIGN_STAGES = [
  {
    "stage": 1,
    "realm": 1,
    "realmName": "Khu Vực 1: Khởi Nguyên Nhà Nước",
    "id": "stage_1",
    "name": "Ải 1: Thung Lũng Vô Kỷ Luật",
    "chapter": "Chương 2",
    "chapterName": "Nguồn Gốc Nhà Nước & Thị Tộc",
    "packId": "hust_ch2",
    "bgGradient": "linear-gradient(to top, #1a0f00 0%, #3d2305 70%, #150901 100%)",
    "badge": "👹 ẢI 1 • TẬP SỰ",
    "threatLevel": "DỄ",
    "threatColor": "text-emerald-400 font-bold",
    "threatDesc": "Phạt sai: -12 HP • Chịu được ~8 lỗi • Cần ~4-5 câu đúng",
    "requiredQuestions": 5,
    "turnTimer": 25,
    "monsterArmor": 0,
    "clearRateText": "Top 88% Sinh Viên Qua Ải",
    "bonusScore": 500,
    "monster": {
      "id": "goblin",
      "name": "Yêu Tinh Vô Kỷ Luật",
      "title": "Kẻ Phá Hoại Trật Tự Thị Tộc",
      "hp": 80,
      "atk": 12,
      "avatar": "assets/monsters/monster_1.svg",
      "quote": "Ở thung lũng này làm gì có pháp luật, chỉ có nắm đấm của ta thôi!",
      "defeatQuote": "Không ngờ ngươi lại hiểu rõ nguồn gốc thị tộc và sự tan rã của công xã nguyên thủy đến vậy..."
    }
  },
  {
    "stage": 2,
    "realm": 1,
    "realmName": "Khu Vực 1: Khởi Nguyên Nhà Nước",
    "id": "stage_2",
    "name": "Ải 2: Hầm Ngục Xiềng Xích Nô Lệ",
    "chapter": "Chương 2",
    "chapterName": "Bản Chất & Kiểu Nhà Nước Chiếm Hữu Nô Lệ",
    "packId": "hust_ch2",
    "bgGradient": "linear-gradient(to top, #241403 0%, #4a2800 70%, #150901 100%)",
    "badge": "⛓️ ẢI 2 • KHỞI ĐẦU",
    "threatLevel": "KHỞI ĐẦU",
    "threatColor": "text-emerald-300 font-bold",
    "threatDesc": "Phạt sai: -14 HP • Chịu được ~7 lỗi • Cần ~5-6 câu đúng",
    "requiredQuestions": 6,
    "turnTimer": 25,
    "monsterArmor": 0.02,
    "clearRateText": "Top 80% Sinh Viên Qua Ải",
    "bonusScore": 650,
    "monster": {
      "id": "orc_slaver",
      "name": "Dị Thú Bóc Lột Xiềng Xích",
      "title": "Kẻ Cai Trị Nhà Nước Chủ Nô",
      "hp": 110,
      "atk": 14,
      "avatar": "assets/monsters/monster_2.svg",
      "quote": "Bản chất của nhà nước đầu tiên trong lịch sử là gì? Hãy nếm mùi roi vọt!",
      "defeatQuote": "Ngươi đã vạch trần bản chất áp bức giai cấp của nhà nước chủ nô..."
    }
  },
  {
    "stage": 3,
    "realm": 1,
    "realmName": "Khu Vực 1: Khởi Nguyên Nhà Nước",
    "id": "stage_3",
    "name": "Ải 3: Rừng Rậm Lãnh Địa Phong Kiến",
    "chapter": "Chương 2",
    "chapterName": "Các Kiểu Nhà Nước: Phong Kiến & Tư Sản",
    "packId": "hust_ch2",
    "bgGradient": "linear-gradient(to top, #0f172a 0%, #1e293b 70%, #020617 100%)",
    "badge": "🏰 ẢI 3 • TRUNG BÌNH",
    "threatLevel": "TRUNG BÌNH",
    "threatColor": "text-amber-400 font-bold",
    "threatDesc": "Phạt sai: -16 HP • Chịu được 6 lỗi • Cần ~6-7 câu đúng",
    "requiredQuestions": 7,
    "turnTimer": 24,
    "monsterArmor": 0.04,
    "clearRateText": "Top 72% Sinh Viên Qua Ải",
    "bonusScore": 800,
    "monster": {
      "id": "dark_lord",
      "name": "Lãnh Chúa Đẳng Cấp Bóng Đêm",
      "title": "Chúa Tể Đất Đai Phong Kiến",
      "hp": 150,
      "atk": 16,
      "avatar": "assets/monsters/monster_3.svg",
      "quote": "Kiểu nhà nước phong kiến cát cứ phân quyền sẽ giam cầm ngươi mãi mãi!",
      "defeatQuote": "Tri thức về các kiểu nhà nước trong lịch sử của ngươi thật đáng nể..."
    }
  },
  {
    "stage": 4,
    "realm": 1,
    "realmName": "Khu Vực 1: Khởi Nguyên Nhà Nước",
    "id": "stage_4",
    "name": "Ải 4: Pháo Đài Quân Chủ & Cộng Hòa",
    "chapter": "Chương 2",
    "chapterName": "Hình Thức Chính Thể & Cấu Trúc Nhà Nước",
    "packId": "hust_ch2",
    "bgGradient": "linear-gradient(to top, #1c1917 0%, #44403c 70%, #0c0a09 100%)",
    "badge": "🗿 ẢI 4 • KHÁ",
    "threatLevel": "KHÁ",
    "threatColor": "text-amber-300 font-bold",
    "threatDesc": "Phạt sai: -18 HP • Chịu được 5 lỗi • Cần ~7-8 câu đúng",
    "requiredQuestions": 8,
    "turnTimer": 24,
    "monsterArmor": 0.06,
    "clearRateText": "Top 65% Sinh Viên Qua Ải",
    "bonusScore": 1000,
    "monster": {
      "id": "stone_gargoyle",
      "name": "Thủ Hộ Thạch Thần Chính Thể",
      "title": "Người Gác Đền Quân Chủ & Cộng Hòa",
      "hp": 200,
      "atk": 18,
      "avatar": "assets/monsters/monster_4.svg",
      "quote": "Phân biệt nhà nước đơn nhất và nhà nước liên bang trước khi hóa đá!",
      "defeatQuote": "Ngươi hiểu quá vững cấu trúc nhà nước và chế độ chính trị..."
    }
  },
  {
    "stage": 5,
    "realm": 2,
    "realmName": "Khu Vực 2: Bộ Máy Nhà Nước VN",
    "id": "stage_5",
    "name": "Ải 5: Đại Sảnh Quyền Lực Tối Cao",
    "chapter": "Chương 3",
    "chapterName": "Quốc Hội - Cơ Quan Quyền Lực Nhà Nước Cao Nhất",
    "packId": "hust_ch3",
    "bgGradient": "linear-gradient(to top, #1e1b4b 0%, #312e81 60%, #0f172a 100%)",
    "badge": "🏛️ ẢI 5 • KHÁ",
    "threatLevel": "KHÁ",
    "threatColor": "text-sky-400 font-bold",
    "threatDesc": "Phạt sai: -22 HP • Chịu được 4-5 lỗi • Cần ~8-9 câu đúng",
    "requiredQuestions": 9,
    "turnTimer": 22,
    "monsterArmor": 0.08,
    "clearRateText": "Top 58% Sinh Viên Qua Ải",
    "bonusScore": 1200,
    "monster": {
      "id": "specter_parliament",
      "name": "Bóng Ma Thao Túng Nghị Viện",
      "title": "Ảo Ảnh Bóp Méo Chức Năng Lập Pháp",
      "hp": 260,
      "atk": 22,
      "avatar": "assets/monsters/monster_5.svg",
      "quote": "Nhiệm kỳ Quốc hội mấy năm? Thẩm quyền lập hiến thuộc về ai? Hãy trả lời mau!",
      "defeatQuote": "Quốc hội là cơ quan đại biểu cao nhất của Nhân dân... ta đã thua!"
    }
  },
  {
    "stage": 6,
    "realm": 2,
    "realmName": "Khu Vực 2: Bộ Máy Nhà Nước VN",
    "id": "stage_6",
    "name": "Ải 6: Hoàng Thành Nguyên Thủ Quốc Gia",
    "chapter": "Chương 3",
    "chapterName": "Chủ Tịch Nước - Vị Trí & Thẩm Quyền",
    "packId": "hust_ch3",
    "bgGradient": "linear-gradient(to top, #312e81 0%, #4338ca 60%, #172554 100%)",
    "badge": "👑 ẢI 6 • THỬ THÁCH",
    "threatLevel": "THỬ THÁCH",
    "threatColor": "text-amber-500 font-bold",
    "threatDesc": "Phạt sai: -24 HP • Chịu được 4 lỗi • Cần ~9-10 câu đúng",
    "requiredQuestions": 10,
    "turnTimer": 22,
    "monsterArmor": 0.1,
    "clearRateText": "Top 50% Sinh Viên Qua Ải",
    "bonusScore": 1450,
    "monster": {
      "id": "corrupted_guardian",
      "name": "Hộ Vệ Hoàng Gia Hắc Hóa",
      "title": "Kẻ Thách Thức Thẩm Quyền Nguyên Thủ",
      "hp": 330,
      "atk": 24,
      "avatar": "assets/monsters/monster_6.svg",
      "quote": "Ai có quyền công bố Hiến pháp và luật? Ai thống lĩnh các lực lượng vũ trang?",
      "defeatQuote": "Chủ tịch nước thay mặt nước CHXHCN Việt Nam về đối nội và đối ngoại..."
    }
  },
  {
    "stage": 7,
    "realm": 2,
    "realmName": "Khu Vực 2: Bộ Máy Nhà Nước VN",
    "id": "stage_7",
    "name": "Ải 7: Tháp Hành Pháp Tối Cao",
    "chapter": "Chương 3",
    "chapterName": "Chính Phủ - Cơ Quan Hành Chính Nhà Nước Cao Nhất",
    "packId": "hust_ch3",
    "bgGradient": "linear-gradient(to top, #0f172a 0%, #1e3a8a 60%, #030712 100%)",
    "badge": "⚡ ẢI 7 • THỬ THÁCH",
    "threatLevel": "THỬ THÁCH",
    "threatColor": "text-amber-500 font-bold",
    "threatDesc": "Phạt sai: -26 HP • Chịu được 3-4 lỗi • Cần ~10-11 câu đúng",
    "requiredQuestions": 11,
    "turnTimer": 20,
    "monsterArmor": 0.12,
    "clearRateText": "Top 44% Sinh Viên Qua Ải",
    "bonusScore": 1700,
    "monster": {
      "id": "iron_chancellor",
      "name": "Thống Lĩnh Hành Pháp Độc Tài",
      "title": "Kẻ Chiếm Đoạt Thẩm Quyền Chấp Hành",
      "hp": 410,
      "atk": 26,
      "avatar": "assets/monsters/monster_7.svg",
      "quote": "Chính phủ chịu trách nhiệm trước cơ quan nào? Thử trả lời sai xem!",
      "defeatQuote": "Chính phủ là cơ quan chấp hành của Quốc hội, cơ quan hành chính cao nhất..."
    }
  },
  {
    "stage": 8,
    "realm": 2,
    "realmName": "Khu Vực 2: Bộ Máy Nhà Nước VN",
    "id": "stage_8",
    "name": "Ải 8: Pháp Đình Công Lý & Kiểm Sát",
    "chapter": "Chương 3",
    "chapterName": "TAND, VKSND & Chính Quyền Địa Phương",
    "packId": "hust_ch3",
    "bgGradient": "linear-gradient(to top, #2e1065 0%, #3b0764 60%, #0f051d 100%)",
    "badge": "⚖️ ẢI 8 • NGUY HIỂM",
    "threatLevel": "NGUY HIỂM",
    "threatColor": "text-orange-400 font-bold",
    "threatDesc": "Phạt sai: -28 HP • Chịu được 3 lỗi • Cần ~12 câu đúng",
    "requiredQuestions": 12,
    "turnTimer": 20,
    "monsterArmor": 0.14,
    "clearRateText": "Top 38% Sinh Viên Qua Ải",
    "bonusScore": 2000,
    "monster": {
      "id": "dark_inquisitor",
      "name": "Thẩm Phán Hắc Ám Bóp Méo Luật",
      "title": "Kẻ Xuyên Tạc Nguyên Tắc Độc Lập Xét Xử",
      "hp": 500,
      "atk": 28,
      "avatar": "assets/monsters/monster_8.svg",
      "quote": "Cơ quan nào thực hành quyền công tố? Ai xét xử độc lập chỉ tuân theo pháp luật?",
      "defeatQuote": "TAND thực hiện quyền tư pháp, VKSND thực hành quyền công tố và kiểm sát tư pháp..."
    }
  },
  {
    "stage": 9,
    "realm": 3,
    "realmName": "Khu Vực 3: Cơ Sở Pháp Luật",
    "id": "stage_9",
    "name": "Ải 9: Vực Thẳm Thuộc Tính Pháp Luật",
    "chapter": "Chương 4",
    "chapterName": "Nguồn Gốc, Bản Chất & Thuộc Tính Pháp Luật",
    "packId": "hust_ch4",
    "bgGradient": "linear-gradient(to top, #042f2e 0%, #115e59 60%, #021818 100%)",
    "badge": "🐍 ẢI 9 • NGUY HIỂM",
    "threatLevel": "NGUY HIỂM",
    "threatColor": "text-orange-400 font-bold",
    "threatDesc": "Phạt sai: -32 HP • Sai 3 câu là chết! • Cần ~13 câu đúng",
    "requiredQuestions": 13,
    "turnTimer": 20,
    "monsterArmor": 0.15,
    "clearRateText": "Top 32% Sinh Viên Qua Ải",
    "bonusScore": 2350,
    "monster": {
      "id": "water_hydra",
      "name": "Hắc Thủy Xà Thuộc Tính",
      "title": "Quái Vật Tính Quy Phạm Phổ Biến",
      "hp": 600,
      "atk": 32,
      "avatar": "assets/monsters/monster_9.svg",
      "quote": "Tính quy phạm phổ biến và tính xác định chặt chẽ về hình thức là gì?",
      "defeatQuote": "Pháp luật luôn mang bản chất giai cấp và bản chất xã hội sâu sắc..."
    }
  },
  {
    "stage": 10,
    "realm": 3,
    "realmName": "Khu Vực 3: Cơ Sở Pháp Luật",
    "id": "stage_10",
    "name": "Ải 10: Mê Hồn Trận Quy Phạm Pháp Luật",
    "chapter": "Chương 4",
    "chapterName": "Cơ Cấu QPPL: Giả Định - Quy Định - Chế Tài",
    "packId": "hust_ch4",
    "bgGradient": "linear-gradient(to top, #450a0a 0%, #7f1d1d 60%, #1c0505 100%)",
    "badge": "🔥 ẢI 10 • ÁP LỰC",
    "threatLevel": "ÁP LỰC",
    "threatColor": "text-rose-400 font-bold",
    "threatDesc": "Phạt sai: -35 HP • Sai 3 câu là tử vong! • Cần ~14 câu đúng",
    "requiredQuestions": 14,
    "turnTimer": 18,
    "monsterArmor": 0.16,
    "clearRateText": "Top 27% Sinh Viên Qua Ải",
    "bonusScore": 2700,
    "monster": {
      "id": "cerberus_rules",
      "name": "Tam Đầu Xà Quy Phạm Pháp Luật",
      "title": "Quái Thú Giả Định - Quy Định - Chế Tài",
      "hp": 710,
      "atk": 35,
      "avatar": "assets/monsters/monster_10.svg",
      "quote": "Đâu là bộ phận chỉ ra ai, điều kiện nào? Đâu là chế tài trừng phạt?",
      "defeatQuote": "Ngươi bóc tách 3 bộ phận quy phạm pháp luật chuẩn xác như thẩm phán..."
    }
  },
  {
    "stage": 11,
    "realm": 3,
    "realmName": "Khu Vực 3: Cơ Sở Pháp Luật",
    "id": "stage_11",
    "name": "Ải 11: Đầm Lầy Quan Hệ Pháp Luật",
    "chapter": "Chương 4",
    "chapterName": "Chủ Thể, Năng Lực Pháp Luật & Năng Lực Hành Vi",
    "packId": "hust_ch4",
    "bgGradient": "linear-gradient(to top, #082f49 0%, #0369a1 60%, #031726 100%)",
    "badge": "🐙 ẢI 11 • KHẮC NGHIỆT",
    "threatLevel": "KHẮC NGHIỆT",
    "threatColor": "text-rose-400 font-bold",
    "threatDesc": "Phạt sai: -38 HP • Sai 2-3 câu tử vong • Cần ~15 câu đúng",
    "requiredQuestions": 15,
    "turnTimer": 18,
    "monsterArmor": 0.18,
    "clearRateText": "Top 22% Sinh Viên Qua Ải",
    "bonusScore": 3100,
    "monster": {
      "id": "kraken_rights",
      "name": "Thủy Quái Năng Lực Hành Vi",
      "title": "Kẻ Đánh Chìm Năng Lực Pháp Luật",
      "hp": 830,
      "atk": 38,
      "avatar": "assets/monsters/monster_11.svg",
      "quote": "Khi nào cá nhân có năng lực pháp luật? Khi nào bị mất năng lực hành vi?",
      "defeatQuote": "Năng lực chủ thể gồm cả năng lực pháp luật và năng lực hành vi..."
    }
  },
  {
    "stage": 12,
    "realm": 3,
    "realmName": "Khu Vực 3: Cơ Sở Pháp Luật",
    "id": "stage_12",
    "name": "Ải 12: Cổng Địa Ngục Vi Phạm Pháp Luật",
    "chapter": "Chương 4",
    "chapterName": "4 Yếu Tố Cấu Thành Vi Phạm & Trách Nhiệm Pháp Lý",
    "packId": "hust_ch4",
    "bgGradient": "linear-gradient(to top, #3b0764 0%, #581c87 60%, #150326 100%)",
    "badge": "🐲 ẢI 12 • RẤT KHÓ",
    "threatLevel": "RẤT KHÓ",
    "threatColor": "text-rose-500 font-black",
    "threatDesc": "Phạt sai: -42 HP • Sai 2 câu là hấp hối! • Cần ~16-17 câu đúng",
    "requiredQuestions": 16,
    "turnTimer": 18,
    "monsterArmor": 0.2,
    "clearRateText": "Top 18% Cao Thủ Qua Nổi",
    "bonusScore": 3550,
    "monster": {
      "id": "dragon_liability",
      "name": "Độc Long Trách Nhiệm Pháp Lý",
      "title": "Chúa Tể 4 Yếu Tố Cấu Thành Vi Phạm",
      "hp": 960,
      "atk": 42,
      "avatar": "assets/monsters/monster_12.svg",
      "quote": "Mặt khách quan, mặt chủ quan, chủ thể, khách thể - ngươi thiếu yếu tố nào?",
      "defeatQuote": "Không có lỗi thì không có vi phạm pháp luật... ngươi đã chiến thắng!"
    }
  },
  {
    "stage": 13,
    "realm": 4,
    "realmName": "Khu Vực 4: Pháp Luật Thế Giới",
    "id": "stage_13",
    "name": "Ải 13: Thánh Đường Dân Luật Civil Law",
    "chapter": "Chương 5",
    "chapterName": "Hệ Thống Civil Law - Dòng Họ Pháp Luật La Mã",
    "packId": "hust_ch5",
    "bgGradient": "linear-gradient(to top, #292524 0%, #57534e 60%, #0c0a09 100%)",
    "badge": "🏛️ ẢI 13 • CỰC KHÓ",
    "threatLevel": "CỰC KHÓ",
    "threatColor": "text-rose-500 font-black",
    "threatDesc": "Phạt sai: -46 HP • Sai 2 câu là hấp hối! • Cần ~17 câu đúng",
    "requiredQuestions": 17,
    "turnTimer": 18,
    "monsterArmor": 0.22,
    "clearRateText": "Top 15% Sinh Viên Qua Ải",
    "bonusScore": 4000,
    "monster": {
      "id": "civil_law_colossus",
      "name": "Thần Tượng Pháp Điển La Mã",
      "title": "Người Gác Đền Dòng Họ Dân Luật",
      "hp": 1100,
      "atk": 46,
      "avatar": "assets/monsters/monster_13.svg",
      "quote": "Văn bản quy phạm pháp luật là nguồn số một! Tố tụng thẩm vấn hay tranh tụng?",
      "defeatQuote": "Civil Law chịu ảnh hưởng sâu sắc từ Luật La Mã và Pháp điển hóa..."
    }
  },
  {
    "stage": 14,
    "realm": 4,
    "realmName": "Khu Vực 4: Pháp Luật Thế Giới",
    "id": "stage_14",
    "name": "Ải 14: Thao Trường Thông Luật Common Law",
    "chapter": "Chương 5",
    "chapterName": "Hệ Thống Common Law - Án Lệ & Tranh Tụng",
    "packId": "hust_ch5",
    "bgGradient": "linear-gradient(to top, #1c1917 0%, #44403c 60%, #090807 100%)",
    "badge": "🗿 ẢI 14 • CỰC KHÓ",
    "threatLevel": "CỰC KHÓ",
    "threatColor": "text-rose-500 font-black",
    "threatDesc": "Phạt sai: -50 HP • SAI 2 CÂU LÀ TỬ VONG! • Cần ~18 câu đúng",
    "requiredQuestions": 18,
    "turnTimer": 16,
    "monsterArmor": 0.24,
    "clearRateText": "Top 12% Cao Thủ Đến Được Đây",
    "bonusScore": 4500,
    "monster": {
      "id": "common_law_golem",
      "name": "Khổng Lồ Án Lệ Tiền Lệ Pháp",
      "title": "Chúa Tể Án Lệ & Nguyên Tắc Stare Decisis",
      "hp": 1250,
      "atk": 50,
      "avatar": "assets/monsters/monster_14.svg",
      "quote": "Án lệ Stare Decisis buộc thẩm phán sau phải tuân theo phán quyết trước!",
      "defeatQuote": "Common Law coi Thẩm phán là người sáng tạo ra luật... ngươi quá xuất sắc!"
    }
  },
  {
    "stage": 15,
    "realm": 4,
    "realmName": "Khu Vực 4: Pháp Luật Thế Giới",
    "id": "stage_15",
    "name": "Ải 15: Sa Mạc Huyền Bí Luật Hồi Giáo & XHCN",
    "chapter": "Chương 5",
    "chapterName": "Pháp Luật Hồi Giáo (Sharia) & Pháp Luật XHCN",
    "packId": "hust_ch5",
    "bgGradient": "linear-gradient(to top, #451a03 0%, #78350f 60%, #1c0a01 100%)",
    "badge": "🏜️ ẢI 15 • HIỂM NGHÈO",
    "threatLevel": "HIỂM NGHÈO",
    "threatColor": "text-rose-500 font-black animate-pulse",
    "threatDesc": "Phạt sai: -54 HP • SAI 2 CÂU = K.O. TỨC THÌ! • Cần ~19 câu đúng",
    "requiredQuestions": 19,
    "turnTimer": 16,
    "monsterArmor": 0.25,
    "clearRateText": "Chỉ Top 9% Sinh Viên Vượt Qua",
    "bonusScore": 5000,
    "monster": {
      "id": "desert_sharia_sphinx",
      "name": "Sa Thần Giáo Pháp Sharia",
      "title": "Nhân Sư Bí Ẩn Các Dòng Họ Pháp Luật",
      "hp": 1410,
      "atk": 54,
      "avatar": "assets/monsters/monster_15.svg",
      "quote": "Kinh Quran và Sunnah là nguồn pháp luật nào? Giải mã nhân sư hay bị chôn vùi!",
      "defeatQuote": "Ngươi am tường cả 4 dòng họ pháp luật lớn nhất thế giới..."
    }
  },
  {
    "stage": 16,
    "realm": 5,
    "realmName": "Khu Vực 5: Các Ngành Luật VN",
    "id": "stage_16",
    "name": "Ải 16: Hoàng Cung Luật Hiến Pháp & Hành Chính",
    "chapter": "Chương 6",
    "chapterName": "Ngành Luật Hiến Pháp & Xử Phạt Hành Chính",
    "packId": "hust_ch6",
    "bgGradient": "linear-gradient(to top, #450a0a 0%, #991b1b 60%, #180202 100%)",
    "badge": "🏛️ ẢI 16 • ÁC MỘNG",
    "threatLevel": "ÁC MỘNG",
    "threatColor": "text-rose-500 font-black animate-pulse",
    "threatDesc": "Phạt sai: -58 HP • SAI 2 CÂU = TỬ TRẬN! • Cần ~20 câu đúng",
    "requiredQuestions": 20,
    "turnTimer": 16,
    "monsterArmor": 0.26,
    "clearRateText": "Top 7% Dũng Sĩ Chạm Tới",
    "bonusScore": 5600,
    "monster": {
      "id": "fire_archon",
      "name": "Viêm Ma Quyền Lực Hành Chính",
      "title": "Chúa Tể Thẩm Quyền Xử Phạt Hành Chính",
      "hp": 1580,
      "atk": 58,
      "avatar": "assets/monsters/monster_16.svg",
      "quote": "Phạt tiền và cảnh cáo là hình thức phạt gì? Thẩm quyền xử phạt của ai?",
      "defeatQuote": "Hiến pháp là đạo luật cơ bản, có hiệu lực pháp lý cao nhất nước ta..."
    }
  },
  {
    "stage": 17,
    "realm": 5,
    "realmName": "Khu Vực 5: Các Ngành Luật VN",
    "id": "stage_17",
    "name": "Ải 17: Ngục Tối Tội Phạm & Bộ Luật Hình Sự",
    "chapter": "Chương 6",
    "chapterName": "Bộ Luật Hình Sự: Tội Phạm, Say Rượu, Độ Tuổi",
    "packId": "hust_ch6",
    "bgGradient": "linear-gradient(to top, #1f2937 0%, #374151 60%, #030712 100%)",
    "badge": "💀 ẢI 17 • ÁC MỘNG",
    "threatLevel": "ÁC MỘNG",
    "threatColor": "text-rose-500 font-black animate-pulse",
    "threatDesc": "Phạt sai: -64 HP • 1 CÂU HẤP HỐI, 2 CÂU LÀ CHẾT! • Cần ~21 câu đúng",
    "requiredQuestions": 21,
    "turnTimer": 16,
    "monsterArmor": 0.27,
    "clearRateText": "Top 5% Sinh Viên Đạt Được",
    "bonusScore": 6250,
    "monster": {
      "id": "hellish_reaper",
      "name": "Quỷ Dạ Xoa Tội Phạm Hình Sự",
      "title": "Thần Chết Của 4 Loại Tội Danh & Say Rượu",
      "hp": 1760,
      "atk": 64,
      "avatar": "assets/monsters/monster_17.svg",
      "quote": "Điều 13: Say rượu có được miễn trách nhiệm hình sự không? Tuổi 14 chịu tội gì?",
      "defeatQuote": "Say rượu vẫn phải chịu TNHS! Tuổi từ đủ 16 chịu mọi tội phạm... ta khâm phục!"
    }
  },
  {
    "stage": 18,
    "realm": 5,
    "realmName": "Khu Vực 5: Các Ngành Luật VN",
    "id": "stage_18",
    "name": "Ải 18: Thung Lũng Tranh Chấp Luật Dân Sự",
    "chapter": "Chương 6",
    "chapterName": "Hợp Đồng, Nghĩa Vụ & Thừa Kế Dân Sự",
    "packId": "hust_ch6",
    "bgGradient": "linear-gradient(to top, #14532d 0%, #166534 60%, #052e16 100%)",
    "badge": "📜 ẢI 18 • TỬ THẦN",
    "threatLevel": "TỬ THẦN",
    "threatColor": "text-rose-600 font-black animate-bounce",
    "threatDesc": "Phạt sai: -70 HP • 💀 SAI 2 CÂU = BAY MÀU! • Cần ~22 câu đúng",
    "requiredQuestions": 22,
    "turnTimer": 15,
    "monsterArmor": 0.28,
    "clearRateText": "Chỉ Top 3.5% Dũng Sĩ Sống Sót",
    "bonusScore": 7000,
    "monster": {
      "id": "contract_behemoth",
      "name": "Ma Thú Bồi Thường Dân Sự",
      "title": "Chúa Tể Giao Dịch & 3 Hàng Thừa Kế",
      "hp": 1950,
      "atk": 70,
      "avatar": "assets/monsters/monster_18.svg",
      "quote": "Thừa kế không phụ thuộc nội dung di chúc gồm những ai? Hàng thừa kế thứ nhất gồm ai?",
      "defeatQuote": "Bố mẹ đẻ, bố mẹ nuôi, con đẻ, con nuôi, vợ/chồng là hàng thừa kế thứ nhất..."
    }
  },
  {
    "stage": 19,
    "realm": 5,
    "realmName": "Khu Vực 5: Các Ngành Luật VN",
    "id": "stage_19",
    "name": "Ải 19: Chiến Trường Lao Động & Hôn Nhân Gia Đình",
    "chapter": "Chương 6",
    "chapterName": "Thử Việc, Sa Thải, Kết Hôn & Ly Hôn",
    "packId": "hust_ch6",
    "bgGradient": "linear-gradient(to top, #581c87 0%, #7e22ce 60%, #1e053a 100%)",
    "badge": "⚔️ ẢI 19 • TỬ THẦN",
    "threatLevel": "TỬ THẦN",
    "threatColor": "text-rose-600 font-black animate-bounce",
    "threatDesc": "Phạt sai: -76 HP • 💀 PHẠT CỰC NẶNG -76 HP! • Cần ~23 câu đúng",
    "requiredQuestions": 23,
    "turnTimer": 15,
    "monsterArmor": 0.29,
    "clearRateText": "Chỉ Top 2.5% Sinh Viên Chạm Tới",
    "bonusScore": 7800,
    "monster": {
      "id": "blood_dragon_labor",
      "name": "Huyết Long Sa Thải & Ly Hôn",
      "title": "Ác Thú Tranh Chấp Tài Sản Chung & Thử Việc",
      "hp": 2150,
      "atk": 76,
      "avatar": "assets/monsters/monster_19.svg",
      "quote": "Thời gian thử việc đại học tối đa mấy ngày? Tài sản thừa kế riêng có nhập chung?",
      "defeatQuote": "Thử việc trình độ đại học tối đa 60 ngày! Tài sản thừa kế riêng không tự động nhập chung..."
    }
  },
  {
    "stage": 20,
    "realm": 6,
    "realmName": "Khu Vực 6: Sở Hữu Trí Tuệ",
    "id": "stage_20",
    "name": "Ải 20: Thư Viện Bản Quyền Phong Ấn",
    "chapter": "Chương 7",
    "chapterName": "Quyền Tác Giả: Quyền Nhân Thân & Quyền Tài Sản",
    "packId": "hust_ch7",
    "bgGradient": "linear-gradient(to top, #1e1b4b 0%, #3730a3 60%, #090526 100%)",
    "badge": "👻 ẢI 20 • HUYỀN THOẠI",
    "threatLevel": "HUYỀN THOẠI",
    "threatColor": "text-rose-400 font-black tracking-wide",
    "threatDesc": "Phạt sai: -82 HP • 💀 SAI 1 CÂU MẤT 82% MÁU! • Cần ~24 câu đúng",
    "requiredQuestions": 24,
    "turnTimer": 14,
    "monsterArmor": 0.3,
    "clearRateText": "Top 2% Thủ Khoa Bách Khoa",
    "bonusScore": 8700,
    "monster": {
      "id": "phantom_piracy",
      "name": "Bóng Ma Đạo Văn & Đạo Nhạc",
      "title": "Kẻ Đánh Cắp Bản Quyền Tác Phẩm",
      "hp": 2360,
      "atk": 82,
      "avatar": "assets/monsters/monster_20.svg",
      "quote": "Quyền nhân thân nào không được chuyển giao? Thời hạn bảo hộ suốt đời tác giả cộng bao nhiêu năm?",
      "defeatQuote": "Bảo hộ suốt đời tác giả cộng 50 năm sau khi tác giả qua đời... ngươi quá đỉnh cao!"
    }
  },
  {
    "stage": 21,
    "realm": 6,
    "realmName": "Khu Vực 6: Sở Hữu Trí Tuệ",
    "id": "stage_21",
    "name": "Ải 21: Lò Rèn Sáng Chế & Sở Hữu Công Nghiệp",
    "chapter": "Chương 7",
    "chapterName": "Sáng Chế, Kiểu Dáng Công Nghiệp & Nhãn Hiệu",
    "packId": "hust_ch7",
    "bgGradient": "linear-gradient(to top, #27272a 0%, #52525b 60%, #09090b 100%)",
    "badge": "⚙️ ẢI 21 • HUYỀN THOẠI",
    "threatLevel": "HUYỀN THOẠI",
    "threatColor": "text-rose-400 font-black tracking-wide",
    "threatDesc": "Phạt sai: -88 HP • 💀 SAI 1 CÂU HẤP HỐI, 2 CÂU LÀ TỬ VONG! • Cần ~25 câu đúng",
    "requiredQuestions": 25,
    "turnTimer": 14,
    "monsterArmor": 0.31,
    "clearRateText": "Top 1.5% Cao Thủ Vượt Qua",
    "bonusScore": 9700,
    "monster": {
      "id": "iron_titan_ip",
      "name": "Hắc Kim Ma Thú Sáng Chế",
      "title": "Chúa Tể Đánh Cắp Kiểu Dáng & Nhãn Hiệu",
      "hp": 2580,
      "atk": 88,
      "avatar": "assets/monsters/monster_21.svg",
      "quote": "Bằng độc quyền sáng chế có hiệu lực mấy năm? Giải pháp hữu ích mấy năm?",
      "defeatQuote": "Sáng chế 20 năm, giải pháp hữu ích 10 năm, kiểu dáng công nghiệp 5 năm gia hạn 2 lần..."
    }
  },
  {
    "stage": 22,
    "realm": 6,
    "realmName": "Khu Vực 6: Sở Hữu Trí Tuệ",
    "id": "stage_22",
    "name": "Ải 22: Tháp Bí Mật Chuyển Giao Công Nghệ",
    "chapter": "Chương 7",
    "chapterName": "Bí Mật Kinh Doanh & Hợp Đồng Li-Xăng",
    "packId": "hust_ch7",
    "bgGradient": "linear-gradient(to top, #083344 0%, #0e7490 60%, #020617 100%)",
    "badge": "🔮 ẢI 22 • HUYỀN THOẠI ĐỈNH PHONG",
    "threatLevel": "ĐỈNH PHONG",
    "threatColor": "text-amber-400 font-black tracking-wide",
    "threatDesc": "Phạt sai: -92 HP • 💀 SAI 1 CÂU GẦN NHƯ CHẾT TỨC THÌ! • Cần ~26 câu đúng",
    "requiredQuestions": 26,
    "turnTimer": 13,
    "monsterArmor": 0.32,
    "clearRateText": "Chỉ Top 1% Siêu Cấp Thủ Khoa",
    "bonusScore": 10800,
    "monster": {
      "id": "trade_secret_archmage",
      "name": "Chúa Tể Bí Mật Kinh Doanh",
      "title": "Pháp Sư Độc Quyền Công Nghệ Bách Khoa",
      "hp": 2820,
      "atk": 92,
      "avatar": "assets/monsters/monster_22.svg",
      "quote": "Điều kiện để thông tin được coi là bí mật kinh doanh? Chuyển giao quyền sở hữu công nghiệp thế nào?",
      "defeatQuote": "Bảo hộ bí mật kinh doanh không cần đăng ký nhưng phải có biện pháp bảo mật hợp lý..."
    }
  },
  {
    "stage": 23,
    "realm": 7,
    "realmName": "Khu Vực 7: Đỉnh Phong Huyền Thoại",
    "id": "stage_23",
    "name": "Ải 23: Vực Thẳm Cạm Bẫy Điểm Liệt HUST",
    "chapter": "Chuyên Đề Bẫy",
    "chapterName": "Tổng Hợp Các Câu Bẫy Kinh Điển Điểm F HUST",
    "packId": "hust_exam_trap",
    "bgGradient": "linear-gradient(to top, #4a044e 0%, #86198f 60%, #1f0224 100%)",
    "badge": "🦊 ẢI 23 • THẦN THOẠI",
    "threatLevel": "THẦN THOẠI",
    "threatColor": "text-rose-400 font-black tracking-wider animate-bounce",
    "threatDesc": "Phạt sai: -96 HP • ☠️ SAI 1 CÂU MẤT 96% MÁU! • Cần ~28 câu đúng",
    "requiredQuestions": 28,
    "turnTimer": 13,
    "monsterArmor": 0.33,
    "clearRateText": "Chỉ Top 0.5% Sinh Viên Chạm Tới",
    "bonusScore": 12500,
    "monster": {
      "id": "nine_tailed_trickster",
      "name": "Cửu Vĩ Ma Hồ Đề Lừa",
      "title": "Quái Thú Giăng Bẫy Điểm Liệt Bách Khoa",
      "hp": 3080,
      "atk": 96,
      "avatar": "assets/monsters/monster_23.svg",
      "quote": "Tất cả các đáp án trên? Hay chỉ có một ngoại lệ duy nhất? Hãy sập bẫy của ta!",
      "defeatQuote": "Ngươi tỉnh táo đến đáng sợ... không một câu gài bẫy nào có thể lừa nổi ngươi!"
    }
  },
  {
    "stage": 24,
    "realm": 7,
    "realmName": "Khu Vực 7: Đỉnh Phong Huyền Thoại",
    "id": "stage_24",
    "name": "Ải 24: VÕ ĐÀI TẬN CÙNG VŨ TRỤ — ĐẠI PHÁ ĐẢO",
    "chapter": "Toàn Bộ 7 Chương",
    "chapterName": "ĐẠI TRÙM CUỐI: MA VƯƠNG ĐIỂM F TỐI THƯỢNG (THE ULTIMATE OVERLORD)",
    "packId": "hust_all",
    "bgGradient": "radial-gradient(ellipse at bottom, #58003a 0%, #290040 45%, #0d0014 100%)",
    "badge": "☠️ TRÙM CUỐI • ĐẠI PHÁ ĐẢO",
    "threatLevel": "TUYỆT VỌNG TỐI THƯỢNG",
    "threatColor": "text-amber-300 font-black tracking-widest neon-text-gold animate-pulse",
    "threatDesc": "Phạt sai: -100 HP • ☠️ SAI 1 CÂU DUY NHẤT LÀ BAY MÀU TỨC THÌ! • Cần 32+ câu đúng",
    "requiredQuestions": 32,
    "turnTimer": 12,
    "monsterArmor": 0.35,
    "clearRateText": "CHỈ TOP 0.1% ĐỆ NHẤT THỦ KHOA HUST",
    "bonusScore": 20000,
    "monster": {
      "id": "ultimate_overlord",
      "name": "ĐẠI MA VƯƠNG ĐIỂM LIỆT TỐI THƯỢNG",
      "title": "Nỗi Khiếp Sợ Thi Cuối Kỳ Môn Pháp Luật Bách Khoa",
      "hp": 3500,
      "atk": 100,
      "avatar": "assets/monsters/monster_24.svg",
      "quote": "Hahaha! Muốn chinh phục toàn bộ 4,800+ câu Pháp Luật Đại Cương ĐHBK Hà Nội? Hãy nếm trải bản án tuyệt đối của ta!",
      "defeatQuote": "VĨ ĐẠI! Ngươi chính thức trở thành ĐỆ NHẤT THỦ KHOA PHÁP LUẬT ĐẠI CƯƠNG TOÀN KHÓA ĐHBK HÀ NỘI!"
    }
  }
];

// ==========================================================================
// ==========================================================================
// BẢNG XẾP HẠNG THỰC TẾ (REAL USERS ONLY - KHÔNG SỬ DỤNG DỮ LIỆU TỰ TẠO)
// ==========================================================================
const DEFAULT_LEADERBOARD = [];

// CỔ VẬT TRI THỨC VƯỢT ẢI (ROGUELIKE RELICS & TALENTS)
// ==========================================================================
const CAMPAIGN_RELICS = [
  {
    id: "relic_pen_a",
    name: "Bút Phê Điểm A",
    icon: "fa-pen-nib",
    tag: "TẤN CÔNG",
    color: "from-amber-500 to-amber-700",
    border: "border-amber-400",
    desc: "Tăng vĩnh viễn +25% Sát thương đòn đánh của dũng sĩ lên mọi quái thú.",
    type: "atk_boost",
    val: 0.25
  },
  {
    id: "relic_scale",
    name: "Cán Cân Công Lý",
    icon: "fa-scale-balanced",
    tag: "CHÍ MẠNG",
    color: "from-sky-500 to-indigo-700",
    border: "border-sky-400",
    desc: "Tăng +30% Tỉ lệ đánh Chí Mạng (đòn chí mạng gây x1.5 sát thương).",
    type: "crit_boost",
    val: 30
  },
  {
    id: "relic_armor",
    name: "Khiên Pháp Chế HUST",
    icon: "fa-shield-halved",
    tag: "PHÒNG THỦ",
    color: "from-emerald-500 to-teal-700",
    border: "border-emerald-400",
    desc: "Giảm vĩnh viễn 30% sát thương từ tất cả đòn phản kích của ma thú.",
    type: "dmg_reduction",
    val: 0.30
  },
  {
    id: "relic_heart",
    name: "Trái Tim Bách Khoa",
    icon: "fa-heart-pulse",
    tag: "SINH LỰC",
    color: "from-rose-500 to-pink-700",
    border: "border-rose-400",
    desc: "Tăng Máu tối đa dũng sĩ lên 135 HP và lập tức hồi đầy thanh máu.",
    type: "max_hp",
    val: 35
  },
  {
    id: "relic_speed",
    name: "Gia Tốc Tri Thức",
    icon: "fa-bolt-lightning",
    tag: "HỒI PHỤC",
    color: "from-yellow-400 to-amber-600",
    border: "border-yellow-400",
    desc: "Trả lời đúng trong 5 giây đầu hồi phục ngay +10 HP cho dũng sĩ.",
    type: "speed_heal",
    val: 10
  },
  {
    id: "relic_core",
    name: "Lõi Năng Lượng Thần Tốc",
    icon: "fa-atom",
    tag: "TUYỆT KỸ",
    color: "from-purple-500 to-violet-700",
    border: "border-purple-400",
    desc: "Mỗi câu trả lời đúng nạp +35% năng lượng Tuyệt Kỹ (thay vì 25%).",
    type: "energy_charge",
    val: 10
  },
  {
    id: "relic_clover",
    name: "Cỏ May Mắn Kỳ Thi",
    icon: "fa-clover",
    tag: "TIẾP TẾ",
    color: "from-emerald-400 to-green-700",
    border: "border-emerald-300",
    desc: "Tự động tiếp tế thêm +1 Bình Dược (+35 HP) và +1 Kính Chiếu Yêu 50/50.",
    type: "item_restock",
    val: 1
  },
  {
    id: "relic_eye",
    name: "Mắt Thần Phán Quan",
    icon: "fa-eye",
    tag: "ĐUA TOP",
    color: "from-cyan-400 to-blue-700",
    border: "border-cyan-400",
    desc: "Tăng thêm +50% Điểm số tích lũy cho toàn bộ các ải tiếp theo.",
    type: "score_multiplier",
    val: 1.5
  }
];

// Export to window
if (typeof window !== "undefined") {
  window.HEROES_DATA = HEROES_DATA;
  window.MAPS_DATA = MAPS_DATA;
  window.QUESTION_PACKS = QUESTION_PACKS;
  window.FALLBACK_HUST_QUESTIONS = FALLBACK_HUST_QUESTIONS;
  window.CAMPAIGN_STAGES = CAMPAIGN_STAGES;
  window.DEFAULT_LEADERBOARD = DEFAULT_LEADERBOARD;
  window.CAMPAIGN_RELICS = CAMPAIGN_RELICS;
}
