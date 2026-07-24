// ============ 配置 ============
const API_BASE = 'http://localhost:3000/api';

// ============ 状态管理 ============
let isSpinning = false;
let spinInterval = null;
let userLibrary = [];
let userTopics = [];
let lastTopicIndex = -1;
let currentUser = null;
let authToken = null;

// ============ DOM 元素 ============
const topicText = document.getElementById('topicText');
const actionBtn = document.getElementById('actionBtn');
const answerSection = document.getElementById('answerSection');
const answerBtn = document.getElementById('answerBtn');
const songsResult = document.getElementById('songsResult');

const libraryToggle = document.getElementById('libraryToggle');
const libraryPanel = document.getElementById('libraryPanel');
const closeLibrary = document.getElementById('closeLibrary');
const songInput = document.getElementById('songInput');
const addSongBtn = document.getElementById('addSongBtn');
const songList = document.getElementById('songList');

const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const authForm = document.getElementById('authForm');
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const tabBtns = document.querySelectorAll('.tab-btn');

const userStatus = document.getElementById('userStatus');
const extraFeatures = document.getElementById('extraFeatures');
const myTopicsBtn = document.getElementById('myTopicsBtn');
const topicsPanel = document.getElementById('topicsPanel');
const closeTopics = document.getElementById('closeTopics');
const topicInput = document.getElementById('topicInput');
const addTopicBtn = document.getElementById('addTopicBtn');
const topicList = document.getElementById('topicList');

let currentAuthMode = 'login';

// ============ 初始化 ============
function init() {
    checkAutoLogin();
    loadLocalLibrary();
    renderLibrary();
    bindEvents();
}

// ============ 认证相关 ============
async function checkAutoLogin() {
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        try {
            const response = await fetch(`${API_BASE}/auth/verify`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                currentUser = data.user;
                onLoginSuccess();
                await syncFromServer();
            } else {
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error('自动登录失败:', error);
            localStorage.removeItem('authToken');
        }
    }
}

function updateAuthUI() {
    if (currentUser) {
        authBtn.textContent = currentUser.username;
        authBtn.classList.add('logged-in');
        userStatus.querySelector('.status-badge').textContent = `✨ ${currentUser.username}`;
        userStatus.querySelector('.status-badge').classList.add('logged-in');
        extraFeatures.style.display = 'block';
    } else {
        authBtn.textContent = '登录';
        authBtn.classList.remove('logged-in');
        userStatus.querySelector('.status-badge').textContent = '游客模式';
        userStatus.querySelector('.status-badge').classList.remove('logged-in');
        extraFeatures.style.display = 'none';
    }
}

function onLoginSuccess() {
    updateAuthUI();
    closeAuthModalFunc();
}

async function handleAuth(e) {
    e.preventDefault();

    const username = authUsername.value.trim();
    const password = authPassword.value;

    if (!username || !password) {
        alert('请填写完整信息');
        return;
    }

    authSubmitBtn.disabled = true;
    authSubmitBtn.textContent = currentAuthMode === 'login' ? '登录中...' : '注册中...';

    try {
        const endpoint = currentAuthMode === 'login' ? '/auth/login' : '/auth/register';
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);

            if (currentAuthMode === 'register' && userLibrary.length > 0) {
                await migrateLocalLibrary();
            }

            onLoginSuccess();
            await syncFromServer();
            alert(currentAuthMode === 'login' ? '登录成功！' : '注册成功！');
        } else {
            alert(data.error || '操作失败');
        }
    } catch (error) {
        console.error('认证错误:', error);
        alert('网络错误，请检查后端服务是否启动');
    } finally {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = currentAuthMode === 'login' ? '登录' : '注册';
    }
}

async function migrateLocalLibrary() {
    for (const song of userLibrary) {
        try {
            await fetch(`${API_BASE}/songs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ songName: song })
            });
        } catch (error) {
            console.error('迁移歌曲失败:', song, error);
        }
    }
}

function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        authToken = null;
        currentUser = null;
        userTopics = [];
        localStorage.removeItem('authToken');
        updateAuthUI();
        loadLocalLibrary();
        renderLibrary();
        alert('已退出登录');
    }
}

// ============ 命题系统 ============
function getAllTopics() {
    return currentUser ? [...TOPICS, ...userTopics.map(t => t.topic_text)] : TOPICS;
}

function getRandomTopic() {
    const allTopics = getAllTopics();
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * allTopics.length);
    } while (randomIndex === lastTopicIndex && allTopics.length > 1);

    lastTopicIndex = randomIndex;
    return allTopics[randomIndex];
}

function startSpinning() {
    isSpinning = true;
    actionBtn.textContent = '停止';
    actionBtn.classList.add('spinning');

    answerSection.classList.remove('visible');
    songsResult.classList.remove('visible');

    spinInterval = setInterval(() => {
        topicText.textContent = getRandomTopic();
    }, 100);
}

function stopSpinning() {
    isSpinning = false;
    clearInterval(spinInterval);

    actionBtn.textContent = '开始';
    actionBtn.classList.remove('spinning');

    topicText.textContent = getRandomTopic();
    answerSection.classList.add('visible');
}

function toggleSpin() {
    if (isSpinning) {
        stopSpinning();
    } else {
        startSpinning();
    }
}

// ============ 作答系统 ============
function getRandomSongs(count = 3) {
    if (userLibrary.length === 0) {
        return [];
    }

    if (userLibrary.length <= count) {
        return [...userLibrary].sort(() => Math.random() - 0.5);
    }

    const shuffled = [...userLibrary].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function showAnswer() {
    const songs = getRandomSongs(3);

    if (songs.length === 0) {
        songsResult.innerHTML = `
            <div class="empty-songs">
                你还没有添加歌曲到曲库<br>
                点击右上角"我的曲库"添加吧~
            </div>
        `;
    } else {
        let html = '<h3>✨ 为你推荐</h3>';
        songs.forEach((song, index) => {
            const songName = typeof song === 'string' ? song : song.song_name;
            html += `
                <div class="song-item">
                    <div class="song-number">${index + 1}</div>
                    <div class="song-name">${escapeHtml(songName)}</div>
                </div>
            `;
        });
        songsResult.innerHTML = html;
    }

    songsResult.classList.add('visible');
}

// ============ 曲库管理 ============
function loadLocalLibrary() {
    if (currentUser) return;

    const saved = localStorage.getItem('ktvLibrary');
    if (saved) {
        try {
            userLibrary = JSON.parse(saved);
        } catch (e) {
            userLibrary = [];
        }
    }
}

function saveLocalLibrary() {
    if (currentUser) return;
    localStorage.setItem('ktvLibrary', JSON.stringify(userLibrary));
}

async function syncFromServer() {
    if (!currentUser) return;

    try {
        const songsResponse = await fetch(`${API_BASE}/songs`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const songsData = await songsResponse.json();
        if (songsData.success) {
            userLibrary = songsData.songs;
            renderLibrary();
        }

        const topicsResponse = await fetch(`${API_BASE}/topics`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const topicsData = await topicsResponse.json();
        if (topicsData.success) {
            userTopics = topicsData.topics;
            renderTopics();
        }
    } catch (error) {
        console.error('同步失败:', error);
    }
}

async function addSong() {
    const songName = songInput.value.trim();

    if (!songName) {
        return;
    }

    if (currentUser) {
        try {
            const response = await fetch(`${API_BASE}/songs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ songName })
            });

            const data = await response.json();
            if (data.success) {
                await syncFromServer();
                songInput.value = '';
                songInput.focus();
            } else {
                alert(data.error || '添加失败');
            }
        } catch (error) {
            console.error('添加歌曲错误:', error);
            alert('网络错误');
        }
    } else {
        if (userLibrary.includes(songName)) {
            alert('这首歌已经在曲库里了~');
            return;
        }

        userLibrary.push(songName);
        saveLocalLibrary();
        renderLibrary();
        songInput.value = '';
        songInput.focus();
    }
}

async function deleteSong(id, index) {
    const song = userLibrary[index];
    const songName = typeof song === 'string' ? song : song.song_name;

    if (!confirm(`确定要删除"${songName}"吗？`)) {
        return;
    }

    if (currentUser) {
        try {
            const response = await fetch(`${API_BASE}/songs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            const data = await response.json();
            if (data.success) {
                await syncFromServer();
            } else {
                alert(data.error || '删除失败');
            }
        } catch (error) {
            console.error('删除歌曲错误:', error);
            alert('网络错误');
        }
    } else {
        userLibrary.splice(index, 1);
        saveLocalLibrary();
        renderLibrary();
    }
}

function renderLibrary() {
    if (userLibrary.length === 0) {
        songList.innerHTML = '<div class="empty-hint">还没有添加歌曲哦~</div>';
        return;
    }

    let html = '';
    userLibrary.forEach((song, index) => {
        const songName = typeof song === 'string' ? song : song.song_name;
        const songId = typeof song === 'object' ? song.id : index;
        html += `
            <div class="library-song-item">
                <div class="library-song-name">${escapeHtml(songName)}</div>
                <button class="delete-btn" onclick="deleteSong(${songId}, ${index})">删除</button>
            </div>
        `;
    });

    songList.innerHTML = html;
}

// ============ 自定义命题管理 ============
async function addTopic() {
    if (!currentUser) {
        alert('请先登录');
        return;
    }

    const topicText = topicInput.value.trim();

    if (!topicText) {
        return;
    }

    if (topicText.length < 10) {
        alert('命题内容至少10个字符');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/topics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ topicText })
        });

        const data = await response.json();
        if (data.success) {
            await syncFromServer();
            topicInput.value = '';
            topicInput.focus();
        } else {
            alert(data.error || '添加失败');
        }
    } catch (error) {
        console.error('添加命题错误:', error);
        alert('网络错误');
    }
}

async function deleteTopic(id, index) {
    const topic = userTopics[index];

    if (!confirm(`确定要删除这个命题吗？\n\n"${topic.topic_text}"`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/topics/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();
        if (data.success) {
            await syncFromServer();
        } else {
            alert(data.error || '删除失败');
        }
    } catch (error) {
        console.error('删除命题错误:', error);
        alert('网络错误');
    }
}

function renderTopics() {
    if (userTopics.length === 0) {
        topicList.innerHTML = '<div class="empty-hint">还没有添加自定义命题哦~</div>';
        return;
    }

    let html = '';
    userTopics.forEach((topic, index) => {
        html += `
            <div class="library-topic-item">
                <div class="library-topic-text">${escapeHtml(topic.topic_text)}</div>
                <button class="delete-btn" onclick="deleteTopic(${topic.id}, ${index})">删除</button>
            </div>
        `;
    });

    topicList.innerHTML = html;
}

// ============ UI 控制 ============
function toggleLibrary() {
    libraryPanel.classList.toggle('open');
}

function closeLibraryPanel() {
    libraryPanel.classList.remove('open');
}

function openAuthModal() {
    if (currentUser) {
        handleLogout();
    } else {
        authModal.classList.add('open');
    }
}

function closeAuthModalFunc() {
    authModal.classList.remove('open');
    authForm.reset();
}

function switchAuthTab(tab) {
    currentAuthMode = tab;
    tabBtns.forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    authSubmitBtn.textContent = tab === 'login' ? '登录' : '注册';
}

function toggleTopics() {
    if (!currentUser) {
        alert('请先登录');
        return;
    }
    topicsPanel.classList.toggle('open');
}

function closeTopicsPanel() {
    topicsPanel.classList.remove('open');
}

// ============ 工具函数 ============
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============ 事件绑定 ============
function bindEvents() {
    actionBtn.addEventListener('click', toggleSpin);
    answerBtn.addEventListener('click', showAnswer);

    libraryToggle.addEventListener('click', toggleLibrary);
    closeLibrary.addEventListener('click', closeLibraryPanel);

    addSongBtn.addEventListener('click', addSong);
    songInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addSong();
        }
    });

    authBtn.addEventListener('click', openAuthModal);
    closeAuthModal.addEventListener('click', closeAuthModalFunc);
    authForm.addEventListener('submit', handleAuth);

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
    });

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModalFunc();
        }
    });

    myTopicsBtn.addEventListener('click', toggleTopics);
    closeTopics.addEventListener('click', closeTopicsPanel);
    addTopicBtn.addEventListener('click', addTopic);
    topicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addTopic();
        }
    });

    libraryPanel.addEventListener('click', (e) => {
        if (e.target === libraryPanel) {
            closeLibraryPanel();
        }
    });

    topicsPanel.addEventListener('click', (e) => {
        if (e.target === topicsPanel) {
            closeTopicsPanel();
        }
    });
}

// ============ 启动 ============
init();

window.deleteSong = deleteSong;
window.deleteTopic = deleteTopic;
