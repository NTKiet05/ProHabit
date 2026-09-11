/**
 * Bro Habit Tracker - Application Logic
 */

// Default Habits matching the screenshot
const DEFAULT_HABITS = [
    { id: 'h1', name: 'Wake up at 05:00', emoji: '⏰' },
    { id: 'h2', name: 'Gym', emoji: '💪' },
    { id: 'h3', name: 'Reading / Learning', emoji: '📖' },
    { id: 'h4', name: 'Day Planning', emoji: '📅' },
    { id: 'h5', name: 'No Gooning', emoji: '💦' },
    { id: 'h6', name: 'Project Work', emoji: '🎯' },
    { id: 'h7', name: 'No Alcohol', emoji: '🍾' },
    { id: 'h8', name: 'Social Media Detox', emoji: '🌿' },
    { id: 'h9', name: 'Goal Journaling', emoji: '📝' },
    { id: 'h10', name: 'Cold Shower', emoji: '🚿' },
    { id: 'h11', name: 'Stretching', emoji: '🤸' }
];

// Weekday Labels in English (matching spreadsheet)
const WEEKDAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Default Schedule for vertical timeline
const DEFAULT_SCHEDULE = [
    { id: 's1', time: '05:00 - 06:00', activity: 'Thức dậy & Thiền', emoji: '⏰' },
    { id: 's2', time: '06:00 - 07:30', activity: 'Tập Gym / Chạy bộ', emoji: '💪' },
    { id: 's3', time: '08:00 - 12:00', activity: 'Làm việc dự án', emoji: '💻' },
    { id: 's4', time: '12:00 - 13:00', activity: 'Ăn trưa & Nghỉ ngơi', emoji: '🥪' },
    { id: 's5', time: '13:30 - 17:30', activity: 'Project Work & Meeting', emoji: '🎯' },
    { id: 's6', time: '18:00 - 19:30', activity: 'Đọc sách / Học tập', emoji: '📖' },
    { id: 's7', time: '20:00 - 22:00', activity: 'Relax & Gia đình', emoji: '🌿' },
    { id: 's8', time: '22:30', activity: 'Đi ngủ nghỉ ngơi', emoji: '💤' }
];

// ==========================================================================
// Cấu hình Supabase (Hãy điền URL và Anon Key của bạn ở đây để đồng bộ đám mây)
// ==========================================================================
const SUPABASE_URL = "https://ofmqwfwdchginudwwpgp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nRB78hGoOTxb0s7sfg08ZQ_11BlgN0G";

let supabaseClient = null;
let currentUser = null;
let syncTimer = null;
let isOfflineMode = false;
let currentAuthTab = 'login';

// Khởi tạo Supabase client
if (typeof supabase !== 'undefined' && SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
        console.error("Lỗi khởi tạo Supabase:", e);
    }
}

// Default Coursera Mini Multi-Course Architecture matching user's curriculum & engineering tracks
const DEFAULT_CLASSROOM = {
    activeCourseId: 'course_control_systems',
    courses: [
        {
            id: 'course_control_systems',
            title: 'Lý thuyết & Kỹ thuật Điều khiển Tự động (Control Systems)',
            desc: 'Lộ trình tự học kỷ luật cao theo từng Chặng. Bắt buộc điểm danh và hoàn thành tiết học mỗi ngày.',
            category: 'Kỹ thuật Điều khiển Tự động',
            thumbnail: '🎛️',
            color: '#6366f1',
            currentPhase: 'Chặng 1',
            phases: [
                { id: 'p1', name: 'Chặng 1', durationWeeks: 3, label: '3 tuần' },
                { id: 'p2', name: 'Chặng 2', durationWeeks: 3, label: '3 tuần' }
            ],
            lessons: [
                // Chặng 1:
                {
                    id: 'cls_1',
                    stt: 1,
                    phase: 'Chặng 1',
                    module: 'PID Control',
                    title: 'PID Control',
                    url: 'https://www.youtube.com/watch?v=wkfEZmsQqiA&list=PLn8PRpmsu08PQBgjxYFXSsODEF3Jqmm-y',
                    completed: false,
                    attendanceLogs: []
                },
                {
                    id: 'cls_2_1',
                    stt: 2,
                    phase: 'Chặng 1',
                    module: 'Control Systems Lectures',
                    title: 'The root locus method',
                    url: 'https://www.youtube.com/watch?v=CRvVDoQJjYI&list=PLUMWjy5jgHK3-ca6GP6PL0AgcNGHqn33f',
                    completed: false,
                    attendanceLogs: []
                },
                {
                    id: 'cls_2_2',
                    stt: 2,
                    phase: 'Chặng 1',
                    module: 'Control Systems Lectures',
                    title: 'Transfer Functions',
                    url: 'https://youtu.be/RJieGwXorUk?si=J5eEE0s4mhgWB6tr',
                    completed: false,
                    attendanceLogs: []
                },
                {
                    id: 'cls_2_3',
                    stt: 2,
                    phase: 'Chặng 1',
                    module: 'Control Systems Lectures',
                    title: 'Feedback control system',
                    url: 'https://www.youtube.com/watch?v=3GkSz3guJkk&list=PLy8CVak7-Br5qq5z9Z4PkpajRUJzhJi66',
                    completed: false,
                    attendanceLogs: []
                },
                // Chặng 2:
                {
                    id: 'cls_3',
                    stt: 3,
                    phase: 'Chặng 2',
                    module: 'State Space',
                    title: 'State Space',
                    url: 'https://youtube.com/playlist?list=PLfqhYmT4ggAtpuB1g8Nbgh912PwYjn_We&si=qQWUdqqw4JEDSxwT',
                    completed: false,
                    attendanceLogs: []
                },
                {
                    id: 'cls_4_1',
                    stt: 4,
                    phase: 'Chặng 2',
                    module: 'Observability',
                    title: 'Observability',
                    url: 'https://youtu.be/lRZmJBcg1ZA?si=AVkYhtdaQZlfBycK',
                    completed: false,
                    attendanceLogs: []
                },
                {
                    id: 'cls_4_2',
                    stt: 4,
                    phase: 'Chặng 2',
                    module: 'Observability',
                    title: 'Observability matlab 1',
                    url: 'https://youtu.be/XBI_hQRqMvM?si=6Yw_LVt_dZV7wV17',
                    completed: false,
                    attendanceLogs: []
                },
                {
                    id: 'cls_4_3',
                    stt: 4,
                    phase: 'Chặng 2',
                    module: 'Observability',
                    title: 'Observability matlab 2',
                    url: 'https://youtu.be/DLytfA10RR8?si=nx5QX-FQpcyl4Wqo',
                    completed: false,
                    attendanceLogs: []
                },
                {
                    id: 'cls_5_1',
                    stt: 5,
                    phase: 'Chặng 2',
                    module: 'Matlab - system control',
                    title: 'Part 1 - The state space equations',
                    url: 'https://www.youtube.com/watch?v=hpeKrMG-WP0',
                    completed: false,
                    attendanceLogs: []
                },
                {
                    id: 'cls_5_2',
                    stt: 5,
                    phase: 'Chặng 2',
                    module: 'Matlab - system control',
                    title: 'Part 2 - Pole placement',
                    url: 'https://youtu.be/FXSpHy8LvmY?si=IOkhQEoM6fWV2SzD',
                    completed: false,
                    attendanceLogs: []
                },
                {
                    id: 'cls_5_3',
                    stt: 5,
                    phase: 'Chặng 2',
                    module: 'Matlab - system control',
                    title: 'Part 3 - Observability and Controllability',
                    url: 'https://www.youtube.com/watch?v=BYvTEfNAi38',
                    completed: false,
                    attendanceLogs: []
                },
                {
                    id: 'cls_5_4',
                    stt: 5,
                    phase: 'Chặng 2',
                    module: 'Matlab - system control',
                    title: 'Part 4 - What Is LQR Optimal Control',
                    url: 'https://www.youtube.com/watch?v=E_RDCFOlJx4',
                    completed: false,
                    attendanceLogs: []
                }
            ],
            resources: [
                { id: 'res_1', title: 'Giáo trình Kỹ thuật Điều khiển Tự động - TS. Nguyễn Thị Phương Hà', type: 'PDF / Sách', url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/' },
                { id: 'res_2', title: 'MATLAB Control System Toolbox & Tutorials', type: 'Source Code / Lab', url: 'https://ctms.engin.umich.edu/CTMS/index.php?aux=Home' },
                { id: 'res_3', title: 'Brian Douglas Classical Control Theory Playlist', type: 'Video / Playlist', url: 'https://www.youtube.com/@BrianBDouglas' },
                { id: 'res_4', title: 'Control Systems Cheat Sheet (Bode, Nyquist, Root Locus)', type: 'Cheat Sheet', url: 'https://en.wikipedia.org/wiki/Control_theory' }
            ]
        },
        {
            id: 'course_embedded_systems',
            title: 'Lập trình Vi điều khiển & Hệ thống Nhúng (Embedded Systems STM32)',
            desc: 'Chinh phục kiến trúc ARM Cortex-M, ngoại vi GPIO, Timer PWM, UART/SPI/I2C và RTOS.',
            category: 'Hệ thống Nhúng & IoT',
            thumbnail: '⚡',
            color: '#06b6d4',
            currentPhase: 'Chặng 1',
            phases: [
                { id: 'emb_p1', name: 'Chặng 1: Nền tảng ARM & Ngoại vi cơ bản', durationWeeks: 4, label: '4 tuần' },
                { id: 'emb_p2', name: 'Chặng 2: Giao thức truyền thông & FreeRTOS', durationWeeks: 4, label: '4 tuần' }
            ],
            lessons: [
                { id: 'emb_1', stt: 1, phase: 'Chặng 1: Nền tảng ARM & Ngoại vi cơ bản', module: 'Kiến trúc ARM', title: 'Kiến trúc ARM Cortex-M4 & Bus Matrix', url: 'https://www.youtube.com/watch?v=1F_E31Qp9oA', completed: false, attendanceLogs: [] },
                { id: 'emb_2', stt: 2, phase: 'Chặng 1: Nền tảng ARM & Ngoại vi cơ bản', module: 'GPIO & Interrupt', title: 'Cấu hình GPIO, Ngắt ngoài EXTI và NVIC', url: 'https://www.youtube.com/watch?v=0kF_3d8PspI', completed: false, attendanceLogs: [] },
                { id: 'emb_3', stt: 3, phase: 'Chặng 1: Nền tảng ARM & Ngoại vi cơ bản', module: 'Timers & PWM', title: 'General Purpose Timer & Điều chế xung PWM', url: 'https://www.youtube.com/watch?v=jW93H1VfXn4', completed: false, attendanceLogs: [] },
                { id: 'emb_4', stt: 4, phase: 'Chặng 2: Giao thức truyền thông & FreeRTOS', module: 'Giao tiếp ngoại vi', title: 'Giao tiếp UART với máy tính và ngắt nhận RX', url: 'https://www.youtube.com/watch?v=6vC7c6Uo6gY', completed: false, attendanceLogs: [] },
                { id: 'emb_5', stt: 5, phase: 'Chặng 2: Giao thức truyền thông & FreeRTOS', module: 'FreeRTOS', title: 'Đa nhiệm với FreeRTOS: Task Creation & Queues', url: 'https://www.youtube.com/watch?v=F321087yYy4', completed: false, attendanceLogs: [] }
            ],
            resources: [
                { id: 'emb_res_1', title: 'STM32F4 Reference Manual (RM0090) Full PDF', type: 'PDF / Sách', url: 'https://www.st.com/' },
                { id: 'emb_res_2', title: 'Mastering STM32 by Carmine Noviello', type: 'PDF / Sách', url: 'https://www.carminenoviello.com/mastering-stm32/' },
                { id: 'emb_res_3', title: 'FreeRTOS Real-Time Kernel Hands-On Tutorial', type: 'Source Code / Lab', url: 'https://www.freertos.org/' }
            ]
        },
        {
            id: 'course_signal_processing',
            title: 'Xử lý Tín hiệu Số & Toán Kỹ thuật (DSP & Engineering Math)',
            desc: 'Phân tích Fourier, Biến đổi Z, Thiết kế bộ lọc số FIR/IIR và ứng dụng thực nghiệm.',
            category: 'Toán học & Tín hiệu',
            thumbnail: '📊',
            color: '#10b981',
            currentPhase: 'Chặng 1',
            phases: [
                { id: 'dsp_p1', name: 'Chặng 1: Chuỗi Fourier & Biến đổi Laplace', durationWeeks: 3, label: '3 tuần' },
                { id: 'dsp_p2', name: 'Chặng 2: Biến đổi Z & Bộ lọc số', durationWeeks: 3, label: '3 tuần' }
            ],
            lessons: [
                { id: 'dsp_1', stt: 1, phase: 'Chặng 1: Chuỗi Fourier & Biến đổi Laplace', module: 'Fourier Analysis', title: 'Chuỗi Fourier & Phổ tần số liên tục', url: 'https://www.youtube.com/watch?v=spUNpyF58BY', completed: false, attendanceLogs: [] },
                { id: 'dsp_2', stt: 2, phase: 'Chặng 1: Chuỗi Fourier & Biến đổi Laplace', module: 'Laplace Transform', title: 'Biến đổi Laplace và Phân tích Hệ thống LTI', url: 'https://www.youtube.com/watch?v=6mx7f0e_y_g', completed: false, attendanceLogs: [] },
                { id: 'dsp_3', stt: 3, phase: 'Chặng 2: Biến đổi Z & Bộ lọc số', module: 'Z-Transform', title: 'Biến đổi Z và Điểm cực - Điểm không (Pole-Zero)', url: 'https://www.youtube.com/watch?v=t5JvIqQO5m8', completed: false, attendanceLogs: [] },
                { id: 'dsp_4', stt: 4, phase: 'Chặng 2: Biến đổi Z & Bộ lọc số', module: 'Digital Filters', title: 'Thiết kế bộ lọc FIR theo phương pháp cửa sổ', url: 'https://www.youtube.com/watch?v=r0OqCg_E53c', completed: false, attendanceLogs: [] }
            ],
            resources: [
                { id: 'dsp_res_1', title: 'Discrete-Time Signal Processing - Oppenheim & Schafer', type: 'PDF / Sách', url: 'https://ocw.mit.edu/' },
                { id: 'dsp_res_2', title: 'Python DSP & SciPy Signal Processing Tutorials', type: 'Source Code / Lab', url: 'https://docs.scipy.org/doc/scipy/reference/signal.html' }
            ]
        }
    ]
};

// Default User Profile
const DEFAULT_PROFILE = {
    name: 'Nguyễn Tuấn Kiệt',
    headline: 'Executive Discipline & Continuous Learning',
    avatarText: 'TK',
    avatarUrl: '',
    bio: 'Kỷ luật là cầu nối giữa mục tiêu và thành tựu.',
    statusTier: 'Hội viên Pro'
};

// State
const todayObj = new Date();
let state = {
    currentYear: todayObj.getFullYear(),
    currentMonth: todayObj.getMonth(),
    theme: 'dark', // default theme
    habits: [...DEFAULT_HABITS],
    schedule: [...DEFAULT_SCHEDULE],
    todos: [], // Added for TODO List task tracking
    logs: {},
    classroom: JSON.parse(JSON.stringify(DEFAULT_CLASSROOM)),
    profile: { ...DEFAULT_PROFILE },
    isWorkspaceExpanded: false
};

// Motivational Quotes Database
const MOTIVATIONAL_QUOTES = [
    "“Kỷ luật là cầu nối giữa mục tiêu và thành tựu.”",
    "“Thói quen tốt hôm nay kiến tạo tương lai ngày mai.”",
    "“Động lực giúp bạn bắt đầu. Kỷ luật giữ cho bạn tiếp tục.”",
    "“Xuất sắc là thói quen, không phải hành động nhất thời.”",
    "“Mỗi ngày tốt hơn 1% sẽ tạo ra sự khác biệt khổng lồ.”",
    "“Kỷ luật tự giác chính là sức mạnh tự do lớn nhất.”",
    "“Hành trình vạn dặm bắt đầu từ một bước chân nhỏ bé.”",
    "“Đừng đếm ngày trôi qua, hãy làm cho từng ngày có nghĩa.”",
    "“Bí mật của thành công nằm ở thói quen hàng ngày của bạn.”",
    "“Chiến thắng bản thân là chiến thắng vĩ đại nhất.”"
];

function initHeaderSubtitle() {
    // Set random motivational quote
    const quoteEl = document.getElementById('header-quote');
    if (quoteEl) {
        const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
        quoteEl.innerText = randomQuote;
    }
    
    // Initial clock update and set interval
    updateHeaderDateTime();
    setInterval(updateHeaderDateTime, 1000);
}

function updateHeaderDateTime() {
    const datetimeEl = document.getElementById('header-datetime');
    if (!datetimeEl) return;
    
    const now = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = days[now.getDay()];
    
    const dateStr = String(now.getDate()).padStart(2, '0');
    const monthStr = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    
    datetimeEl.innerText = `${dayName}, ${dateStr}/${monthStr}/${year} • ${hour}:${minute}:${second}`;
}

// Initialize State
function init() {
    setupEventListeners();
    setupAuthUI();
    registerServiceWorker();
    initHeaderSubtitle();
    initTodoDeadlineChecker();
    initShortcutMenu();
    initProductivitySuite();
    initExcelPreviewHandlers();
    initClassroom();
    renderProfile();
    setupProfileModal();
    setupWorkspaceExpansion();
}

// Đăng ký Service Worker cho PWA (Hỗ trợ chạy Offline và Cài đặt như App di động)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('Đăng ký Service Worker thành công với scope:', reg.scope))
            .catch((err) => console.error('Lỗi đăng ký Service Worker:', err));
    }
}

// ==========================================================================
// USER PROFILE MANAGEMENT & DYNAMIC EDITING
// ==========================================================================
function renderProfile() {
    if (!state.profile) state.profile = { ...DEFAULT_PROFILE };
    const p = state.profile;
    
    // Left Rail profile card
    const nameEl = document.getElementById('profile-user-name');
    if (nameEl) nameEl.innerText = p.name || 'Nguyễn Tuấn Kiệt';
    
    const headlineEl = document.getElementById('profile-user-headline');
    if (headlineEl) headlineEl.innerText = p.headline || 'Executive Discipline & Continuous Learning';
    
    const avatarLarge = document.getElementById('profile-avatar-large');
    if (avatarLarge) {
        if (p.avatarUrl && p.avatarUrl.trim() !== '') {
            avatarLarge.innerHTML = `
                <img src="${escapeHtml(p.avatarUrl)}" class="profile-avatar-img" alt="${escapeHtml(p.name)}">
                <span class="avatar-online-dot"></span>
            `;
        } else {
            avatarLarge.innerHTML = `
                <span class="avatar-letters" id="profile-avatar-letters">${escapeHtml(p.avatarText || 'TK')}</span>
                <span class="avatar-online-dot"></span>
            `;
        }
    }
    
    // Top global header
    const headerAvatar = document.getElementById('header-avatar-letters');
    if (headerAvatar) headerAvatar.innerText = p.avatarText || 'TK';
    
    const headerEmail = document.getElementById('user-email-display');
    if (headerEmail) headerEmail.innerText = p.name || 'Kỷ Luật & Học Tập';
    
    const headerStatus = document.getElementById('header-user-status');
    if (headerStatus) headerStatus.innerText = p.statusTier || 'Hội viên Pro';
}

function setupProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (!modal) return;
    
    const openBtn = document.getElementById('open-edit-profile-btn');
    const closeBtn = document.getElementById('close-edit-profile-modal');
    const cancelBtn = document.getElementById('cancel-edit-profile-btn');
    const form = document.getElementById('edit-profile-form');
    
    const nameInp = document.getElementById('profile-input-name');
    const headInp = document.getElementById('profile-input-headline');
    const avLettersInp = document.getElementById('profile-input-avatar-letters');
    const avUrlInp = document.getElementById('profile-input-avatar-url');
    const bioInp = document.getElementById('profile-input-bio');
    
    function openModal() {
        if (!state.profile) state.profile = { ...DEFAULT_PROFILE };
        nameInp.value = state.profile.name || '';
        headInp.value = state.profile.headline || '';
        avLettersInp.value = state.profile.avatarText || '';
        avUrlInp.value = state.profile.avatarUrl || '';
        bioInp.value = state.profile.bio || '';
        modal.style.display = 'flex';
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }
    
    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Click on avatar or user name also triggers edit modal
    document.getElementById('profile-avatar-large')?.addEventListener('click', openModal);
    document.getElementById('profile-user-name')?.addEventListener('click', openModal);
    document.getElementById('user-profile')?.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'logout-btn') return;
        openModal();
    });
    
    // Auto generate initials when typing name if letters is empty
    nameInp?.addEventListener('input', () => {
        const val = nameInp.value.trim();
        if (val && (!avLettersInp.value || avLettersInp.value.length <= 3)) {
            const parts = val.split(/\s+/).filter(Boolean);
            if (parts.length >= 2) {
                avLettersInp.value = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            } else if (parts.length === 1) {
                avLettersInp.value = parts[0].substring(0, 2).toUpperCase();
            }
        }
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = nameInp.value.trim() || 'Nguyễn Tuấn Kiệt';
        const newHead = headInp.value.trim() || 'Executive Discipline & Continuous Learning';
        let newLetters = avLettersInp.value.trim().toUpperCase();
        if (!newLetters) {
            const parts = newName.split(/\s+/).filter(Boolean);
            newLetters = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : newName.substring(0, 2).toUpperCase();
        }
        const newUrl = avUrlInp.value.trim();
        const newBio = bioInp.value.trim();
        
        state.profile = {
            name: newName,
            headline: newHead,
            avatarText: newLetters,
            avatarUrl: newUrl,
            bio: newBio,
            statusTier: state.profile.statusTier || 'Hội viên Pro'
        };
        
        saveState();
        renderProfile();
        closeModal();
        showToast('Đã lưu thông tin hồ sơ cá nhân thành công!');
    });
}

function setupWorkspaceExpansion() {
    const expandBtn = document.getElementById('toggle-expand-btn');
    const expandText = document.getElementById('expand-btn-text');
    const hideLeftRailBtn = document.getElementById('hide-left-rail-btn');
    const floatingShowRailBtn = document.getElementById('floating-show-rail-btn');
    const grid = document.querySelector('.linkedin-layout-grid');
    if (!grid) return;
    
    // Apply initial contextual class for active tab
    const currentTab = localStorage.getItem('habit_tracker_active_tab') || 'habits';
    grid.classList.remove('tab-habits-active', 'tab-tasks-active', 'tab-classroom-active');
    if (currentTab === 'habits') {
        grid.classList.add('tab-habits-active');
    } else if (currentTab === 'tasks') {
        grid.classList.add('tab-tasks-active');
    } else if (currentTab === 'classroom') {
        grid.classList.add('tab-classroom-active');
    }
    
    const updateUIState = (isExpanded) => {
        if (isExpanded) {
            grid.classList.add('workspace-expanded');
            document.body.classList.add('has-hidden-rail');
            if (expandText) expandText.innerText = 'Hiện thông tin chung';
            if (expandBtn) {
                expandBtn.classList.add('rail-hidden-active');
                expandBtn.setAttribute('title', 'Bấm để hiển thị lại thanh thông tin chung');
            }
            if (floatingShowRailBtn) floatingShowRailBtn.style.display = 'flex';
        } else {
            grid.classList.remove('workspace-expanded');
            document.body.classList.remove('has-hidden-rail');
            if (expandText) expandText.innerText = 'Ẩn thông tin chung';
            if (expandBtn) {
                expandBtn.classList.remove('rail-hidden-active');
                expandBtn.setAttribute('title', 'Bấm để ẩn thanh thông tin chung (Cột trái)');
            }
            if (floatingShowRailBtn) floatingShowRailBtn.style.display = 'none';
        }
    };
    
    // Restore saved expansion state if present
    const savedExp = localStorage.getItem('habit_tracker_workspace_expanded') === 'true';
    updateUIState(savedExp);
    
    const toggleRail = (e) => {
        if (e) e.preventDefault();
        const isCurrentlyExpanded = grid.classList.contains('workspace-expanded');
        const nextState = !isCurrentlyExpanded;
        updateUIState(nextState);
        try {
            localStorage.setItem('habit_tracker_workspace_expanded', String(nextState));
        } catch (err) {}
        showToast(nextState ? 'Đã ẩn thanh thông tin chung (không gian làm việc mở rộng).' : 'Đã hiển thị lại thanh thông tin chung.');
    };
    
    if (expandBtn) {
        expandBtn.addEventListener('click', toggleRail);
    }
    if (hideLeftRailBtn) {
        hideLeftRailBtn.addEventListener('click', toggleRail);
    }
    if (floatingShowRailBtn) {
        floatingShowRailBtn.addEventListener('click', toggleRail);
    }
}

// Thiết lập Giao diện đăng nhập Supabase & Kiểm tra phiên đăng nhập
function setupAuthUI() {
    const authOverlay = document.getElementById('auth-overlay');
    const warning = document.getElementById('supabase-config-warning');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const submitBtn = document.getElementById('auth-submit-btn');
    const switchLink = document.getElementById('auth-switch-link');
    const useOfflineBtn = document.getElementById('use-offline-btn');
    const authForm = document.getElementById('auth-form');
    
    const hasConfig = supabaseClient !== null;
    
    if (!hasConfig) {
        warning.style.display = 'block';
        document.getElementById('auth-email').disabled = true;
        document.getElementById('auth-password').disabled = true;
        submitBtn.disabled = true;
        tabLogin.style.pointerEvents = 'none';
        tabSignup.style.pointerEvents = 'none';
        
        useOfflineBtn.addEventListener('click', () => {
            isOfflineMode = true;
            localStorage.setItem('bro_habit_tracker_offline_mode', 'true');
            syncAuthUI(true, 'Chế độ Offline');
            initOfflineState();
        });
        
        authOverlay.style.display = 'flex';
        return;
    }
    
    // Ràng buộc hành động
    tabLogin.addEventListener('click', () => switchAuthTab('login'));
    tabSignup.addEventListener('click', () => switchAuthTab('signup'));
    switchLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthTab(currentAuthTab === 'login' ? 'signup' : 'login');
    });
    
    useOfflineBtn.addEventListener('click', () => {
        isOfflineMode = true;
        localStorage.setItem('bro_habit_tracker_offline_mode', 'true');
        syncAuthUI(true, 'Chế độ Offline');
        initOfflineState();
    });
    
    authForm.addEventListener('submit', handleAuthSubmit);
    
    checkSessionAndInit();
}

function switchAuthTab(tab) {
    currentAuthTab = tab;
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const submitBtn = document.getElementById('auth-submit-btn');
    const switchText = document.getElementById('auth-switch-text');
    
    if (tab === 'login') {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        submitBtn.innerText = 'Đăng nhập';
        switchText.innerHTML = `Chưa có tài khoản? <span class="auth-link" id="auth-switch-link">Đăng ký ngay</span>`;
    } else {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        submitBtn.innerText = 'Đăng ký tài khoản';
        switchText.innerHTML = `Đã có tài khoản? <span class="auth-link" id="auth-switch-link">Đăng nhập ngay</span>`;
    }
    
    // Clear error message on tab switch
    const errorMsg = document.getElementById('auth-error-msg');
    if (errorMsg) {
        errorMsg.style.display = 'none';
        errorMsg.innerText = '';
    }
    
    // Ràng buộc lại hành động cho thẻ link
    document.getElementById('auth-switch-link').addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthTab(currentAuthTab === 'login' ? 'signup' : 'login');
    });
}

// Đồng bộ hiển thị Auth, Header và Logout buttons
function syncAuthUI(isAuthenticatedOrOffline, userLabel = '') {
    const authOverlay = document.getElementById('auth-overlay');
    const userProfile = document.getElementById('user-profile');
    const userEmailDisplay = document.getElementById('user-email-display');
    const headerLogoutBtn = document.getElementById('header-logout-btn');
    const railLogoutBtn = document.getElementById('rail-logout-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (isAuthenticatedOrOffline) {
        if (authOverlay) authOverlay.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        if (headerLogoutBtn) headerLogoutBtn.style.display = 'inline-flex';
        if (railLogoutBtn) railLogoutBtn.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'none'; // Đã có nút Đăng xuất trên header và rail
        if (userEmailDisplay && userLabel) userEmailDisplay.innerText = userLabel;
    } else {
        if (authOverlay) authOverlay.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
        if (headerLogoutBtn) headerLogoutBtn.style.display = 'none';
        if (railLogoutBtn) railLogoutBtn.style.display = 'none';
    }
}

function setupLogoutListeners() {
    const headerLogoutBtn = document.getElementById('header-logout-btn');
    const railLogoutBtn = document.getElementById('rail-logout-btn');
    const logoutBtn = document.getElementById('logout-btn');

    [headerLogoutBtn, railLogoutBtn, logoutBtn].forEach(btn => {
        if (btn && !btn.dataset.boundLogout) {
            btn.dataset.boundLogout = "true";
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogout();
            });
        }
    });
}

async function checkSessionAndInit() {
    setupLogoutListeners();

    // Check if the user previously selected Offline Mode
    const savedOfflineMode = localStorage.getItem('bro_habit_tracker_offline_mode') === 'true';
    if (savedOfflineMode) {
        isOfflineMode = true;
        syncAuthUI(true, 'Chế độ Offline');
        initOfflineState();
        return;
    }
    
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (session && session.user) {
            currentUser = session.user;
            syncAuthUI(true, currentUser.email);
            await loadStateFromCloud();
        } else {
            syncAuthUI(false);
        }
    } catch (e) {
        console.error("Lỗi lấy session:", e);
        // Fallback to offline mode
        isOfflineMode = true;
        syncAuthUI(true, 'Chế độ Offline');
        initOfflineState();
    }
    
    // Lắng nghe thay đổi trạng thái đăng nhập
    if (supabaseClient) {
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            // Only respond if we are NOT in offline mode
            if (localStorage.getItem('bro_habit_tracker_offline_mode') === 'true') return;
            
            if (session && session.user) {
                currentUser = session.user;
                syncAuthUI(true, currentUser.email);
                await loadStateFromCloud();
            } else {
                currentUser = null;
                syncAuthUI(false);
            }
        });
    }
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const submitBtn = document.getElementById('auth-submit-btn');
    const errorMsg = document.getElementById('auth-error-msg');
    
    // Clear previous errors
    if (errorMsg) {
        errorMsg.style.display = 'none';
        errorMsg.innerText = '';
    }
    
    submitBtn.disabled = true;
    submitBtn.innerText = currentAuthTab === 'login' ? 'Đang đăng nhập...' : 'Đang tạo tài khoản...';
    
    try {
        if (currentAuthTab === 'login') {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            showToast("Đăng nhập thành công!");
        } else {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password
            });
            if (error) throw error;
            showToast("Đăng ký thành công! Đang tự động đăng nhập...");
            // Supabase auto logins on signUp depending on config, let's attempt login
            await supabaseClient.auth.signInWithPassword({ email, password });
        }
    } catch (err) {
        console.error(err);
        let userFriendlyMsg = err.message || 'Lỗi không xác định';
        if (userFriendlyMsg.includes('504') || userFriendlyMsg.toLowerCase().includes('timeout')) {
            userFriendlyMsg = 'Máy chủ Supabase đang tạm dừng / timeout (HTTP 504). Vui lòng bấm nút "Sử dụng Offline (Lưu cục bộ)" bên dưới để vào ứng dụng ngay mà không cần tài khoản!';
        } else if (userFriendlyMsg.includes('Failed to fetch') || userFriendlyMsg.toLowerCase().includes('network')) {
            userFriendlyMsg = 'Không thể kết nối đến máy chủ Supabase. Vui lòng bấm "Sử dụng Offline" bên dưới để vào ứng dụng.';
        }
        showToast(userFriendlyMsg, true);
        
        // Show inline error in overlay
        if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.innerText = userFriendlyMsg;
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = currentAuthTab === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản';
    }
}

async function handleLogout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
        localStorage.removeItem('bro_habit_tracker_offline_mode');
        if (supabaseClient && currentUser) {
            try {
                await supabaseClient.auth.signOut();
            } catch (e) {
                console.error("SignOut error:", e);
            }
        }
        currentUser = null;
        isOfflineMode = false;
        showToast("Đã đăng xuất thành công.");
        window.location.reload();
    }
}
window.handleLogout = handleLogout;

// Tải trạng thái từ Supabase
async function loadStateFromCloud() {
    if (!supabaseClient || !currentUser) return;
    
    showToast("Đang tải dữ liệu từ đám mây...");
    
    try {
        const { data, error } = await supabaseClient
            .from('user_states')
            .select('state')
            .eq('user_id', currentUser.id)
            .single();
            
        if (error && error.code !== 'PGRST116') { // PGRST116 là mã khi không tìm thấy dòng dữ liệu nào
            throw error;
        }
        
        if (data && data.state) {
            state = data.state;
            // Xác thực tính nhất quán của dữ liệu
            const today = new Date();
            if (state.currentMonth === undefined) state.currentMonth = today.getMonth();
            if (state.currentYear === undefined) state.currentYear = today.getFullYear();
            if (state.theme === undefined) state.theme = 'dark';
            if (state.habits === undefined) state.habits = [...DEFAULT_HABITS];
            if (state.schedule === undefined) state.schedule = [...DEFAULT_SCHEDULE];
            if (!state.todos) state.todos = [];
            if (!state.logs) state.logs = {};
            if (!state.classroom) state.classroom = JSON.parse(JSON.stringify(DEFAULT_CLASSROOM));
        } else {
            // Người dùng mới, tạo bản ghi ban đầu
            const today = new Date();
            state = {
                currentYear: today.getFullYear(),
                currentMonth: today.getMonth(),
                theme: 'dark',
                habits: [...DEFAULT_HABITS],
                schedule: [...DEFAULT_SCHEDULE],
                todos: [],
                logs: {},
                classroom: JSON.parse(JSON.stringify(DEFAULT_CLASSROOM))
            };
            generateMockData();
            await syncStateToCloudDirect();
        }
        
        // Ràng buộc lại sự kiện lắng nghe sự thay đổi của tháng
        const monthSelect = document.getElementById('month-select');
        if (monthSelect) monthSelect.value = state.currentMonth;
        
        applyTheme();
        renderAll();
        showToast("Đã đồng bộ dữ liệu đám mây!");
    } catch (e) {
        console.error("Lỗi tải dữ liệu Supabase:", e);
        showToast("Lỗi đồng bộ đám mây, sử dụng dữ liệu cục bộ thay thế.", true);
        initOfflineState();
    }
}

async function syncStateToCloud() {
    if (!supabaseClient || !currentUser || isOfflineMode) return;
    
    clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
        await syncStateToCloudDirect();
    }, 1500); // Trì hoãn 1.5s (debounce)
}

async function syncStateToCloudDirect() {
    if (!supabaseClient || !currentUser) return;
    
    try {
        const { error } = await supabaseClient
            .from('user_states')
            .upsert({
                user_id: currentUser.id,
                state: state,
                updated_at: new Date().toISOString()
            });
            
        if (error) throw error;
        console.log("Đã đồng bộ dữ liệu thành công lên Supabase!");
    } catch (e) {
        console.error("Lỗi ghi dữ liệu Supabase:", e);
    }
}

// Khởi tạo Offline nếu không kết nối được
function initOfflineState() {
    loadState();
    const currentMonthKey = String(state.currentMonth);
    if (!state.logs[currentMonthKey]) {
        generateMockData();
    }
    const monthSelect = document.getElementById('month-select');
    if (monthSelect) monthSelect.value = state.currentMonth;
    applyTheme();
    renderAll();
}

// Load state từ localStorage
function loadState() {
    const saved = localStorage.getItem('bro_habit_tracker_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
            const today = new Date();
            if (state.currentMonth === undefined) state.currentMonth = today.getMonth();
            if (state.currentYear === undefined) state.currentYear = today.getFullYear();
            if (state.theme === undefined) state.theme = 'dark';
            if (state.habits === undefined) state.habits = [...DEFAULT_HABITS];
            if (state.schedule === undefined) state.schedule = [...DEFAULT_SCHEDULE];
            if (!state.todos) state.todos = [];
            if (!state.logs) state.logs = {};
            if (!state.classroom) state.classroom = JSON.parse(JSON.stringify(DEFAULT_CLASSROOM));
            if (!state.profile) {
                state.profile = { ...DEFAULT_PROFILE };
            } else {
                state.profile = Object.assign({}, DEFAULT_PROFILE, state.profile);
            }
        } catch (e) {
            console.error('Lỗi load state:', e);
        }
    }
}

// Apply selected theme (dark or light)
function applyTheme() {
    const isLight = state.theme === 'light';
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-toggle-text');
    
    if (isLight) {
        body.classList.add('light-theme');
        if (themeText) themeText.innerText = 'Giao diện sáng';
        if (themeIcon) {
            themeIcon.innerHTML = `<path fill="currentColor" d="M12,7a5,5,0,1,0,5,5A5,5,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Zm0-10a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5Zm0,14a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41L6.34,4.93a1,1,0,0,0-1.41,1.41Zm12.72,9.9a1,1,0,0,0-.7-.29,1,1,0,0,0-.71.29,1,1,0,0,0,0,1.41l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm16-1H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2ZM6.34,17.66a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.41l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM17.66,6.34a1,1,0,0,0,1.41,0l.71-.71a1,1,0,1,0-1.41-1.41l-.71.71A1,1,0,0,0,17.66,6.34Z"/>`;
        }
    } else {
        body.classList.remove('light-theme');
        if (themeText) themeText.innerText = 'Giao diện tối';
        if (themeIcon) {
            themeIcon.innerHTML = `<path fill="currentColor" d="M12.3,2A10,10,0,0,0,12,22a9.76,9.76,0,0,0,4.16-.92,1,1,0,0,0,.17-1.63,1,1,0,0,0-1.12-.13A8,8,0,1,1,12,4a7.92,7.92,0,0,1,3.2.66,1,1,0,0,0,1.11-.13,1,1,0,0,0-.17-1.63A9.76,9.76,0,0,0,12.3,2Z"/>`;
        }
    }
}

// Lưu state
function saveState() {
    localStorage.setItem('bro_habit_tracker_state', JSON.stringify(state));
    syncStateToCloud();
}

// Helper to generate mock data for current selected month & year
function generateMockData() {
    const year = state.currentYear;
    const month = state.currentMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    if (!state.logs[month]) {
        state.logs[month] = {
            wellness: {}
        };
    }
    
    // Fill habits checkboxes
    state.habits.forEach(habit => {
        state.logs[month][habit.id] = {};
        
        for (let d = 1; d <= daysInMonth; d++) {
            // Checkboxes are dense in the first two weeks (days 1-14)
            if (d <= 14) {
                let probability = 0.75;
                if (habit.id === 'h1' || habit.id === 'h2') probability = 0.85; // Bro wakes up & goes to gym
                if (habit.id === 'h5' || habit.id === 'h7') probability = 0.90; // Bro is disciplined
                
                state.logs[month][habit.id][d] = Math.random() < probability;
            } else {
                state.logs[month][habit.id][d] = false;
            }
        }
    });
    
    // Fill mock wellness
    const moods = ['🔥', '😀', '🙂', '😐', '😢'];
    for (let d = 1; d <= daysInMonth; d++) {
        if (d <= 14) {
            const moodIndex = Math.random() < 0.7 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 5); // mostly good
            const sleep = parseFloat((6 + Math.random() * 3).toFixed(1)); // 6h to 9h
            state.logs[month].wellness[d] = {
                mood: moods[moodIndex],
                sleep: sleep
            };
        } else {
            state.logs[month].wellness[d] = {
                mood: '',
                sleep: ''
            };
        }
    }
    
    saveState();
}

// Set up UI Event Listeners
function setupEventListeners() {
    // Global search input for LinkedIn top navigation bar
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            // Filter habits
            document.querySelectorAll('.tr-habit-row').forEach(row => {
                const text = row.querySelector('.habit-text')?.innerText.toLowerCase() || '';
                row.style.display = (!query || text.includes(query)) ? '' : 'none';
            });
            // Filter todos
            document.querySelectorAll('.todo-item').forEach(item => {
                const text = item.querySelector('.todo-title')?.innerText.toLowerCase() || '';
                item.style.display = (!query || text.includes(query)) ? '' : 'none';
            });
            // Filter course curriculum
            document.querySelectorAll('.curriculum-table tbody tr:not(.phase-header-row)').forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = (!query || text.includes(query)) ? '' : 'none';
            });
        });
    }

    // Month selector change
    const monthSelect = document.getElementById('month-select');
    monthSelect.value = state.currentMonth;
    monthSelect.addEventListener('change', (e) => {
        state.currentMonth = parseInt(e.target.value);
        
        // Initialize month logs if not exists
        if (!state.logs[state.currentMonth]) {
            state.logs[state.currentMonth] = { wellness: {} };
            // Populate empty logs for this month
            state.habits.forEach(habit => {
                state.logs[state.currentMonth][habit.id] = {};
            });
        }
        
        saveState();
        renderAll();
        showToast(`Đã chuyển sang ${monthSelect.options[monthSelect.selectedIndex].text}`);
    });
    
    // Add habit form
    const addHabitForm = document.getElementById('add-habit-form');
    addHabitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('habit-name');
        const emojiInput = document.getElementById('habit-emoji');
        
        const newHabit = {
            id: 'h_' + Date.now(),
            name: nameInput.value.trim(),
            emoji: emojiInput.value.trim() || '🎯'
        };
        
        // Add to state
        state.habits.push(newHabit);
        
        // Init logs for this habit across all months
        Object.keys(state.logs).forEach(m => {
            state.logs[m][newHabit.id] = {};
        });
        
        saveState();
        renderAll();
        
        // Reset form
        nameInput.value = '';
        emojiInput.value = '🎯';
        
        showToast(`Đã thêm thói quen "${newHabit.name}"`);
    });
    // Theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            saveState();
            applyTheme();
            showToast(`Đã chuyển sang giao diện ${state.theme === 'dark' ? 'tối' : 'sáng'}`);
        });
    }

    // Thiết lập sự kiện quản lý Thời gian biểu (Schedule Modal)
    const editScheduleBtn = document.getElementById('edit-schedule-btn');
    const scheduleModal = document.getElementById('schedule-modal');
    const closeScheduleModal = document.getElementById('close-schedule-modal');
    
    if (editScheduleBtn && scheduleModal && closeScheduleModal) {
        editScheduleBtn.addEventListener('click', () => {
            renderScheduleEditList();
            scheduleModal.style.display = 'flex';
        });
        closeScheduleModal.addEventListener('click', () => {
            scheduleModal.style.display = 'none';
        });
        scheduleModal.addEventListener('click', (e) => {
            if (e.target === scheduleModal) {
                scheduleModal.style.display = 'none';
            }
        });
    }
    
    // Quick Time Preset Pills for Schedule
    document.querySelectorAll('.sched-preset-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            const timeVal = btn.getAttribute('data-time');
            const timeInput = document.getElementById('sched-time');
            const actInput = document.getElementById('sched-activity');
            if (timeInput && timeVal) {
                timeInput.value = timeVal;
                if (actInput) actInput.focus();
            }
        });
    });
    
    const addScheduleForm = document.getElementById('add-schedule-form');
    if (addScheduleForm) {
        addScheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const timeInput = document.getElementById('sched-time');
            const emojiInput = document.getElementById('sched-emoji');
            const actInput = document.getElementById('sched-activity');
            
            const newItem = {
                id: 's_' + Date.now(),
                time: timeInput.value.trim(),
                emoji: (emojiInput && emojiInput.value.trim()) || '🎯',
                activity: actInput.value.trim()
            };
            
            if (!state.schedule) state.schedule = [];
            state.schedule.push(newItem);
            
            saveState();
            renderSchedule();
            renderScheduleEditList();
            
            timeInput.value = '';
            if (emojiInput) emojiInput.value = '🎯';
            actInput.value = '';
            showToast(`Đã thêm hoạt động: "${newItem.activity}"`);
        });
    }

    // Reset all data button
    const resetAllBtn = document.getElementById('reset-all-btn');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', async () => {
            const confirmed = confirm('CẢNH BÁO:\n\nBạn có chắc chắn muốn RESET TOÀN BỘ dữ liệu không?\nHành động này sẽ xoá sạch nhật ký thói quen, thời gian biểu, lịch ngủ, tâm trạng và trả ứng dụng về trạng thái mặc định ban đầu.');
            
            if (confirmed) {
                const today = new Date();
                // Reset state to empty arrays so user starts with a completely blank slate
                state = {
                    currentYear: today.getFullYear(),
                    currentMonth: today.getMonth(),
                    theme: state.theme || 'dark',
                    habits: [],
                    schedule: [],
                    logs: {}
                };
                
                // Save to localStorage
                localStorage.setItem('bro_habit_tracker_state', JSON.stringify(state));
                
                // If logged in to Supabase, sync reset state to cloud
                if (supabaseClient && currentUser && !isOfflineMode) {
                    showToast('Đang reset dữ liệu trên đám mây...');
                    await syncStateToCloudDirect();
                }
                
                showToast('Đã reset toàn bộ dữ liệu thành công! Đang tải lại trang...', false);
                
                // Reload the application to apply all changes fresh
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        });
    }

    // File Input Listener for Schedule Import
    const fileInput = document.getElementById('schedule-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const filename = file.name;
            const ext = filename.split('.').pop().toLowerCase();
            document.getElementById('import-status-text').innerText = `Đang xử lý: ${filename}`;
            
            if (ext === 'xlsx' || ext === 'xls') {
                parseExcel(file);
            } else if (ext === 'csv' || ext === 'txt') {
                parseCSV(file);
            } else if (ext === 'pdf') {
                parsePDF(file);
            } else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext) || file.type.startsWith('image/')) {
                parseImageOCR(file);
            } else {
                showToast('Định dạng file không hỗ trợ! Chọn file Excel, CSV, PDF hoặc Hình ảnh.', true);
                document.getElementById('import-status-text').innerText = 'Lỗi: File không hỗ trợ';
            }
        });
    }

    // TODO List form submission
    const addTodoForm = document.getElementById('add-todo-form');
    if (addTodoForm) {
        addTodoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('todo-title-input');
            const descInput = document.getElementById('todo-desc-input');
            const deadlineInput = document.getElementById('todo-deadline-input');
            
            const title = titleInput.value.trim();
            const desc = descInput.value.trim();
            const deadline = deadlineInput.value;
            
            if (!title || !deadline) return;
            
            const newTodo = {
                id: 't_' + Date.now(),
                title: title,
                description: desc,
                deadline: deadline,
                completed: false,
                notified: false
            };
            
            state.todos.push(newTodo);
            saveState();
            renderTodos();
            
            // Clear form
            titleInput.value = '';
            descInput.value = '';
            deadlineInput.value = '';
            
            showToast(`Đã thêm nhiệm vụ: "${newTodo.title}"`);
        });
    }

    // Handle Deadline presets click
    const presetsContainer = document.querySelector('.deadline-presets');
    if (presetsContainer) {
        presetsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.preset-btn');
            if (!btn) return;
            
            const deadlineInput = document.getElementById('todo-deadline-input');
            if (!deadlineInput) return;
            
            const now = new Date();
            let targetDate = new Date();
            
            const offset = btn.dataset.offset;
            const preset = btn.dataset.preset;
            
            if (offset) {
                const minutes = parseInt(offset);
                targetDate = new Date(now.getTime() + minutes * 60000);
            } else if (preset === 'today22') {
                targetDate.setHours(22, 0, 0, 0);
                if (targetDate < now) {
                    targetDate.setDate(targetDate.getDate() + 1); // Set to tomorrow if past 22:00
                }
            } else if (preset === 'tomorrow09') {
                targetDate.setDate(targetDate.getDate() + 1);
                targetDate.setHours(9, 0, 0, 0);
            }
            
            // Format to datetime-local (YYYY-MM-DDTHH:MM) local time timezone
            const yyyy = targetDate.getFullYear();
            const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
            const dd = String(targetDate.getDate()).padStart(2, '0');
            const hh = String(targetDate.getHours()).padStart(2, '0');
            const min = String(targetDate.getMinutes()).padStart(2, '0');
            
            deadlineInput.value = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
            showToast(`Đã chọn hạn chót: ${hh}:${min} ngày ${dd}/${mm}`);
        });
    }

    // Ask for notification permissions on load/first click
    if ("Notification" in window && Notification.permission === "default") {
        document.body.addEventListener('click', function askPerm() {
            Notification.requestPermission();
            document.body.removeEventListener('click', askPerm);
        }, { once: true });
    }
}

// Show notification toast
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    if (isError) {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Render everything on screen
function renderAll() {
    const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);
    const weekdays = getWeekdayLabelsForMonth(state.currentYear, state.currentMonth);
    
    // Calculate current statistics
    const stats = calculateStats(daysInMonth);
    
    // Render stats text
    document.getElementById('goal-stat').innerText = stats.goal;
    document.getElementById('completed-stat').innerText = stats.completed;
    document.getElementById('left-stat').innerText = stats.left;
    
    // Render overall donut chart
    updateDonutChart(stats.percentage);
    
    // Render charts
    renderDailyProgressChart(daysInMonth, weekdays);
    renderWeeklyProgressChart(daysInMonth);
    
    // Render Main Grid Sheet
    renderMainGrid(daysInMonth, weekdays);
    
    // Render Wellness Table
    renderWellnessGrid(daysInMonth);
    
    // Render Top Habits List
    renderTopHabitsList();
    
    // Render Habit management section list
    renderManageHabits();

    // Render Daily Schedule
    renderSchedule();

    // Render TODO List
    renderTodos();

    // Render Productivity Suite
    renderProductivitySuite();

    // Render Virtual Strict Classroom & Attendance
    renderClassroom();

    // Render User Profile
    renderProfile();
}

// Get total days in month
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// Get array of weekdays for month dates (1 to 31)
function getWeekdayLabelsForMonth(year, month) {
    const days = getDaysInMonth(year, month);
    const labels = [];
    for (let d = 1; d <= days; d++) {
        const dateObj = new Date(year, month, d);
        const dayIndex = dateObj.getDay();
        labels.push(WEEKDAYS_SHORT[dayIndex]);
    }
    return labels;
}

// Calculate Goals, Completed, Left, and Percentage
function calculateStats(daysInMonth) {
    const month = state.currentMonth;
    const monthLogs = state.logs[month] || {};
    
    let goal = state.habits.length * daysInMonth;
    let completed = 0;
    
    state.habits.forEach(habit => {
        const habitLogs = monthLogs[habit.id] || {};
        for (let d = 1; d <= daysInMonth; d++) {
            if (habitLogs[d] === true) {
                completed++;
            }
        }
    });
    
    let left = goal - completed;
    let percentage = goal > 0 ? (completed / goal) * 100 : 0;
    
    return {
        goal,
        completed,
        left,
        percentage
    };
}

// Update Donut Chart
function updateDonutChart(percentage) {
    const segment = document.getElementById('donut-segment');
    const text = document.getElementById('donut-percentage');
    
    // Circumference of radius 50 is 2 * pi * 50 = 314.16
    const circ = 314.16;
    const offset = circ - (percentage / 100) * circ;
    
    segment.setAttribute('stroke-dashoffset', offset);
    text.innerText = `${percentage.toFixed(0)}%`;
}

// Render Daily Progress Chart (SVG bar chart)
function renderDailyProgressChart(daysInMonth, weekdays) {
    const container = document.getElementById('daily-chart-container');
    const width = container.clientWidth || 500;
    const height = 180;
    const paddingLeft = 35;
    const paddingRight = 10;
    const paddingTop = 15;
    const paddingBottom = 25;
    
    const month = state.currentMonth;
    const monthLogs = state.logs[month] || {};
    const totalHabits = state.habits.length;
    
    // Calculate completion % for each day
    const dailyCompletion = [];
    for (let d = 1; d <= daysInMonth; d++) {
        let dayCompleted = 0;
        state.habits.forEach(habit => {
            const habitLogs = monthLogs[habit.id] || {};
            if (habitLogs[d] === true) {
                dayCompleted++;
            }
        });
        const dayPct = totalHabits > 0 ? (dayCompleted / totalHabits) * 100 : 0;
        dailyCompletion.push(dayPct);
    }
    
    let svg = `<svg class="svg-chart" width="100%" height="100%" viewBox="0 0 ${width} ${height}">`;
    
    // Grid Lines
    const gridValues = [0, 25, 50, 75, 100];
    gridValues.forEach(val => {
        const y = paddingTop + (1 - val/100) * (height - paddingTop - paddingBottom);
        svg += `<line class="svg-grid-line" x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" />`;
        svg += `<text class="svg-text" x="${paddingLeft - 8}" y="${y + 4}" text-anchor="end">${val}%</text>`;
    });
    
    // Draw Bars
    const barAreaWidth = width - paddingLeft - paddingRight;
    const colWidth = barAreaWidth / daysInMonth;
    const barWidth = Math.max(3, colWidth * 0.7);
    
    for (let i = 0; i < daysInMonth; i++) {
        const pct = dailyCompletion[i];
        const barHeight = (pct / 100) * (height - paddingTop - paddingBottom);
        const x = paddingLeft + (i * colWidth) + (colWidth - barWidth) / 2;
        const y = height - paddingBottom - barHeight;
        
        svg += `<rect class="svg-bar" x="${x}" y="${y}" width="${barWidth}" height="${Math.max(1, barHeight)}" rx="2" fill="url(#daily-grad)">
            <title>Ngày ${i+1}: ${pct.toFixed(0)}%</title>
        </rect>`;
        
        // X-axis weekday label
        const textX = x + barWidth / 2;
        const textY = height - 8;
        
        // Show weekday for some columns to avoid clutter
        if (daysInMonth <= 15 || i % 2 === 0) {
            svg += `<text class="svg-text" x="${textX}" y="${textY}" text-anchor="middle">${weekdays[i]}</text>`;
        }
    }
    
    svg += `
        <defs>
            <linearGradient id="daily-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#007BFF" />
                <stop offset="100%" stop-color="#17A2B8" />
            </linearGradient>
        </defs>
    </svg>`;
    
    container.innerHTML = svg;
}

// Render Weekly Progress Chart (SVG bar chart)
function renderWeeklyProgressChart(daysInMonth) {
    const container = document.getElementById('weekly-chart-container');
    const width = container.clientWidth || 300;
    const height = 180;
    const paddingLeft = 35;
    const paddingRight = 10;
    const paddingTop = 15;
    const paddingBottom = 25;
    
    const month = state.currentMonth;
    const monthLogs = state.logs[month] || {};
    const totalHabits = state.habits.length;
    
    // Group days into 5 weeks: W1(1-7), W2(8-14), W3(15-21), W4(22-28), W5(29-31)
    const weeksRange = [
        { name: 'week 1', start: 1, end: 7 },
        { name: 'week 2', start: 8, end: 14 },
        { name: 'week 3', start: 15, end: 21 },
        { name: 'week 4', start: 22, end: 28 },
        { name: 'week 5', start: 29, end: daysInMonth }
    ];
    
    const weeklyCompletion = [];
    weeksRange.forEach(week => {
        let totalPossible = totalHabits * (week.end - week.start + 1);
        let completed = 0;
        
        state.habits.forEach(habit => {
            const habitLogs = monthLogs[habit.id] || {};
            for (let d = week.start; d <= week.end; d++) {
                if (habitLogs[d] === true) {
                    completed++;
                }
            }
        });
        
        const weekPct = totalPossible > 0 ? (completed / totalPossible) * 100 : 0;
        weeklyCompletion.push(weekPct);
    });
    
    let svg = `<svg class="svg-chart" width="100%" height="100%" viewBox="0 0 ${width} ${height}">`;
    
    // Grid Lines
    const gridValues = [0, 25, 50, 75, 100];
    gridValues.forEach(val => {
        const y = paddingTop + (1 - val/100) * (height - paddingTop - paddingBottom);
        svg += `<line class="svg-grid-line" x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" />`;
        svg += `<text class="svg-text" x="${paddingLeft - 8}" y="${y + 4}" text-anchor="end">${val}%</text>`;
    });
    
    // Draw Bars
    const barAreaWidth = width - paddingLeft - paddingRight;
    const colWidth = barAreaWidth / 5;
    const barWidth = Math.max(15, colWidth * 0.5);
    
    for (let i = 0; i < 5; i++) {
        const pct = weeklyCompletion[i];
        const barHeight = (pct / 100) * (height - paddingTop - paddingBottom);
        const x = paddingLeft + (i * colWidth) + (colWidth - barWidth) / 2;
        const y = height - paddingBottom - barHeight;
        
        svg += `<rect class="svg-bar" x="${x}" y="${y}" width="${barWidth}" height="${Math.max(1, barHeight)}" rx="3" fill="url(#weekly-grad)">
            <title>${weeksRange[i].name.toUpperCase()}: ${pct.toFixed(0)}%</title>
        </rect>`;
        
        // Label x-axis
        const textX = x + barWidth / 2;
        const textY = height - 8;
        svg += `<text class="svg-text" x="${textX}" y="${textY}" text-anchor="middle">${weeksRange[i].name}</text>`;
    }
    
    svg += `
        <defs>
            <linearGradient id="weekly-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#007BFF" />
                <stop offset="100%" stop-color="#17A2B8" />
            </linearGradient>
        </defs>
    </svg>`;
    
    container.innerHTML = svg;
}

// Render Main Spreadsheet Grid Table
function renderMainGrid(daysInMonth, weekdays) {
    const table = document.getElementById('tracker-table');
    const month = state.currentMonth;
    const monthLogs = state.logs[month] || {};
    
    // --- 1. BUILD THEAD ---
    // Double Row header in spreadsheet:
    // Row 1: "My Habits", Week 1 (spanning 7 cols), Week 2 (spanning 7 cols), Week 3 (7 cols), Week 4 (7 cols), Week 5 (rest cols), "Goal", "Actual", "Left", "Progress", "%"
    
    let theadHTML = ``;
    
    // Header Row 1 (Weeks)
    theadHTML += `<tr>`;
    theadHTML += `<th rowspan="2" class="th-habits-title">My Habits</th>`;
    
    // Render week spans
    theadHTML += `<th colspan="7" class="week-cat-header">Week 1</th>`;
    theadHTML += `<th colspan="7" class="week-cat-header">Week 2</th>`;
    theadHTML += `<th colspan="7" class="week-cat-header">Week 3</th>`;
    theadHTML += `<th colspan="7" class="week-cat-header">Week 4</th>`;
    
    const w5Days = daysInMonth - 28;
    if (w5Days > 0) {
        theadHTML += `<th colspan="${w5Days}" class="week-cat-header">Week 5</th>`;
    }
    
    theadHTML += `<th colspan="5" class="th-analysis-title">Analysis</th>`;
    theadHTML += `</tr>`;
    
    // Header Row 2 (Days Weekday Name, followed by Date row)
    theadHTML += `<tr>`;
    const today = new Date();
    const isCurrentMonthYear = (state.currentMonth === today.getMonth() && state.currentYear === today.getFullYear());
    const todayDay = today.getDate();

    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = (isCurrentMonthYear && d === todayDay);
        const isTodayLeft = (isCurrentMonthYear && d === todayDay - 1);
        theadHTML += `
            <th class="th-day-header ${isToday ? 'today' : ''} ${isTodayLeft ? 'today-left-col' : ''}">
                <div class="th-day-name">${weekdays[d-1]}</div>
                <div class="th-day-num">${d}</div>
            </th>
        `;
    }
    
    // Analysis labels
    theadHTML += `<th class="th-analysis-label">Goal</th>`;
    theadHTML += `<th class="th-analysis-label">Actual</th>`;
    theadHTML += `<th class="th-analysis-label">Left</th>`;
    theadHTML += `<th class="th-analysis-label">Progress</th>`;
    theadHTML += `<th class="th-analysis-label">%</th>`;
    theadHTML += `</tr>`;
    
    table.querySelector('thead').innerHTML = theadHTML;
    
    // --- 2. BUILD TBODY ---
    let tbodyHTML = ``;
    
    state.habits.forEach(habit => {
        const habitLogs = monthLogs[habit.id] || {};
        
        // Calculate stats for this habit
        let goal = daysInMonth;
        let actual = 0;
        for (let d = 1; d <= daysInMonth; d++) {
            if (habitLogs[d] === true) {
                actual++;
            }
        }
        let left = goal - actual;
        let pct = goal > 0 ? (actual / goal) * 100 : 0;
        
        tbodyHTML += `<tr class="tr-habit-row" data-habit-id="${habit.id}">`;
        
        // Habit Name Label (Sticky Left)
        tbodyHTML += `
            <td class="td-habit-label">
                <div class="habit-label-content">
                    <span class="habit-emoji">${habit.emoji}</span>
                    <span class="habit-text" title="${habit.name}">${habit.name}</span>
                </div>
            </td>
        `;
        
        // 31 days checkboxes
        for (let d = 1; d <= daysInMonth; d++) {
            const isChecked = habitLogs[d] === true;
            const weekday = weekdays[d-1];
            const isWeekend = (weekday === 'Su' || weekday === 'Sa');
            const isToday = (isCurrentMonthYear && d === todayDay);
            const isTodayLeft = (isCurrentMonthYear && d === todayDay - 1);
            
            let cellClass = 'td-checkbox-cell';
            if (!isChecked) cellClass += ' unchecked';
            if (isWeekend) cellClass += ' weekend';
            if (isToday) cellClass += ' today-col';
            if (isTodayLeft) cellClass += ' today-left-col';
            
            tbodyHTML += `
                <td class="${cellClass}" data-day="${d}" onclick="toggleCell('${habit.id}', ${d})">
                    <input type="checkbox" class="custom-chk" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); toggleCell('${habit.id}', ${d});" />
                </td>
            `;
        }
        
        // Analysis metrics (Sticky Right? No, let them follow the row, styled nicely)
        tbodyHTML += `<td class="td-analysis-val">${goal}</td>`;
        tbodyHTML += `<td class="td-analysis-val" id="actual-${habit.id}">${actual}</td>`;
        tbodyHTML += `<td class="td-analysis-val" id="left-${habit.id}">${left}</td>`;
        
        // Progress mini-bar
        tbodyHTML += `
            <td class="td-analysis-bar-cell">
                <div class="cell-progress-bar-wrapper">
                    <div class="cell-progress-bar" id="bar-${habit.id}" style="width: ${pct}%"></div>
                </div>
            </td>
        `;
        
        // Percentage text
        tbodyHTML += `<td class="td-analysis-pct" id="pct-${habit.id}">${pct.toFixed(0)}%</td>`;
        
        tbodyHTML += `</tr>`;
    });
    
    table.querySelector('tbody').innerHTML = tbodyHTML;
}

// Toggle a checkbox cell in the spreadsheet
window.toggleCell = function(habitId, day) {
    const month = state.currentMonth;
    if (!state.logs[month]) {
        state.logs[month] = { wellness: {} };
    }
    if (!state.logs[month][habitId]) {
        state.logs[month][habitId] = {};
    }
    
    // Toggle
    const current = state.logs[month][habitId][day] === true;
    state.logs[month][habitId][day] = !current;
    
    saveState();
    
    // Dynamic recalculation of this habit's row (avoid full DOM re-render for performance & focus)
    const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);
    const habitLogs = state.logs[month][habitId] || {};
    let actual = 0;
    for (let d = 1; d <= daysInMonth; d++) {
        if (habitLogs[d] === true) {
            actual++;
        }
    }
    const left = daysInMonth - actual;
    const pct = (actual / daysInMonth) * 100;
    
    // Update Row cells
    document.getElementById(`actual-${habitId}`).innerText = actual;
    document.getElementById(`left-${habitId}`).innerText = left;
    document.getElementById(`bar-${habitId}`).style.width = `${pct}%`;
    document.getElementById(`pct-${habitId}`).innerText = `${pct.toFixed(0)}%`;
    
    // Update Checkbox Visual Container
    const row = document.querySelector(`.tr-habit-row[data-habit-id="${habitId}"]`);
    if (row) {
        const cell = row.querySelector(`td[data-day="${day}"]`);
        if (cell) {
            const chk = cell.querySelector('.custom-chk');
            const newVal = !current;
            chk.checked = newVal;
            if (newVal) {
                cell.classList.remove('unchecked');
                triggerFireworks();
            } else {
                cell.classList.add('unchecked');
            }
        }
    }
    
    // Recalculate other components (charts & top stats)
    const stats = calculateStats(daysInMonth);
    document.getElementById('goal-stat').innerText = stats.goal;
    document.getElementById('completed-stat').innerText = stats.completed;
    document.getElementById('left-stat').innerText = stats.left;
    updateDonutChart(stats.percentage);
    
    // Re-draw SVG charts
    const weekdays = getWeekdayLabelsForMonth(state.currentYear, state.currentMonth);
    renderDailyProgressChart(daysInMonth, weekdays);
    renderWeeklyProgressChart(daysInMonth);
    
    // Update leaderboard & wellness lists since metrics updated
    renderTopHabitsList();
};

// Render Wellness Table
function renderWellnessGrid(daysInMonth) {
    const container = document.getElementById('wellness-grid-container');
    const month = state.currentMonth;
    
    if (!state.logs[month]) {
        state.logs[month] = { wellness: {} };
    }
    if (!state.logs[month].wellness) {
        state.logs[month].wellness = {};
    }
    
    const wellnessLogs = state.logs[month].wellness;
    
    let html = `<table class="wellness-table">`;
    
    // Row 1: Header Day Numbers
    const today = new Date();
    const isCurrentMonthYear = (state.currentMonth === today.getMonth() && state.currentYear === today.getFullYear());
    const todayDay = today.getDate();

    html += `<tr>`;
    html += `<th class="th-well-title">Wellness</th>`;
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = (isCurrentMonthYear && d === todayDay);
        const isTodayLeft = (isCurrentMonthYear && d === todayDay - 1);
        html += `<th class="td-well-day ${isToday ? 'today' : ''} ${isTodayLeft ? 'today-left-col' : ''}">${d}</th>`;
    }
    html += `</tr>`;
    
    // Row 2: Mood Selector
    html += `<tr>`;
    html += `<td class="td-well-label">Mood</td>`;
    for (let d = 1; d <= daysInMonth; d++) {
        const entry = wellnessLogs[d] || {};
        const moodEmoji = entry.mood || '';
        const isToday = (isCurrentMonthYear && d === todayDay);
        const isTodayLeft = (isCurrentMonthYear && d === todayDay - 1);
        
        html += `
            <td class="td-well-cell ${isToday ? 'today-col' : ''} ${isTodayLeft ? 'today-left-col' : ''}" id="mood-cell-${d}" onclick="toggleMoodPopover(event, ${d})" style="cursor: pointer; padding: 0 !important;">
                <div class="mood-select-wrapper">
                    ${moodEmoji}
                    <div class="mood-popover" id="mood-popover-${d}">
                        <span class="mood-option" onclick="selectMood(event, ${d}, '🔥')">🔥</span>
                        <span class="mood-option" onclick="selectMood(event, ${d}, '😀')">😀</span>
                        <span class="mood-option" onclick="selectMood(event, ${d}, '🙂')">🙂</span>
                        <span class="mood-option" onclick="selectMood(event, ${d}, '😐')">😐</span>
                        <span class="mood-option" onclick="selectMood(event, ${d}, '😢')">😢</span>
                    </div>
                </div>
            </td>
        `;
    }
    html += `</tr>`;
    
    // Row 3: Sleep Hours
    html += `<tr>`;
    html += `<td class="td-well-label">Hours of Sleep</td>`;
    for (let d = 1; d <= daysInMonth; d++) {
        const entry = wellnessLogs[d] || {};
        const sleepHours = entry.sleep !== undefined ? entry.sleep : '';
        const isToday = (isCurrentMonthYear && d === todayDay);
        const isTodayLeft = (isCurrentMonthYear && d === todayDay - 1);
        
        html += `
            <td class="td-well-cell sleep-input-cell ${isToday ? 'today-col' : ''} ${isTodayLeft ? 'today-left-col' : ''}">
                <input type="number" step="0.5" min="0" max="24" value="${sleepHours}" placeholder="-" onchange="updateSleep(${d}, this.value)" />
            </td>
        `;
    }
    html += `</tr>`;
    
    html += `</table>`;
    container.innerHTML = html;
}

// Open/Close mood popover
let activeMoodPopover = null;
window.toggleMoodPopover = function(event, day) {
    event.stopPropagation();
    
    // Close other popovers
    if (activeMoodPopover && activeMoodPopover !== day) {
        const prevPopover = document.getElementById(`mood-popover-${activeMoodPopover}`);
        if (prevPopover) prevPopover.classList.remove('active');
    }
    
    const popover = document.getElementById(`mood-popover-${day}`);
    if (popover) {
        popover.classList.toggle('active');
        if (popover.classList.contains('active')) {
            activeMoodPopover = day;
            
            // Auto close on external click
            const closeHandler = () => {
                popover.classList.remove('active');
                document.removeEventListener('click', closeHandler);
                activeMoodPopover = null;
            };
            setTimeout(() => {
                document.addEventListener('click', closeHandler);
            }, 50);
        } else {
            activeMoodPopover = null;
        }
    }
};

// Select Mood emoji
window.selectMood = function(event, day, emoji) {
    event.stopPropagation();
    const month = state.currentMonth;
    
    if (!state.logs[month].wellness[day]) {
        state.logs[month].wellness[day] = {};
    }
    
    state.logs[month].wellness[day].mood = emoji;
    saveState();
    
    // Update cell text
    const cell = document.getElementById(`mood-cell-${day}`);
    if (cell) {
        // Clear all text except the popover div
        const popoverHTML = cell.querySelector('.mood-popover').outerHTML;
        cell.innerHTML = `${emoji} ${popoverHTML}`;
    }
    
    showToast(`Đã ghi nhận tâm trạng ngày ${day}: ${emoji}`);
};

// Update Sleep hours
window.updateSleep = function(day, value) {
    const month = state.currentMonth;
    if (!state.logs[month].wellness[day]) {
        state.logs[month].wellness[day] = {};
    }
    
    const hours = parseFloat(value);
    state.logs[month].wellness[day].sleep = isNaN(hours) ? '' : hours;
    saveState();
    showToast(`Đã lưu số giờ ngủ ngày ${day}: ${value} giờ`);
};

// Render Top Habits List
function renderTopHabitsList() {
    const list = document.getElementById('top-habits-list');
    const month = state.currentMonth;
    const monthLogs = state.logs[month] || {};
    const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);
    
    // Calculate percentages for each habit
    const ratedHabits = state.habits.map(habit => {
        const habitLogs = monthLogs[habit.id] || {};
        let actual = 0;
        for (let d = 1; d <= daysInMonth; d++) {
            if (habitLogs[d] === true) {
                actual++;
            }
        }
        const pct = daysInMonth > 0 ? (actual / daysInMonth) * 100 : 0;
        return {
            ...habit,
            pct: pct
        };
    });
    
    // Sort descending by completion percentage
    ratedHabits.sort((a, b) => b.pct - a.pct);
    
    // Render top 10 (or all if less than 10)
    let html = ``;
    const renderCount = Math.min(10, ratedHabits.length);
    
    for (let i = 0; i < renderCount; i++) {
        const habit = ratedHabits[i];
        html += `
            <li class="top-habit-item">
                <div class="top-habit-left">
                    <span class="top-habit-rank">${i + 1}</span>
                    <div class="top-habit-detail">
                        <span class="top-habit-emoji">${habit.emoji}</span>
                        <span class="top-habit-name">${habit.name}</span>
                    </div>
                </div>
                <div class="top-habit-right">
                    <div class="top-habit-pct-bar">
                        <div class="top-habit-pct-fill" style="width: ${habit.pct}%"></div>
                    </div>
                    <span class="top-habit-pct">${habit.pct.toFixed(0)}%</span>
                </div>
            </li>
        `;
    }
    
    list.innerHTML = html;
}

// Render Habit list in the Settings drawer
function renderManageHabits() {
    const list = document.getElementById('manage-habits-list');
    let html = ``;
    
    state.habits.forEach((habit, idx) => {
        html += `
            <li class="manage-habit-item">
                <div class="manage-habit-info">
                    <span class="manage-habit-name">${habit.name}</span>
                </div>
                <button class="delete-habit-btn" onclick="deleteHabit('${habit.id}', '${habit.name}')" aria-label="Delete ${habit.name}">
                    Xóa
                </button>
            </li>
        `;
    });
    
    list.innerHTML = html;
}

// Delete Habit handler
window.deleteHabit = function(id, name) {
    if (confirm(`Bạn có chắc chắn muốn xoá thói quen "${name}"? Tất cả lịch sử điền thói quen này sẽ bị xoá.`)) {
        // Remove from state list
        state.habits = state.habits.filter(h => h.id !== id);
        
        // Remove from logs
        Object.keys(state.logs).forEach(m => {
            if (state.logs[m][id]) {
                delete state.logs[m][id];
            }
        });
        
        saveState();
        renderAll();
        renderManageHabits();
        showToast(`Đã xoá thói quen "${name}"`, true);
    }
};

// Render Daily Schedule Timeline
function renderSchedule() {
    const timeline = document.getElementById('schedule-timeline');
    if (!timeline) return;
    
    const scheduleItems = state.schedule || [];
    
    let html = ``;
    if (scheduleItems.length === 0) {
        html = `<div class="empty-schedule" style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding: 2rem 0;">Chưa có hoạt động nào. Hãy bấm "Quản lý" để tạo thời gian biểu!</div>`;
    } else {
        // Sắp xếp các mốc giờ tăng dần
        const sortedItems = [...scheduleItems].sort((a, b) => a.time.localeCompare(b.time));
        
        sortedItems.forEach(item => {
            html += `
                <div class="timeline-item">
                    <div class="timeline-time-badge">${item.time}</div>
                    <div class="timeline-content">
                        <span class="timeline-emoji">${item.emoji}</span>
                        <span class="timeline-activity">${item.activity}</span>
                    </div>
                </div>
            `;
        });
    }
    
    timeline.innerHTML = html;
}

// Render danh sách hoạt động trong modal chỉnh sửa
function renderScheduleEditList() {
    const list = document.getElementById('schedule-edit-list');
    if (!list) return;
    
    const scheduleItems = state.schedule || [];
    const sortedItems = [...scheduleItems].sort((a, b) => a.time.localeCompare(b.time));
    
    const countBadge = document.getElementById('sched-count-badge');
    if (countBadge) {
        countBadge.innerText = `${sortedItems.length} hoạt động`;
    }
    
    let html = ``;
    if (sortedItems.length === 0) {
        html = `<li style="text-align:center; color:var(--text-muted); font-size:0.88rem; padding:1.5rem 0;">Chưa có mốc hoạt động nào. Hãy nhập khung giờ và tên hoạt động ở trên để tạo thời gian biểu!</li>`;
    } else {
        sortedItems.forEach(item => {
            const escapedAct = (item.activity || '').replace(/'/g, "\\'");
            html += `
                <li class="schedule-edit-item">
                    <div class="sched-edit-info">
                        <span class="sched-edit-time">${item.time}</span>
                        <span class="sched-edit-act">${item.activity}</span>
                    </div>
                    <button class="delete-sched-btn" onclick="deleteScheduleItem('${item.id}', '${escapedAct}')" aria-label="Xoá hoạt động">
                        Xóa
                    </button>
                </li>
            `;
        });
    }
    list.innerHTML = html;
}

// Xoá mốc thời gian biểu toàn cục
window.deleteScheduleItem = function(id, activityName) {
    if (confirm(`Bạn có chắc chắn muốn xoá mốc thời gian "${activityName}"?`)) {
        state.schedule = (state.schedule || []).filter(item => item.id !== id);
        saveState();
        renderSchedule();
        renderScheduleEditList();
        showToast(`Đã xoá mốc thời gian "${activityName}"`, true);
    }
};

// Start application
window.addEventListener('load', init);
// Handle window resize for SVG re-draw
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);
        const weekdays = getWeekdayLabelsForMonth(state.currentYear, state.currentMonth);
        renderDailyProgressChart(daysInMonth, weekdays);
        renderWeeklyProgressChart(daysInMonth);
    }, 150);
});

// --- AI CHATBOT FUNCTIONALITY ---
(function() {
    const trigger = document.getElementById('chatbot-trigger');
    const panel = document.getElementById('chatbot-panel');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const chatForm = document.getElementById('chatbot-input-form');
    const chatInput = document.getElementById('chatbot-input');
    const chatMessages = document.getElementById('chatbot-messages');

    // Toggle Chat Panel
    trigger.addEventListener('click', () => {
        panel.classList.toggle('active');
        // Hide badge when opened
        const pulse = trigger.querySelector('.chatbot-pulse');
        if (pulse) pulse.style.display = 'none';
        scrollToBottom();
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
    });

    // Helper to open AI Coach from anywhere in the app
    window.openAICoachChat = function(initialMessage = '') {
        panel.classList.add('active');
        const pulse = trigger.querySelector('.chatbot-pulse');
        if (pulse) pulse.style.display = 'none';
        scrollToBottom();
        if (chatInput) {
            if (initialMessage) chatInput.value = initialMessage;
            chatInput.focus();
        }
    };

    // Submit Custom Message
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        
        appendChatMessage('user', text);
        chatInput.value = '';
        
        processChatbotResponse(text);
    });

    // File / Image upload for AI Schedule & TODO Generator
    const chatFileInput = document.getElementById('chatbot-file-input');
    if (chatFileInput) {
        chatFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            appendChatMessage('user', `📎 Đã gửi file thời khóa biểu: **${file.name}**`);
            
            // Add typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message coach typing';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerText = 'AI Assistant đang đọc và phân tích file thời khóa biểu...';
            chatMessages.appendChild(typingDiv);
            scrollToBottom();
            
            const ext = file.name.split('.').pop().toLowerCase();
            
            try {
                if (ext === 'xlsx' || ext === 'xls') {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        try {
                            const data = new Uint8Array(evt.target.result);
                            const workbook = XLSX.read(data, { type: 'array' });
                            const firstSheetName = workbook.SheetNames[0];
                            const worksheet = workbook.Sheets[firstSheetName];
                            const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                            
                            const extracted = extractScheduleFromExcelRows(rawRows);
                            const indicator = document.getElementById('typing-indicator');
                            if (indicator) indicator.remove();
                            
                            if (extracted && extracted.length > 0) {
                                const todayDay = new Date().getDay();
                                const todayItems = extracted.filter(it => it.day === todayDay || it.isToday);
                                const targetItems = todayItems.length > 0 ? todayItems : extracted;
                                
                                const now = new Date();
                                const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                
                                const parsedForState = targetItems.map(it => {
                                    let endH = 11, endM = 30;
                                    const rangeMatch = (it.time || '').match(/-?\s*(\d{1,2})[:h](\d{1,2})/);
                                    if (rangeMatch) {
                                        endH = parseInt(rangeMatch[1], 10);
                                        endM = parseInt(rangeMatch[2], 10);
                                    }
                                    return {
                                        time: it.time,
                                        emoji: it.emoji || '🏫',
                                        activity: it.activity,
                                        todoTitle: `Dự lớp: ${it.activity}`,
                                        deadline: `${todayStr}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
                                    };
                                });
                                
                                const reply = applyScheduleAndTodosToState(parsedForState);
                                appendChatMessage('coach', reply);
                            } else {
                                appendChatMessage('coach', '⚠️ Không tìm thấy môn học nào trong file Excel. Vui lòng kiểm tra lại cấu trúc file!');
                            }
                        } catch (err) {
                            console.error(err);
                            const indicator = document.getElementById('typing-indicator');
                            if (indicator) indicator.remove();
                            appendChatMessage('coach', `❌ Lỗi đọc file Excel: ${err.message}`);
                        }
                    };
                    reader.readAsArrayBuffer(file);
                } else if (ext === 'csv' || ext === 'txt') {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        const indicator = document.getElementById('typing-indicator');
                        if (indicator) indicator.remove();
                        const parsed = extractScheduleAndTodosFromText(evt.target.result);
                        if (parsed && parsed.length > 0) {
                            const reply = applyScheduleAndTodosToState(parsed);
                            appendChatMessage('coach', reply);
                        } else {
                            appendChatMessage('coach', '⚠️ Không nhận diện được khung giờ và môn học trong file văn bản.');
                        }
                    };
                    reader.readAsText(file);
                } else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext) || file.type.startsWith('image/')) {
                    if (typeof Tesseract === 'undefined') {
                        const indicator = document.getElementById('typing-indicator');
                        if (indicator) indicator.remove();
                        appendChatMessage('coach', '⚠️ Thư viện nhận diện ảnh Tesseract chưa sẵn sàng.');
                        return;
                    }
                    Tesseract.recognize(file, 'vie+eng', {
                        logger: m => {
                            if (m.status === 'recognizing text') {
                                const ind = document.getElementById('typing-indicator');
                                if (ind) ind.innerText = `Đang nhận diện chữ từ ảnh (${Math.round((m.progress || 0) * 100)}%)...`;
                            }
                        }
                    }).then(({ data: { text } }) => {
                        const indicator = document.getElementById('typing-indicator');
                        if (indicator) indicator.remove();
                        
                        const parsed = extractScheduleAndTodosFromText(text);
                        if (parsed && parsed.length > 0) {
                            const reply = applyScheduleAndTodosToState(parsed);
                            appendChatMessage('coach', reply);
                        } else {
                            appendChatMessage('coach', `🔍 Đã đọc ảnh nhưng chưa phân tích được giờ học cụ thể. Nội dung trích xuất:\n\n*${text.slice(0, 150)}...*\n\nBạn có thể nhắn trực tiếp theo cú pháp: \`Sáng 7h-9h30 học Giải tích 2, Chiều 13h30-16h thực hành Vi điều khiển\`.`);
                        }
                    }).catch(err => {
                        console.error(err);
                        const indicator = document.getElementById('typing-indicator');
                        if (indicator) indicator.remove();
                        appendChatMessage('coach', '❌ Lỗi nhận diện ảnh: ' + err.message);
                    });
                } else if (ext === 'pdf') {
                    const reader = new FileReader();
                    reader.onload = async function(evt) {
                        try {
                            const typedarray = new Uint8Array(evt.target.result);
                            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
                            const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                            let fullText = '';
                            const numPages = Math.min(pdf.numPages, 3);
                            for (let i = 1; i <= numPages; i++) {
                                const page = await pdf.getPage(i);
                                const content = await page.getTextContent();
                                fullText += content.items.map(it => it.str).join(' ') + '\n';
                            }
                            const indicator = document.getElementById('typing-indicator');
                            if (indicator) indicator.remove();
                            
                            const parsed = extractScheduleAndTodosFromText(fullText);
                            if (parsed && parsed.length > 0) {
                                const reply = applyScheduleAndTodosToState(parsed);
                                appendChatMessage('coach', reply);
                            } else {
                                appendChatMessage('coach', '⚠️ Không tìm thấy khung giờ trong file PDF.');
                            }
                        } catch (err) {
                            const indicator = document.getElementById('typing-indicator');
                            if (indicator) indicator.remove();
                            appendChatMessage('coach', '❌ Lỗi đọc file PDF: ' + err.message);
                        }
                    };
                    reader.readAsArrayBuffer(file);
                } else {
                    const indicator = document.getElementById('typing-indicator');
                    if (indicator) indicator.remove();
                    appendChatMessage('coach', '⚠️ Định dạng file không hỗ trợ! Vui lòng chọn file Excel, Ảnh (JPG/PNG), PDF hoặc TXT.');
                }
            } catch (error) {
                console.error(error);
                const indicator = document.getElementById('typing-indicator');
                if (indicator) indicator.remove();
                appendChatMessage('coach', '❌ Đã xảy ra lỗi: ' + error.message);
            }
            
            chatFileInput.value = '';
        });
    }

    // Suggestion Chips Click
    document.querySelectorAll('.chip-btn').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            appendChatMessage('user', prompt);
            processChatbotResponse(prompt);
        });
    });

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendChatMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        msgDiv.innerHTML = formatMarkdown(text);
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
        return msgDiv;
    }

    function formatMarkdown(text) {
        if (!text) return '';
        if (text.includes('class="chat-schedule-card"') || text.includes('class="chat-lesson-card"')) {
            return text;
        }
        let html = text;
        html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(139, 92, 246, 0.15); color: var(--accent-primary); padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 0.85em;">$1</code>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/^\*\s+(.+)$/gm, '• $1');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function escapeHtmlLocal(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Schedule & TODO NLP extractor
    function extractScheduleAndTodosFromText(text) {
        if (!text || typeof text !== 'string') return [];
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        let segments = [];
        const lines = text.split(/[\r\n]+/);
        lines.forEach(line => {
            line = line.trim();
            if (!line) return;
            const parts = line.split(/(?:[,;\t]+|\s{2,}|\s+(?=(?<![-–—to]\s*)(?:tiết\s*\d|\d{1,2}(?:[hH]\d{0,2}|:\d{2}))))/i);
            if (parts.length > 1) {
                parts.forEach(p => { if (p.trim()) segments.push(p.trim()); });
            } else {
                segments.push(line);
            }
        });

        const results = [];
        function guessEmoji(name) {
            const lower = name.toLowerCase();
            if (/toán|giải tích|đại số|xác suất|hình học/i.test(lower)) return '📐';
            if (/lập trình|code|python|java|c\+\+|javascript|web|cntt|vi điều khiển|nhúng|mạng|database|cơ sở dữ liệu|sql|stm32/i.test(lower)) return '💻';
            if (/tiếng anh|english|toeic|ielts|ngữ pháp|từ vựng/i.test(lower)) return '🇬🇧';
            if (/gym|chạy|chạy bộ|workout|thể thao|thể dục|yoga|bơi/i.test(lower)) return '🏋️';
            if (/họp|meeting|thảo luận|nhóm|trao đổi/i.test(lower)) return '👥';
            if (/đọc sách|sách|reading|nghiên cứu tài liệu/i.test(lower)) return '📖';
            if (/bài tập|đồ án|btl|bài tập lớn|tiểu luận|homework|task|báo cáo/i.test(lower)) return '📝';
            if (/ăn|cơm|trưa|tối|nghỉ|relax/i.test(lower)) return '🥪';
            if (/ngủ|sleep/i.test(lower)) return '💤';
            return '🏫';
        }

        const periodTimes = {
            1: { start: '07:00', end: '07:50', sh: 7, sm: 0, eh: 7, em: 50 },
            2: { start: '07:50', end: '08:40', sh: 7, sm: 50, eh: 8, em: 40 },
            3: { start: '08:50', end: '09:40', sh: 8, sm: 50, eh: 9, em: 40 },
            4: { start: '09:50', end: '10:40', sh: 9, sm: 50, eh: 10, em: 40 },
            5: { start: '10:40', end: '11:30', sh: 10, sm: 40, eh: 11, em: 30 },
            6: { start: '12:30', end: '13:20', sh: 12, sm: 30, eh: 13, em: 20 },
            7: { start: '13:20', end: '14:10', sh: 13, sm: 20, eh: 14, em: 10 },
            8: { start: '14:20', end: '15:10', sh: 14, sm: 20, eh: 15, em: 10 },
            9: { start: '15:20', end: '16:10', sh: 15, sm: 20, eh: 16, em: 10 },
            10: { start: '16:10', end: '17:00', sh: 16, sm: 10, eh: 17, em: 0 },
            11: { start: '17:30', end: '18:20', sh: 17, sm: 30, eh: 18, em: 20 },
            12: { start: '18:20', end: '19:10', sh: 18, sm: 20, eh: 19, em: 10 }
        };

        for (let seg of segments) {
            seg = seg.trim();
            if (!seg) continue;
            let startH = null, startM = 0, endH = null, endM = 0;
            let timeStr = '';
            let actName = seg;
            let session = null;
            if (/\b(?:sáng|morning)\b/i.test(seg)) session = 'morning';
            else if (/\b(?:chiều|afternoon)\b/i.test(seg)) session = 'afternoon';
            else if (/\b(?:tối|đêm|evening|night)\b/i.test(seg)) session = 'evening';

            // 1. Period format: "Tiết 1-3", "Tiết 7-9"
            const periodMatch = seg.match(/\btiết\s*(\d{1,2})(?:\s*(?:-|–|—|đến|to)\s*(\d{1,2}))?/i);
            if (periodMatch) {
                const pStart = parseInt(periodMatch[1], 10);
                const pEnd = periodMatch[2] ? parseInt(periodMatch[2], 10) : pStart;
                if (periodTimes[pStart] && periodTimes[pEnd]) {
                    startH = periodTimes[pStart].sh;
                    startM = periodTimes[pStart].sm;
                    endH = periodTimes[pEnd].eh;
                    endM = periodTimes[pEnd].em;
                    timeStr = `${periodTimes[pStart].start} - ${periodTimes[pEnd].end}`;
                } else {
                    timeStr = `Tiết ${pStart}-${pEnd}`;
                    startH = pStart <= 5 ? 7 : (pStart <= 10 ? 13 : 18);
                    endH = pEnd <= 5 ? 11 : (pEnd <= 10 ? 16 : 21);
                }
                actName = seg.replace(periodMatch[0], '').trim();
            }

            // 2. Time range format: "7h-9h30", "13h30-16h", "07:30 - 09:30"
            if (!timeStr) {
                const rangeMatch = seg.match(/(\d{1,2})(?:[hH](\d{1,2})?|:(\d{2}))?\s*(?:-|–|—|đến|to)\s*(\d{1,2})(?:[hH](\d{1,2})?|:(\d{2}))?/i);
                if (rangeMatch) {
                    let sh = parseInt(rangeMatch[1], 10);
                    let sm = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : (rangeMatch[3] ? parseInt(rangeMatch[3], 10) : 0);
                    let eh = parseInt(rangeMatch[4], 10);
                    let em = rangeMatch[5] ? parseInt(rangeMatch[5], 10) : (rangeMatch[6] ? parseInt(rangeMatch[6], 10) : 0);
                    
                    if (session === 'afternoon' || session === 'evening') {
                        if (sh < 12) sh += 12;
                        if (eh < 12) eh += 12;
                    } else {
                        if (eh < sh && eh < 12) eh += 12;
                    }
                    startH = sh; startM = sm; endH = eh; endM = em;
                    timeStr = `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')} - ${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
                    actName = seg.replace(rangeMatch[0], '').trim();
                }
            }

            // 3. Single time format: "7h", "19h", "14h30", "08:00"
            if (!timeStr) {
                const singleMatch = seg.match(/(?:(?:lúc|vào|tầm)\s+)?(\d{1,2})(?:[hH](\d{1,2})?|:(\d{2}))/i);
                if (singleMatch && !/thứ\s*\d/i.test(singleMatch[0])) {
                    let h = parseInt(singleMatch[1], 10);
                    let m = singleMatch[2] ? parseInt(singleMatch[2], 10) : (singleMatch[3] ? parseInt(singleMatch[3], 10) : 0);
                    if ((session === 'afternoon' || session === 'evening') && h < 12) {
                        h += 12;
                    } else if (h < 6 && (session === 'afternoon' || session === 'evening' || h <= 5)) {
                        h += 12;
                    }
                    startH = h; startM = m;
                    endH = Math.min(23, h + 1);
                    endM = (m + 30) % 60;
                    if (m + 30 >= 60) endH = Math.min(23, endH + 1);
                    timeStr = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')} - ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
                    actName = seg.replace(singleMatch[0], '').trim();
                }
            }

            if (!timeStr) continue;

            actName = actName.replace(/^(?:sáng|chiều|tối|đêm|morning|afternoon|evening)\s+/i, '');
            actName = actName.replace(/^[:\-\s•,;]+/, '').trim();
            actName = actName.replace(/[:\-\s•,;]+$/, '').trim();
            if (actName.startsWith('(') && actName.endsWith(')')) {
                actName = actName.slice(1, -1).trim();
            }
            actName = actName.replace(/^(?:học\s+môn|học|môn|thực\s+hành|làm\s+việc|ôn\s+tập|đi|làm)\s+/i, '');
            actName = actName.trim();

            let chosenEmoji = null;
            const emojiRegex = /^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|[\uD83E][\uDD10-\uDDFF])/;
            const emojiMatch = actName.match(emojiRegex);
            if (emojiMatch) {
                chosenEmoji = emojiMatch[1];
                actName = actName.replace(chosenEmoji, '').trim();
                actName = actName.replace(/^[:\-\s•]+/, '').trim();
            } else {
                chosenEmoji = guessEmoji(actName);
            }

            if (!actName || actName.length < 2) continue;
            actName = actName.charAt(0).toUpperCase() + actName.slice(1);
            const deadlineH = endH !== null ? endH : 21;
            const deadlineM = endM !== null ? endM : 0;
            const deadlineStr = `${todayStr}T${String(deadlineH).padStart(2, '0')}:${String(deadlineM).padStart(2, '0')}`;

            results.push({
                time: timeStr,
                emoji: chosenEmoji,
                activity: actName,
                todoTitle: `Hoàn thành: ${actName}`,
                deadline: deadlineStr
            });
        }
        return results;
    }

    // Apply parsed schedule and TODO items to global State
    function applyScheduleAndTodosToState(parsedItems) {
        if (!parsedItems || parsedItems.length === 0) return 'Không có mục nào để thêm.';
        
        if (!Array.isArray(state.schedule)) state.schedule = [];
        if (!Array.isArray(state.todos)) state.todos = [];
        
        let addedScheduleCount = 0;
        let addedTodoCount = 0;
        const addedList = [];
        
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        parsedItems.forEach(item => {
            const isDuplicateSched = state.schedule.some(s => 
                s.time === item.time && s.activity.toLowerCase() === item.activity.toLowerCase()
            );
            
            if (!isDuplicateSched) {
                const schedId = 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
                state.schedule.push({
                    id: schedId,
                    time: item.time,
                    emoji: item.emoji || '📌',
                    activity: item.activity
                });
                addedScheduleCount++;
            }
            
            const todoTitle = item.todoTitle || `Hoàn thành: ${item.activity}`;
            const isDuplicateTodo = state.todos.some(t => 
                t.title.toLowerCase() === todoTitle.toLowerCase() && !t.completed
            );
            
            let deadline = item.deadline;
            if (!deadline) {
                const rangeMatch = (item.time || '').match(/(\d{1,2})[:h](\d{2})?\s*(?:-|–|—|to|đến)\s*(\d{1,2})[:h](\d{2})?/i);
                let endH = 21, endM = 0;
                if (rangeMatch && rangeMatch[3]) {
                    endH = parseInt(rangeMatch[3], 10);
                    endM = rangeMatch[4] ? parseInt(rangeMatch[4], 10) : 0;
                } else {
                    const singleMatch = (item.time || '').match(/(\d{1,2})[:h](\d{2})?/i);
                    if (singleMatch) {
                        endH = Math.min(23, parseInt(singleMatch[1], 10) + 1);
                        endM = singleMatch[2] ? parseInt(singleMatch[2], 10) : 0;
                    }
                }
                deadline = `${todayStr}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
            }
            
            if (!isDuplicateTodo) {
                const todoId = 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
                state.todos.push({
                    id: todoId,
                    title: todoTitle,
                    description: `Tự động tạo từ Thời khóa biểu [${item.time}]`,
                    deadline: deadline,
                    completed: false,
                    category: 'study',
                    createdAt: new Date().toISOString()
                });
                addedTodoCount++;
            }
            
            addedList.push({
                time: item.time,
                emoji: item.emoji || '📌',
                activity: item.activity,
                deadline: deadline
            });
        });
        
        state.schedule.sort((a, b) => a.time.localeCompare(b.time));
        saveState();
        
        if (typeof renderSchedule === 'function') renderSchedule();
        if (typeof renderScheduleEditList === 'function') renderScheduleEditList();
        if (typeof renderTodos === 'function') renderTodos();
        if (typeof checkTodoDeadlines === 'function') checkTodoDeadlines();
        
        if (typeof triggerFireworks === 'function') triggerFireworks();
        
        let cardHtml = `<div class="chat-schedule-card">`;
        cardHtml += `<div class="chat-card-title">📅 Đã xếp lịch & tạo ${addedTodoCount} việc cần làm hôm nay!</div>`;
        cardHtml += `<div style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 0.6rem;">Đã đồng bộ tự động lên Thời gian biểu và Danh sách TODO của bạn:</div>`;
        
        addedList.forEach(item => {
            cardHtml += `
                <div class="chat-item-row">
                    <span class="chat-item-time">${escapeHtmlLocal(item.time)}</span>
                    <span class="chat-item-text"><strong>${item.emoji} ${escapeHtmlLocal(item.activity)}</strong></span>
                </div>
            `;
        });
        
        cardHtml += `
            <div class="chat-action-links">
                <button class="chat-nav-btn" onclick="switchAppTab('tasks'); document.getElementById('sec-schedule')?.scrollIntoView({behavior:'smooth'});">
                    📅 Xem Thời gian biểu
                </button>
                <button class="chat-nav-btn" onclick="switchAppTab('tasks'); document.getElementById('sec-todo')?.scrollIntoView({behavior:'smooth'});">
                    ✅ Xem Việc cần làm
                </button>
            </div>
        </div>`;
        
        return cardHtml;
    }

    // AI Course Curriculum & Lesson Generator
    function generateCourseLessonAI(prompt) {
        const activeCourse = typeof getActiveCourse === 'function' ? getActiveCourse() : null;
        if (!activeCourse) return 'Không tìm thấy thông tin khóa học hiện tại.';

        const promptLower = prompt.toLowerCase();
        let newLesson = null;
        let companionResource = null;

        // Knowledge repository by course type
        if (activeCourse.id === 'course_control_systems' || promptLower.includes('điều khiển') || promptLower.includes('kalman') || promptLower.includes('pid') || promptLower.includes('bode')) {
            if (promptLower.includes('kalman')) {
                newLesson = {
                    id: 'cls_ai_' + Date.now(),
                    stt: (activeCourse.lessons || []).length + 1,
                    phase: 'Chặng 2',
                    module: 'Optimal Control & Estimation',
                    title: 'Bộ lọc Kalman tuyến tính (Kalman Filter) & Ứng dụng ước lượng trạng thái',
                    url: 'https://www.youtube.com/watch?v=mwn8xhgNpFY',
                    completed: false,
                    attendanceLogs: []
                };
                companionResource = {
                    id: 'res_ai_' + Date.now(),
                    title: 'Tài liệu & MATLAB Code: Kalman Filter Tutorial - MathWorks',
                    type: 'Source Code / Lab',
                    url: 'https://www.mathworks.com/videos/series/understanding-kalman-filters.html'
                };
            } else if (promptLower.includes('bode') || promptLower.includes('nyquist') || promptLower.includes('tần số')) {
                newLesson = {
                    id: 'cls_ai_' + Date.now(),
                    stt: (activeCourse.lessons || []).length + 1,
                    phase: 'Chặng 1',
                    module: 'Frequency Domain Analysis',
                    title: 'Biểu đồ Bode, Biểu đồ Nyquist & Dự trữ độ ổn định biên/pha',
                    url: 'https://www.youtube.com/watch?v=CRvVDoQJjYI',
                    completed: false,
                    attendanceLogs: []
                };
                companionResource = {
                    id: 'res_ai_' + Date.now(),
                    title: 'Bảng tra cứu công thức biểu đồ Bode & Tiêu chuẩn Nyquist',
                    type: 'Cheat Sheet',
                    url: 'https://ctms.engin.umich.edu/CTMS/index.php?example=Introduction&section=ControlFrequency'
                };
            } else {
                newLesson = {
                    id: 'cls_ai_' + Date.now(),
                    stt: (activeCourse.lessons || []).length + 1,
                    phase: 'Chặng 2',
                    module: 'State Space & Observers',
                    title: 'Thiết kế Bộ quan sát trạng thái Luenberger Observer & Bộ điều khiển LQG',
                    url: 'https://www.youtube.com/watch?v=lRZmJBcg1ZA',
                    completed: false,
                    attendanceLogs: []
                };
                companionResource = {
                    id: 'res_ai_' + Date.now(),
                    title: 'Slide bài giảng State Space Observers - MIT OpenCourseWare',
                    type: 'Slide bài giảng',
                    url: 'https://ocw.mit.edu/'
                };
            }
        } else if (activeCourse.id === 'course_embedded_systems' || promptLower.includes('nhúng') || promptLower.includes('stm32') || promptLower.includes('freertos') || promptLower.includes('i2c')) {
            if (promptLower.includes('freertos') || promptLower.includes('rtos') || promptLower.includes('mutex')) {
                newLesson = {
                    id: 'cls_ai_' + Date.now(),
                    stt: (activeCourse.lessons || []).length + 1,
                    phase: 'Chặng 2: Giao thức truyền thông & FreeRTOS',
                    module: 'FreeRTOS nâng cao',
                    title: 'Đồng bộ hóa & Bảo vệ vùng tranh chấp: Mutex vs Binary Semaphore',
                    url: 'https://www.youtube.com/watch?v=F321087yYy4',
                    completed: false,
                    attendanceLogs: []
                };
                companionResource = {
                    id: 'res_ai_' + Date.now(),
                    title: 'FreeRTOS Mutex and Semaphore Hands-on Guide PDF',
                    type: 'PDF / Sách',
                    url: 'https://www.freertos.org/'
                };
            } else {
                newLesson = {
                    id: 'cls_ai_' + Date.now(),
                    stt: (activeCourse.lessons || []).length + 1,
                    phase: 'Chặng 1: Nền tảng ARM & Ngoại vi cơ bản',
                    module: 'Ngoại vi giao tiếp',
                    title: 'Giao thức I2C & Đọc cảm biến góc quay MPU6050 với STM32 HAL',
                    url: 'https://www.youtube.com/watch?v=6vC7c6Uo6gY',
                    completed: false,
                    attendanceLogs: []
                };
                companionResource = {
                    id: 'res_ai_' + Date.now(),
                    title: 'STM32 HAL I2C Driver & MPU6050 GitHub Library',
                    type: 'Source Code / Lab',
                    url: 'https://github.com/'
                };
            }
        } else {
            // Signal processing or generic
            newLesson = {
                id: 'cls_ai_' + Date.now(),
                stt: (activeCourse.lessons || []).length + 1,
                phase: activeCourse.phases && activeCourse.phases[0] ? activeCourse.phases[0].name : 'Chặng 1',
                module: 'Chủ đề chuyên sâu',
                title: prompt.length > 5 && !prompt.includes('Gợi ý') ? `Chuyên đề: ${prompt.replace(/^(?:thêm|soạn|gợi ý)\s+(?:bài\s+học\s+về|bài\s+học|tài\s+liệu)?/i, '').trim()}` : 'Thuật toán Biến đổi Fourier Nhanh (FFT) & Ứng dụng lọc nhiễu',
                url: 'https://www.youtube.com/watch?v=spUNpyF58BY',
                completed: false,
                attendanceLogs: []
            };
            companionResource = {
                id: 'res_ai_' + Date.now(),
                title: 'Tài liệu tham khảo chuyên đề & Python Code mẫu',
                type: 'Source Code / Lab',
                url: 'https://ocw.mit.edu/'
            };
        }

        // Add to active course
        if (!Array.isArray(activeCourse.lessons)) activeCourse.lessons = [];
        activeCourse.lessons.push(newLesson);

        if (companionResource) {
            if (!Array.isArray(activeCourse.resources)) activeCourse.resources = [];
            activeCourse.resources.push(companionResource);
        }

        saveState();
        if (typeof renderCourseraMini === 'function') renderCourseraMini();
        if (typeof triggerFireworks === 'function') triggerFireworks();

        let replyHtml = `<div class="chat-lesson-card">`;
        replyHtml += `<div class="chat-lesson-title">🎉 Đã tự động thêm bài học & tài liệu mới vào lộ trình!</div>`;
        replyHtml += `<div class="chat-lesson-meta">`;
        replyHtml += `📚 Khóa học: <strong>${escapeHtmlLocal(activeCourse.title)}</strong><br>`;
        replyHtml += `📌 Chặng: <strong>${escapeHtmlLocal(newLesson.phase)}</strong> • Module: <strong>${escapeHtmlLocal(newLesson.module)}</strong><br>`;
        replyHtml += `📖 Bài học: <strong>${escapeHtmlLocal(newLesson.title)}</strong><br>`;
        if (companionResource) {
            replyHtml += `📑 Tài liệu đính kèm: <em>${escapeHtmlLocal(companionResource.title)}</em> (${companionResource.type})`;
        }
        replyHtml += `</div>`;
        replyHtml += `
            <div class="chat-action-links">
                <button class="chat-nav-btn" onclick="switchAppTab('classroom'); document.getElementById('curriculum-table')?.scrollIntoView({behavior:'smooth'});">
                    👉 Xem trong Lớp học Coursera
                </button>
            </div>
        </div>`;

        return replyHtml;
    }

    async function processChatbotResponse(message) {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message coach typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerText = 'AI Assistant đang phân tích yêu cầu...';
        chatMessages.appendChild(typingDiv);
        scrollToBottom();

        setTimeout(() => {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();
            
            const reply = generateLocalCoachAdvice(message);
            appendChatMessage('coach', reply);
        }, 400);
    }

    function generateLocalCoachAdvice(message) {
        const msgLower = message.toLowerCase();

        // 1. Check if user asks for lesson suggestions or adding course content
        if (msgLower.includes('bài học') || msgLower.includes('lộ trình') || msgLower.includes('tài liệu') || msgLower.includes('khóa học') || msgLower.includes('kalman') || msgLower.includes('coursera')) {
            return generateCourseLessonAI(message);
        }

        // 2. Check if user provides schedule to extract
        const parsedSchedule = extractScheduleAndTodosFromText(message);
        if (parsedSchedule && parsedSchedule.length > 0) {
            return applyScheduleAndTodosToState(parsedSchedule);
        }

        // 3. User clicked schedule chip or asked how to schedule
        if (msgLower.includes('xếp lịch') || msgLower.includes('thời khóa biểu') || msgLower.includes('lên todo') || msgLower.includes('tkb')) {
            return `📅 **HƯỚNG DẪN XẾP LỊCH & LÊN TODO TỰ ĐỘNG:**\n\nBạn có thể gửi thời khóa biểu cho tôi bằng 2 cách:\n\n1. 📎 **Bấm biểu tượng kẹp giấy bên dưới** để tải file Excel (.xlsx), ảnh chụp TKB (JPG, PNG), PDF hoặc TXT.\n2. ✍️ **Nhắn trực tiếp cú pháp bất kỳ**, ví dụ:\n   * *'Sáng 7h-9h30 học Giải tích 2, Chiều 13h30-16h học Vi điều khiển, Tối 19h làm bài tập lớn'*\n   * *'Tiết 1-3: Cơ sở dữ liệu, Tiết 7-9: Mạng máy tính'*\n\nTôi sẽ phân tích ngay, nạp vào **Thời gian biểu** và tự sinh **TODO List kèm Deadline** chuẩn xác!`;
        }

        const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);
        const month = state.currentMonth;
        const monthLogs = state.logs[month] || {};
        
        let totalHabits = state.habits.length;
        let goalCount = totalHabits * daysInMonth;
        let actualCount = 0;
        
        let habitStats = [];
        state.habits.forEach(h => {
            const hLogs = monthLogs[h.id] || {};
            let count = 0;
            for (let d = 1; d <= daysInMonth; d++) {
                if (hLogs[d] === true) count++;
            }
            habitStats.push({ name: h.name, emoji: h.emoji, count: count });
            actualCount += count;
        });
        
        habitStats.sort((a, b) => b.count - a.count);
        const bestHabit = habitStats[0];
        const worstHabit = habitStats[habitStats.length - 1];
        
        const wellnessLogs = monthLogs.wellness || {};
        let sleepTotal = 0;
        let sleepDaysCount = 0;
        let moodCounts = {};
        
        for (let d = 1; d <= daysInMonth; d++) {
            const w = wellnessLogs[d] || {};
            if (w.sleep !== undefined && w.sleep !== '') {
                sleepTotal += parseFloat(w.sleep);
                sleepDaysCount++;
            }
            if (w.mood) {
                moodCounts[w.mood] = (moodCounts[w.mood] || 0) + 1;
            }
        }
        
        let sleepAvg = sleepDaysCount > 0 ? (sleepTotal / sleepDaysCount).toFixed(1) : 0;
        
        let dominantMood = 'Chưa ghi nhận';
        let maxMoodCount = 0;
        for (const [m, count] of Object.entries(moodCounts)) {
            if (count > maxMoodCount) {
                maxMoodCount = count;
                dominantMood = m;
            }
        }

        const pct = goalCount > 0 ? ((actualCount / goalCount) * 100).toFixed(0) : 0;
        
        if (msgLower.includes('phân tích') || msgLower.includes('tiến độ') || msgLower.includes('tổng quan')) {
            let advice = `📊 **BÁO CÁO PHÂN TÍCH TIẾN ĐỘ THÁNG NÀY**\n\n`;
            advice += `* **Tỷ lệ hoàn thành thói quen:** \`${pct}%\` (${actualCount}/${goalCount} lượt hoàn thành).\n`;
            
            if (bestHabit && bestHabit.count > 0) {
                advice += `* **Thói quen tốt nhất:** ${bestHabit.emoji} \`${bestHabit.name}\` (đã làm ${bestHabit.count} ngày). Bạn duy trì rất xuất sắc!\n`;
            }
            if (worstHabit && worstHabit.count < daysInMonth && worstHabit.name !== (bestHabit ? bestHabit.name : '')) {
                advice += `* **Cần cải thiện:** ${worstHabit.emoji} \`${worstHabit.name}\` (chỉ mới làm ${worstHabit.count} ngày). Hãy cố gắng tập trung thêm cho thói quen này nhé!\n`;
            }
            
            if (sleepAvg > 0) {
                advice += `* **Thời gian ngủ trung bình:** \`${sleepAvg} giờ/đêm\`. ${sleepAvg < 6 ? 'Bạn đang thiếu ngủ nhẹ đấy, hãy ngủ sớm hơn!' : 'Thời lượng ngủ rất tuyệt vời!'}\n`;
            }
            
            if (dominantMood !== 'Chưa ghi nhận') {
                advice += `* **Tâm trạng thường gặp:** ${dominantMood} (chiếm ${maxMoodCount} ngày).\n`;
            }
            
            advice += `\n**Lời khuyên:** Bạn đang có nền tảng rất tốt! Hãy tiếp tục duy trì đà kỷ luật này. Mỗi bước nhỏ mỗi ngày sẽ tạo nên sự thay đổi khổng lồ. Level up! 🚀`;
            return advice;
        }
        
        if (msgLower.includes('giấc ngủ') || msgLower.includes('sleep') || msgLower.includes('ngủ')) {
            let advice = `**TƯ VẤN SỨC KHỎE GIẤC NGỦ**\n\n`;
            if (sleepAvg > 0) {
                advice += `Thời gian ngủ trung bình hiện tại của bạn là **${sleepAvg} giờ/đêm**.\n\n`;
                if (sleepAvg < 6) {
                    advice += `⚠️ **Cảnh báo:** Bạn đang ngủ trung bình dưới 6 tiếng. Việc này ảnh hưởng lớn đến hiệu suất làm việc và sự tập trung của bạn.\n`;
                    advice += `👉 **Khuyến nghị của Coach:**\n`;
                    advice += `1. Đặt báo thức đi ngủ (Wind-down alarm) trước khi ngủ 30 phút.\n`;
                    advice += `2. Tránh xa màn hình điện thoại/máy tính ít nhất 20 phút trước khi ngủ.\n`;
                    advice += `3. Giữ phòng ngủ mát mẻ và tối hoàn toàn.`;
                } else if (sleepAvg >= 6 && sleepAvg <= 8) {
                    advice += `✨ **Nhận xét:** Giấc ngủ của bạn đang duy trì ở mức lý tưởng (6 - 8 tiếng). Cơ thể và trí não của bạn đang được phục hồi rất tốt.\n`;
                    advice += `👉 **Khuyến nghị của Coach:** Hãy duy trì lịch trình thức - ngủ cố định kể cả vào cuối tuần để giữ nhịp sinh học ổn định!`;
                } else {
                    advice += `**Nhận xét:** Giấc ngủ của bạn khá dài (trên 8 tiếng). Hãy đảm bảo chất lượng giấc ngủ sâu để không cảm thấy mệt mỏi vào ban ngày.`;
                }
            } else {
                advice += `Bạn chưa ghi nhận dữ liệu giấc ngủ nào trong tháng này. Hãy nhập số giờ ngủ ở bảng Sức khỏe & Tinh thần (Wellness) để tôi phân tích nhé!`;
            }
            return advice;
        }
        
        if (msgLower.includes('thời gian biểu') || msgLower.includes('lịch trình') || msgLower.includes('schedule') || msgLower.includes('timeline')) {
            let advice = `**PHÂN TÍCH THỜI GIAN BIỂU CỦA BẠN**\n\n`;
            const schedList = state.schedule || [];
            
            if (schedList.length > 0) {
                advice += `Lịch trình hàng ngày của bạn hiện có **${schedList.length} mốc thời gian** được thiết lập:\n\n`;
                
                schedList.forEach(item => {
                    advice += `* **[${item.time}]** ${item.emoji} *${item.activity}*\n`;
                });
                
                advice += `\n**Đánh giá cấu trúc ngày:**\n`;
                let hasGym = schedList.some(item => item.activity.toLowerCase().includes('gym') || item.activity.toLowerCase().includes('chạy') || item.activity.toLowerCase().includes('thể thao') || item.activity.toLowerCase().includes('tập'));
                let hasWork = schedList.some(item => item.activity.toLowerCase().includes('làm việc') || item.activity.toLowerCase().includes('dự án') || item.activity.toLowerCase().includes('work') || item.activity.toLowerCase().includes('học'));
                let hasMorning = schedList.some(item => item.time.includes('05:') || item.time.includes('06:') || item.time.includes('07:'));
                
                if (hasMorning) {
                    advice += `* ☀️ **Khởi đầu ngày mới**: Bạn bắt đầu ngày mới rất sớm và năng lượng.\n`;
                } else {
                    advice += `* ☀️ **Buổi sáng**: Lịch trình sáng chưa ghi nhận hoạt động cụ thể.\n`;
                }
                if (hasWork) {
                    advice += `* 💼 **Thời gian làm việc/Học tập**: Đã sắp xếp block tập trung hiệu quả.\n`;
                }
                if (hasGym) {
                    advice += `* 🏋️ **Vận động thể chất**: Tuyệt vời! Lịch trình có thời gian tập luyện rèn luyện sức bền.\n`;
                }
                advice += `\n👉 **Lời khuyên**: Hãy tuân thủ đúng khung giờ đã đặt ra để tạo tính kỷ luật kiên định!`;
            } else {
                advice += `Hiện tại bạn chưa ghi nhận hoạt động thời gian biểu nào. Hãy bấm vào nút **Quản lý** trên tab Lịch & Việc để thiết lập lịch trình nhé!`;
            }
            return advice;
        }
        
        if (msgLower.includes('động lực') || msgLower.includes('motivation') || msgLower.includes('kỷ luật')) {
            const quotes = [
                "“Kỷ luật là cầu nối giữa mục tiêu và thành tựu.” — Jim Rohn",
                "“Chúng ta là những gì chúng ta thường xuyên làm. Sự xuất sắc, vì thế, không phải là một hành động mà là một thói quen.” — Aristotle",
                "“Động lực giúp bạn bắt đầu. Thói quen giữ cho bạn tiếp tục.” — Jim Ryun",
                "“Thành công không phải là chìa khóa mở cánh cửa hạnh phúc. Hạnh phúc mới là chìa khóa dẫn tới thành công.” — Albert Schweitzer",
                "“Đừng đếm ngày trôi qua, hãy làm cho những ngày trôi qua có ý nghĩa.” — Muhammad Ali"
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            return `**ĐỘNG LỰC HÔM NAY CHO BẠN:**\n\n${randomQuote}\n\n*Hôm nay là một ngày mới, cơ hội mới để bạn hoàn thành các mục tiêu của mình. Bắt đầu ngay thôi!*`;
        }
        
        return `Tôi đã nhận được câu hỏi từ bạn. Bạn có thể sử dụng các phím tắt nhanh bên dưới để tôi hỗ trợ:\n\n* **📚 Gợi ý bài học AI**: Tự động gợi ý & biên soạn bài học + tài liệu vào lộ trình Coursera Mini.\n* **📅 Xếp lịch & Lên TODO**: Gửi hoặc paste thời khóa biểu để AI tự xếp lịch và lên việc cần làm.\n* **Phân tích tiến độ**: Xem báo cáo thói quen tháng này.`;
    }
})();

// --- CLIENT-SIDE SCHEDULE IMPORT PARSERS ---

// HTML entity escaper
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Store pending items for the Excel Preview Modal
let pendingExcelItems = [];
let currentExcelFilter = 'today';

// 1. Enhanced Excel (.xlsx, .xls) Parser using SheetJS
function parseExcel(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Prioritize sheet named TKB, Schedule, Lịch, etc.
            let targetSheetName = workbook.SheetNames[0];
            const tkbNames = workbook.SheetNames.filter(n => /tkb|lịch|schedule|thời khóa biểu|hoc|class/i.test(n));
            if (tkbNames.length > 0) {
                targetSheetName = tkbNames[0];
            }
            const worksheet = workbook.Sheets[targetSheetName];
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
            
            const parsedItems = extractScheduleFromExcelRows(rawRows);
            
            if (parsedItems && parsedItems.length > 0) {
                openExcelPreviewModal(parsedItems);
                document.getElementById('import-status-text').innerText = `Đã nhận diện ${parsedItems.length} hoạt động`;
            } else {
                showToast('Không tìm thấy dòng thời khóa biểu hợp lệ nào trong file Excel!', true);
                document.getElementById('import-status-text').innerText = 'Không có dữ liệu';
            }
        } catch (err) {
            console.error("Excel parse error:", err);
            showToast('Lỗi phân tích file Excel!', true);
            document.getElementById('import-status-text').innerText = 'Lỗi đọc file';
        }
    };
    reader.readAsArrayBuffer(file);
}

// Extract schedule from arbitrary rows (Matrix or List format)
function extractScheduleFromExcelRows(rawRows) {
    if (!rawRows || rawRows.length === 0) return [];
    
    const now = new Date();
    const todayDayOfWeek = now.getDay(); // 0 = CN, 1 = T2, ..., 6 = T7
    const items = [];
    
    // Day patterns
    const dayKeywords = [
        { day: 1, name: "Thứ 2", regex: /\b(t(hứ\s*hai|2|hứ\s*2)|mon(day)?)\b/i },
        { day: 2, name: "Thứ 3", regex: /\b(t(hứ\s*ba|3|hứ\s*3)|tue(sday)?)\b/i },
        { day: 3, name: "Thứ 4", regex: /\b(t(hứ\s*tư|4|hứ\s*4)|wed(nesday)?)\b/i },
        { day: 4, name: "Thứ 5", regex: /\b(t(hứ\s*năm|5|hứ\s*5)|thu(rsday)?)\b/i },
        { day: 5, name: "Thứ 6", regex: /\b(t(hứ\s*sáu|6|hứ\s*6)|fri(day)?)\b/i },
        { day: 6, name: "Thứ 7", regex: /\b(t(hứ\s*bảy|7|hứ\s*7)|sat(urday)?)\b/i },
        { day: 0, name: "Chủ Nhật", regex: /\b(c(hủ\s*nhật|n)|sun(day)?)\b/i }
    ];
    
    function detectDay(val) {
        if (!val) return null;
        const str = String(val).trim();
        for (const dk of dayKeywords) {
            if (dk.regex.test(str)) {
                return dk;
            }
        }
        return null;
    }
    
    // Standardize period & session strings to time ranges
    function normalizeTime(val) {
        if (!val) return "07:00 - 11:30";
        let str = String(val).trim();
        
        // Direct time format (08:00 - 11:30, 8h - 11h30)
        const directMatch = str.match(/(\d{1,2}[:h]\d{2}(?:\s*-\s*\d{1,2}[:h]\d{2})?)/i);
        if (directMatch) {
            return directMatch[1].replace(/h/gi, ':');
        }
        
        // Session: Sáng / Chiều / Tối
        if (/sáng/i.test(str)) return "07:00 - 11:30";
        if (/chiều/i.test(str)) return "13:00 - 16:30";
        if (/tối/i.test(str)) return "18:00 - 21:00";
        
        // Periods: Tiết 1-3, Tiết 4-6, Tiết 7-9, Tiết 10-12
        const tietMatch = str.match(/tiết\s*(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?/i);
        if (tietMatch) {
            const startP = parseInt(tietMatch[1], 10);
            if (startP <= 3) return "07:00 - 09:30";
            if (startP <= 6) return "09:30 - 11:30";
            if (startP <= 9) return "13:00 - 15:30";
            if (startP <= 12) return "15:30 - 18:00";
        }
        
        // Excel decimal time
        const num = parseFloat(str);
        if (!isNaN(num) && num > 0 && num < 1) {
            const totalMinutes = Math.round(num * 24 * 60);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }
        
        return str.length > 2 ? str : "07:00 - 11:30";
    }

    // CHECK 1: MATRIX FORMAT (Columns = Days of week)
    let matrixHeaderIndex = -1;
    let matrixDayColumns = {};
    
    for (let r = 0; r < Math.min(10, rawRows.length); r++) {
        const row = rawRows[r];
        if (!Array.isArray(row)) continue;
        let dayColCount = 0;
        let tempCols = {};
        
        row.forEach((cell, cIdx) => {
            const d = detectDay(cell);
            if (d) {
                dayColCount++;
                tempCols[cIdx] = d;
            }
        });
        
        if (dayColCount >= 3) {
            matrixHeaderIndex = r;
            matrixDayColumns = tempCols;
            break;
        }
    }
    
    if (matrixHeaderIndex !== -1) {
        // Parse Matrix table
        for (let r = matrixHeaderIndex + 1; r < rawRows.length; r++) {
            const row = rawRows[r];
            if (!Array.isArray(row)) continue;
            
            // Find time in row (first 1-2 columns)
            let rowTime = "";
            for (let c = 0; c < Math.min(2, row.length); c++) {
                if (row[c] && !matrixDayColumns[c]) {
                    rowTime = normalizeTime(row[c]);
                    break;
                }
            }
            if (!rowTime) rowTime = "07:00 - 11:30";
            
            // Check each day column
            Object.keys(matrixDayColumns).forEach(colIdx => {
                const dayObj = matrixDayColumns[colIdx];
                const cellVal = String(row[colIdx] || '').trim();
                
                if (cellVal && cellVal.length > 1 && !/^\d+$/.test(cellVal)) {
                    items.push({
                        id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                        day: dayObj.day,
                        dayName: dayObj.name,
                        isToday: dayObj.day === todayDayOfWeek,
                        time: rowTime,
                        emoji: "🏫",
                        activity: cellVal.replace(/\n+/g, ' • ').trim()
                    });
                }
            });
        }
        
        if (items.length > 0) return items;
    }
    
    // CHECK 2: LIST FORMAT
    let listHeaderRow = 0;
    let colMap = { day: -1, time: -1, subject: -1, room: -1, classCode: -1 };
    
    for (let r = 0; r < Math.min(8, rawRows.length); r++) {
        const row = rawRows[r];
        if (!Array.isArray(row)) continue;
        
        row.forEach((cell, cIdx) => {
            const str = String(cell).toLowerCase();
            if (/thứ|ngày|day/i.test(str)) colMap.day = cIdx;
            else if (/giờ|thời gian|tiết|buổi|time/i.test(str)) colMap.time = cIdx;
            else if (/môn|học phần|nội dung|tên lớp|môn học|subject/i.test(str)) colMap.subject = cIdx;
            else if (/phòng|room/i.test(str)) colMap.room = cIdx;
            else if (/mã lớp|lớp|class/i.test(str)) colMap.classCode = cIdx;
        });
        
        if (colMap.subject !== -1 || (colMap.time !== -1 && colMap.day !== -1)) {
            listHeaderRow = r;
            break;
        }
    }
    
    if (colMap.time === -1 && colMap.subject === -1) {
        colMap.time = 0;
        colMap.subject = 1;
    } else if (colMap.subject === -1) {
        colMap.subject = colMap.time === 0 ? 1 : 0;
    }
    
    for (let r = listHeaderRow + 1; r < rawRows.length; r++) {
        const row = rawRows[r];
        if (!Array.isArray(row)) continue;
        
        let dayObj = colMap.day !== -1 ? detectDay(row[colMap.day]) : null;
        if (!dayObj) {
            for (let c = 0; c < row.length; c++) {
                dayObj = detectDay(row[c]);
                if (dayObj) break;
            }
        }
        const dayNumber = dayObj ? dayObj.day : todayDayOfWeek;
        const dayName = dayObj ? dayObj.name : "Hôm nay";
        
        let timeVal = colMap.time !== -1 ? row[colMap.time] : "";
        let timeStr = normalizeTime(timeVal);
        
        let subject = colMap.subject !== -1 ? String(row[colMap.subject] || '').trim() : "";
        if (!subject && row[1]) subject = String(row[1]).trim();
        
        let room = colMap.room !== -1 ? String(row[colMap.room] || '').trim() : "";
        let classCode = colMap.classCode !== -1 ? String(row[colMap.classCode] || '').trim() : "";
        
        let fullActivity = subject;
        if (classCode && !subject.includes(classCode)) fullActivity += ` (${classCode})`;
        if (room && !subject.includes(room)) fullActivity += ` [${room}]`;
        
        if (fullActivity && fullActivity.length > 1 && !/^(stt|thứ|tiết|môn)/i.test(fullActivity)) {
            items.push({
                id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                day: dayNumber,
                dayName: dayName,
                isToday: dayNumber === todayDayOfWeek,
                time: timeStr,
                emoji: "🏫",
                activity: fullActivity
            });
        }
    }
    
    return items;
}

// Open Excel Preview Modal
function openExcelPreviewModal(items) {
    pendingExcelItems = items;
    const modal = document.getElementById('excel-preview-modal');
    const subtitle = document.getElementById('excel-modal-subtitle');
    if (!modal) return;
    
    const todayCount = items.filter(i => i.isToday).length;
    subtitle.innerText = `Tìm thấy ${items.length} hoạt động (${todayCount} hoạt động cho hôm nay)`;
    
    currentExcelFilter = todayCount > 0 ? 'today' : 'all';
    
    const filterTodayBtn = document.getElementById('excel-filter-today');
    const filterAllBtn = document.getElementById('excel-filter-all');
    if (filterTodayBtn && filterAllBtn) {
        if (currentExcelFilter === 'today') {
            filterTodayBtn.classList.add('active');
            filterAllBtn.classList.remove('active');
        } else {
            filterAllBtn.classList.add('active');
            filterTodayBtn.classList.remove('active');
        }
    }
    
    renderExcelPreviewRows(currentExcelFilter);
    modal.style.display = 'flex';
}

function renderExcelPreviewRows(filterMode) {
    const tbody = document.getElementById('excel-preview-tbody');
    if (!tbody) return;
    
    let html = '';
    let visibleCount = 0;
    
    pendingExcelItems.forEach((item, idx) => {
        const show = filterMode === 'all' || (filterMode === 'today' && item.isToday);
        if (!show) return;
        visibleCount++;
        
        html += `
            <tr data-idx="${idx}">
                <td><input type="checkbox" class="excel-row-chk" data-idx="${idx}" checked></td>
                <td><span class="excel-day-badge ${item.isToday ? 'today' : ''}">${item.dayName}</span></td>
                <td><span class="excel-time-badge">${item.time}</span></td>
                <td><strong>${escapeHtml(item.activity)}</strong></td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html || `<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">Không có hoạt động nào cho ngày hôm nay trong file Excel. Hãy bấm "Toàn bộ tuần" để xem tất cả lịch!</td></tr>`;
}

// Initialize Excel Preview Modal Handlers
function initExcelPreviewHandlers() {
    const modal = document.getElementById('excel-preview-modal');
    const closeBtn = document.getElementById('close-excel-modal');
    const cancelBtn = document.getElementById('cancel-excel-btn');
    const confirmBtn = document.getElementById('confirm-excel-btn');
    const filterToday = document.getElementById('excel-filter-today');
    const filterAll = document.getElementById('excel-filter-all');
    const selectAll = document.getElementById('excel-select-all');
    const deselectAll = document.getElementById('excel-deselect-all');
    const masterChk = document.getElementById('excel-th-chk');
    
    if (!modal) return;
    
    const closeModal = () => { modal.style.display = 'none'; };
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    if (filterToday) {
        filterToday.addEventListener('click', () => {
            currentExcelFilter = 'today';
            filterToday.classList.add('active');
            filterAll.classList.remove('active');
            renderExcelPreviewRows('today');
        });
    }
    
    if (filterAll) {
        filterAll.addEventListener('click', () => {
            currentExcelFilter = 'all';
            filterAll.classList.add('active');
            filterToday.classList.remove('active');
            renderExcelPreviewRows('all');
        });
    }
    
    if (selectAll) {
        selectAll.addEventListener('click', () => {
            document.querySelectorAll('.excel-row-chk').forEach(c => c.checked = true);
            if (masterChk) masterChk.checked = true;
        });
    }
    
    if (deselectAll) {
        deselectAll.addEventListener('click', () => {
            document.querySelectorAll('.excel-row-chk').forEach(c => c.checked = false);
            if (masterChk) masterChk.checked = false;
        });
    }
    
    if (masterChk) {
        masterChk.addEventListener('change', (e) => {
            document.querySelectorAll('.excel-row-chk').forEach(c => c.checked = e.target.checked);
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const checkedCheckboxes = document.querySelectorAll('.excel-row-chk:checked');
            const selectedItems = [];
            
            checkedCheckboxes.forEach(chk => {
                const idx = parseInt(chk.dataset.idx, 10);
                if (pendingExcelItems[idx]) {
                    selectedItems.push(pendingExcelItems[idx]);
                }
            });
            
            if (selectedItems.length === 0) {
                showToast('Vui lòng chọn ít nhất 1 hoạt động để nạp!', true);
                return;
            }
            
            const modeInput = document.querySelector('input[name="excel-import-mode"]:checked');
            const isReplace = modeInput && modeInput.value === 'replace';
            
            if (isReplace) {
                state.schedule = selectedItems;
            } else {
                state.schedule = [...(state.schedule || []), ...selectedItems];
            }
            
            saveState();
            renderSchedule();
            renderScheduleEditList();
            renderProductivitySuite();
            closeModal();
            
            showToast(`Đã nạp thành công ${selectedItems.length} hoạt động vào Lịch trình!`);
            document.getElementById('import-status-text').innerText = `Đã nạp (${selectedItems.length} hoạt động)`;
        });
    }
}

// 2. CSV / TXT Parser
function parseCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const lines = text.split('\n');
            let importedCount = 0;
            const newItems = [];
            
            lines.forEach(line => {
                const parts = line.split(/[,;\t]/);
                if (parts && parts.length >= 2) {
                    const timeStr = parts[0].trim();
                    let emoji = '🎯';
                    let activity = '';
                    
                    if (parts.length === 2) {
                        activity = parts[1].trim();
                    } else if (parts.length >= 3) {
                        emoji = parts[1].trim();
                        activity = parts[2].trim();
                    }
                    
                    if (timeStr && activity && /\d/.test(timeStr)) {
                        newItems.push({
                            id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                            time: timeStr,
                            emoji: emoji,
                            activity: activity
                        });
                        importedCount++;
                    }
                }
            });
            
            if (newItems.length > 0) {
                state.schedule = [...(state.schedule || []), ...newItems];
                saveState();
                renderSchedule();
                renderScheduleEditList();
                showToast(`Đã nhập thành công ${importedCount} mốc từ CSV/TXT!`);
                document.getElementById('import-status-text').innerText = `Đã nhập xong (${importedCount} dòng)`;
            } else {
                showToast('Không có dữ liệu hợp lệ trong file CSV/TXT.', true);
                document.getElementById('import-status-text').innerText = 'Không có dữ liệu';
            }
        } catch (err) {
            console.error(err);
            showToast('Lỗi đọc file CSV/TXT!', true);
            document.getElementById('import-status-text').innerText = 'Lỗi đọc file';
        }
    };
    reader.readAsText(file);
}

// 3. PDF Text Extractor using PDF.js
function parsePDF(file) {
    document.getElementById('import-status-text').innerText = "Đang trích xuất PDF...";
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const typedarray = new Uint8Array(e.target.result);
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
            
            const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
            let fullText = '';
            
            const numPages = Math.min(pdf.numPages, 3);
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                let lastY = -1;
                let pageLines = [];
                let currentLine = '';
                
                textContent.items.forEach(item => {
                    if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
                        pageLines.push(currentLine);
                        currentLine = item.str;
                    } else {
                        currentLine += ' ' + item.str;
                    }
                    lastY = item.transform[5];
                });
                if (currentLine) pageLines.push(currentLine);
                
                fullText += pageLines.join('\n') + '\n';
            }
            
            parseRawTextToSchedule(fullText, 'PDF');
        } catch (err) {
            console.error(err);
            showToast('Lỗi đọc chữ từ PDF! Vui lòng chọn PDF có chứa text.', true);
            document.getElementById('import-status-text').innerText = "Lỗi đọc PDF";
        }
    };
    reader.readAsArrayBuffer(file);
}

// 4. Image OCR using Tesseract.js
function parseImageOCR(file) {
    document.getElementById('import-status-text').innerText = "Đang quét ảnh (OCR)...";
    
    Tesseract.recognize(
        file,
        'vie+eng',
        { logger: m => {
            if (m.status === 'recognizing') {
                document.getElementById('import-status-text').innerText = `Đang quét: ${Math.round(m.progress * 100)}%`;
            }
        }}
    ).then(({ data: { text } }) => {
        parseRawTextToSchedule(text, 'Hình ảnh (OCR)');
    }).catch(err => {
        console.error(err);
        showToast('Lỗi nhận diện chữ từ hình ảnh!', true);
        document.getElementById('import-status-text').innerText = "Lỗi nhận diện";
    });
}

// 5. Shared Regex Parser for Raw Text (from OCR or PDF)
function parseRawTextToSchedule(text, sourceName) {
    const lines = text.split('\n');
    const newItems = [];
    let importedCount = 0;
    
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = CN, 1 = T2, ..., 5 = T6, 6 = T7
    
    // Day patterns mapping to Javascript's now.getDay()
    const dayPatterns = [
        { day: 0, regex: /\b(c(hủ\s*nhật|n)|sunday)\b/i },
        { day: 1, regex: /\b(t(hứ\s*hai|2|hứ\s*2)|monday)\b/i },
        { day: 2, regex: /\b(t(hứ\s*ba|3|hứ\s*3)|tuesday)\b/i },
        { day: 3, regex: /\b(t(hứ\s*tư|4|hứ\s*4)|wednesday)\b/i },
        { day: 4, regex: /\b(t(hứ\s*năm|5|hứ\s*5)|thursday)\b/i },
        { day: 5, regex: /\b(t(hứ\s*sáu|6|hứ\s*6)|friday)\b/i },
        { day: 6, regex: /\b(t(hứ\s*bảy|7|hứ\s*7)|saturday)\b/i }
    ];
    
    function getDayFromText(str) {
        let matchedDays = [];
        for (const p of dayPatterns) {
            if (p.regex.test(str)) {
                matchedDays.push(p.day);
            }
        }
        // If multiple different days match in the same line, it's a table header row (e.g. "T2 T3 T4 T5 T6 T7"). Ignore it.
        if (matchedDays.length > 1) {
            return null;
        }
        return matchedDays.length === 1 ? matchedDays[0] : null;
    }
    
    let currentDay = dayOfWeek; // Default to current day
    let currentSession = null;  // Track 'sáng' or 'chiều'
    
    // Class code pattern (e.g. 23DTV_CLC1, 24DTV_DKD2, 25DTV_DKD3)
    const classCodeRegex = /\b([0-9]{2}[A-Z0-9]+_[A-Z0-9]+)\b/i;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Update currentDay if a day indicator is found on this line
        const daySeen = getDayFromText(line);
        if (daySeen !== null) {
            currentDay = daySeen;
        }
        
        // Update currentSession if session keyword is seen on this line
        if (/sáng/i.test(line)) {
            currentSession = "sáng";
        } else if (/chiều/i.test(line)) {
            currentSession = "chiều";
        }
        
        // 1. If it contains a class code, backtrack to extract the multi-line subject name
        const codeMatch = line.match(classCodeRegex);
        if (codeMatch) {
            const classCode = codeMatch[1];
            
            let subjectLines = [];
            let j = i - 1;
            
            while (j >= 0) {
                const prevLine = lines[j].trim();
                
                // Stop backtracking if we hit another code, session keyword, or day header
                if (!prevLine || 
                    classCodeRegex.test(prevLine) || 
                    /sáng|chiều/i.test(prevLine) || 
                    getDayFromText(prevLine) !== null) {
                    break;
                }
                
                subjectLines.unshift(prevLine);
                j--;
            }
            
            let subjectName = subjectLines.join(' ').trim();
            subjectName = subjectName.replace(/^[:\-\s•\(\)]+/, '').trim();
            subjectName = subjectName.replace(/[:\-\s•\(\)]+$/, '').trim();
            
            if (subjectName && subjectName.length > 2) {
                // Check if the subject belongs to today's day of week
                if (currentDay === dayOfWeek) {
                    const timeStr = currentSession === "chiều" ? "13:00 - 16:30" : "07:00 - 11:30";
                    newItems.push({
                        id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                        time: timeStr,
                        emoji: "🏫",
                        activity: `${subjectName} (${classCode})`
                    });
                    importedCount++;
                }
            }
        } else {
            // 2. Check if line contains a standard timestamp (e.g., "08:00 - 12:00")
            const timeRegex = /(\d{1,2}[:h]\d{2}\s*(?:-\s*\d{1,2}[:h]\d{2})?)/i;
            const timeMatch = line.match(timeRegex);
            
            if (timeMatch) {
                const timeStr = timeMatch[1].trim();
                let remaining = line.replace(timeStr, '').trim();
                remaining = remaining.replace(/^[:\-\s•]+/, '').trim();
                
                let emoji = '🏫';
                const emojiRegex = /^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/;
                const emojiMatch = remaining.match(emojiRegex);
                if (emojiMatch) {
                    emoji = emojiMatch[1];
                    remaining = remaining.replace(emoji, '').trim();
                    remaining = remaining.replace(/^[:\-\s•]+/, '').trim();
                }
                
                if (remaining && remaining.length > 1) {
                    newItems.push({
                        id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                        time: timeStr,
                        emoji: emoji,
                        activity: remaining
                    });
                    importedCount++;
                }
            }
        }
    }
    
    if (newItems.length > 0) {
        state.schedule = [...(state.schedule || []), ...newItems];
        saveState();
        renderSchedule();
        renderScheduleEditList();
        showToast(`Đã nhận diện & tự động nạp ${importedCount} mốc học tập cho ngày hôm nay!`);
        document.getElementById('import-status-text').innerText = `Đã nhập xong (${importedCount} dòng)`;
    } else {
        showToast(`Không tìm thấy môn học nào của ngày hôm nay trong ảnh.`, true);
        document.getElementById('import-status-text').innerText = "Thất bại";
    }
}

// --- CLIENT-SIDE TODO LIST FUNCTIONALITY & DEADLINE ALERT ---

// Helper to format overdue duration
function formatOverdueDuration(diffInMinutes) {
    const overdueMins = Math.floor(Math.abs(diffInMinutes));
    if (overdueMins < 60) {
        return `${overdueMins} phút`;
    } else if (overdueMins < 1440) {
        const hours = Math.floor(overdueMins / 60);
        const mins = overdueMins % 60;
        return `${hours} giờ ${mins > 0 ? mins + 'p' : ''}`.trim();
    } else {
        const days = Math.floor(overdueMins / 1440);
        return `${days} ngày`;
    }
}

// Render TODO list on the dashboard
function renderTodos() {
    const list = document.getElementById('todo-list');
    const countBadge = document.getElementById('todo-count-badge');
    if (!list) return;
    
    const now = new Date();
    
    // Sort logic:
    // 1. Incomplete & Overdue tasks first (most overdue first)
    // 2. Incomplete & Upcoming tasks (nearest deadline first)
    // 3. Completed tasks last
    const sortedTodos = [...(state.todos || [])].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        const aDate = new Date(a.deadline);
        const bDate = new Date(b.deadline);
        const aOverdue = !a.completed && (aDate < now);
        const bOverdue = !b.completed && (bDate < now);
        
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        
        if (aOverdue && bOverdue) {
            return aDate - bDate; // older deadline first
        }
        return aDate - bDate;
    });
    
    let html = "";
    let overdueCount = 0;
    let pendingCount = 0;
    
    sortedTodos.forEach(todo => {
        const dlDate = new Date(todo.deadline);
        const diffInMinutes = (dlDate - now) / 60000;
        const isOverdue = diffInMinutes <= 0 && !todo.completed;
        const isUrgent = diffInMinutes > 0 && diffInMinutes <= 90 && !todo.completed;
        
        if (!todo.completed) {
            if (isOverdue) overdueCount++;
            else pendingCount++;
        }
        
        // Format deadline date
        const dateStr = String(dlDate.getDate()).padStart(2, '0');
        const monthStr = String(dlDate.getMonth() + 1).padStart(2, '0');
        const hourStr = String(dlDate.getHours()).padStart(2, '0');
        const minStr = String(dlDate.getMinutes()).padStart(2, '0');
        const formattedDeadline = `${hourStr}:${minStr} ${dateStr}/${monthStr}/${dlDate.getFullYear()}`;
        
        let badgeClass = "badge-deadline";
        let badgeText = `⏳ Hạn chót: ${formattedDeadline}`;
        
        if (isOverdue) {
            badgeClass = "badge-overdue";
            badgeText = `🚨 ĐÃ QUÁ HẠN (trễ ${formatOverdueDuration(diffInMinutes)})`;
        } else if (isUrgent) {
            badgeClass = "badge-warning";
            badgeText = `⚠️ Sắp hết hạn: ${formattedDeadline}`;
        }
        
        html += `
            <li class="todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" id="todo-item-${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo('${todo.id}')" aria-label="Đánh dấu hoàn thành">
                <div class="todo-content">
                    <div class="todo-title">${escapeHtml(todo.title)}</div>
                    ${todo.description ? `<div class="todo-desc">${escapeHtml(todo.description)}</div>` : ''}
                    <div class="todo-badges">
                        <span class="todo-badge ${badgeClass}">${badgeText}</span>
                        ${!todo.completed ? `
                            <button type="button" class="todo-focus-btn" onclick="startPomodoroForTodo('${todo.id}')" title="Tập trung làm việc này (25 phút)">
                                🎯 Focus
                            </button>
                        ` : ''}
                    </div>
                </div>
                <button class="todo-delete-btn" onclick="deleteTodo('${todo.id}')" title="Xóa nhiệm vụ" aria-label="Xóa nhiệm vụ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                </button>
            </li>
        `;
    });
    
    list.innerHTML = html || `<li style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">Không có công việc nào! Hãy thêm việc cần làm.</li>`;
    
    if (countBadge) {
        if (overdueCount > 0) {
            countBadge.innerHTML = `<span style="color:#f87171;font-weight:800;">🚨 ${overdueCount} quá hạn</span> • ${pendingCount} việc sắp đến`;
        } else {
            countBadge.innerText = `${pendingCount} việc chưa hoàn thành`;
        }
    }
}

// Toggle Todo completion status
function toggleTodo(id) {
    const todo = (state.todos || []).find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        if (todo.completed) {
            todo.notified = true;
            triggerFireworks();
        }
        saveState();
        renderTodos();
        renderProductivitySuite();
        showToast(todo.completed ? "Đã hoàn thành công việc!" : "Đã mở lại công việc.");
    }
}

// Delete Todo item
function deleteTodo(id) {
    if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
        state.todos = (state.todos || []).filter(t => t.id !== id);
        saveState();
        renderTodos();
        renderProductivitySuite();
        showToast("Đã xóa công việc.");
    }
}

// Play urgent overdue warning sound (Synthesized via Web Audio API)
function playOverdueSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        [0, 0.16, 0.32].forEach((offset, idx) => {
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            // Descending urgent alert frequencies
            const freqs = [580, 480, 380];
            osc.frequency.setValueAtTime(freqs[idx] || 480, audioCtx.currentTime + offset);
            gain.gain.setValueAtTime(0.16, audioCtx.currentTime + offset);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + offset + 0.14);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + offset);
            osc.stop(audioCtx.currentTime + offset + 0.14);
        });
    } catch (e) {
        console.warn("Audio Context alert blocked/unsupported:", e);
    }
}

// Show crimson overdue alert banner
function showInAppOverdueAlert(todo, durationText) {
    const banner = document.getElementById('inapp-overdue-banner');
    if (!banner) return;
    
    banner.innerHTML = `
        <div class="inapp-overdue-icon">🚨</div>
        <div class="inapp-overdue-content">
            <div class="inapp-overdue-title">CẢNH BÁO QUÁ HẠN NHIỆM VỤ!</div>
            <div class="inapp-overdue-desc">Công việc "<strong>${escapeHtml(todo.title)}</strong>" đã trễ hạn <strong>${durationText}</strong>! Vui lòng kiểm tra và xử lý ngay.</div>
        </div>
        <button class="inapp-overdue-close" onclick="this.parentElement.classList.remove('show')" aria-label="Đóng">&times;</button>
    `;
    
    banner.classList.add('show');
    playOverdueSound();
    
    setTimeout(() => {
        banner.classList.remove('show');
    }, 14000);
}

// Native Desktop Overdue Notification
function showSystemOverdueNotification(todo, durationText) {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        new Notification("🚨 CẢNH BÁO QUÁ HẠN!", {
            body: `Công việc "${todo.title}" đã trễ hạn ${durationText}! Hãy hoàn thành ngay.`,
            icon: "favicon.ico"
        });
    }
}

// Real-Time Todo Deadline & Overdue Monitor
function checkTodoDeadlines() {
    const now = new Date();
    let hasChanges = false;
    
    (state.todos || []).forEach(todo => {
        if (!todo.completed) {
            const dlDate = new Date(todo.deadline);
            const diffInMinutes = (dlDate - now) / 60000;
            
            // CASE 1: OVERDUE (Hạn chót đã qua mà chưa hoàn thành)
            if (diffInMinutes <= 0) {
                // Alert if not alerted before OR re-alert every 30 minutes
                const lastAlert = todo.lastOverdueAlert || 0;
                if (now.getTime() - lastAlert > 30 * 60 * 1000) {
                    todo.lastOverdueAlert = now.getTime();
                    hasChanges = true;
                    
                    const durationText = formatOverdueDuration(diffInMinutes);
                    showInAppOverdueAlert(todo, durationText);
                    showSystemOverdueNotification(todo, durationText);
                }
            } 
            // CASE 2: Approaching deadline (within 90 mins)
            else if (diffInMinutes > 0 && diffInMinutes <= 90 && !todo.notified) {
                todo.notified = true;
                hasChanges = true;
                
                showSystemNotification(todo);
                showInAppAlert(todo);
            }
        }
    });
    
    if (hasChanges) {
        saveState();
        renderTodos();
        renderProductivitySuite();
    }
}

// Play standard approaching deadline beep sound
function playAlertSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc1 = audioCtx.createOscillator();
        let gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain1.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.25);
        
        setTimeout(() => {
            let osc2 = audioCtx.createOscillator();
            let gain2 = audioCtx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(800, audioCtx.currentTime);
            gain2.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.start();
            osc2.stop(audioCtx.currentTime + 0.25);
        }, 120);
    } catch (e) {
        console.warn("Audio Context alert blocked/unsupported:", e);
    }
}

// Approaching deadline banner
function showInAppAlert(todo) {
    let banner = document.getElementById('inapp-alert-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'inapp-alert-banner';
        banner.className = 'inapp-alert-banner';
        document.body.appendChild(banner);
    }
    
    banner.innerHTML = `
        <div class="inapp-alert-icon">⚠️</div>
        <div class="inapp-alert-content">
            <div class="inapp-alert-title">Sắp đến hạn chót (Deadline)!</div>
            <div class="inapp-alert-desc">Công việc "<strong>${escapeHtml(todo.title)}</strong>" cần hoàn thành trước 1 tiếng 30 phút nữa!</div>
        </div>
        <button class="inapp-alert-close" onclick="this.parentElement.classList.remove('show')" aria-label="Đóng cảnh báo">&times;</button>
    `;
    
    banner.classList.add('show');
    playAlertSound();
    
    setTimeout(() => {
        banner.classList.remove('show');
    }, 15000);
}

// Show Native OS Desktop Notification for approaching deadline
function showSystemNotification(todo) {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        new Notification("⚠️ Hạn chót sắp đến!", {
            body: `Công việc "${todo.title}" cần hoàn thành trước 1 tiếng 30 phút nữa.`,
            icon: "favicon.ico"
        });
    }
}

// Initialize Todo deadline checking loop (runs every 30s)
function initTodoDeadlineChecker() {
    checkTodoDeadlines();
    setInterval(checkTodoDeadlines, 30000);
}

// ==========================================================================
// PRODUCTIVITY BOOSTER SUITE & POMODORO FOCUS TIMER
// ==========================================================================
let pomodoroState = {
    timeLeft: 25 * 60,
    totalTime: 25 * 60,
    isRunning: false,
    interval: null,
    currentTaskTitle: 'Phiên 25 phút'
};

// Calculate streak days (consecutive days of tracked habits)
function calculateStreakDays() {
    const now = new Date();
    const currentDay = now.getDate();
    const month = state.currentMonth;
    const habits = state.habits || [];
    if (habits.length === 0) return 0;
    
    let streak = 0;
    for (let d = currentDay; d >= 1; d--) {
        let hasAnyCheck = false;
        habits.forEach(h => {
            if (state.logs && state.logs[month] && state.logs[month][h.id] && state.logs[month][h.id][d]) {
                hasAnyCheck = true;
            }
        });
        if (hasAnyCheck) {
            streak++;
        } else if (d < currentDay) {
            break; // Streak broke
        }
    }
    return streak;
}

// Calculate Daily Productivity Score (0 - 100%)
function calculateProductivityScore() {
    const now = new Date();
    const day = now.getDate();
    const month = state.currentMonth;
    
    // 1. Habit completion today (max 45 points)
    const habits = state.habits || [];
    let completedHabits = 0;
    habits.forEach(h => {
        if (state.logs && state.logs[month] && state.logs[month][h.id] && state.logs[month][h.id][day]) {
            completedHabits++;
        }
    });
    let habitScore = habits.length > 0 ? Math.round((completedHabits / habits.length) * 45) : 30;
    
    // 2. Task completion and Overdue penalties (max 45 points)
    const todos = state.todos || [];
    const completedTodos = todos.filter(t => t.completed).length;
    const overdueTodos = todos.filter(t => !t.completed && new Date(t.deadline) < now).length;
    
    let taskScore = 25;
    if (todos.length > 0) {
        taskScore = Math.round((completedTodos / todos.length) * 45);
    }
    
    // Penalty: -12 points for each overdue task!
    taskScore -= (overdueTodos * 12);
    if (taskScore < 0) taskScore = 0;
    
    // 3. Sleep & wellness bonus (max 10 points)
    let sleepScore = 5;
    if (state.logs && state.logs[month] && state.logs[month].wellness && state.logs[month].wellness.sleep && state.logs[month].wellness.sleep[day]) {
        const sleepHours = parseFloat(state.logs[month].wellness.sleep[day]);
        if (sleepHours >= 7 && sleepHours <= 9) sleepScore = 10;
        else if (sleepHours >= 6) sleepScore = 7;
    }
    
    let totalScore = habitScore + taskScore + sleepScore;
    if (totalScore > 100) totalScore = 100;
    if (totalScore < 0) totalScore = 0;
    
    const streak = calculateStreakDays();
    
    return {
        score: totalScore,
        streak: streak,
        completedHabits: completedHabits,
        totalHabits: habits.length,
        overdueCount: overdueTodos
    };
}

// Render Productivity Section UI
function renderProductivitySuite() {
    const scoreValEl = document.getElementById('prod-score-val');
    const ringFillEl = document.getElementById('prod-ring-fill');
    const badgeEl = document.getElementById('prod-badge');
    const streakEl = document.getElementById('prod-streak');
    const descEl = document.getElementById('prod-desc');
    
    if (!scoreValEl) return;
    
    const data = calculateProductivityScore();
    scoreValEl.innerText = data.score;
    
    // Stroke dashoffset for SVG ring (Circumference ~ 264)
    if (ringFillEl) {
        const circumference = 2 * Math.PI * 42; // ~263.89
        const offset = circumference * (1 - data.score / 100);
        ringFillEl.style.strokeDashoffset = offset;
        
        if (data.score >= 85) ringFillEl.style.stroke = "var(--accent-success)";
        else if (data.score >= 60) ringFillEl.style.stroke = "var(--accent-primary)";
        else if (data.score >= 40) ringFillEl.style.stroke = "var(--accent-warning)";
        else ringFillEl.style.stroke = "var(--accent-danger)";
    }
    
    // Badges & Tier
    if (badgeEl) {
        badgeEl.className = 'prod-badge';
        if (data.score >= 90) {
            badgeEl.classList.add('tier-peak');
            badgeEl.innerText = '⚡ Siêu Năng Suất';
        } else if (data.score >= 75) {
            badgeEl.classList.add('tier-high');
            badgeEl.innerText = '⚡ Hiệu Quả Cao';
        } else if (data.score >= 50) {
            badgeEl.classList.add('tier-good');
            badgeEl.innerText = '⚡ Đang Tiến Bộ';
        } else {
            badgeEl.classList.add('tier-low');
            badgeEl.innerText = '⚡ Cần Tập Trung';
        }
    }
    
    if (streakEl) {
        streakEl.innerText = `🔥 ${data.streak} ngày kỷ luật`;
    }

    // Synchronize LinkedIn Left Rail identity card
    const leftStreakEl = document.getElementById('left-rail-streak');
    const leftScoreEl = document.getElementById('left-rail-score');
    const leftBadgeEl = document.getElementById('left-rail-badge');
    if (leftStreakEl) leftStreakEl.innerText = `${data.streak} ngày`;
    if (leftScoreEl) leftScoreEl.innerText = `${data.score}/100`;
    if (leftBadgeEl) {
        if (data.score >= 90) leftBadgeEl.innerText = 'Siêu Năng Suất';
        else if (data.score >= 75) leftBadgeEl.innerText = 'Hiệu Quả Cao';
        else if (data.score >= 50) leftBadgeEl.innerText = 'Đang Tiến Bộ';
        else leftBadgeEl.innerText = 'Cần Tập Trung';
    }
    
    if (descEl) {
        if (data.overdueCount > 0) {
            descEl.innerHTML = `<span style="color:#f87171;font-weight:700;">Bạn có ${data.overdueCount} công việc quá hạn!</span> Hãy hoàn thành ngay để khôi phục điểm năng suất!`;
        } else if (data.completedHabits === data.totalHabits && data.totalHabits > 0) {
            descEl.innerText = 'Tuyệt vời! Bạn đã hoàn thành toàn bộ thói quen đề ra cho hôm nay!';
        } else {
            descEl.innerText = `Đã hoàn thành ${data.completedHabits}/${data.totalHabits} thói quen. Bắt đầu phiên Focus để hoàn thành tiếp!`;
        }
    }
}

// Start Pomodoro Focus Mode directly for a specific Todo task
function startPomodoroForTodo(todoId) {
    const todo = (state.todos || []).find(t => t.id === todoId);
    if (!todo) return;
    
    pomodoroState.currentTaskTitle = todo.title;
    const taskNameEl = document.getElementById('pomo-task-name');
    if (taskNameEl) taskNameEl.innerText = todo.title;
    
    // Scroll to productivity section smoothly
    const prodSec = document.getElementById('sec-productivity');
    if (prodSec) {
        prodSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    startPomodoro();
    showToast(`Đã kích hoạt chế độ Focus cho: "${todo.title}"`);
}
window.startPomodoroForTodo = startPomodoroForTodo;

// Pomodoro Timer Controls
function startPomodoro() {
    if (pomodoroState.isRunning) return;
    
    pomodoroState.isRunning = true;
    const startBtn = document.getElementById('pomo-start-btn');
    const pomoBox = document.querySelector('.pomodoro-box');
    if (startBtn) startBtn.innerHTML = `⏸️ Tạm dừng`;
    if (pomoBox) pomoBox.classList.add('running');
    
    pomodoroState.interval = setInterval(() => {
        if (pomodoroState.timeLeft > 0) {
            pomodoroState.timeLeft--;
            updatePomodoroDisplay();
        } else {
            // Pomodoro Finished!
            pausePomodoro();
            triggerFireworks();
            playAlertSound();
            showToast('🎉 Chúc mừng! Bạn vừa hoàn thành xuất sắc 1 phiên Deep Work 25 phút!');
            pomodoroState.timeLeft = pomodoroState.totalTime;
            updatePomodoroDisplay();
            renderProductivitySuite();
        }
    }, 1000);
}

function pausePomodoro() {
    pomodoroState.isRunning = false;
    clearInterval(pomodoroState.interval);
    const startBtn = document.getElementById('pomo-start-btn');
    const pomoBox = document.querySelector('.pomodoro-box');
    if (startBtn) {
        startBtn.innerHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg> Tiếp tục`;
    }
    if (pomoBox) pomoBox.classList.remove('running');
}

function resetPomodoro() {
    pausePomodoro();
    pomodoroState.timeLeft = pomodoroState.totalTime;
    const startBtn = document.getElementById('pomo-start-btn');
    if (startBtn) {
        startBtn.innerHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg> Bắt đầu`;
    }
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const display = document.getElementById('pomo-timer-display');
    if (!display) return;
    const mins = Math.floor(pomodoroState.timeLeft / 60);
    const secs = pomodoroState.timeLeft % 60;
    display.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Initialize Productivity Suite & Pomodoro UI Handlers
function initProductivitySuite() {
    const startBtn = document.getElementById('pomo-start-btn');
    const resetBtn = document.getElementById('pomo-reset-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (pomodoroState.isRunning) {
                pausePomodoro();
            } else {
                startPomodoro();
            }
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetPomodoro);
    }
    
    updatePomodoroDisplay();
    renderProductivitySuite();
}

// Expose Todo functions to window so they are globally accessible via inline HTML handlers
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

// Trigger fireworks / confetti celebration effect
function triggerFireworks() {
    if (typeof confetti === 'undefined') return;
    
    const duration = 2.5 * 1000; // 2.5 seconds of fireworks!
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Fire bursts from different coordinates to look like real fireworks!
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}
window.triggerFireworks = triggerFireworks;

// Initialize Bottom Tab Navigation Menu (Habits / Classroom / Tasks)
function switchAppTab(tabName) {
    if (!tabName) tabName = 'habits';
    
    try {
        localStorage.setItem('habit_tracker_active_tab', tabName);
    } catch (e) {}

    // Update tab navigation items (Top LinkedIn Header & Mobile Dock)
    const items = document.querySelectorAll('.shortcut-item, .linkedin-nav-item');
    items.forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update app tab panes
    const panes = document.querySelectorAll('.app-tab-pane');
    panes.forEach(pane => {
        if (pane.id === `pane-${tabName}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Update layout grid classes for optimal spacious width
    const grid = document.querySelector('.linkedin-layout-grid');
    if (grid) {
        grid.classList.remove('tab-habits-active', 'tab-tasks-active', 'tab-classroom-active');
        if (tabName === 'habits') {
            grid.classList.add('tab-habits-active');
        } else if (tabName === 'tasks') {
            grid.classList.add('tab-tasks-active');
        } else if (tabName === 'classroom') {
            grid.classList.add('tab-classroom-active');
        }
    }

    // Trigger tab-specific renders to ensure fresh state
    if (tabName === 'classroom') {
        renderCourseraMini();
    } else if (tabName === 'habits') {
        const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);
        const weekdays = getWeekdayLabelsForMonth(state.currentYear, state.currentMonth);
        renderMainGrid(daysInMonth, weekdays);
        renderProductivitySuite();
    } else if (tabName === 'tasks') {
        renderSchedule();
        renderTodos();
    }
}
window.switchAppTab = switchAppTab;

function initShortcutMenu() {
    const items = document.querySelectorAll('.shortcut-item, .linkedin-nav-item');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.getAttribute('data-tab');
            if (tabName) {
                switchAppTab(tabName);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Restore last active tab if exists
    try {
        const savedTab = localStorage.getItem('habit_tracker_active_tab');
        if (savedTab && ['habits', 'classroom', 'tasks'].includes(savedTab)) {
            switchAppTab(savedTab);
        }
    } catch(e) {}
}
window.initShortcutMenu = initShortcutMenu;

// ==========================================================================
// COURSERA MINI ACADEMY - STRICT VIRTUAL CLASSROOM & ATTENDANCE SUITE
// ==========================================================================
let classroomStudyState = {
    lessonId: null,
    durationMins: 25,
    timeLeft: 25 * 60,
    isRunning: false,
    interval: null
};

let currentCourseraSubtab = 'curriculum';
let currentCurriculumPhaseFilter = 'all';

// Helper: Safely retrieve the currently active course with automatic legacy data migration
function getActiveCourse() {
    if (!state.classroom) {
        state.classroom = JSON.parse(JSON.stringify(DEFAULT_CLASSROOM));
    }
    
    // Auto-migrate legacy format if needed
    if (!state.classroom.courses || !Array.isArray(state.classroom.courses) || state.classroom.courses.length === 0) {
        const legacyLessons = state.classroom.lessons || [];
        const legacyTitle = state.classroom.courseTitle || 'Lý thuyết & Kỹ thuật Điều khiển Tự động (Control Systems)';
        const legacyDesc = state.classroom.courseDesc || 'Lộ trình tự học kỷ luật cao theo từng Chặng. Bắt buộc điểm danh và hoàn thành tiết học mỗi ngày.';
        const legacyPhases = state.classroom.phases;
        
        state.classroom = JSON.parse(JSON.stringify(DEFAULT_CLASSROOM));
        if (legacyLessons.length > 0) {
            state.classroom.courses[0].lessons = legacyLessons;
        }
        state.classroom.courses[0].title = legacyTitle;
        state.classroom.courses[0].desc = legacyDesc;
        if (legacyPhases && legacyPhases.length > 0) {
            state.classroom.courses[0].phases = legacyPhases;
        }
        saveState();
    }

    let active = state.classroom.courses.find(c => c.id === state.classroom.activeCourseId);
    if (!active) {
        active = state.classroom.courses[0];
        state.classroom.activeCourseId = active.id;
    }
    
    if (!active.lessons) active.lessons = [];
    if (!active.resources) active.resources = [];
    if (!active.phases) {
        active.phases = [
            { id: 'p1', name: 'Chặng 1', durationWeeks: 3, label: '3 tuần' },
            { id: 'p2', name: 'Chặng 2', durationWeeks: 3, label: '3 tuần' }
        ];
    }
    return active;
}
window.getActiveCourse = getActiveCourse;

// Helper: Switch active course
function switchActiveCourse(courseId) {
    if (!state.classroom || !state.classroom.courses) return;
    const course = state.classroom.courses.find(c => c.id === courseId);
    if (!course) return;

    state.classroom.activeCourseId = courseId;
    currentCurriculumPhaseFilter = 'all';
    const filterSelect = document.getElementById('curriculum-phase-filter');
    if (filterSelect) filterSelect.value = 'all';

    saveState();
    renderCourseraMini();
    showToast(`Đã chuyển sang khóa: "${course.title}"`);
}
window.switchActiveCourse = switchActiveCourse;

// Helper: Switch subtab inside Coursera Mini (Curriculum / Resources / Attendance)
function switchCourseraSubtab(subtabName) {
    currentCourseraSubtab = subtabName;
    const subtabBtns = document.querySelectorAll('.coursera-subtab-btn');
    subtabBtns.forEach(btn => {
        if (btn.getAttribute('data-subtab') === subtabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const subpanes = document.querySelectorAll('.coursera-subpane');
    subpanes.forEach(pane => {
        if (pane.id === `coursera-subpane-${subtabName}`) {
            pane.style.display = 'block';
            pane.classList.add('active');
        } else {
            pane.style.display = 'none';
            pane.classList.remove('active');
        }
    });

    const filterArea = document.getElementById('coursera-filter-area');
    if (filterArea) {
        filterArea.style.display = subtabName === 'curriculum' ? 'block' : 'none';
    }
}
window.switchCourseraSubtab = switchCourseraSubtab;

// Helper: Parse YouTube URL to get video or playlist embed info
function getYouTubeEmbedInfo(url) {
    if (!url) return null;
    try {
        if (url.includes('playlist?list=')) {
            const match = url.match(/list=([a-zA-Z0-9_-]+)/);
            if (match) {
                return {
                    type: 'playlist',
                    embedUrl: `https://www.youtube.com/embed/videoseries?list=${match[1]}`
                };
            }
        }
        let videoId = null;
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        }
        if (videoId) {
            return {
                type: 'video',
                embedUrl: `https://www.youtube.com/embed/${videoId}`
            };
        }
    } catch (e) {
        console.warn("Lỗi parse URL YouTube:", e);
    }
    return null;
}

// Render multi-course selector pills / chips
function renderCourseChips() {
    const container = document.getElementById('course-chips-container');
    if (!container || !state.classroom || !state.classroom.courses) return;

    const activeCourse = getActiveCourse();
    container.innerHTML = '';

    state.classroom.courses.forEach(course => {
        const lessons = course.lessons || [];
        const completed = lessons.filter(l => l.completed).length;
        const total = lessons.length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        const isActive = course.id === activeCourse.id;

        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `course-chip-card ${isActive ? 'active' : ''}`;
        chip.onclick = () => switchActiveCourse(course.id);
        chip.innerHTML = `
            <div class="course-chip-icon">${escapeHtml(course.thumbnail || '📘')}</div>
            <div class="course-chip-info">
                <div class="course-chip-top-row">
                    <span class="course-chip-name">${escapeHtml(course.title)}</span>
                    ${isActive ? '<span class="course-active-badge">Đang học</span>' : ''}
                </div>
                <div class="course-chip-category-text">${escapeHtml(course.category || 'Tự học')}</div>
                <div class="course-chip-meta">
                    <span class="course-chip-lessons-text">${completed}/${total} bài học</span>
                    <span class="course-chip-pct-val">${pct}%</span>
                </div>
                <div class="course-chip-prog-track">
                    <div class="course-chip-prog-fill" style="width: ${pct}%;"></div>
                </div>
            </div>
        `;
        container.appendChild(chip);
    });
}

// Render the Course Hero Banner
function renderCourseHeroBanner(activeCourse) {
    const categoryEl = document.getElementById('hero-course-category');
    const titleEl = document.getElementById('classroom-course-title');
    const descEl = document.getElementById('classroom-course-desc');
    const phaseEl = document.getElementById('hero-course-phase');
    const countEl = document.getElementById('hero-course-lesson-count');
    const durationEl = document.getElementById('hero-course-duration');
    const pctEl = document.getElementById('hero-progress-pct');
    const fillEl = document.getElementById('hero-progress-fill');
    const subEl = document.getElementById('hero-progress-sub');

    if (categoryEl) categoryEl.innerText = activeCourse.category || 'Tự đào tạo chuyên sâu';
    if (titleEl) titleEl.innerText = activeCourse.title;
    if (descEl) descEl.innerText = activeCourse.desc || 'Lộ trình tự học kỷ luật cao theo từng Chặng. Bắt buộc điểm danh và hoàn thành tiết học mỗi ngày.';

    const lessons = activeCourse.lessons || [];
    const completed = lessons.filter(l => l.completed).length;
    const total = lessons.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (phaseEl) phaseEl.innerText = `Chặng hiện tại: ${activeCourse.currentPhase || 'Chặng 1'}`;
    if (countEl) countEl.innerText = `${total} bài học`;
    if (durationEl) durationEl.innerText = `Chuẩn: 25p / tiết`;

    if (pctEl) pctEl.innerText = `${pct}%`;
    if (fillEl) fillEl.style.width = `${pct}%`;
    if (subEl) subEl.innerText = `Hoàn thành ${completed} / ${total} bài học`;
}

// Update Phase Filter dropdown options for current course
function updatePhaseFilterOptions(activeCourse) {
    const filterSelect = document.getElementById('curriculum-phase-filter');
    if (!filterSelect) return;

    // Collect phases from course definition + any phases found in lessons
    const phasesMap = new Map();
    (activeCourse.phases || []).forEach(p => phasesMap.set(p.name, p.label || p.name));
    (activeCourse.lessons || []).forEach(l => {
        if (l.phase && !phasesMap.has(l.phase)) {
            phasesMap.set(l.phase, l.phase);
        }
    });

    const currentVal = currentCurriculumPhaseFilter;
    filterSelect.innerHTML = `<option value="all">Tất cả các chặng</option>`;
    phasesMap.forEach((label, name) => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.innerText = `${name} (${label})`;
        if (name === currentVal) opt.selected = true;
        filterSelect.appendChild(opt);
    });
}

// Render Subtab 1: Curriculum & Lessons table
function renderCourseCurriculum(activeCourse) {
    const tbody = document.getElementById('curriculum-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const lessons = activeCourse.lessons || [];
    if (lessons.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                    <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">Khóa học này chưa có bài học nào</div>
                    <div style="font-size: 0.85rem; margin-bottom: 1rem;">Bạn có thể thêm bài học thủ công, nạp từ file Excel hoặc yêu cầu <strong>AI Coach</strong> tự động gợi ý bài học và tài liệu!</div>
                    <div style="display: flex; gap: 0.5rem; justify-content: center;">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('classroom-add-modal').style.display='flex'">+ Thêm Bài Học Thủ Công</button>
                        <button type="button" class="btn btn-primary btn-sm" onclick="openAICoachChat('Gợi ý bài học cho khóa học này')">Gợi Ý Bài Học Tiếp Theo</button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    // Determine which phases to show
    let phasesToRender = [];
    if (currentCurriculumPhaseFilter === 'all') {
        const phaseNames = new Set((activeCourse.phases || []).map(p => p.name));
        lessons.forEach(l => { if (l.phase) phaseNames.add(l.phase); });
        phasesToRender = Array.from(phaseNames).map(name => {
            const found = (activeCourse.phases || []).find(p => p.name === name);
            return found || { id: name, name: name, label: '' };
        });
    } else {
        const found = (activeCourse.phases || []).find(p => p.name === currentCurriculumPhaseFilter);
        phasesToRender = [found || { id: currentCurriculumPhaseFilter, name: currentCurriculumPhaseFilter, label: '' }];
    }

    phasesToRender.forEach(phase => {
        const phaseLessons = lessons.filter(l => {
            const pName = (l.phase || '').trim().toLowerCase();
            return pName.startsWith(phase.name.toLowerCase()) || pName === phase.name.toLowerCase();
        });

        if (phaseLessons.length === 0 && currentCurriculumPhaseFilter !== 'all') return;

        // Phase Header Row
        const phaseRow = document.createElement('tr');
        phaseRow.className = 'phase-header-row';
        phaseRow.innerHTML = `
            <td colspan="5">
                <div class="phase-header-flex">
                    <span>${escapeHtml(phase.name)}</span>
                    <span class="phase-header-duration">${escapeHtml(phase.label || phase.durationWeeks ? phase.durationWeeks + ' tuần' : '')}</span>
                </div>
            </td>
        `;
        tbody.appendChild(phaseRow);

        phaseLessons.forEach((lesson, idx) => {
            const row = document.createElement('tr');

            // Format attendance cell
            let attendanceContent = '';
            if (lesson.completed && lesson.attendanceLogs && lesson.attendanceLogs.length > 0) {
                const lastLog = lesson.attendanceLogs[lesson.attendanceLogs.length - 1];
                const noteSnippet = lastLog.notes ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem; max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(lastLog.notes)}">“${escapeHtml(lastLog.notes)}”</div>` : '';
                attendanceContent = `
                    <div class="attendance-cell-content">
                        <div>
                            <span class="attendance-badge-done">Đã học (${escapeHtml(lastLog.date)})</span>
                            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;">${lastLog.minutes || 25} phút ${noteSnippet}</div>
                        </div>
                        <button type="button" class="btn btn-secondary btn-xs study-enter-btn" onclick="openStudySession('${lesson.id}')" title="Ôn tập lại hoặc xem ghi chú">
                            Ôn lại
                        </button>
                    </div>
                `;
            } else {
                attendanceContent = `
                    <div class="attendance-cell-content">
                        <span class="attendance-badge-pending">Chưa học</span>
                        <button type="button" class="btn btn-primary btn-xs study-enter-btn" onclick="openStudySession('${lesson.id}')">
                            Vào học
                        </button>
                    </div>
                `;
            }

            row.innerHTML = `
                <td class="col-stt">${lesson.stt || (idx + 1)}</td>
                <td class="col-module"><span class="module-title">${escapeHtml(lesson.module || '')}</span></td>
                <td class="col-lesson"><span class="lesson-title-cell">${escapeHtml(lesson.title)}</span></td>
                <td class="col-materials">
                    <a href="${escapeHtml(lesson.url)}" target="_blank" rel="noopener noreferrer" class="curriculum-yt-link" title="Mở trên tab mới">
                        <span>Mở bài giảng</span>
                    </a>
                </td>
                <td class="col-attendance">${attendanceContent}</td>
            `;
            tbody.appendChild(row);
        });
    });
}

// Render Subtab 2: Resources & Reading Materials cards
function renderCourseResources(activeCourse) {
    const grid = document.getElementById('course-resources-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const resources = activeCourse.resources || [];
    if (resources.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; background: var(--bg-card); border-radius: var(--border-radius-md); border: 1px dashed var(--border-color); color: var(--text-muted);">
                <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">Chưa có tài liệu đính kèm cho khóa học này</div>
                <p style="font-size: 0.85rem; margin-bottom: 1rem;">Bạn có thể bấm "+ Thêm Tài Liệu Mới" để lưu lại sách PDF, slide bài giảng hoặc link repository mã nguồn.</p>
                <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('add-resource-modal').style.display='flex'">+ Thêm Tài Liệu Mới</button>
            </div>
        `;
        return;
    }

    resources.forEach(res => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
            <div class="resource-card-content" style="width: 100%;">
                <div class="resource-card-type">${escapeHtml(res.type || 'Tài liệu')}</div>
                <h4 class="resource-card-title">${escapeHtml(res.title)}</h4>
                <div class="resource-card-actions">
                    <a href="${escapeHtml(res.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-xs" style="text-decoration:none;">
                        Mở tài liệu
                    </a>
                    <button type="button" class="btn btn-outline btn-xs" style="color:#f87171; border-color: rgba(248,113,113,0.3);" onclick="deleteResource('${res.id}')" title="Xóa tài liệu">
                        Xóa
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Delete Resource Helper
function deleteResource(resId) {
    const course = getActiveCourse();
    if (!course || !course.resources) return;
    const idx = course.resources.findIndex(r => r.id === resId);
    if (idx !== -1) {
        course.resources.splice(idx, 1);
        saveState();
        renderCourseResources(course);
        showToast('Đã xóa tài liệu khỏi khóa học.');
    }
}
window.deleteResource = deleteResource;

// Render Subtab 3: Discipline & Attendance Dossier KPIs and History List
function renderCourseAttendance(activeCourse) {
    const lessons = activeCourse.lessons || [];
    const allLogs = [];
    lessons.forEach(l => {
        (l.attendanceLogs || []).forEach(log => {
            allLogs.push({
                ...log,
                lessonTitle: l.title,
                module: l.module
            });
        });
    });

    const completedCount = lessons.filter(l => l.completed).length;
    const totalCount = lessons.length;

    // 1. Tỷ lệ chuyên cần KPI
    const attendanceRate = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 100;
    const rateEl = document.getElementById('kpi-attendance-rate');
    const badgeEl = document.getElementById('kpi-attendance-badge');
    const subEl = document.getElementById('kpi-attendance-sub');

    if (rateEl) rateEl.innerText = `${attendanceRate}%`;
    if (badgeEl) {
        if (attendanceRate >= 80) {
            badgeEl.className = 'kpi-status-badge badge-green';
            badgeEl.innerText = 'Đạt Chuẩn';
        } else if (attendanceRate >= 50) {
            badgeEl.className = 'kpi-status-badge badge-yellow';
            badgeEl.innerText = 'Cần Cố Gắng';
        } else {
            badgeEl.className = 'kpi-status-badge badge-red';
            badgeEl.innerText = 'Cảnh Báo Học Vụ';
        }
    }
    if (subEl) {
        subEl.innerText = `Đã hoàn thành ${completedCount}/${totalCount} bài học lộ trình`;
    }

    // 2. Điểm danh hôm nay KPI
    const todayStr = new Date().toISOString().split('T')[0];
    const attendedToday = allLogs.find(l => l.date === todayStr);
    const todayStatusEl = document.getElementById('kpi-today-status');
    const todaySubEl = document.getElementById('kpi-today-sub');

    if (todayStatusEl) {
        if (attendedToday) {
            todayStatusEl.innerHTML = '<span style="color:#34d399;font-weight:800;">Đã Điểm Danh</span>';
            if (todaySubEl) todaySubEl.innerText = `Hoàn thành lúc ${attendedToday.time || 'hôm nay'} (${attendedToday.minutes || 25}p)`;
        } else {
            todayStatusEl.innerHTML = '<span style="color:#f87171;font-weight:800;">Chưa Điểm Danh</span>';
            if (todaySubEl) todaySubEl.innerText = 'Hạn chót đóng cửa lúc 23:00 hôm nay';
        }
    }

    // 3. Thời hạn chặng KPI
    const phaseStartDate = new Date(activeCourse.phaseStartDate || new Date().toISOString().split('T')[0]);
    const daysPassed = Math.max(1, Math.floor((Date.now() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const phaseDays = activeCourse.phaseDurationDays || 21;
    const daysLeft = Math.max(0, phaseDays - (daysPassed - 1));
    const countdownEl = document.getElementById('kpi-phase-countdown');
    const phaseNameEl = document.getElementById('kpi-phase-name');
    const progEl = document.getElementById('kpi-phase-prog');

    if (countdownEl) {
        if (daysLeft > 0) {
            countdownEl.innerText = `Còn ${daysLeft} ngày`;
            countdownEl.style.color = 'var(--text-primary)';
        } else {
            countdownEl.innerText = `Đã hết hạn chặng!`;
            countdownEl.style.color = '#f87171';
        }
    }
    if (phaseNameEl) {
        phaseNameEl.innerText = `${activeCourse.currentPhase || 'Chặng 1'} (3 tuần)`;
    }
    if (progEl) {
        const progPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        progEl.style.width = `${progPct}%`;
    }

    // Attendance History Log List
    const logListEl = document.getElementById('attendance-log-list');
    if (!logListEl) return;
    logListEl.innerHTML = '';

    if (allLogs.length === 0) {
        logListEl.innerHTML = `
            <div style="text-align: center; padding: 2.5rem 1.5rem; color: var(--text-muted);">
                <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.25rem;">Chưa có lượt điểm danh nào trong khóa này</div>
                <div style="font-size: 0.85rem;">Bắt đầu tiết học để đóng dấu điểm danh và tích lũy kỷ luật học tập!</div>
            </div>
        `;
        return;
    }

    // Sort descending by date & time
    allLogs.sort((a, b) => {
        const dA = new Date(`${a.date || '2026-01-01'}T${a.time || '00:00'}`);
        const dB = new Date(`${b.date || '2026-01-01'}T${b.time || '00:00'}`);
        return dB - dA;
    });

    allLogs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'attendance-log-item';
        item.innerHTML = `
            <div class="attendance-log-header">
                <div>
                    <span class="attendance-log-badge">Có mặt</span>
                    <strong style="color: var(--text-primary); font-size: 0.9rem;">${escapeHtml(log.lessonTitle || 'Bài học')}</strong>
                    <span style="font-size: 0.78rem; color: var(--text-muted); margin-left: 0.5rem;">[${escapeHtml(log.module || '')}]</span>
                </div>
                <div class="attendance-log-time">
                    ${escapeHtml(log.date)} • ${escapeHtml(log.time || '')} • ${log.minutes || 25}p
                </div>
            </div>
            ${log.notes ? `<div class="attendance-log-notes">“${escapeHtml(log.notes)}”</div>` : ''}
        `;
        logListEl.appendChild(item);
    });
}

// Master Render for Coursera Mini Dashboard
function renderCourseraMini() {
    const activeCourse = getActiveCourse();
    if (!activeCourse) return;

    renderCourseChips();
    renderCourseHeroBanner(activeCourse);
    updatePhaseFilterOptions(activeCourse);
    renderCourseCurriculum(activeCourse);
    renderCourseResources(activeCourse);
    renderCourseAttendance(activeCourse);
}
window.renderCourseraMini = renderCourseraMini;

// Backward Compatibility Alias
function renderClassroom() {
    renderCourseraMini();
}
window.renderClassroom = renderClassroom;

// Open Strict Study Session Modal
function openStudySession(lessonId) {
    const activeCourse = getActiveCourse();
    // Search in active course first, or any course
    let targetLesson = (activeCourse.lessons || []).find(l => l.id === lessonId);
    if (!targetLesson && state.classroom && state.classroom.courses) {
        for (const c of state.classroom.courses) {
            const found = (c.lessons || []).find(l => l.id === lessonId);
            if (found) {
                targetLesson = found;
                break;
            }
        }
    }
    if (!targetLesson) return;

    classroomStudyState.lessonId = lessonId;
    classroomStudyState.durationMins = 25;
    classroomStudyState.timeLeft = 25 * 60;
    classroomStudyState.isRunning = false;
    clearInterval(classroomStudyState.interval);

    // Update modal elements
    const modal = document.getElementById('study-session-modal');
    const phaseBadge = document.getElementById('study-modal-phase');
    const moduleBadge = document.getElementById('study-modal-module');
    const titleEl = document.getElementById('study-modal-title');
    const extLink = document.getElementById('study-modal-extlink');
    const embedContainer = document.getElementById('study-video-embed');
    const notesTextarea = document.getElementById('study-session-notes');
    const startBtn = document.getElementById('study-timer-start-btn');
    const durBtns = document.querySelectorAll('.study-dur-btn');

    if (phaseBadge) phaseBadge.innerText = targetLesson.phase || 'Chặng 1';
    if (moduleBadge) moduleBadge.innerText = targetLesson.module || '';
    if (titleEl) titleEl.innerText = targetLesson.title;
    if (extLink) extLink.href = targetLesson.url;
    if (notesTextarea) notesTextarea.value = '';
    if (startBtn) startBtn.innerText = 'Bắt đầu tiết học';

    durBtns.forEach(btn => {
        if (parseInt(btn.getAttribute('data-mins')) === 25) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    // Embed video or fallback
    const embedInfo = getYouTubeEmbedInfo(targetLesson.url);
    if (embedContainer) {
        if (embedInfo) {
            embedContainer.innerHTML = `<iframe src="${embedInfo.embedUrl}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
        } else {
            embedContainer.innerHTML = `
                <div style="padding: 2.5rem; text-align: center; color: var(--text-secondary);">
                    <p style="margin-bottom: 0.75rem; font-weight: 600;">Xem bài giảng trực tiếp tại liên kết YouTube bên dưới</p>
                    <a href="${escapeHtml(targetLesson.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display:inline-flex;align-items:center;gap:0.4rem;">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="#ef4444"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> Mở video bài giảng trên tab mới
                    </a>
                </div>
            `;
        }
    }

    updateStudyTimerDisplay();
    if (modal) modal.style.display = 'flex';
}
window.openStudySession = openStudySession;

function closeStudyModal() {
    const modal = document.getElementById('study-session-modal');
    if (modal) modal.style.display = 'none';

    classroomStudyState.isRunning = false;
    clearInterval(classroomStudyState.interval);
    const embedContainer = document.getElementById('study-video-embed');
    if (embedContainer) embedContainer.innerHTML = '';
}

function updateStudyTimerDisplay() {
    const display = document.getElementById('study-countdown-display');
    if (!display) return;
    const mins = Math.floor(classroomStudyState.timeLeft / 60);
    const secs = classroomStudyState.timeLeft % 60;
    display.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startStudyTimer() {
    if (classroomStudyState.isRunning) {
        classroomStudyState.isRunning = false;
        clearInterval(classroomStudyState.interval);
        const startBtn = document.getElementById('study-timer-start-btn');
        if (startBtn) startBtn.innerText = 'Tiếp tục';
        return;
    }

    classroomStudyState.isRunning = true;
    const startBtn = document.getElementById('study-timer-start-btn');
    const statusText = document.getElementById('study-timer-status-text');
    if (startBtn) startBtn.innerText = 'Tạm dừng';
    if (statusText) statusText.innerText = 'Đang trong tiết học kỷ luật. Giữ tập trung tối đa, không chuyển sang mạng xã hội!';

    classroomStudyState.interval = setInterval(() => {
        if (classroomStudyState.timeLeft > 0) {
            classroomStudyState.timeLeft--;
            updateStudyTimerDisplay();
        } else {
            classroomStudyState.isRunning = false;
            clearInterval(classroomStudyState.interval);
            playAlertSound();
            if (startBtn) startBtn.innerText = 'Hoàn thành tiết';
            if (statusText) statusText.innerHTML = '<span style="color:#34d399;font-weight:700;">🎉 Bạn đã học đủ thời gian tiết học! Hãy viết ghi chú bài thu hoạch và bấm Đóng dấu điểm danh.</span>';
            showToast('🎉 Tiết học đã hoàn thành! Hãy ghi chép tóm tắt và đóng dấu điểm danh.');
        }
    }, 1000);
}

function resetStudyTimer() {
    classroomStudyState.isRunning = false;
    clearInterval(classroomStudyState.interval);
    classroomStudyState.timeLeft = classroomStudyState.durationMins * 60;
    const startBtn = document.getElementById('study-timer-start-btn');
    const statusText = document.getElementById('study-timer-status-text');
    if (startBtn) startBtn.innerText = 'Bắt đầu tiết học';
    if (statusText) statusText.innerText = 'Bấm bắt đầu và tập trung học video bài giảng. Không mở mạng xã hội gây sao nhãng!';
    updateStudyTimerDisplay();
}

// Confirm Attendance & Record Learning Proof (Anti-Cheat Verification)
function confirmAttendance() {
    if (!classroomStudyState.lessonId) return;

    let targetLesson = null;
    if (state.classroom && state.classroom.courses) {
        for (const c of state.classroom.courses) {
            const found = (c.lessons || []).find(l => l.id === classroomStudyState.lessonId);
            if (found) {
                targetLesson = found;
                break;
            }
        }
    }
    if (!targetLesson) return;

    const notesEl = document.getElementById('study-session-notes');
    const notesText = notesEl ? notesEl.value.trim() : '';

    // Anti-Cheat: Require at least 8 characters of learning summary
    if (notesText.length < 8) {
        showToast('Kỷ luật lớp học: Bạn bắt buộc phải ghi ít nhất 1 câu tóm tắt bài thu hoạch để chứng minh đã học thật!', true);
        if (notesEl) {
            notesEl.focus();
            notesEl.style.borderColor = 'var(--accent-danger)';
            setTimeout(() => notesEl.style.borderColor = '', 2000);
        }
        return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    targetLesson.completed = true;
    if (!targetLesson.attendanceLogs) targetLesson.attendanceLogs = [];

    targetLesson.attendanceLogs.push({
        date: todayStr,
        time: nowTime,
        minutes: classroomStudyState.durationMins,
        notes: notesText
    });

    saveState();
    renderCourseraMini();
    renderProductivitySuite();
    triggerFireworks();
    showToast(`🎉 Xuất sắc! Đã đóng dấu điểm danh thành công cho bài: "${targetLesson.title}"!`);
    closeStudyModal();
}

// Quick study next pending lesson
function openQuickStudyLesson() {
    const activeCourse = getActiveCourse();
    const lessons = activeCourse.lessons || [];
    const pending = lessons.find(l => !l.completed);
    if (pending) {
        openStudySession(pending.id);
    } else if (lessons.length > 0) {
        openStudySession(lessons[0].id);
    } else {
        showToast('Chưa có bài học nào trong lộ trình! Hãy bấm + Thêm Bài Học.', true);
    }
}
window.openQuickStudyLesson = openQuickStudyLesson;

// Check Proctor Absence Alert (Evening curfew check)
function checkClassroomAbsence() {
    const activeCourse = getActiveCourse();
    if (!activeCourse) return;
    const now = new Date();
    const currentHour = now.getHours();
    const todayStr = now.toISOString().split('T')[0];

    let attendedToday = false;
    (activeCourse.lessons || []).forEach(l => {
        (l.attendanceLogs || []).forEach(log => {
            if (log.date === todayStr) attendedToday = true;
        });
    });

    const banner = document.getElementById('classroom-absence-banner');
    if (!banner) return;

    if (currentHour >= 20 && !attendedToday) {
        banner.innerHTML = `
            <div class="classroom-absence-icon">🚨</div>
            <div class="classroom-absence-content">
                <div class="classroom-absence-title">BÁO ĐỘNG HỌC TẬP: Bạn chưa vào lớp điểm danh hôm nay!</div>
                <div class="classroom-absence-desc">Điểm danh ngày hôm nay sẽ đóng cửa lúc 23:00. Bạn đang có nguy cơ bị trừ 20 điểm Năng Suất và cắt đứt chuỗi chuyên cần!</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="openQuickStudyLesson()" style="white-space:nowrap;font-weight:700;">Vào Lớp Ngay</button>
            <button class="classroom-absence-close" onclick="this.parentElement.style.display='none'">&times;</button>
        `;
        banner.style.display = 'flex';
        playAlertSound();
    } else {
        banner.style.display = 'none';
    }
}

// Parse Excel file for classroom curriculum roadmap into active course
function parseClassroomExcel(file) {
    if (typeof XLSX === 'undefined') {
        showToast('Thư viện XLSX chưa sẵn sàng!', true);
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (!rows || rows.length === 0) {
                showToast('File Excel không có dữ liệu!', true);
                return;
            }

            let importedLessons = [];
            let currentPhase = 'Chặng 1';
            let currentModule = '';

            rows.forEach((row) => {
                if (!row || row.length === 0) return;
                const rowStr = row.map(c => String(c || '').trim()).join(' ');

                if (rowStr.toLowerCase().includes('chặng 1')) {
                    currentPhase = 'Chặng 1';
                    return;
                } else if (rowStr.toLowerCase().includes('chặng 2')) {
                    currentPhase = 'Chặng 2';
                    return;
                } else if (rowStr.toLowerCase().includes('chặng 3')) {
                    currentPhase = 'Chặng 3';
                    return;
                }

                let title = '';
                let url = '';
                let moduleName = currentModule;

                row.forEach((cell) => {
                    const cStr = String(cell || '').trim();
                    if (cStr.startsWith('http://') || cStr.startsWith('https://')) {
                        url = cStr;
                    } else if (cStr.length > 2 && isNaN(cStr) && !['stt', 'nội dung', 'điểm danh', 'chủ đề', 'thứ', 'tuần'].includes(cStr.toLowerCase())) {
                        if (!title) title = cStr;
                        else if (!moduleName) moduleName = cStr;
                    }
                });

                if (title) {
                    importedLessons.push({
                        id: 'cls_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                        stt: importedLessons.length + 1,
                        phase: currentPhase,
                        module: moduleName || title,
                        title: title,
                        url: url || 'https://www.youtube.com',
                        completed: false,
                        attendanceLogs: []
                    });
                }
            });

            if (importedLessons.length > 0) {
                const activeCourse = getActiveCourse();
                activeCourse.lessons = importedLessons;
                saveState();
                renderCourseraMini();
                showToast(`🎉 Đã nhập thành công ${importedLessons.length} bài học từ Excel vào lộ trình khóa: "${activeCourse.title}"!`);
                const addModal = document.getElementById('classroom-add-modal');
                if (addModal) addModal.style.display = 'none';
            } else {
                showToast('Không tìm thấy danh sách bài học hợp lệ trong file Excel!', true);
            }
        } catch (err) {
            console.error('Lỗi đọc Excel lớp học:', err);
            showToast('Lỗi khi phân tích file Excel: ' + err.message, true);
        }
    };
    reader.readAsArrayBuffer(file);
}

// Initialize all Coursera Mini Classroom Event Listeners
function initClassroom() {
    renderCourseraMini();

    // Quick study button in Hero banner
    const quickStudyBtn = document.getElementById('classroom-quick-study-btn');
    if (quickStudyBtn) {
        quickStudyBtn.addEventListener('click', openQuickStudyLesson);
    }

    // Subtab navigation buttons (Curriculum / Resources / Attendance)
    const subtabBtns = document.querySelectorAll('.coursera-subtab-btn');
    subtabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const subtab = btn.getAttribute('data-subtab');
            if (subtab) switchCourseraSubtab(subtab);
        });
    });

    // Curriculum Phase Filter dropdown
    const phaseFilter = document.getElementById('curriculum-phase-filter');
    if (phaseFilter) {
        phaseFilter.addEventListener('change', (e) => {
            currentCurriculumPhaseFilter = e.target.value;
            const activeCourse = getActiveCourse();
            renderCourseCurriculum(activeCourse);
        });
    }

    // Add Course Modal handlers
    const addCourseBtn = document.getElementById('classroom-add-course-btn');
    const addCourseModal = document.getElementById('add-course-modal');
    const closeAddCourseBtn = document.getElementById('close-add-course-modal');
    const addCourseForm = document.getElementById('add-course-form');

    if (addCourseBtn && addCourseModal) {
        addCourseBtn.addEventListener('click', () => {
            addCourseModal.style.display = 'flex';
        });
    }
    if (closeAddCourseBtn && addCourseModal) {
        closeAddCourseBtn.addEventListener('click', () => {
            addCourseModal.style.display = 'none';
        });
    }
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('course-title-input').value.trim();
            const category = document.getElementById('course-category-input').value.trim();
            const desc = document.getElementById('course-desc-input').value.trim();
            const emoji = document.getElementById('course-emoji-input').value.trim() || '🎓';
            const durationWeeks = parseInt(document.getElementById('course-duration-input').value) || 6;

            if (!title) return;

            const newCourseId = 'course_' + Date.now();
            const halfWeeks = Math.max(1, Math.round(durationWeeks / 2));
            const newCourse = {
                id: newCourseId,
                title: title,
                category: category || 'Tự đào tạo chuyên sâu',
                desc: desc || `Khóa học ${title} gồm ${durationWeeks} tuần đào tạo kỷ luật cao.`,
                thumbnail: emoji,
                color: '#6366f1',
                currentPhase: 'Chặng 1',
                phases: [
                    { id: 'p1', name: 'Chặng 1', durationWeeks: halfWeeks, label: `${halfWeeks} tuần` },
                    { id: 'p2', name: 'Chặng 2', durationWeeks: halfWeeks, label: `${halfWeeks} tuần` }
                ],
                lessons: [],
                resources: []
            };

            if (!state.classroom) state.classroom = JSON.parse(JSON.stringify(DEFAULT_CLASSROOM));
            if (!state.classroom.courses) state.classroom.courses = [];

            state.classroom.courses.push(newCourse);
            state.classroom.activeCourseId = newCourseId;
            saveState();
            renderCourseraMini();
            showToast(`🎉 Đã tạo khóa học mới: "${newCourse.title}"!`);

            addCourseForm.reset();
            if (addCourseModal) addCourseModal.style.display = 'none';
        });
    }

    // Add Resource Modal handlers
    const addResourceBtn = document.getElementById('add-course-resource-btn');
    const addResourceModal = document.getElementById('add-resource-modal');
    const closeAddResourceBtn = document.getElementById('close-add-resource-modal');
    const addResourceForm = document.getElementById('add-resource-form');

    if (addResourceBtn && addResourceModal) {
        addResourceBtn.addEventListener('click', () => {
            addResourceModal.style.display = 'flex';
        });
    }
    if (closeAddResourceBtn && addResourceModal) {
        closeAddResourceBtn.addEventListener('click', () => {
            addResourceModal.style.display = 'none';
        });
    }
    if (addResourceForm) {
        addResourceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('res-title-input').value.trim();
            const type = document.getElementById('res-type-input').value;
            const url = document.getElementById('res-url-input').value.trim();

            if (!title || !url) return;

            const activeCourse = getActiveCourse();
            if (!activeCourse.resources) activeCourse.resources = [];

            const newRes = {
                id: 'res_' + Date.now(),
                title: title,
                type: type,
                url: url,
                addedAt: new Date().toISOString().split('T')[0]
            };

            activeCourse.resources.push(newRes);
            saveState();
            renderCourseResources(activeCourse);
            showToast(`Đã thêm tài liệu: "${newRes.title}"`);

            addResourceForm.reset();
            if (addResourceModal) addResourceModal.style.display = 'none';
        });
    }

    // Add Lesson Modal handlers
    const addLessonBtn = document.getElementById('classroom-add-lesson-btn');
    const addLessonModal = document.getElementById('classroom-add-modal');
    const closeAddLessonBtn = document.getElementById('close-add-lesson-modal');
    const addLessonForm = document.getElementById('add-lesson-form');

    if (addLessonBtn && addLessonModal) {
        addLessonBtn.addEventListener('click', () => {
            addLessonModal.style.display = 'flex';
        });
    }
    if (closeAddLessonBtn && addLessonModal) {
        closeAddLessonBtn.addEventListener('click', () => {
            addLessonModal.style.display = 'none';
        });
    }
    if (addLessonForm) {
        addLessonForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phase = document.getElementById('lesson-phase-select').value;
            const moduleName = document.getElementById('lesson-module-input').value.trim();
            const title = document.getElementById('lesson-title-input').value.trim();
            const url = document.getElementById('lesson-url-input').value.trim();

            if (!title || !url) return;

            const activeCourse = getActiveCourse();
            if (!activeCourse.lessons) activeCourse.lessons = [];

            const newLesson = {
                id: 'cls_' + Date.now(),
                stt: activeCourse.lessons.length + 1,
                phase: phase,
                module: moduleName || phase,
                title: title,
                url: url,
                completed: false,
                attendanceLogs: []
            };

            activeCourse.lessons.push(newLesson);
            saveState();
            renderCourseraMini();
            showToast(`Đã thêm bài học "${newLesson.title}" vào lộ trình!`);

            addLessonForm.reset();
            if (addLessonModal) addLessonModal.style.display = 'none';
        });
    }

    // Excel import for classroom
    const importExcelBtn = document.getElementById('classroom-import-excel-btn');
    const excelFileInput = document.getElementById('classroom-excel-input');
    const excelStatus = document.getElementById('classroom-excel-status');

    if (importExcelBtn && addLessonModal) {
        importExcelBtn.addEventListener('click', () => {
            addLessonModal.style.display = 'flex';
        });
    }
    if (excelFileInput) {
        excelFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (excelStatus) excelStatus.innerText = `Đang đọc: ${file.name}`;
            parseClassroomExcel(file);
        });
    }

    // Study Session Modal handlers
    const closeStudyBtn = document.getElementById('close-study-modal');
    const closeStudyBtn2 = document.getElementById('close-study-modal-btn');
    const timerStartBtn = document.getElementById('study-timer-start-btn');
    const timerResetBtn = document.getElementById('study-timer-reset-btn');
    const confirmAttendanceBtn = document.getElementById('confirm-attendance-btn');

    if (closeStudyBtn) closeStudyBtn.addEventListener('click', closeStudyModal);
    if (closeStudyBtn2) closeStudyBtn2.addEventListener('click', closeStudyModal);
    if (timerStartBtn) timerStartBtn.addEventListener('click', startStudyTimer);
    if (timerResetBtn) timerResetBtn.addEventListener('click', resetStudyTimer);
    if (confirmAttendanceBtn) confirmAttendanceBtn.addEventListener('click', confirmAttendance);

    // Duration buttons (15m, 25m, 45m)
    const durBtns = document.querySelectorAll('.study-dur-btn');
    durBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            durBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mins = parseInt(btn.getAttribute('data-mins')) || 25;
            classroomStudyState.durationMins = mins;
            resetStudyTimer();
        });
    });

    // Proctor check absence loop
    checkClassroomAbsence();
    setInterval(checkClassroomAbsence, 60000);
}
