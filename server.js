const express = require('express');
const { PeerServer } = require('peer');

const app = express();

// إنشاء خادم PeerJS على المسار الرئيسي
const peerServer = PeerServer({
  port: 9000, // يستخدم عند التشغيل المحلي فقط
  path: '/'
});

// مسار اختبار للتأكد أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('✅ خادم PeerJS يعمل بنجاح');
});

// خادم Express لتشغيل التطبيق في Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📡 خادم Express يعمل على المنفذ ${PORT}`);
});
