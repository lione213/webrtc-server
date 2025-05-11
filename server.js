const express = require('express');
const { PeerServer } = require('peer');

const app = express();

// إنشاء خادم PeerJS مع إعدادات متقدمة
const peerServer = PeerServer({
  port: process.env.PORT || 9000,
  path: '/',
  allow_discovery: true, // يسمح للمتصلين برؤية بعضهم البعض
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // خادم STUN مجاني
      { urls: "turn:your-turn-server.com", username: "user", credential: "pass" } // خادم TURN (يجب توفيره إذا كنت بحاجة لاتصال ثابت)
    ]
  }
});

// مسار اختبار للتأكد من أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('✅ خادم PeerJS يعمل بشكل سليم');
});

// تشغيل خادم Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📡 خادم Express يعمل على المنفذ ${PORT}`);
});
