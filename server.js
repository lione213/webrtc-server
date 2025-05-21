const express = require('express');
const { PeerServer } = require('peer');
const cors = require('cors');
const app = express();

// استخدام CORS للسماح بالوصول من أي مصدر
app.use(cors());

// المنفذ الذي سيستمع عليه خادم Express
const EXPRESS_PORT = process.env.PORT || 3000;

// المنفذ الذي سيستمع عليه خادم PeerJS
// يمكن أن يكون نفس منفذ Express إذا كانت هناك مشكلة في المنافذ المتعددة
const PEER_PORT = process.env.PEER_PORT || EXPRESS_PORT;

// إنشاء خادم PeerJS مع إعدادات بسيطة أولاً
const peerServer = PeerServer({
  port: PEER_PORT,
  path: '/peerjs',
  allow_discovery: true,
  // تبسيط إعدادات خادم ICE
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
      // ملاحظة: تم إزالة خادم TURN لأنه قد يكون سبب المشكلة
    ]
  }
});

// مسار رئيسي للتأكد من أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('✅ خادم PeerJS يعمل بشكل سليم');
});

// مسار لعرض معلومات عن خادم PeerJS
app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    peerjs_port: PEER_PORT,
    express_port: EXPRESS_PORT,
    peer_path: '/peerjs'
  });
});

// تشغيل خادم Express
app.listen(EXPRESS_PORT, () => {
  console.log(`📡 خادم Express يعمل على المنفذ ${EXPRESS_PORT}`);
  console.log(`📡 خادم PeerJS يعمل على المنفذ ${PEER_PORT} والمسار /peerjs`);
});

// معالجة الأخطاء غير المتوقعة
process.on('uncaughtException', (err) => {
  console.error('خطأ غير متوقع:', err);
  // لا نقوم بإنهاء العملية هنا لتجنب إيقاف الخادم فجأة
});
