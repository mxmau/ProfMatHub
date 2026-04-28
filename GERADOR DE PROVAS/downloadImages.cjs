const https = require('https');
const fs = require('fs');

function downloadAndEncode(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
        return downloadAndEncode(res.headers.location).then(resolve).catch(reject);
      }
      
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        const mimeType = res.headers['content-type'] || 'image/png';
        resolve(`data:${mimeType};base64,${base64}`);
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const igarassu = await downloadAndEncode('https://lh3.googleusercontent.com/d/1-9sECNP9OXUwvvOX6DkHopnnoPoKOQhV');
    const saoLourenco = await downloadAndEncode('https://lh3.googleusercontent.com/d/1EWUQq0oPFwJicofvY8crFH5ApaF-H5sf');
    
    fs.writeFileSync('images.json', JSON.stringify({ igarassu, saoLourenco }));
    console.log('Done');
  } catch (err) {
    console.error(err);
  }
}

run();
