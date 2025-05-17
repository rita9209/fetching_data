const https = require('https');

module.exports = (req, res) => {
  const options = {
    hostname: 'script.google.com',
    path: '/macros/s/AKfycbwyn5RmjRH7Qm1v8hQdcffcAIT2X-VSm4J8KY9c_PJjfCX_QJhI_YLt8yioNXyZ_kpF/exec',
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0' // 避免被當成機器人封鎖
    }
  };

  https.get(options, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      // 被轉向了，從 Location 抓出新網址
      const redirectUrl = response.headers.location;
      https.get(redirectUrl, (finalRes) => {
        let data = '';
        finalRes.on('data', chunk => data += chunk);
        finalRes.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(data);
        });
      }).on('error', err => {
        res.status(500).send({ error: 'Redirect fetch failed' });
      });
    } else {
      // 沒有轉向，直接處理
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(data);
      });
    }
  }).on('error', (err) => {
    res.status(500).send({ error: 'Request failed' });
  });
};
