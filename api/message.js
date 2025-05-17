const https = require('https');

module.exports = (req, res) => {
  const options = {
    hostname: 'script.google.com',
    path: '/macros/s/AKfycbwyn5RmjRH7Qm1v8hQdcffcAIT2X-VSm4J8KY9c_PJjfCX_QJhI_YLt8yioNXyZ_kpF/exec',
    method: 'GET',
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => data += chunk);
    proxyRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.status(proxyRes.statusCode).send(data);
    });
  });

  proxyReq.on('error', () => {
    res.status(500).send({ error: 'Proxy failed' });
  });

  proxyReq.end();
};
