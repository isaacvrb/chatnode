const socket = io();

let userName = '';
let userList = [];

const loginPage = document.querySelector('#loginPage');
const chatPage = document.querySelector('#chatPage');

const loginInput = document.querySelector('#loginNameInput');
const chatInput = document.querySelector('#chatTextInput');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';
loginInput.focus();

function renderUserList() {
  const ul = document.querySelector('.userList');
  const count = document.querySelector('#onlineCount');
  ul.innerHTML = '';

  userList.forEach(user => {
    const li = document.createElement('li');
    const isMe = user === userName;
    li.innerHTML = `<span class="user-dot"></span>${user}${isMe ? ' <em>(Você)</em>' : ''}`;
    ul.appendChild(li);
  });

  if (count) count.textContent = `${userList.length} online`;
}

function avatarColor(name) {
  const colors = ['#2563eb','#7c3aed','#db2777','#d97706','#059669','#0891b2'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function renderMessage(type, user, msg) {
  const ul = document.querySelector('.chatList');
  const chatArea = document.querySelector('.chatArea');

  switch (type) {
    case 'status':
      ul.innerHTML += `<li class="m-status">${msg}</li>`;
      break;
    case 'msg': {
      const isMe = user === userName;
      const initial = user.charAt(0).toUpperCase();
      const color = avatarColor(user);
      if (isMe) {
        ul.innerHTML += `
          <li class="m-txt me">
            <div class="bubble">
              <span class="author me">${user}</span>
              <p>${msg}</p>
            </div>
          </li>`;
      } else {
        ul.innerHTML += `
          <li class="m-txt">
            <div class="avatar" style="background:${color}">${initial}</div>
            <div class="bubble">
              <span class="author">${user}</span>
              <p>${msg}</p>
            </div>
          </li>`;
      }
      break;
    }
  }

  chatArea.scrollTop = chatArea.scrollHeight;
}

loginInput.addEventListener('keypress', e => {
  if (e.keyCode === 13) doLogin();
});

document.querySelector('#loginBtn').addEventListener('click', doLogin);

function doLogin() {
  const name = loginInput.value.trim();
  if (name) {
    userName = name;
    document.title = `Chat - ${userName}`;
    socket.emit('join-request', userName);
  }
}

chatInput.addEventListener('keypress', e => {
  if (e.keyCode === 13) doSend();
});

document.querySelector('#sendBtn').addEventListener('click', doSend);

function doSend() {
  const txt = chatInput.value.trim();
  if (txt) {
    chatInput.value = '';
    renderMessage('msg', userName, txt);
    socket.emit('send-msg', txt);
  }
}

socket.on('user-ok', list => {
  loginPage.style.display = 'none';
  chatPage.style.display = 'flex';

  chatInput.focus();

  renderMessage('status', null, 'Conectado com sucesso!');

  userList = list;
  renderUserList();
});

socket.on('list-update', data => {
  userList = data.list;
  renderUserList();

  if (data.joined) {
    renderMessage('status', null, `${data.joined} entrou no chat.`);
  }

  if (data.left) {
    renderMessage('status', null, `${data.left} saiu do chat.`);
  }
});

socket.on('show-msg', data => {
  renderMessage('msg', data.userName, data.msg);
});

socket.on('disconnect', () => {
  renderMessage('status', null, 'Você foi desconectado.');
  userList = [];
  renderUserList();
});

socket.on('connect_error', () => {
  renderMessage('status', null, 'Tentando reconectar...');
});

socket.io.on('reconnect', () => {
  renderMessage('status', null, 'Reconectado ao servidor.');

  if (userName) {
    socket.emit('join-request', userName);
  }
});
