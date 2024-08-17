const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();

app.use(express.static(path.join(__dirname, 'public_html')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public_html', 'index.html'));
});

const PORT = process.env.PORT || 3030

// Listen both http & https ports
const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('/home/admin/conf/web/prioritizer.eugeenyjoy.ru/ssl/prioritizer.eugeenyjoy.ru.key'),
  cert: fs.readFileSync('/home/admin/conf/web/prioritizer.eugeenyjoy.ru/ssl/prioritizer.eugeenyjoy.ru.pem'),
}, app);

httpServer.listen(3030, () => {
    console.log('HTTP Server running on port 3030');
});

httpsServer.listen(3031, () => {
    console.log('HTTPS Server running on port 3031');
});
