const fs = require('fs');

const mdContent = fs.readFileSync('firebase - account.md', 'utf8');
const base64Match = mdContent.replace(/\s+/g, '').match(/-----BEGINPRIVATEKEY-----(.*?)-----ENDPRIVATEKEY-----/);

if (base64Match) {
  const base64 = base64Match[1].replace(/\\n/g, '').replace(/\\r/g, '');
  let formatted = '';
  for (let i = 0; i < base64.length; i += 64) {
    formatted += base64.substring(i, i + 64) + '\\n';
  }
  if (formatted.endsWith('\\n')) {
    formatted = formatted.slice(0, -2);
  }
  let env = fs.readFileSync('.env', 'utf8');
  env = env.replace(/(FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n)(.*?)(\\n-----END PRIVATE KEY-----")/, '\$1' + formatted + '\$3');
  fs.writeFileSync('.env', env);
  console.log('Fixed from MD');
} else {
  console.log('Could not find base64');
}
