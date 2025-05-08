const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();

// إنشاء خادم Express
const server = app.listen(process.env.PORT || 9000, () => {
  console.log(`📡 الخادم يعمل على المنفذ ${server.address().port}`);
});

// إنشاء خادم PeerJS مدمج مع Express
const peerServer = ExpressPeerServer(server, {
  path: '/peerjs',
  allow_discovery: true
});

app.use('/peerjs', peerServer);

// مسار اختبار للتأكد أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('✅ خادم PeerJS يعمل بنجاح');
});

// معالجة الأخطاء
peerServer.on('connection', (client) => {
  console.log(`📞 عميل متصل: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`❌ عميل منفصل: ${client.getId()}`);
});
