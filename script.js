let socket; 
let myName = ""; 
let isMicOn = false;
let localStream;

function startApp() {
    if (typeof io !== 'undefined') {
        socket = io(); 
        socket.emit('join-server', myName);
        
        socket.on('audio-stream', (data) => {
            if (data.user !== myName) {
                const audio = new Audio(data.audio);
                audio.play().catch(e => console.log("Audio play error:", e));
            }
        });

        socket.on('update-users', (u) => {
            const div = document.getElementById('user-display');
            if(div) {
                div.innerHTML = ''; 
                u.forEach(x => { div.innerHTML += '<div class="user-tag">' + x + '</div>'; });
            }
        });
        socket.on('createMessage', (d) => { addMessageToBox(d.user, d.msg); });
    }
}

async function toggleMic() {
    isMicOn = !isMicOn;
    const btn = document.getElementById('mic-trigger');
    const st = document.getElementById('status');
    
    if (isMicOn) { 
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(localStream);
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && socket) {
                    const reader = new FileReader();
                    reader.readAsDataURL(event.data);
                    reader.onloadend = () => {
                        socket.emit('audio-stream', { user: myName, audio: reader.result });
                    };
                }
            };
            mediaRecorder.start(500); 
            btn.classList.add('active'); 
            st.innerText = "ACTIVE"; 
            st.style.color = "#00ff88";
        } catch (err) {
            alert("الميكروفون لا يعمل: " + err.message);
            isMicOn = false;
        }
    } else { 
        if (localStream) localStream.getTracks().forEach(track => track.stop());
        btn.classList.remove('active'); 
        st.innerText = "STANDBY"; 
        st.style.color = "white"; 
    }
}
// اترك دوال (goStep2, finishAll, sendMsg, addMessageToBox) كما هي عندك
