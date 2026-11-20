# ⚔️ ĐẤU TRƯỜNG TRI THỨC HUST - ÔN THI PHÁP LUẬT ĐẠI CƯƠNG

> **Web Game & Ứng Dụng Ôn Thi Đột Phá Cho Sinh Viên Đại Học Bách Khoa Hà Nội (HUST)**  
> Trải nghiệm ôn thi Pháp Luật Đại Cương thông qua phong cách Web Game RPG Roguelike Vượt Ải Diệt Quái, hệ thống âm thanh sống động, bộ câu hỏi chuẩn hóa và Bảng Xếp Hạng Đua Top đồng bộ IP Cloud.

🌐 **Trải Nghiệm Trực Tuyến:** [https://dau-truong-tri-thuc-hust.netlify.app/game](https://dau-truong-tri-thuc-hust.netlify.app/game)

---

## 🌟 Tính Năng Nổi Bật

1. **Hành Trình 24 Cửa Ải Diệt Ma Thú (RPG Roguelike Campaign)**:
   - 24 ải đấu trải dài từ Chương 1 đến Chương 6 môn Pháp Luật Đại Cương HUST.
   - Độ khó tăng dần: HP Quái Thú, Sát Thương Phản Kích (Rage Attack) và yêu cầu chuỗi Combo chính xác cao.
   - Cơ chế chọn Cổ Vật (Relic Loot) ngẫu nhiên sau mỗi ải: Tim Rồng (+Máu), Bùa May Mắn (+Vật phẩm), Kiếm Thần (+Sát thương chí mạng)...

2. **Kho Đề Chuẩn Hóa & Không Trùng Lặp**:
   - Tích hợp toàn diện các bộ Quiz từ 1 đến 6 và ngân hàng đề thi trắc nghiệm các kỳ.
   - Thuật toán phân bổ câu hỏi thông minh, đảm bảo **không trùng lặp** câu hỏi giữa các ải.

3. **Bảng Xếp Hạng Đua Top Bất Biến & Đồng Bộ Theo IP Máy**:
   - Lưu trữ dữ liệu thực trên **Netlify Blobs** Cloud Storage.
   - Nhận diện máy qua **Địa chỉ IP** & **Device ID** duy nhất.
   - **Đồng bộ thông minh**: Tự động cập nhật thứ hạng khi người chơi đạt điểm cao hơn; bảo lưu an toàn kỷ lục cao nhất khi chơi lại.
   - Dữ liệu minh bạch, ẩn bảo mật một phần IP (`118.70.*.*`, `2405:4803:*:*`).

4. **Hệ Thống Âm Thanh Arcade 8-Bit & Hiệu Ứng Trận Đấu**:
   - Âm thanh Web Audio API thuần: Âm thanh chém quái, gầm thét của Boss, âm thanh hồi máu, fanfare qua ải và nhạc nền chiến trận.

---

## 🚀 Cấu Trúc Dự Án

```
ON_THI_PHAP_LUAT_DAI_CUONG/
├── assets/                       # Ảnh Avatar Dũng sĩ, Ma Thú, Bản đồ ải
├── netlify/
│   └── functions/
│       └── leaderboard.mjs       # Serverless Function API Bảng Xếp Hạng & Sync IP
├── dau-truong-tri-thuc.html      # Giao diện chính của Game Đấu Trường Tri Thức
├── game_engine.js                # Game Engine v3.3.1 (State, Combat, Relic, Audio, Sync)
├── game_data.js                  # Dữ liệu 24 Ải, Ma Thú, Cổ Vật Relic
├── data_bank.js                  # Kho câu hỏi Pháp Luật Đại Cương chuẩn hóa
├── data.js                       # Dữ liệu câu hỏi bổ trợ
├── game_audio.js                 # Bộ tổng hợp âm thanh Web Audio API
├── netlify.toml                  # Cấu hình triển khai & routing Netlify
└── package.json                  # Cấu hình dependency Netlify Blobs
```

---

## 💻 Hướng Dẫn Chạy Cục Bộ (Local)

1. **Cách 1: Mở Trực Tiếp Bằng Trình Duyệt**
   - Nhấp đúp chuột vào file `dau-truong-tri-thuc.html` để mở ngay trên Chrome, Cốc Cốc, Edge, Safari...
   - Hệ thống tự động kết nối API Cloud để đồng bộ Bảng Vàng và IP máy.

2. **Cách 2: Sử Dụng Live Server / Netlify Dev**
   ```bash
   npm install
   npx netlify dev
   ```
   Truy cập: `http://localhost:8888/game` hoặc `http://localhost:8888/dau-truong-tri-thuc.html`

---

## 📜 Bản Quyền & Tác Giả

- Dự án được phát triển phục vụ cộng đồng sinh viên Đại học Bách Khoa Hà Nội ôn thi học phần Pháp Luật Đại Cương.
- Giữ vững kỷ cương - Quyết tâm rinh điểm A Bách Khoa!
