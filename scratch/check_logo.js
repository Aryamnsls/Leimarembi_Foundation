const fs = require('fs');
const http = require('http');

http.get('http://localhost:3000/leimarembi_official_logo.png', (res) => {
  console.log('Status code:', res.statusCode);
});
