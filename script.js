let socket; 
let myName = ""; 
let isMicOn = false;

function goStep2() {
    const passInput = document.getElementById('pass-val');
    if (passInput && passInput.value === "soft 23") {
        document.getElementById('step-pass').style.display = 'none';
        document.getElementById('step-name').style.display = 'flex';
    } else { 
        alert("كلمة السر خاطئة!"); 
    }
}

function finishAll() {
    const n = document.getElementById('name-val').value;
    if (n.trim() !== "") {
        myName = n;
        document.getElementById('step-name').style.display = 'none';
        const s = document.getElementById('welcome-splash');
        document.getElementById('welcome-txt').innerText = "WELCOME " + myName;
        s.style.display = 'flex';
        setTimeout(() => {
            s.style.display = 'none';
            document.getElementById('server-interface').style.display = 'flex';
            startApp();
        }, 2000);
    }
}

function toggleMic() {
    isMicOn = !isMicOn;
    const btn = document.getElementById('mic-trigger');
    const st = document.getElementById('status');
    if (isMicOn) { 
        btn.classList.add('active'); 
        st.innerText = "ACTIVE"; 
        st.style.color = "#00ff88"; 
    } else { 
        btn.classList.remove('active'); 
        st.innerText = "STANDBY"; 
        st.style.color = "white"; 
    }
}

function addMessageToBox(user, msg) {
    const li = document.createElement('li');
    li.innerHTML = '<strong style="color:var(--main-blue)">' + user + ':</strong> ' + msg;
    const box = document.getElementById('msg-box');
    if (box) {
        box.appendChild(li);
        box.scrollTop = box.scrollHeight;
    }
}

function startApp() {
    if (typeof io !== 'undefined') {
        socket = io(); 
        socket.emit('join-server', myName);
        socket.on('update-users', (u) => {
            const div = document.getElementById('user-display');
            if(div) {
                div.innerHTML = ''; 
                u.forEach(x => { 
                    div.innerHTML += '<div class="user-tag">' + x + '</div>'; 
                });
            }
        });
        socket.on('createMessage', (d) => {
            addMessageToBox(d.user, d.msg);
        });
    }
}

function sendMsg() {
    const inp = document.getElementById('chat-input');
    const val = inp.value.trim();
    if(val !== "") {
        if(socket && socket.connected) {
            socket.emit('message', val);
        } else {
            addMessageToBox(myName, val);
        }
        inp.value = ''; 
    }
}