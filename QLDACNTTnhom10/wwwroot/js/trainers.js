/**
 * trainers.js - Logic & Mock Data for FitManage Trainer Directory
 * Multi-filter, Grid/List view toggle, Modals, Pagination, CSV Export
 */

// =============================================================================
// 1. MOCK DATA: DANH SÁCH HUẤN LUYỆN VIÊN (12 HLV MẪU ĐẦY ĐỦ THUỘC TÍNH)
// =============================================================================
const mockTrainers = [
  {
    id: 1024,
    code: "#HLV-1024",
    name: "Nguyễn Hoàng Nam",
    specialization: "Yoga",
    rank: "Master",
    rankTitle: "Master Yoga Coach",
    rankBadgeClass: "bg-primary-fixed text-on-primary-fixed-variant",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5hLqr6tVD86mm63efB3nzxPacdQ4-lWalu08U7mpJl7BYWtSehzntyX1pzqTCV2ItVzDzMTfIc0i96sSC-OBzfeBFw2eNSdTNvA0Tpx597pb9iFmBojkY172TxcXEofkWHVawo6LIki--Jzv1bOoOgH2AIsuKha4vc14pV0d9Ydm8EQ03HrLG1peT1tYbWBSlQ7xl9wT8hNgv1br2bX3xc8d8hLz0xWqi6Y3G3uy2VI85ySCeUIvFfw",
    status: "available", // available | busy | off
    statusText: "Sẵn sàng",
    statusDotColor: "bg-emerald-500",
    rating: 4.9,
    reviewCount: 128,
    experience: "5 năm",
    activeClients: 18,
    tags: ["Hatha Yoga", "Vinyasa", "Phục hồi cột sống"],
    shift: "Ca sáng (06:00 - 14:00)",
    branch: "Flagship Q.1",
    branchDisplay: "Chi nhánh Q.1 Flagship",
    phone: "0908 124 556",
    email: "hoangnam.yoga@fitmanage.vn",
    bio: "Chuyên gia Yoga Alliance RYT-500 với hơn 5 năm kinh nghiệm phục hồi chức năng vận động và dẫn dắt các lớp thiền chuyên sâu. Phong cách giảng dạy kiên nhẫn, chuẩn chỉ từng tư thế asana.",
    certifications: ["Yoga Alliance RYT-500 quốc tế", "Chứng chỉ Trị liệu Cột sống & Thoát vị đĩa đệm", "Cử nhân TDTT chuyên ngành Huấn luyện"],
    reviews: [
      { author: "Trần Mai Lan", rating: 5, date: "24/09/2026", comment: "Thầy Nam nắn chỉnh tư thế rất kỹ, sau 3 tuần tập tình trạng đau thắt lưng của mình cải thiện rõ rệt!" },
      { author: "Lê Hoàng Phúc", rating: 4.8, date: "18/09/2026", comment: "Giọng giảng dịu nhẹ, lớp học kết thúc luôn có cảm giác tái tạo năng lượng hoàn toàn." }
    ]
  },
  {
    id: 1038,
    code: "#HLV-1038",
    name: "Trần Thu Trang",
    specialization: "Pilates",
    rank: "Senior",
    rankTitle: "Senior Pilates Specialist",
    rankBadgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFjBSYp1dP35w80YxbPva-1kI3dcNOpZkDjg4lKai_CCCmZATS885bZWkjpwgg6vSlrCizl01DzTTJvTiShDyciYpPLD_uK57DPFOhnkkeCoD1lo1wD7MfBWeAAlbB1-dilVDn0W7kYHqPpgLYmMhJZj20ILB3xvBjXcdhLnaiA_4aqkDdKKqrpHViyjE5wqIlJCNsicNozbTZIlN9W33LTiATqCXgG1tzh_aqWmCibamyST3d1KjNdg",
    status: "busy",
    statusText: "Đang dạy lớp",
    statusDotColor: "bg-amber-500",
    rating: 5.0,
    reviewCount: 94,
    experience: "4 năm",
    activeClients: 15,
    tags: ["Pilates Reformer", "Cadillac", "Core Strengh"],
    shift: "Ca linh hoạt",
    branch: "Thảo Điền CS2",
    branchDisplay: "CS2 Thảo Điền",
    phone: "0912 889 004",
    email: "thutrang.pilates@fitmanage.vn",
    bio: "Chuyên sâu các thiết bị máy Pilates Reformer và Cadillac. Tốt nghiệp học viện Polestar Pilates, chuyên siết cơ bụng sâu và căn chỉnh vóc dáng thon gọn cho hội viên nữ.",
    certifications: ["Polestar Pilates Comprehensive Certified", "Prenatal & Postnatal Pilates Specialist", "Anatomy Trains in Motion"],
    reviews: [
      { author: "Vũ Phương Linh", rating: 5, date: "28/09/2026", comment: "Cô Trang dạy Pilates Reformer cực kỳ chuyên nghiệp. Cơ bụng săn chắc rõ sau 1 liệu trình." }
    ]
  },
  {
    id: 1011,
    code: "#HLV-1011",
    name: "David Trần",
    specialization: "Gym PT",
    rank: "Elite",
    rankTitle: "Elite Bodybuilding & PT",
    rankBadgeClass: "bg-amber-100 text-amber-900",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZDw-jOmHxVIQjVb4uh_tFmeujWfGFGjVL0QH-eZQWg6956DAw9fpCwCdgCu18A47SL_oQRlouDc6_O4n-AiUioQzVAUJB9NxPBNURX535r8EygZlR-0m7BCx5wTJZmOpumNHsmaZJGN9oima4yJT0QSjv2ccoJ6lwoXRe8tptbiVG26Isw83s8hnxs8rHDq40I8ipyQmyLO-UGeNMRyC8YkVh18MxcPTn2OOZ8CX1odITWIkBEseoVQ",
    status: "available",
    statusText: "Sẵn sàng",
    statusDotColor: "bg-emerald-500",
    rating: 4.95,
    reviewCount: 210,
    experience: "7 năm",
    activeClients: 24,
    tags: ["Hypertrophy", "Dinh dưỡng Macro", "Thi đấu thể hình"],
    shift: "Full-day",
    branch: "Flagship Q.1",
    branchDisplay: "Toàn hệ thống · Base Q.1",
    phone: "0977 444 888",
    email: "david.tran@fitmanage.vn",
    bio: "Top 3 Vô địch Thể hình Quốc gia 2023, chứng chỉ ISSA Master Trainer. Chuyên kèm 1:1 tăng cơ nạc cấp tốc, siết mỡ thi đấu và lên thực đơn dinh dưỡng cá nhân hóa chuẩn khoa học.",
    certifications: ["ISSA Certified Master Trainer & Nutrition Specialist", "VĐV Thể hình Quốc Gia", "CPR / AED Certified"],
    reviews: [
      { author: "Đặng Văn Lâm", rating: 5, date: "29/09/2026", comment: "HLV David theo sát giáo án từng hiệp đấu. Đã giảm được 7kg mỡ và lên 2kg cơ sau 2 tháng." }
    ]
  },
  {
    id: 1052,
    code: "#HLV-1052",
    name: "Lê Minh Quân",
    specialization: "Boxing",
    rank: "Senior",
    rankTitle: "Senior Kickboxing & HIIT",
    rankBadgeClass: "bg-red-100 text-red-800",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL0ejTb3UBn5Cup6uAdqNtklEl1-yczl7ldrrqSGpHKyFJVVCuYbDmMgEpMG3VfNpGZJDJ9M_xhc0_nfklYVsbxVQS2AZE8WVsd34l9Sva-uHdPR4B5vKapLvws0MNAh2uJW74w6iYgBzhqQkhphLx7VPADpOfmUT_QGWTOlSVTvFM8S0G6z1dukNwMnp8kdx3ZH3pMOZKdrKJ7GeEKkBSlvsKGfogBNIsVKVSo0pBYa6xY_hs560r-g",
    status: "busy",
    statusText: "Đang kèm 1:1",
    statusDotColor: "bg-amber-500",
    rating: 4.85,
    reviewCount: 86,
    experience: "3 năm",
    activeClients: 12,
    tags: ["Kickboxing", "HIIT Circuit", "Giảm mỡ thần tốc"],
    shift: "Ca chiều (14:00 - 22:00)",
    branch: "Flagship Q.1",
    branchDisplay: "Q.1 Flagship",
    phone: "0938 555 123",
    email: "minhquan.boxing@fitmanage.vn",
    bio: "Cựu võ sĩ Muay Thai bán chuyên, chuyên giảng dạy Kickboxing đối kháng, HIIT đốt calo cường độ cao giúp giải tỏa áp lực công việc và nâng cao sức bền tim mạch.",
    certifications: ["WBC Muay Thai Coach Certificate", "NASM Performance Enhancement Specialist", "Cardio Kickboxing Level 2"],
    reviews: [
      { author: "Ngô Quốc Bảo", rating: 4.8, date: "20/09/2026", comment: "Tập Kickboxing với Quân xả stress cực tốt, mồ hôi ướt đẫm mà tinh thần rất phấn chấn!" }
    ]
  },
  {
    id: 1065,
    code: "#HLV-1065",
    name: "Phan Ngọc Anh",
    specialization: "Yoga",
    rank: "Master",
    rankTitle: "Yoga Therapy & Yin",
    rankBadgeClass: "bg-indigo-100 text-indigo-900",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLzIKIge5R3fIixMfqu4Nzay3_FYSgjN9y7WuyDara654_-17H3QPQL-se2a8BMIVTf6jgJl7HhVWfsYOWqlEeqoYHV9Bu5-QktuntW1yyKtmrnNR1M-yCoc8DCiPbM_QyLj3xlbYRSf58jeaXwtcHBqSjR08_6ED6QaxQ0Ykfmtfg1H5q1qtudMexxIzp0vg6DIAI3SILAt9UT0Lca6fpPcnFA-tyN_b7MXZLh6uykvVdU9cWTUilPw",
    status: "available",
    statusText: "Sẵn sàng",
    statusDotColor: "bg-emerald-500",
    rating: 4.92,
    reviewCount: 112,
    experience: "6 năm",
    activeClients: 16,
    tags: ["Yin Yoga", "Thiền Chuông Xoay", "Trị liệu căng thẳng"],
    shift: "Ca sáng",
    branch: "Landmark 81",
    branchDisplay: "Landmark 81 Studio",
    phone: "0903 777 999",
    email: "ngocanh.yin@fitmanage.vn",
    bio: "Nhà trị liệu âm thanh và chuyên gia phục hồi Yin Yoga. Tốt nghiệp khóa huấn luyện Chuông xoay Tây Tạng tại Kathmandu Nepal, mang đến liệu pháp chữa lành sâu cho giấc ngủ và tâm trí.",
    certifications: ["International Sound Healing Master", "Yin Yoga 300h Certified", "Mindfulness-Based Stress Reduction"],
    reviews: [
      { author: "Hà Thanh Thảo", rating: 5, date: "26/09/2026", comment: "Buổi trị liệu chuông xoay và Yin của cô Ngọc Anh như một phép màu cho chứng mất ngủ của mình." }
    ]
  },
  {
    id: 1077,
    code: "#HLV-1077",
    name: "Hoàng Đức Trọng",
    specialization: "Gym PT",
    rank: "Junior",
    rankTitle: "Junior Strength & Conditioning",
    rankBadgeClass: "bg-surface-container-high text-on-surface-variant",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBA3mN34soLW2BqGpFaR7y9wTG9TGiT84VB47Yvp3hxOWDIf14UfmVSvZgrOtGhCZbL37o_Lw6NZs-_k6S8YvWmfoYvluRST0yCPpapmKwmXIGLfIeNkdc2h7gcbx7ZrLAG9LB0PgMcPrS927Of730C_4vuq1S5a2JUrrJxD1u0BfDyFC6OqlubN1HTANYzdf-RVE2ObO3gfMNamnNmiZNarzZpQA0DGTOnc_td7mF8w1RWG2pUZH3Tzg",
    status: "off",
    statusText: "Nghỉ ca / Off-duty",
    statusDotColor: "bg-slate-400",
    rating: 4.8,
    reviewCount: 45,
    experience: "2 năm",
    activeClients: 9,
    tags: ["Powerlifting", "Mobility", "Tăng sức bền"],
    shift: "Off hôm nay",
    branch: "Flagship Q.1",
    branchDisplay: "Off hôm nay · Sẵn sàng ngày mai",
    phone: "0916 222 345",
    email: "ductrong.strength@fitmanage.vn",
    bio: "HLV trẻ năng nổ, chuyên môn vững về các bài tập Compound căn bản (Squat, Bench Press, Deadlift). Rất phù hợp cho người mới bắt đầu làm quen với tạ an toàn.",
    certifications: ["CSCS Level 1", "Olympic Lifting Foundations", "Bằng HLV Thể hình Cấp II"],
    reviews: [
      { author: "Phạm Hải Đăng", rating: 4.8, date: "22/09/2026", comment: "Em Trọng hướng dẫn kỹ thuật Deadlift rất chuẩn xác, chỉnh form tỉ mỉ chống đau lưng." }
    ]
  },
  {
    id: 1088,
    code: "#HLV-1088",
    name: "Elena Nguyễn",
    specialization: "Pilates",
    rank: "Senior",
    rankTitle: "Senior Pilates & Barre Specialist",
    rankBadgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    status: "available",
    statusText: "Sẵn sàng",
    statusDotColor: "bg-emerald-500",
    rating: 4.98,
    reviewCount: 152,
    experience: "5 năm",
    activeClients: 20,
    tags: ["Mat Pilates", "Barre Workout", "Định hình vóc dáng"],
    shift: "Ca sáng (07:00 - 15:00)",
    branch: "Thảo Điền CS2",
    branchDisplay: "CS2 Thảo Điền",
    phone: "0909 333 444",
    email: "elena.nguyen@fitmanage.vn",
    bio: "Huấn luyện viên Pilates kiêm cựu diễn viên múa Ba-lê, chuyên các bài tập định hình cơ thể, kéo dài đường nét và giải phóng áp lực các khớp cổ chân, hông chậu.",
    certifications: ["STOTT Pilates Certified Instructor", "Barre Above Master Trainer", "Fascia Release Specialist"],
    reviews: [
      { author: "Nguyễn Bích Ngọc", rating: 5, date: "25/09/2026", comment: "Lớp Barre của Elena cực kỳ cuốn hút, nhạc hay và cơ mông đùi vào form rất đẹp." }
    ]
  },
  {
    id: 1095,
    code: "#HLV-1095",
    name: "Đặng Tuấn Anh",
    specialization: "Gym PT",
    rank: "Master",
    rankTitle: "Master PT & Functional Training",
    rankBadgeClass: "bg-primary-fixed text-on-primary-fixed-variant",
    avatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80",
    status: "busy",
    statusText: "Đang dạy lớp",
    statusDotColor: "bg-amber-500",
    rating: 4.91,
    reviewCount: 180,
    experience: "8 năm",
    activeClients: 22,
    tags: ["Olympic Lifting", "Calisthenics", "Tăng cơ giảm mỡ"],
    shift: "Ca tối (16:00 - 22:00)",
    branch: "Flagship Q.1",
    branchDisplay: "Q.1 Flagship",
    phone: "0934 888 666",
    email: "tuananh.masterpt@fitmanage.vn",
    bio: "Hơn 8 năm quản lý và dẫn dắt đội ngũ PT. Chuyên gia huấn luyện thể lực chức năng (Functional Training), tối ưu chuyển động cơ thể toàn diện.",
    certifications: ["ACE Master Certified Personal Trainer", "Crossfit Level 2 Trainer", "Precision Nutrition Coach"],
    reviews: [
      { author: "Hoàng Gia Huy", rating: 5, date: "27/09/2026", comment: "Thầy Tuấn Anh cực kỳ giàu kinh nghiệm. Kế hoạch tập bài bản và luôn tạo động lực." }
    ]
  },
  {
    id: 1102,
    code: "#HLV-1102",
    name: "Vũ Mai Linh",
    specialization: "Boxing",
    rank: "Senior",
    rankTitle: "Zumba & Cardio Dance Master",
    rankBadgeClass: "bg-emerald-100 text-emerald-800",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    status: "available",
    statusText: "Sẵn sàng",
    statusDotColor: "bg-emerald-500",
    rating: 4.89,
    reviewCount: 98,
    experience: "4 năm",
    activeClients: 14,
    tags: ["Zumba Fitness", "Cardio Dance", "Đốt mỡ âm nhạc"],
    shift: "Ca chiều (15:00 - 21:00)",
    branch: "Landmark 81",
    branchDisplay: "Landmark 81 Studio",
    phone: "0902 444 555",
    email: "mailinh.zumba@fitmanage.vn",
    bio: "Năng lượng bùng nổ, biên đạo các bài nhảy Zumba quốc tế với tiết tấu sôi động giúp tiêu hao 600-800 kcal mỗi buổi tập.",
    certifications: ["Zumba B1 & B2 Certified", "Les Mills BodyJam Certified", "Aerobic Gymnastics Instructor"],
    reviews: [
      { author: "Lê Minh Hương", rating: 5, date: "21/09/2026", comment: "Mỗi giờ học của Mai Linh là một bữa tiệc âm nhạc tràn ngập tiếng cười và mồ hôi!" }
    ]
  },
  {
    id: 1115,
    code: "#HLV-1115",
    name: "Bùi Quốc Thái",
    specialization: "Boxing",
    rank: "Senior",
    rankTitle: "Boxing & Self-Defense Coach",
    rankBadgeClass: "bg-red-100 text-red-800",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    status: "busy",
    statusText: "Đang kèm 1:1",
    statusDotColor: "bg-amber-500",
    rating: 4.87,
    reviewCount: 75,
    experience: "4 năm",
    activeClients: 11,
    tags: ["Boxing Footwork", "Tự vệ thực tế", "Phản xạ nhanh"],
    shift: "Ca tối (17:00 - 22:00)",
    branch: "Thảo Điền CS2",
    branchDisplay: "CS2 Thảo Điền",
    phone: "0988 123 789",
    email: "quocthai.boxing@fitmanage.vn",
    bio: "Chuyên sâu kỹ thuật đấm bốc cổ điển Anh Quốc kết hợp bài tập phản xạ né đòn, nâng cao thể lực và tính tự vệ.",
    certifications: ["Vietnam Boxing Federation Coach", "Functional Movement Screen (FMS) Certified"],
    reviews: [
      { author: "Trần Anh Vũ", rating: 4.9, date: "15/09/2026", comment: "Thầy Thái dạy bộ pháp (footwork) rất chuẩn, đòn đấm có lực và chắc chắn hơn nhiều." }
    ]
  },
  {
    id: 1128,
    code: "#HLV-1128",
    name: "Đỗ Thu Thảo",
    specialization: "Yoga",
    rank: "Master",
    rankTitle: "Ashtanga & Pranayama Master",
    rankBadgeClass: "bg-primary-fixed text-on-primary-fixed-variant",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    status: "available",
    statusText: "Sẵn sàng",
    statusDotColor: "bg-emerald-500",
    rating: 4.94,
    reviewCount: 135,
    experience: "5 năm",
    activeClients: 17,
    tags: ["Ashtanga Primary", "Pranayama Thở", "Thiền Chánh Niệm"],
    shift: "Ca sáng (06:00 - 12:00)",
    branch: "Flagship Q.1",
    branchDisplay: "Flagship Q.1",
    phone: "0911 345 678",
    email: "thuthao.ashtanga@fitmanage.vn",
    bio: "Được đào tạo trực tiếp tại Mysore Ấn Độ, lưu giữ trọn vẹn triết lý Ashtanga truyền thống kết hợp phương pháp thở Pranayama thanh lọc độc tố.",
    certifications: ["KPJAYI Mysore Authorized Student", "Pranayama & Kriya Master", "Ayurvedic Lifestyle Consultant"],
    reviews: [
      { author: "Đoàn Thu Hà", rating: 5, date: "23/09/2026", comment: "Các bài thở Pranayama của cô Thảo giúp mình bớt hẳn chứng đau nửa đầu mãn tính." }
    ]
  },
  {
    id: 1140,
    code: "#HLV-1140",
    name: "Ngô Gia Bảo",
    specialization: "Gym PT",
    rank: "Senior",
    rankTitle: "Rehab & Movement Specialist",
    rankBadgeClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    status: "available",
    statusText: "Sẵn sàng",
    statusDotColor: "bg-emerald-500",
    rating: 4.96,
    reviewCount: 88,
    experience: "6 năm",
    activeClients: 13,
    tags: ["Phục hồi chấn thương", "Chỉnh gù vẹo", "Trigger Point"],
    shift: "Ca linh hoạt",
    branch: "Flagship Q.1",
    branchDisplay: "Toàn hệ thống",
    phone: "0944 555 777",
    email: "giabao.rehab@fitmanage.vn",
    bio: "Chuyên gia vật lý trị liệu thể thao, chuyên giải phóng cơ mạc (Myofascial Release) và tái thiết lập đường cong sinh lý cột sống cho dân văn phòng.",
    certifications: ["Bác sĩ Y học Thể thao & Phục hồi Chức năng", "Dry Needling & Cupping Therapy Certified"],
    reviews: [
      { author: "Võ Thành Long", rating: 5, date: "29/09/2026", comment: "Bác sĩ Bảo dãn cơ cực kỳ êm ái, bả vai bị đông cứng sau 3 buổi đã cử động nhẹ nhàng." }
    ]
  }
];

// =============================================================================
// 2. STATE MANAGEMENT & FILTER CONTROLS
// =============================================================================
let currentFilters = {
  search: "",
  specialization: "all",
  rank: "all",
  branch: "all",
  viewMode: "grid", // "grid" | "list"
  page: 1,
  pageSize: 6
};

// =============================================================================
// 3. CORE FILTER & RENDER FUNCTION
// =============================================================================
function getFilteredTrainers() {
  return mockTrainers.filter(trainer => {
    // 1. Search Query
    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      const matchName = trainer.name.toLowerCase().includes(q);
      const matchCode = trainer.code.toLowerCase().includes(q);
      const matchPhone = trainer.phone.includes(q);
      const matchSpec = trainer.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchCode && !matchPhone && !matchSpec) return false;
    }

    // 2. Specialization
    if (currentFilters.specialization !== "all") {
      if (trainer.specialization.toLowerCase() !== currentFilters.specialization.toLowerCase()) {
        return false;
      }
    }

    // 3. Rank
    if (currentFilters.rank !== "all") {
      if (trainer.rank.toLowerCase() !== currentFilters.rank.toLowerCase()) {
        return false;
      }
    }

    // 4. Branch
    if (currentFilters.branch !== "all") {
      if (!trainer.branch.toLowerCase().includes(currentFilters.branch.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

function updateKpiCounters() {
  const total = mockTrainers.length;
  const active = mockTrainers.filter(t => t.status === "busy").length;
  const available = mockTrainers.filter(t => t.status === "available").length;
  const off = mockTrainers.filter(t => t.status === "off").length;

  const kpiTotal = document.getElementById("kpiTotal");
  const kpiActive = document.getElementById("kpiActive");
  const kpiAvailable = document.getElementById("kpiAvailable");
  const kpiOff = document.getElementById("kpiOff");

  if (kpiTotal) kpiTotal.innerText = total;
  if (kpiActive) kpiActive.innerText = active;
  if (kpiAvailable) kpiAvailable.innerText = available;
  if (kpiOff) kpiOff.innerText = off;
}

function renderTrainers() {
  const filtered = getFilteredTrainers();
  const totalCountEl = document.getElementById("totalResultsCount");
  if (totalCountEl) totalCountEl.innerText = `${filtered.length} HLV`;

  const gridContainer = document.getElementById("trainersGridContainer");
  const listContainer = document.getElementById("trainersListContainer");

  // Calculate pagination slice
  const startIndex = (currentFilters.page - 1) * currentFilters.pageSize;
  const endIndex = Math.min(startIndex + currentFilters.pageSize, filtered.length);
  const pagedTrainers = filtered.slice(startIndex, endIndex);

  // Toggle Grid vs List visibility
  if (currentFilters.viewMode === "grid") {
    if (gridContainer) gridContainer.classList.remove("hidden");
    if (listContainer) listContainer.classList.add("hidden");
    renderGridView(pagedTrainers, gridContainer);
  } else {
    if (gridContainer) gridContainer.classList.add("hidden");
    if (listContainer) listContainer.classList.remove("hidden");
    renderListView(pagedTrainers, listContainer);
  }

  renderPagination(filtered.length, startIndex, endIndex);
}

// -----------------------------------------------------------------------------
// Render Grid Cards View
// -----------------------------------------------------------------------------
function renderGridView(trainers, container) {
  if (!container) return;

  if (trainers.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center flex flex-col items-center justify-center bg-surface-container-lowest rounded-2xl p-8 border border-dashed border-outline-variant">
        <span class="material-symbols-outlined text-[48px] text-secondary/50 mb-2">person_search</span>
        <h4 class="font-title-lg text-title-lg font-bold text-on-surface">Không tìm thấy huấn luyện viên phù hợp</h4>
        <p class="font-body-md text-body-md text-secondary mt-1">Vui lòng điều chỉnh lại tiêu chí tìm kiếm hoặc bộ lọc.</p>
        <button onclick="resetFilters()" class="mt-4 px-4 py-2 rounded-lg bg-[#0B2238] text-white font-title-md text-title-md hover:bg-[#123352] transition-colors">
          Đặt lại bộ lọc
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = trainers.map(trainer => {
    const isOff = trainer.status === "off";
    const statusDot = `<span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ${trainer.statusDotColor} border-2 border-white status-dot-pulse" title="${trainer.statusText}"></span>`;
    const bookBtn = isOff
      ? `<button class="flex-1 h-9 rounded-lg bg-surface-container text-secondary font-title-md text-title-md cursor-not-allowed" disabled>Đang nghỉ ca</button>`
      : `<button onclick="openBookTrainerModal(${trainer.id})" class="flex-1 h-9 rounded-lg bg-[#0B2238] text-white font-title-md text-title-md hover:bg-[#123352] transition-all active:scale-95 shadow-xs">Đặt lịch 1:1</button>`;

    const tagsHtml = trainer.tags.map(tag => 
      `<span class="px-2 py-0.5 rounded-md bg-surface-container font-label-sm text-label-sm text-secondary">${tag}</span>`
    ).join("");

    return `
      <div class="trainer-card bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md border border-outline-variant/30 ${isOff ? 'opacity-90' : ''}">
        <div class="flex flex-col gap-4">
          <!-- Top Row: Avatar & Basic Info & Rank Badge -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="relative w-14 h-14 rounded-full overflow-hidden bg-surface-container shrink-0 shadow-inner">
                <img class="w-full h-full object-cover ${isOff ? 'grayscale' : ''}" src="${trainer.avatar}" alt="${trainer.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'" />
                ${statusDot}
              </div>
              <div class="flex flex-col min-w-0">
                <h3 class="font-title-lg text-title-lg text-on-surface font-semibold leading-snug truncate">${trainer.name}</h3>
                <span class="font-label-sm text-label-sm text-secondary">${trainer.code}</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full ${trainer.rankBadgeClass} font-label-sm text-label-sm font-semibold shrink-0 shadow-2xs">${trainer.rankTitle}</span>
          </div>

          <!-- Stats 3-Column Grid -->
          <div class="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-surface-container-low text-center">
            <div class="flex flex-col">
              <span class="font-title-md text-title-md text-amber-600 font-bold flex items-center justify-center gap-0.5">
                ${trainer.rating} <span class="material-symbols-outlined text-[14px] text-amber-500 star-filled">star</span>
              </span>
              <span class="font-body-sm text-body-sm text-secondary">${trainer.reviewCount} đánh giá</span>
            </div>
            <div class="flex flex-col">
              <span class="font-title-md text-title-md text-on-surface font-semibold">${trainer.experience}</span>
              <span class="font-body-sm text-body-sm text-secondary">Kinh nghiệm</span>
            </div>
            <div class="flex flex-col">
              <span class="font-title-md text-title-md text-on-surface font-semibold">${trainer.activeClients}</span>
              <span class="font-body-sm text-body-sm text-secondary">HV active</span>
            </div>
          </div>

          <!-- Specialty Tags -->
          <div class="flex flex-wrap gap-1.5">
            ${tagsHtml}
          </div>

          <!-- Shift & Location Details -->
          <div class="flex items-center gap-2 font-body-sm text-body-sm text-secondary pt-1 border-t border-outline-variant/20">
            <span class="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
            <span class="truncate">${trainer.shift} · ${trainer.branchDisplay}</span>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center gap-2 pt-2">
          <button onclick="openTrainerProfileModal(${trainer.id})" class="flex-1 h-9 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md hover:bg-surface-container transition-colors">
            Xem hồ sơ
          </button>
          ${bookBtn}
        </div>
      </div>
    `;
  }).join("");
}

// -----------------------------------------------------------------------------
// Render Table List View
// -----------------------------------------------------------------------------
function renderListView(trainers, container) {
  if (!container) return;

  if (trainers.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-surface-container-lowest rounded-xl">
        <p class="text-secondary font-body-md">Không tìm thấy huấn luyện viên nào.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr class="bg-surface-container-low border-b border-outline-variant/40 text-secondary font-label-md text-label-md uppercase tracking-wider">
            <th class="p-4">Huấn luyện viên</th>
            <th class="p-4">Chuyên môn & Cấp bậc</th>
            <th class="p-4">Đánh giá & Kinh nghiệm</th>
            <th class="p-4">Ca dạy & Chi nhánh</th>
            <th class="p-4">Trạng thái</th>
            <th class="p-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/20 font-body-md text-body-md text-on-surface">
          ${trainers.map(t => {
            return `
              <tr class="hover:bg-surface-container-low/50 transition-colors">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <img class="w-10 h-10 rounded-full object-cover shrink-0" src="${t.avatar}" alt="${t.name}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'" />
                    <div class="flex flex-col">
                      <span class="font-title-md text-title-md font-semibold text-on-surface">${t.name}</span>
                      <span class="font-label-sm text-label-sm text-secondary">${t.code} • ${t.phone}</span>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex flex-col gap-1 items-start">
                    <span class="px-2 py-0.5 rounded-full ${t.rankBadgeClass} font-label-sm text-label-sm font-semibold">${t.rankTitle}</span>
                    <span class="text-xs text-secondary">${t.tags.slice(0, 2).join(", ")}</span>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-amber-600 flex items-center gap-1">
                      ${t.rating} <span class="material-symbols-outlined text-[14px] star-filled">star</span>
                      <span class="font-normal text-xs text-secondary">(${t.reviewCount})</span>
                    </span>
                    <span class="text-xs text-secondary mt-0.5">${t.experience} • ${t.activeClients} HV active</span>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex flex-col text-xs text-secondary">
                    <span class="font-medium text-on-surface">${t.shift}</span>
                    <span>${t.branchDisplay}</span>
                  </div>
                </td>
                <td class="p-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${t.status === 'available' ? 'bg-emerald-50 text-emerald-700' : t.status === 'busy' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-700'}">
                    <span class="w-1.5 h-1.5 rounded-full ${t.statusDotColor}"></span>
                    ${t.statusText}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <div class="inline-flex items-center gap-2">
                    <button onclick="openTrainerProfileModal(${t.id})" class="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md transition-colors">
                      Hồ sơ
                    </button>
                    ${t.status === 'off' ? `
                      <button class="px-3 py-1.5 rounded-lg bg-surface-container text-secondary font-title-md text-title-md cursor-not-allowed" disabled>Nghỉ</button>
                    ` : `
                      <button onclick="openBookTrainerModal(${t.id})" class="px-3 py-1.5 rounded-lg bg-[#0B2238] text-white font-title-md text-title-md hover:bg-[#123352] transition-colors">
                        Đặt lịch
                      </button>
                    `}
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// Pagination Rendering
// -----------------------------------------------------------------------------
function renderPagination(totalItems, startIdx, endIdx) {
  const container = document.getElementById("paginationContainer");
  if (!container) return;

  const totalPages = Math.ceil(totalItems / currentFilters.pageSize) || 1;

  container.innerHTML = `
    <div class="flex items-center gap-space-md flex-wrap">
      <span class="font-body-sm text-body-sm text-secondary">
        Hiển thị <strong class="text-on-surface font-semibold">${totalItems > 0 ? startIdx + 1 : 0} - ${endIdx}</strong> trên <strong class="text-on-surface font-semibold">${totalItems}</strong> huấn luyện viên
      </span>
      <div class="flex items-center gap-2">
        <span class="font-body-sm text-body-sm text-secondary">Số lượng:</span>
        <div class="relative">
          <select id="pageSizeSelect" onchange="changePageSize(this.value)" class="h-8 pl-2 pr-6 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none focus:outline-none cursor-pointer">
            <option value="6" ${currentFilters.pageSize === 6 ? 'selected' : ''}>6 / trang</option>
            <option value="12" ${currentFilters.pageSize === 12 ? 'selected' : ''}>12 / trang</option>
            <option value="24" ${currentFilters.pageSize === 24 ? 'selected' : ''}>24 / trang</option>
          </select>
          <span class="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 text-[14px] text-secondary pointer-events-none">expand_more</span>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-1">
      <button onclick="changePage(${currentFilters.page - 1})" ${currentFilters.page <= 1 ? 'disabled class="w-8 h-8 rounded-lg flex items-center justify-center text-secondary/40 cursor-not-allowed"' : 'class="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"'}>
        <span class="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>
      ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
        if (p === currentFilters.page) {
          return `<button class="w-8 h-8 rounded-lg bg-[#0B2238] text-white font-title-md text-title-md flex items-center justify-center shadow-xs">${p}</button>`;
        }
        return `<button onclick="changePage(${p})" class="w-8 h-8 rounded-lg text-on-surface font-title-md text-title-md hover:bg-surface-container flex items-center justify-center transition-colors">${p}</button>`;
      }).join("")}
      <button onclick="changePage(${currentFilters.page + 1})" ${currentFilters.page >= totalPages ? 'disabled class="w-8 h-8 rounded-lg flex items-center justify-center text-secondary/40 cursor-not-allowed"' : 'class="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"'}>
        <span class="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  `;
}

function changePage(newPage) {
  const filtered = getFilteredTrainers();
  const totalPages = Math.ceil(filtered.length / currentFilters.pageSize) || 1;
  if (newPage < 1 || newPage > totalPages) return;
  currentFilters.page = newPage;
  renderTrainers();
}

function changePageSize(newSize) {
  currentFilters.pageSize = parseInt(newSize, 10);
  currentFilters.page = 1;
  renderTrainers();
}

function resetFilters() {
  currentFilters.search = "";
  currentFilters.specialization = "all";
  currentFilters.rank = "all";
  currentFilters.branch = "all";
  currentFilters.page = 1;

  const searchInput = document.getElementById("trainerSearchInput");
  const specSelect = document.getElementById("filterSpecialty");
  const rankSelect = document.getElementById("filterRank");
  const branchSelect = document.getElementById("filterBranch");

  if (searchInput) searchInput.value = "";
  if (specSelect) specSelect.value = "all";
  if (rankSelect) rankSelect.value = "all";
  if (branchSelect) branchSelect.value = "all";

  renderTrainers();
}

// =============================================================================
// 4. MODAL: PROFILE CHI TIẾT HUẤN LUYỆN VIÊN
// =============================================================================
function openTrainerProfileModal(id) {
  const trainer = mockTrainers.find(t => t.id === id);
  if (!trainer) return;

  const modal = document.getElementById("trainerProfileModal");
  const box = document.getElementById("profileModalBox");
  if (!modal || !box) return;

  // Set Profile Header Details
  document.getElementById("modalProfileAvatar").src = trainer.avatar;
  document.getElementById("modalProfileName").innerText = trainer.name;
  document.getElementById("modalProfileCode").innerText = trainer.code;
  document.getElementById("modalProfileRank").innerText = trainer.rankTitle;
  document.getElementById("modalProfileRank").className = `px-2.5 py-1 rounded-full ${trainer.rankBadgeClass} font-label-sm text-label-sm font-semibold shrink-0`;
  document.getElementById("modalProfilePhone").innerText = trainer.phone;
  document.getElementById("modalProfileEmail").innerText = trainer.email;

  // Stats
  document.getElementById("modalProfileRating").innerText = `${trainer.rating} (${trainer.reviewCount} đánh giá)`;
  document.getElementById("modalProfileExp").innerText = trainer.experience;
  document.getElementById("modalProfileActiveClients").innerText = `${trainer.activeClients} học viên`;
  document.getElementById("modalProfileBio").innerText = trainer.bio;

  // Certifications
  const certsContainer = document.getElementById("modalProfileCertifications");
  if (certsContainer) {
    certsContainer.innerHTML = trainer.certifications.map(c => `
      <li class="flex items-center gap-2 text-sm text-on-surface">
        <span class="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
        <span>${c}</span>
      </li>
    `).join("");
  }

  // Tags
  const tagsContainer = document.getElementById("modalProfileTags");
  if (tagsContainer) {
    tagsContainer.innerHTML = trainer.tags.map(tag => `
      <span class="px-2.5 py-1 rounded-lg bg-surface-container font-label-sm text-label-sm text-on-surface">${tag}</span>
    `).join("");
  }

  // Reviews
  const reviewsContainer = document.getElementById("modalProfileReviews");
  if (reviewsContainer) {
    reviewsContainer.innerHTML = trainer.reviews.map(r => `
      <div class="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
        <div class="flex items-center justify-between">
          <span class="font-title-md text-title-md font-semibold text-on-surface">${r.author}</span>
          <span class="text-xs text-secondary">${r.date}</span>
        </div>
        <div class="flex items-center gap-1 text-amber-500 text-xs">
          <span class="material-symbols-outlined text-[14px] star-filled">star</span>
          <span class="font-bold">${r.rating} / 5</span>
        </div>
        <p class="font-body-sm text-body-sm text-secondary mt-1">"${r.comment}"</p>
      </div>
    `).join("");
  }

  // Setup Book button in profile modal
  const bookBtn = document.getElementById("modalProfileBookBtn");
  if (bookBtn) {
    if (trainer.status === "off") {
      bookBtn.innerText = "Đang nghỉ ca";
      bookBtn.disabled = true;
      bookBtn.className = "px-6 py-2.5 rounded-xl bg-surface-container text-secondary font-title-md text-title-md cursor-not-allowed";
    } else {
      bookBtn.innerText = "Đặt lịch 1:1 ngay";
      bookBtn.disabled = false;
      bookBtn.className = "px-6 py-2.5 rounded-xl bg-[#0B2238] hover:bg-[#123352] text-white font-title-md text-title-md font-semibold transition-all shadow-md active:scale-95";
      bookBtn.onclick = () => {
        closeTrainerProfileModal();
        openBookTrainerModal(trainer.id);
      };
    }
  }

  modal.classList.remove("opacity-0", "pointer-events-none");
  modal.classList.add("opacity-100");
  box.classList.remove("scale-95");
  box.classList.add("scale-100");
}

function closeTrainerProfileModal() {
  const modal = document.getElementById("trainerProfileModal");
  const box = document.getElementById("profileModalBox");
  if (!modal || !box) return;

  modal.classList.remove("opacity-100");
  modal.classList.add("opacity-0", "pointer-events-none");
  box.classList.remove("scale-100");
  box.classList.add("scale-95");
}

// =============================================================================
// 5. MODAL: ĐẶT LỊCH KÈM 1:1 VỚI HLV
// =============================================================================
let currentBookingTrainerId = null;

function openBookTrainerModal(id) {
  const trainer = mockTrainers.find(t => t.id === id);
  if (!trainer) return;
  currentBookingTrainerId = id;

  const modal = document.getElementById("bookTrainerModal");
  const box = document.getElementById("bookModalBox");
  if (!modal || !box) return;

  document.getElementById("bookTrainerName").innerText = trainer.name;
  document.getElementById("bookTrainerTitle").innerText = `${trainer.rankTitle} • ${trainer.branchDisplay}`;
  document.getElementById("bookTrainerAvatar").src = trainer.avatar;

  modal.classList.remove("opacity-0", "pointer-events-none");
  modal.classList.add("opacity-100");
  box.classList.remove("scale-95");
  box.classList.add("scale-100");
}

function closeBookTrainerModal() {
  const modal = document.getElementById("bookTrainerModal");
  const box = document.getElementById("bookModalBox");
  if (!modal || !box) return;

  modal.classList.remove("opacity-100");
  modal.classList.add("opacity-0", "pointer-events-none");
  box.classList.remove("scale-100");
  box.classList.add("scale-95");
}

function confirmBookTrainer() {
  const trainer = mockTrainers.find(t => t.id === currentBookingTrainerId);
  const memberName = document.getElementById("bookMemberInput")?.value || "Hội viên Sarah Mitchel";
  const dateStr = document.getElementById("bookDateSelect")?.value || "Thứ Tư, 07/10/2026";
  const timeSlot = document.getElementById("bookSlotSelect")?.value || "09:00 - 10:00 Sáng";

  if (trainer) {
    trainer.activeClients += 1;
    renderTrainers();
  }

  closeBookTrainerModal();
  showToast(
    "Đặt lịch 1:1 thành công!",
    `Đã xác nhận lịch hẹn kèm riêng với ${trainer ? trainer.name : "HLV"} vào ${dateStr} (${timeSlot}) cho ${memberName}.`,
    "success"
  );
}

// =============================================================================
// 6. MODAL: THÊM MỚI HUẤN LUYỆN VIÊN (+ Thêm HLV mới)
// =============================================================================
function openAddTrainerModal() {
  const modal = document.getElementById("addTrainerModal");
  const box = document.getElementById("addTrainerModalBox");
  if (!modal || !box) return;

  modal.classList.remove("opacity-0", "pointer-events-none");
  modal.classList.add("opacity-100");
  box.classList.remove("scale-95");
  box.classList.add("scale-100");
}

function closeAddTrainerModal() {
  const modal = document.getElementById("addTrainerModal");
  const box = document.getElementById("addTrainerModalBox");
  if (!modal || !box) return;

  modal.classList.remove("opacity-100");
  modal.classList.add("opacity-0", "pointer-events-none");
  box.classList.remove("scale-100");
  box.classList.add("scale-95");
}

function handleSaveNewTrainer(event) {
  event.preventDefault();
  const name = document.getElementById("newTrainerName")?.value || "Huấn Luyện Viên Mới";
  const spec = document.getElementById("newTrainerSpec")?.value || "Gym PT";
  const rank = document.getElementById("newTrainerRank")?.value || "Senior";
  const branch = document.getElementById("newTrainerBranch")?.value || "Flagship Q.1";
  const shift = document.getElementById("newTrainerShift")?.value || "Ca sáng (06:00 - 14:00)";
  const phone = document.getElementById("newTrainerPhone")?.value || "0908 999 888";
  const exp = document.getElementById("newTrainerExp")?.value || "3 năm";

  const newId = 1150 + mockTrainers.length;
  const newTrainer = {
    id: newId,
    code: `#HLV-${newId}`,
    name: name,
    specialization: spec,
    rank: rank,
    rankTitle: `${rank} ${spec} Coach`,
    rankBadgeClass: rank === "Master" ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-tertiary-fixed text-on-tertiary-fixed",
    avatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=400&q=80",
    status: "available",
    statusText: "Sẵn sàng",
    statusDotColor: "bg-emerald-500",
    rating: 5.0,
    reviewCount: 1,
    experience: exp,
    activeClients: 0,
    tags: [spec, "Đang nhận học viên", "Hồ sơ mới"],
    shift: shift,
    branch: branch,
    branchDisplay: branch,
    phone: phone,
    email: `${name.toLowerCase().replace(/\s+/g, '')}@fitmanage.vn`,
    bio: `Huấn luyện viên ${name} chuyên môn ${spec} với ${exp} kinh nghiệm, mới gia nhập đội ngũ FitManage chi nhánh ${branch}.`,
    certifications: ["Bằng Huấn Luyện Viên Cấp Quốc Gia", "CPR / First Aid Certified"],
    reviews: []
  };

  mockTrainers.unshift(newTrainer);
  updateKpiCounters();
  currentFilters.page = 1;
  renderTrainers();
  closeAddTrainerModal();

  showToast("Thêm HLV mới thành công!", `Đã khởi tạo hồ sơ HLV ${name} (${newTrainer.code}) trên hệ thống.`, "success");
}

// =============================================================================
// 7. XUẤT EXCEL / CSV
// =============================================================================
function exportTrainersCsv() {
  const filtered = getFilteredTrainers();
  const headers = ["Mã HLV", "Họ và Tên", "Chuyên Môn", "Cấp Bậc", "Số Năm KN", "Rating", "Số Đánh Giá", "Số HV Active", "Chi Nhánh", "Ca Dạy", "SĐT", "Trạng Thái"];
  const rows = filtered.map(t => [
    t.code,
    `"${t.name}"`,
    `"${t.specialization}"`,
    `"${t.rankTitle}"`,
    `"${t.experience}"`,
    t.rating,
    t.reviewCount,
    t.activeClients,
    `"${t.branchDisplay}"`,
    `"${t.shift}"`,
    `"${t.phone}"`,
    `"${t.statusText}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Danh_sach_HLV_FitManage_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Xuất Excel thành công!", `Đã xuất ${filtered.length} dòng dữ liệu huấn luyện viên sang file CSV.`, "info");
}

// =============================================================================
// 8. TOAST NOTIFICATION HELPER
// =============================================================================
function showToast(title, message, type = "success") {
  const toast = document.getElementById("appToast");
  const toastTitle = document.getElementById("toastTitle");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");

  if (!toast || !toastTitle || !toastMessage) return;

  toastTitle.innerText = title;
  toastMessage.innerText = message;
  if (toastIcon) {
    toastIcon.innerText = type === "info" ? "info" : "check_circle";
  }

  toast.classList.remove("translate-y-24", "opacity-0", "pointer-events-none");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    hideToast();
  }, 4500);
}

function hideToast() {
  const toast = document.getElementById("appToast");
  if (toast) {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-24", "opacity-0", "pointer-events-none");
  }
}

// =============================================================================
// 9. EVENT LISTENERS INITIALIZATION
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  updateKpiCounters();
  renderTrainers();

  // Search Input
  const searchInput = document.getElementById("trainerSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentFilters.search = e.target.value.trim();
      currentFilters.page = 1;
      renderTrainers();
    });
  }

  // Filter: Specialty
  const filterSpec = document.getElementById("filterSpecialty");
  if (filterSpec) {
    filterSpec.addEventListener("change", (e) => {
      currentFilters.specialization = e.target.value;
      currentFilters.page = 1;
      renderTrainers();
    });
  }

  // Filter: Rank
  const filterRank = document.getElementById("filterRank");
  if (filterRank) {
    filterRank.addEventListener("change", (e) => {
      currentFilters.rank = e.target.value;
      currentFilters.page = 1;
      renderTrainers();
    });
  }

  // Filter: Branch
  const filterBranch = document.getElementById("filterBranch");
  if (filterBranch) {
    filterBranch.addEventListener("change", (e) => {
      currentFilters.branch = e.target.value;
      currentFilters.page = 1;
      renderTrainers();
    });
  }

  // View Mode Toggles
  const btnGridView = document.getElementById("btnGridView");
  const btnListView = document.getElementById("btnListView");

  if (btnGridView && btnListView) {
    btnGridView.addEventListener("click", () => {
      currentFilters.viewMode = "grid";
      btnGridView.classList.add("bg-surface-container-lowest", "text-on-surface", "shadow-sm");
      btnGridView.classList.remove("text-secondary");
      btnListView.classList.remove("bg-surface-container-lowest", "text-on-surface", "shadow-sm");
      btnListView.classList.add("text-secondary");
      renderTrainers();
    });

    btnListView.addEventListener("click", () => {
      currentFilters.viewMode = "list";
      btnListView.classList.add("bg-surface-container-lowest", "text-on-surface", "shadow-sm");
      btnListView.classList.remove("text-secondary");
      btnGridView.classList.remove("bg-surface-container-lowest", "text-on-surface", "shadow-sm");
      btnGridView.classList.add("text-secondary");
      renderTrainers();
    });
  }
});

function handleNavFeature(name) {
  showToast(name, `Tính năng "${name}" đang được kết nối với module hệ thống trong phiên bản kế tiếp.`, "info");
}
