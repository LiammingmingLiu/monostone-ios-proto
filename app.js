// State
let currentScreen = 'welcome';
let previousScreen = 'timeline';
let recording = false;
let recSeconds = 0;
let recInterval = null;

// Navigation
function go(screen) {
  previousScreen = currentScreen;
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(screen);
  if (el) {
    el.classList.add('active');
    el.classList.add('slide-in');
    setTimeout(() => el.classList.remove('slide-in'), 300);
  }
  currentScreen = screen;
}

function back() {
  const target = ['timeline','library','memory','me'].includes(previousScreen) ? previousScreen : 'timeline';
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(target);
  if (el) el.classList.add('active');
  currentScreen = target;
}

function switchTab(tab) {
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(tab);
  if (el) el.classList.add('active');
  currentScreen = tab;
  previousScreen = tab;
}

// Memory segments
function switchSeg(idx) {
  document.querySelectorAll('#memSeg .segb').forEach((b, i) => {
    b.classList.toggle('active', i === idx);
  });
  for (let i = 0; i < 3; i++) {
    const d = document.getElementById('memDomain' + i);
    if (d) d.style.display = i === idx ? 'block' : 'none';
  }
}

// Recording
function toggleRec() {
  recording = !recording;
  const bar = document.getElementById('recbar');
  const fab = document.getElementById('recFab');
  if (recording) {
    bar.classList.add('show');
    fab.classList.add('recording');
    recSeconds = 0;
    recInterval = setInterval(() => {
      recSeconds++;
      const m = Math.floor(recSeconds / 60);
      const s = recSeconds % 60;
      document.getElementById('recTime').textContent = m + ':' + (s < 10 ? '0' : '') + s;
    }, 1000);
  } else {
    bar.classList.remove('show');
    fab.classList.remove('recording');
    if (recInterval) clearInterval(recInterval);
  }
}

// Chat
function sendMsg() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const area = document.getElementById('chatArea');

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = '<div class="chat-bubble">' + escHtml(text) + '</div><div class="chat-time">' + now() + '</div>';
  area.appendChild(userMsg);

  // Typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-msg agent';
  typing.innerHTML = '<div class="chat-bubble"><div class="typing"><span></span><span></span><span></span></div></div>';
  area.appendChild(typing);
  area.scrollTop = area.scrollHeight;

  // Agent response
  setTimeout(() => {
    typing.remove();
    const agentMsg = document.createElement('div');
    agentMsg.className = 'chat-msg agent';
    const responses = [
      '好的，让我查一下你的录音记录... 找到了相关内容。',
      '已经帮你处理了。还需要其他帮助吗？',
      '根据你之前的录音，我找到了一些相关信息。需要我详细展开吗？',
      '明白了。我会记住这个偏好，下次自动应用。'
    ];
    const resp = responses[Math.floor(Math.random() * responses.length)];
    agentMsg.innerHTML = '<div class="chat-bubble">' + resp + '</div><div class="chat-time">' + now() + '</div>';
    area.appendChild(agentMsg);
    area.scrollTop = area.scrollHeight;
  }, 1500);
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function now() {
  const d = new Date();
  return d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
}

// Chip selection
document.querySelectorAll('.chips').forEach(container => {
  container.addEventListener('click', e => {
    if (e.target.classList.contains('chip')) {
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
    }
  });
});
