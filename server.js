const express = require('express');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');
const path = require('path');

// إنشاء تطبيق Express
const app = express();

// تمكين CORS لجميع الطلبات
app.use(cors());

// إضافة تسجيل بسيط للطلبات
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// تقديم الملفات الثابتة من مجلد public (إذا كان موجودًا)
app.use(express.static(path.join(__dirname, 'public')));

// مسار اختبار للتأكد أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('✅ خادم PeerJS يعمل بنجاح');
});

// الاستماع إلى المنفذ المحدد أو 9000 افتراضيًا
const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () => {
  console.log(`📡 خادم Express يعمل على المنفذ ${PORT}`);
});

// إنشاء خادم PeerJS كجزء من خادم Express
const peerServer = ExpressPeerServer(server, {
  path: '/',
  proxied: true,
  debug: true,
  allow_discovery: true,
  // تكوين iceServers لتضمين خوادم TURN
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      // خوادم TURN من Metered.ca
      {
        urls: 'turn:a.relay.metered.ca:80',
        username: 'e7c7cb908cb158b46ecfb3d3',
        credential: 'P+A92s35w8IFXqMc'
      },
      {
        urls: 'turn:a.relay.metered.ca:80?transport=tcp',
        username: 'e7c7cb908cb158b46ecfb3d3',
        credential: 'P+A92s35w8IFXqMc'
      },
      {
        urls: 'turn:a.relay.metered.ca:443',
        username: 'e7c7cb908cb158b46ecfb3d3',
        credential: 'P+A92s35w8IFXqMc'
      },
      {
        urls: 'turn:a.relay.metered.ca:443?transport=tcp',
        username: 'e7c7cb908cb158b46ecfb3d3',
        credential: 'P+A92s35w8IFXqMc'
      }
    ]
  }
});

// استخدام خادم PeerJS
app.use('/', peerServer);

// تسجيل أحداث خادم PeerJS
peerServer.on('connection', (client) => {
  console.log(`📱 اتصال جديد: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`📴 انقطع الاتصال: ${client.getId()}`);
});

peerServer.on('error', (error) => {
  console.error('❌ خطأ في خادم PeerJS:', error);
});

// طريق للتحقق من حالة الخادم
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    connections: Object.keys(peerServer._clients).length,
    uptime: process.uptime()
  });
});
