const startButton = document.getElementById('startButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let peerConnection;

// STUNサーバーの情報を設定（ローカルでも記述しておくのが一般的）
const configuration = {
  'iceServers': [
    { 'urls': 'stun:stun.l.google.com:19302' }
  ]
};

// --- シグナリングサーバーへの接続 ---
// Dockerで動かす場合、'localhost' はDockerコンテナから見たホストマシンを指すため、
// ブラウザからは `location.hostname`（アクセスしているドメイン名/IP）を使うのが確実です。
const ws = new WebSocket(`wss://${location.hostname}:8080`);

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received from signaling server:', message);

  if (message.offer) {
    // 他のピアからOfferを受け取った場合
    handleOffer(message.offer);
  } else if (message.answer) {
    // Answerを受け取った場合
    handleAnswer(message.answer);
  } else if (message.candidate) {
    // ICE Candidateを受け取った場合
    handleCandidate(message.candidate);
  }
};

// --- WebRTC関連の処理 ---

// 1. スタートボタンが押されたときの処理
startButton.onclick = async () => {
  // カメラとマイクへのアクセスを要求
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  // Offerを送信する（接続を開始する側）
  createOffer();
  startButton.disabled = true;
};

// PeerConnectionを初期化
function createPeerConnection() {
  peerConnection = new RTCPeerConnection(configuration);

  // ICE Candidateが生成されたときのイベント
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('Sending ICE candidate');
      ws.send(JSON.stringify({ 'candidate': event.candidate }));
    }
  };

  // 相手から映像/音声トラックが届いたときのイベント
  peerConnection.ontrack = (event) => {
    console.log('Track received');
    remoteVideo.srcObject = event.streams[0];
  };

  // 自分の映像/音声トラックをPeerConnectionに追加
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });
}

// Offerを生成して送信
async function createOffer() {
  console.log('Creating Offer...');
  createPeerConnection();
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  ws.send(JSON.stringify({ 'offer': offer }));
}

// Offerを受け取ったときの処理
async function handleOffer(offer) {
  console.log('Handling Offer...');
  if (!peerConnection) {
    createPeerConnection();
  }
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  
  // Answerを生成して送信
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  ws.send(JSON.stringify({ 'answer': answer }));
}

// Answerを受け取ったときの処理
async function handleAnswer(answer) {
  console.log('Handling Answer...');
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// ICE Candidateを受け取ったときの処理
async function handleCandidate(candidate) {
  console.log('Handling Candidate...');
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}