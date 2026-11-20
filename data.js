/**
 * CORE DATASET - HUST PHÁP LUẬT ĐẠI CƯƠNG (EM1170)
 * Nguồn: Đề thi chuẩn KTPH CLB Hỗ trợ học tập ĐH Bách Khoa Hà Nội
 */

const QUIZ_DATA = [
  {
    "id": 48,
    "set_q_num": 1,
    "chapter": "Chương 1: Nhập môn Pháp luật đại cương",
    "category": "ch1_intro",
    "question": "Theo tài liệu Quiz 01 CLB Hỗ trợ học tập Bách Khoa, môn học Pháp luật đại cương (EM1170) thuộc lĩnh vực nào của khoa học xã hội?",
    "options": [
      "Khoa học chính trị - pháp lý",
      "Khoa học kỹ thuật công nghệ",
      "Khoa học tự nhiên ứng dụng",
      "Khoa học nhân văn thuần túy"
    ],
    "answer": 0,
    "explanation": "Căn cứ tài liệu Quiz 01 CLB Hỗ trợ học tập HUST: Môn học Pháp luật đại cương là môn khoa học chính trị - pháp lý cơ sở, cung cấp tri thức cơ bản về nhà nước và pháp luật cho sinh viên khối kỹ thuật ĐH Bách Khoa Hà Nội."
  },
  {
    "id": 49,
    "set_q_num": 2,
    "chapter": "Chương 1: Nhập môn Pháp luật đại cương",
    "category": "ch1_intro",
    "question": "Theo quan điểm chủ nghĩa Mác - Lênin trong ngân hàng câu hỏi Tailieuhust, khẳng định nào sau đây là SAI khi nghiên cứu về nguồn gốc Nhà nước?",
    "options": [
      "Nhà nước ra đời và tồn tại vĩnh cửu cùng với toàn bộ lịch sử phát triển của xã hội loài người",
      "Thời kỳ công xã nguyên thủy chưa có giai cấp và chưa xuất hiện nhà nước",
      "Nhà nước là một hiện tượng xã hội mang tính lịch sử, chỉ xuất hiện khi có điều kiện kinh tế - xã hội nhất định",
      "Sự xuất hiện chế độ tư hữu và phân hóa giai cấp là nguyên nhân cốt lõi dẫn tới sự ra đời của nhà nước"
    ],
    "answer": 0,
    "explanation": "Căn cứ Quiz 01 Tailieuhust: Khẳng định 'Nhà nước ra đời và tồn tại vĩnh cửu' là SAI, vì trong xã hội nguyên thủy không có nhà nước, và theo học thuyết Mác - Lênin, khi xã hội cộng sản chủ nghĩa không còn giai cấp thì nhà nước cũng sẽ tự tiêu vong."
  },
  {
    "id": 50,
    "set_q_num": 3,
    "chapter": "Chương 2: Những vấn đề cơ bản về Nhà nước",
    "category": "ch2_state",
    "question": "Theo tài liệu 700 câu trắc nghiệm Tailieuhust, sự xuất hiện của nhà nước cổ đại nào có nguyên nhân chủ yếu do mâu thuẫn giai cấp đối kháng gay gắt không thể điều hòa được?",
    "options": [
      "Nhà nước Aten",
      "Nhà nước phương Đông cổ đại",
      "Nhà nước Giéc-manh",
      "Nhà nước phong kiến phương Tây"
    ],
    "answer": 0,
    "explanation": "Căn cứ F.Ăngghen trong tác phẩm 'Nguồn gốc của gia đình, của chế độ tư hữu và của Nhà nước' & Bộ câu hỏi Tailieuhust: Nhà nước Aten là hình thức thuần túy, cổ điển nhất cho sự ra đời nhà nước trực tiếp từ mâu thuẫn giai cấp nội bộ phát triển đỉnh cao."
  },
  {
    "id": 51,
    "set_q_num": 4,
    "chapter": "Chương 2: Những vấn đề cơ bản về Nhà nước",
    "category": "ch2_state",
    "question": "Đặc trưng nào sau đây của Nhà nước giúp phân biệt rõ ràng nhất giữa Nhà nước với các tổ chức chính trị - xã hội khác (như Đảng phái, Công đoàn, Đoàn thanh niên)?",
    "options": [
      "Thiết lập quyền lực công cộng đặc biệt, quản lý dân cư theo lãnh thổ và có chủ quyền quốc gia",
      "Có điều lệ hoạt động và các thành viên tự nguyện tham gia",
      "Có mục tiêu phấn đấu vì lợi ích của một nhóm người trong xã hội",
      "Tổ chức hội nghị định kỳ để bầu ra ban chấp hành"
    ],
    "answer": 0,
    "explanation": "Căn cứ Giáo trình PGS.TS Vũ Quang & Quiz Tailieuhust: Nhà nước có 5 đặc trưng quyền lực công cộng đặc biệt, phân chia dân cư theo lãnh thổ, chủ quyền quốc gia, độc quyền ban hành pháp luật và thu thuế mà không tổ chức chính trị nào khác có được."
  },
  {
    "id": 52,
    "set_q_num": 5,
    "chapter": "Chương 2: Những vấn đề cơ bản về Nhà nước",
    "category": "ch2_state",
    "question": "Theo tài liệu ôn thi CLB Hỗ trợ học tập HUST, chức năng đối nội nào sau đây KHÔNG PHẢI là chức năng đối nội cơ bản của Nhà nước?",
    "options": [
      "Tham gia liên minh quân sự và ký kết các hiệp định thương mại tự do với các quốc gia khác",
      "Bảo đảm trật tự an toàn xã hội và trấn áp các hành vi vi phạm pháp luật",
      "Tổ chức và quản lý phát triển nền kinh tế quốc gia",
      "Bảo vệ chế độ chính trị, phát triển giáo dục, khoa học công nghệ và y tế"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide Chương 2 HUST & Quiz Tailieuhust: Tham gia liên minh quân sự và ký kết điều ước với các nước là thuộc chức năng ĐỐI NGOẠI của nhà nước."
  },
  {
    "id": 53,
    "set_q_num": 6,
    "chapter": "Chương 2: Những vấn đề cơ bản về Nhà nước",
    "category": "ch2_state",
    "question": "Hình thức chính thể của Nhà nước Cộng hòa Xã hội Chủ nghĩa Việt Nam hiện nay theo Hiến pháp 2013 là hình thức nào?",
    "options": [
      "Cộng hòa dân chủ nhân dân (Cộng hòa xã hội chủ nghĩa)",
      "Cộng hòa tổng thống",
      "Cộng hòa đại nghị",
      "Quân chủ lập hiến"
    ],
    "answer": 0,
    "explanation": "Căn cứ Hiến pháp 2013 & Giáo trình HUST: Chính thể của Việt Nam là Cộng hòa Xã hội Chủ nghĩa (thuộc dạng chính thể Cộng hòa dân chủ)."
  },
  {
    "id": 54,
    "set_q_num": 7,
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "category": "ch3_apparatus",
    "question": "Theo Quiz 02 CLB Hỗ trợ học tập Bách Khoa, cơ quan nào là cơ quan đại biểu cao nhất của Nhân dân, cơ quan quyền lực nhà nước cao nhất của nước CHXHCN Việt Nam?",
    "options": [
      "Quốc hội",
      "Chính phủ",
      "Chủ tịch nước",
      "Tòa án nhân dân tối cao"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 69 Hiến pháp 2013: Quốc hội là cơ quan đại biểu cao nhất của Nhân dân, cơ quan quyền lực nhà nước cao nhất của nước CHXHCN Việt Nam."
  },
  {
    "id": 55,
    "set_q_num": 8,
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "category": "ch3_apparatus",
    "question": "Cơ quan hành chính nhà nước cao nhất của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam, thực hiện quyền hành pháp là cơ quan nào?",
    "options": [
      "Chính phủ",
      "Ủy ban Thường vụ Quốc hội",
      "Tòa án nhân dân tối cao",
      "Văn phòng Chủ tịch nước"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 94 Hiến pháp 2013: Chính phủ là cơ quan hành chính nhà nước cao nhất của nước CHXHCN Việt Nam, thực hiện quyền hành pháp, là cơ quan chấp hành của Quốc hội."
  },
  {
    "id": 56,
    "set_q_num": 9,
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "category": "ch3_apparatus",
    "question": "Theo Hiến pháp 2013, ai là người đứng đầu Nhà nước, thay mặt nước Cộng hòa xã hội chủ nghĩa Việt Nam về đối nội và đối ngoại?",
    "options": [
      "Chủ tịch nước",
      "Thủ tướng Chính phủ",
      "Chủ tịch Quốc hội",
      "Tổng Bí thư"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 86 Hiến pháp 2013: Chủ tịch nước là người đứng đầu Nhà nước, thay mặt nước CHXHCN Việt Nam về đối nội và đối ngoại."
  },
  {
    "id": 57,
    "set_q_num": 10,
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "category": "ch3_apparatus",
    "question": "Theo Luật Tổ chức Tòa án nhân dân và Hiến pháp 2013, cơ quan nào là cơ quan xét xử của nước CHXHCN Việt Nam, thực hiện quyền tư pháp?",
    "options": [
      "Tòa án nhân dân",
      "Viện kiểm sát nhân dân",
      "Bộ Tư pháp",
      "Cơ quan Cảnh sát điều tra"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 102 Hiến pháp 2013: Tòa án nhân dân là cơ quan xét xử của nước CHXHCN Việt Nam, thực hiện quyền tư pháp."
  },
  {
    "id": 58,
    "set_q_num": 11,
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "category": "ch3_apparatus",
    "question": "Viện kiểm sát nhân dân trong bộ máy nhà nước Việt Nam thực hiện những chức năng hiến định nào?",
    "options": [
      "Thực hành quyền công tố và kiểm sát hoạt động tư pháp",
      "Xét xử các vụ án hình sự và dân sự",
      "Ban hành luật và nghị quyết",
      "Thực hiện quyền hành pháp và quản lý hành chính nhà nước"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 107 Hiến pháp 2013: Viện kiểm sát nhân dân thực hành quyền công tố, kiểm sát hoạt động tư pháp."
  },
  {
    "id": 59,
    "set_q_num": 12,
    "chapter": "Chương 3: Bộ máy Nhà nước Việt Nam",
    "category": "ch3_apparatus",
    "question": "Theo quy định của Hiến pháp 2013, Hội đồng nhân dân là cơ quan gì ở địa phương?",
    "options": [
      "Cơ quan quyền lực nhà nước ở địa phương, đại diện cho ý chí, nguyện vọng và quyền làm chủ của Nhân dân địa phương",
      "Cơ quan chấp hành của Quốc hội ở địa phương",
      "Cơ quan tư pháp và xét xử ở địa phương",
      "Cơ quan hành chính nhà nước ở địa phương"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 113 Hiến pháp 2013: Hội đồng nhân dân là cơ quan quyền lực nhà nước ở địa phương, do Nhân dân địa phương bầu ra."
  },
  {
    "id": 60,
    "set_q_num": 13,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Theo tài liệu Quiz 03 Tailieuhust, thuộc tính nào sau đây thể hiện ranh giới phân biệt rõ nhất giữa pháp luật với đạo đức và tập quán?",
    "options": [
      "Tính quyền lực nhà nước (được bảo đảm thực hiện bằng quyền lực và sức mạnh cưỡng chế của nhà nước)",
      "Tính xã hội rộng rãi",
      "Tính định hướng hành vi",
      "Tính kế thừa lịch sử"
    ],
    "answer": 0,
    "explanation": "Căn cứ Giáo trình HUST & Quiz 03 Tailieuhust: Tính quyền lực nhà nước (bảo đảm bằng biện pháp cưỡng chế nhà nước) là thuộc tính đặc trưng chỉ pháp luật mới có, trong khi đạo đức được bảo đảm bằng dư luận xã hội và lương tâm."
  },
  {
    "id": 61,
    "set_q_num": 14,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Trong cấu trúc của quy phạm pháp luật (QPPL), bộ phận nào nêu lên các điều kiện, hoàn cảnh, chủ thể chịu sự tác động của điều luật?",
    "options": [
      "Giả định",
      "Quy định",
      "Chế tài",
      "Biện pháp cưỡng chế"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide Chương 4 HUST: Bộ phận Giả định trả lời cho câu hỏi: Ai? Khi nào? Trong hoàn cảnh, điều kiện nào?"
  },
  {
    "id": 62,
    "set_q_num": 15,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Trong cấu trúc của quy phạm pháp luật, bộ phận nào nêu lên khuôn mẫu, cách xử sự mà chủ thể phải làm, được làm hoặc không được làm?",
    "options": [
      "Quy định",
      "Giả định",
      "Chế tài",
      "Cơ cấu quan hệ pháp luật"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide Chương 4 HUST: Bộ phận Quy định là trung tâm của QPPL, trả lời cho câu hỏi: Chủ thể được làm gì, không được làm gì, phải làm như thế nào?"
  },
  {
    "id": 63,
    "set_q_num": 16,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Xác định cấu trúc bộ phận của điều luật sau: 'Người nào xúc phạm nghiêm trọng nhân phẩm, danh dự của người khác, thì bị phạt cảnh cáo, phạt tiền từ 10 triệu đồng đến 30 triệu đồng hoặc phạt cải tạo không giam giữ đến 03 năm' (Khoản 1 Điều 155 BLHS):",
    "options": [
      "Gồm bộ phận Giả định và Chế tài (Khuyết bộ phận Quy định)",
      "Gồm đầy đủ cả 3 bộ phận: Giả định, Quy định, Chế tài",
      "Chỉ có bộ phận Quy định và Chế tài",
      "Chỉ có bộ phận Giả định và Quy định"
    ],
    "answer": 0,
    "explanation": "Căn cứ Bẫy thi số 1 & Tài liệu CLB HTHT HUST: Đa số các điều luật phần các tội phạm cụ thể trong BLHS chỉ có Giả định ('Người nào xúc phạm...') và Chế tài ('thì bị phạt...'), khuyết bộ phận Quy định vì mệnh lệnh cấm được hiểu ngầm."
  },
  {
    "id": 64,
    "set_q_num": 17,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Theo Quiz 04 Tailieuhust, năng lực chủ thể trong quan hệ pháp luật bao gồm hai yếu tố nào hợp thành?",
    "options": [
      "Năng lực pháp luật và Năng lực hành vi",
      "Năng lực kinh tế và Năng lực quản lý",
      "Năng lực thể chất và Năng lực chuyên môn",
      "Năng lực tự nhiên và Năng lực xã hội"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide Chương 4 HUST: Năng lực chủ thể = Năng lực pháp luật (khả năng có quyền và nghĩa vụ do pháp luật quy định) + Năng lực hành vi (khả năng bằng hành vi của mình xác lập, thực hiện quyền và nghĩa vụ)."
  },
  {
    "id": 65,
    "set_q_num": 18,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Thời điểm xuất hiện năng lực pháp luật của một cá nhân (công dân) theo quy định của Bộ luật Dân sự Việt Nam là khi nào?",
    "options": [
      "Có từ khi người đó sinh ra và chấm dứt khi người đó chết",
      "Khi người đó đủ 18 tuổi",
      "Khi người đó đủ 15 tuổi và bắt đầu đi làm",
      "Khi người đó được cấp Căn cước công dân"
    ],
    "answer": 0,
    "explanation": "Căn cứ Khoản 3 Điều 16 Bộ luật Dân sự 2015: Năng lực pháp luật dân sự của cá nhân có từ khi người đó sinh ra và chấm dứt khi người đó chết."
  },
  {
    "id": 66,
    "set_q_num": 19,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Hành vi người tham gia giao thông dừng xe trước vạch sơn khi gặp tín hiệu đèn đỏ là biểu hiện của hình thức thực hiện pháp luật nào?",
    "options": [
      "Tuân thủ pháp luật (Tuân thủ lệnh cấm không được vượt đèn đỏ)",
      "Sử dụng pháp luật",
      "Áp dụng pháp luật",
      "Tự vệ hợp pháp"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide Chương 4 HUST & Quiz Tailieuhust: Tuân thủ pháp luật là việc chủ thể kiềm chế không thực hiện điều mà pháp luật cấm (cấm vượt đèn đỏ)."
  },
  {
    "id": 67,
    "set_q_num": 20,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Công dân A gửi đơn đến Ủy ban nhân dân quận để đăng ký kết hôn với chị B là biểu hiện của hình thức thực hiện pháp luật nào?",
    "options": [
      "Sử dụng pháp luật (Thực hiện quyền được pháp luật cho phép)",
      "Thi hành pháp luật",
      "Tuân thủ pháp luật",
      "Áp dụng pháp luật"
    ],
    "answer": 0,
    "explanation": "Căn cứ Giáo trình HUST: Sử dụng pháp luật là hình thức chủ thể thực hiện quyền chủ thể của mình (làm điều mà pháp luật cho phép làm, như quyền kết hôn, quyền khiếu nại, quyền sở hữu tài sản)."
  },
  {
    "id": 68,
    "set_q_num": 21,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Chủ tịch UBND quận ra Quyết định xử phạt vi phạm hành chính 5 triệu đồng đối với hành vi xả rác thải bừa bãi là hình thức thực hiện pháp luật nào?",
    "options": [
      "Áp dụng pháp luật",
      "Sử dụng pháp luật",
      "Tuân thủ pháp luật",
      "Chấp hành pháp luật"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide Chương 4 HUST: Áp dụng pháp luật là hoạt động mang tính quyền lực nhà nước, chỉ do cơ quan hoặc người có thẩm quyền của nhà nước tiến hành theo trình tự pháp luật."
  },
  {
    "id": 69,
    "set_q_num": 22,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Vi phạm pháp luật phải có đủ 4 dấu hiệu cơ bản nào sau đây?",
    "options": [
      "Hành vi xác định của con người; Trái pháp luật; Có lỗi của chủ thể; Chủ thể có năng lực trách nhiệm pháp lý",
      "Hành vi nguy hiểm; Gây thiệt hại lớn; Có vũ khí; Có nhiều người tham gia",
      "Suy nghĩ tiêu cực; Trái đạo đức xã hội; Gây hoang mang dư luận; Bị cơ quan nhắc nhở",
      "Vi phạm hợp đồng; Không chịu xin lỗi; Có đơn kiện; Tòa án thụ lý"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide Chương 4 HUST: Vi phạm pháp luật luôn là hành vi (hành động hoặc không hành động), trái pháp luật, có lỗi và do chủ thể có năng lực trách nhiệm pháp lý thực hiện."
  },
  {
    "id": 70,
    "set_q_num": 23,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Anh X nảy sinh ý định trong đầu sẽ cướp tiệm vàng nhưng chưa hề thực hiện bất kỳ hành vi chuẩn bị hay hành động nào ra bên ngoài thực tế. Hành vi trong suy nghĩ của X có bị coi là vi phạm pháp luật không?",
    "options": [
      "Không, vì pháp luật chỉ điều chỉnh hành vi thực tế của con người, không xử lý suy nghĩ hay tư tưởng",
      "Có, vì ý định phạm tội đặc biệt nguy hiểm cho xã hội",
      "Có, nếu bị người khác phát hiện và tố cáo",
      "Tùy thuộc vào giá trị của tiệm vàng mà anh X định cướp"
    ],
    "answer": 0,
    "explanation": "Căn cứ nguyên tắc cơ bản của luật học: 'Tư tưởng không bị coi là tội phạm'. Vi phạm pháp luật bắt buộc phải thể hiện ra bên ngoài bằng hành vi xác định của con người."
  },
  {
    "id": 71,
    "set_q_num": 24,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Vụ án ông A giăng dây điện trần có điện áp 220V xung quanh hàng rào vườn cây tiền tỷ vào ban đêm làm một người say rượu ngã vào bị điện giật tử vong (Slide 91 Chương 4 HUST). Lỗi của ông A là lỗi gì?",
    "options": [
      "Cố ý gián tiếp",
      "Cố ý trực tiếp",
      "Vô ý vì quá tự tin",
      "Vô ý do cẩu thả"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 91 Chương 4 HUST: Ông A thấy trước hành vi giăng điện có thể gây chết người, không mong muốn nhưng có ý thức để mặc cho hậu quả xảy ra -> Lỗi cố ý gián tiếp."
  },
  {
    "id": 72,
    "set_q_num": 25,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Vụ án lái xe khách chở 20 người cố vượt qua đoạn đường bị lũ xiết ở Hà Tĩnh năm 2010 vì tin rằng xe to khỏe gầm cao sẽ qua được, dẫn tới lũ cuốn làm 20 người tử vong (Slide 92 Chương 4 HUST). Lỗi của người lái xe là:",
    "options": [
      "Vô ý vì quá tự tin",
      "Cố ý trực tiếp",
      "Cố ý gián tiếp",
      "Vô ý do cẩu thả"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 92 Chương 4 HUST: Người lái xe thấy trước hành vi của mình có thể gây nguy hiểm nhưng tự tin cho rằng hậu quả sẽ không xảy ra hoặc có thể ngăn chặn được -> Lỗi vô ý vì quá tự tin."
  },
  {
    "id": 73,
    "set_q_num": 26,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Bà K đi bộ qua đường vô thức bấm điện thoại không chú ý quan sát, làm hai xe máy chạy ngược chiều giật mình đánh lái tránh bà đâm vào nhau khiến 1 người tử vong (Slide 93 Chương 4 HUST). Lỗi của bà K là:",
    "options": [
      "Vô ý do cẩu thả",
      "Cố ý trực tiếp",
      "Cố ý gián tiếp",
      "Vô ý vì quá tự tin"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide 93 Chương 4 HUST: Bà K không thấy trước hành vi của mình có thể gây nguy hiểm cho người khác, mặc dù buộc phải thấy trước và có thể thấy trước -> Lỗi vô ý do cẩu thả."
  },
  {
    "id": 74,
    "set_q_num": 27,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Theo Điều 22 Bộ luật Hình sự 2015, hành vi của người vì bảo vệ quyền và lợi ích chính đáng của mình, của người khác mà chống trả lại một cách cần thiết người đang có hành vi xâm phạm thì gọi là gì?",
    "options": [
      "Phòng vệ chính đáng (không phải là tội phạm)",
      "Tình thế cấp thiết",
      "Sự kiện bất khả kháng",
      "Tự ý nửa chừng chấm dứt việc phạm tội"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 22 BLHS 2015: Phòng vệ chính đáng là hành vi chống trả một cách cần thiết người đang có hành vi xâm phạm các lợi ích hợp pháp; phòng vệ chính đáng không phải là tội phạm."
  },
  {
    "id": 75,
    "set_q_num": 28,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Theo Điều 23 Bộ luật Hình sự 2015, hành vi của người vì muốn tránh gây thiệt hại cho quyền, lợi ích của Nhà nước, của mình mà không còn cách nào khác phải gây một thiệt hại nhỏ hơn thiệt hại cần ngăn ngừa thì được coi là gì?",
    "options": [
      "Tình thế cấp thiết (không phải là tội phạm)",
      "Phòng vệ chính đáng",
      "Gây thiệt hại do sự kiện bất ngờ",
      "Lỗi vô ý do cẩu thả"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 23 BLHS 2015: Tình thế cấp thiết là tình thế phải gây ra một thiệt hại nhỏ hơn thiệt hại cần ngăn ngừa khi không còn cách nào khác; hành vi này không phải là tội phạm."
  },
  {
    "id": 76,
    "set_q_num": 29,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Trong 4 loại trách nhiệm pháp lý sau đây, loại trách nhiệm pháp lý nào là nghiêm khắc nhất do cơ quan tư pháp (Tòa án) áp dụng?",
    "options": [
      "Trách nhiệm hình sự",
      "Trách nhiệm hành chính",
      "Trách nhiệm dân sự",
      "Trách nhiệm kỷ luật"
    ],
    "answer": 0,
    "explanation": "Căn cứ Giáo trình HUST: Trách nhiệm hình sự là dạng trách nhiệm pháp lý nghiêm khắc nhất, chỉ áp dụng cho người phạm tội, gắn với hình phạt của Nhà nước và để lại án tích."
  },
  {
    "id": 77,
    "set_q_num": 30,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Một công chức nhà nước đi làm muộn nhiều lần và vi phạm quy chế cơ quan thì bị áp dụng loại trách nhiệm pháp lý nào?",
    "options": [
      "Trách nhiệm kỷ luật",
      "Trách nhiệm hình sự",
      "Trách nhiệm dân sự",
      "Trách nhiệm quốc tế"
    ],
    "answer": 0,
    "explanation": "Căn cứ Luật Cán bộ, công chức & Giáo trình HUST: Vi phạm kỷ luật lao động hoặc quy chế công vụ sẽ bị xử lý trách nhiệm kỷ luật (khiển trách, cảnh cáo, hạ bậc lương, buộc thôi việc)."
  },
  {
    "id": 78,
    "set_q_num": 31,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Theo quy định của Luật Ban hành văn bản quy phạm pháp luật 2015, văn bản nào sau đây do Quốc hội ban hành có hiệu lực pháp lý cao nhất trong hệ thống pháp luật Việt Nam?",
    "options": [
      "Hiến pháp",
      "Bộ luật",
      "Nghị quyết của Quốc hội",
      "Pháp lệnh của Ủy ban Thường vụ Quốc hội"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 119 Hiến pháp 2013: Hiến pháp là luật cơ bản của nước CHXHCN Việt Nam, có hiệu lực pháp lý cao nhất; mọi văn bản quy phạm pháp luật khác phải phù hợp với Hiến pháp."
  },
  {
    "id": 79,
    "set_q_num": 32,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Văn bản quy phạm pháp luật do Thủ tướng Chính phủ ban hành có tên gọi pháp lý là gì?",
    "options": [
      "Quyết định",
      "Nghị định",
      "Thông tư",
      "Pháp lệnh"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 4 Luật Ban hành VBQPPL 2015: Thủ tướng Chính phủ ban hành Quyết định; Chính phủ ban hành Nghị định; Bộ trưởng ban hành Thông tư."
  },
  {
    "id": 80,
    "set_q_num": 33,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Bộ trưởng các Bộ (ví dụ Bộ trưởng Bộ GD&ĐT, Bộ Khoa học & Công nghệ) ban hành loại văn bản quy phạm pháp luật nào?",
    "options": [
      "Thông tư",
      "Nghị định",
      "Quyết định quy phạm",
      "Chỉ thị quy phạm"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 4 Luật Ban hành VBQPPL 2015: Bộ trưởng, Thủ trưởng cơ quan ngang bộ ban hành Thông tư."
  },
  {
    "id": 81,
    "set_q_num": 34,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Ủy ban nhân dân các cấp (UBND tỉnh, huyện, xã) ban hành loại văn bản quy phạm pháp luật nào theo luật định?",
    "options": [
      "Quyết định",
      "Nghị quyết",
      "Thông tư liên tịch",
      "Chỉ thị"
    ],
    "answer": 0,
    "explanation": "Căn cứ Luật Ban hành VBQPPL: UBND ban hành Quyết định; còn Hội đồng nhân dân (HĐND) cùng cấp ban hành Nghị quyết."
  },
  {
    "id": 82,
    "set_q_num": 35,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Khi có sự mâu thuẫn về nội dung quy định giữa văn bản luật do Quốc hội ban hành và Nghị định do Chính phủ ban hành về cùng một vấn đề, nguyên tắc áp dụng pháp luật là:",
    "options": [
      "Áp dụng quy định của văn bản luật do Quốc hội ban hành (văn bản có hiệu lực pháp lý cao hơn)",
      "Áp dụng quy định của Nghị định vì chi tiết và ban hành sau",
      "Để Tòa án tự do lựa chọn văn bản áp dụng",
      "Tạm dừng giải quyết vụ việc để chờ hướng dẫn mới"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 156 Luật Ban hành VBQPPL 2015: Trong trường hợp các văn bản quy phạm pháp luật có quy định khác nhau về cùng một vấn đề thì áp dụng văn bản có hiệu lực pháp lý cao hơn."
  },
  {
    "id": 83,
    "set_q_num": 36,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Hiệu lực trở về trước (hiệu lực hồi tố) của văn bản quy phạm pháp luật ở Việt Nam được áp dụng trong trường hợp nào sau đây?",
    "options": [
      "Trường hợp quy định trách nhiệm pháp lý mới nhẹ hơn hoặc xóa bỏ trách nhiệm pháp lý đối với hành vi đó",
      "Áp dụng rộng rãi cho mọi trường hợp",
      "Áp dụng khi quy định mức phạt tăng nặng hơn",
      "Áp dụng khi quy định thêm tội phạm mới"
    ],
    "answer": 0,
    "explanation": "Căn cứ Điều 152 Luật Ban hành VBQPPL 2015: Không được quy định hiệu lực trở về trước đối với trường hợp quy định trách nhiệm pháp lý mới hoặc trách nhiệm pháp lý nặng hơn. Chỉ áp dụng hồi tố khi có lợi cho đối tượng áp dụng."
  },
  {
    "id": 84,
    "set_q_num": 37,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Khách thể của quan hệ pháp luật là gì?",
    "options": [
      "Lợi ích vật chất, tinh thần hoặc lợi ích xã hội mà các chủ thể hướng tới khi tham gia quan hệ pháp luật",
      "Cá nhân hoặc tổ chức tham gia quan hệ pháp luật",
      "Các quyền và nghĩa vụ của các bên tham gia",
      "Văn bản pháp luật làm phát sinh quan hệ đó"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide Chương 4 HUST: Khách thể của quan hệ pháp luật là những lợi ích vật chất, giá trị tinh thần hoặc lợi ích xã hội mà các bên chủ thể mong muốn đạt được khi tham gia quan hệ."
  },
  {
    "id": 85,
    "set_q_num": 38,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Sự kiện pháp lý là gì theo lý luận chung về pháp luật?",
    "options": [
      "Những sự kiện thực tế trong đời sống xã hội mà pháp luật gắn sự xuất hiện của chúng với việc làm phát sinh, thay đổi hoặc chấm dứt quan hệ pháp luật",
      "Mọi hành vi vi phạm pháp luật xảy ra trong xã hội",
      "Văn bản quy phạm pháp luật vừa mới được ban hành",
      "Các phiên tòa xét xử công khai của Tòa án"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide Chương 4 HUST: Sự kiện pháp lý là những hoàn cảnh, sự kiện thực tế được quy phạm pháp luật dự liệu, làm phát sinh, thay đổi hoặc chấm dứt quan hệ pháp luật (gồm sự biến pháp lý và hành vi pháp lý)."
  },
  {
    "id": 86,
    "set_q_num": 39,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Sự kiện một người qua đời vì tuổi già là loại sự kiện pháp lý nào sau đây?",
    "options": [
      "Sự biến pháp lý (xảy ra ngoài ý muốn chủ quan của con người nhưng làm phát sinh quan hệ thừa kế)",
      "Hành vi pháp lý hợp pháp",
      "Hành vi pháp lý bất hợp pháp",
      "Quy phạm pháp luật chuyên ngành"
    ],
    "answer": 0,
    "explanation": "Căn cứ Giáo trình HUST: Sự biến pháp lý là hiện tượng xảy ra ngoài ý chí chủ quan của con người (thiên tai, cái chết tự nhiên, sự trôi chảy của thời gian...) nhưng làm phát sinh, thay đổi hoặc chấm dứt quan hệ pháp lý."
  },
  {
    "id": 87,
    "set_q_num": 40,
    "chapter": "Chương 4: Những vấn đề cơ bản về Pháp luật",
    "category": "ch4_law",
    "question": "Hành vi ký kết hợp đồng mua bán máy tính giữa sinh viên Bách Khoa và cửa hàng là loại sự kiện pháp lý nào?",
    "options": [
      "Hành vi pháp lý (xảy ra theo ý chí chủ quan của chủ thể)",
      "Sự biến pháp lý",
      "Sự kiện bất khả kháng",
      "Tình huống vi phạm pháp luật"
    ],
    "answer": 0,
    "explanation": "Căn cứ Slide Chương 4 HUST: Hành vi pháp lý là những hành vi thực tế diễn ra theo ý chí của con người (hợp pháp hoặc bất hợp pháp) làm phát sinh quyền và nghĩa vụ pháp lý."
  }
];
