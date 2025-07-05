const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

// 証明書ファイルのパス
const certPath = './certs/';
const keyFilePath = `${certPath}nginx.key`;
const certFilePath = `${certPath}nginx.crt`;

// 証明書を読み込む
const serverOptions = {
  key: fs.readFileSync(keyFilePath),
  cert: fs.readFileSync(certFilePath),
};

// HTTPSサーバーを作成
const server = https.createServer(serverOptions);

// HTTPSサーバー上でWebSocketサーバーを起動
const wss = new WebSocket.Server({ server });

server.listen(8080, () => {
  console.log('Signaling server started securely on port 8080 (WSS)');
});

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', message => {
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', error => {
    console.error('WebSocket error:', error);
  });
});