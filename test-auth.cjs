const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// 1. Load .env manually exactly like dev-server.js does
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
      value = value.replace(/\\n/gm, '\n');
    }
    value = value.replace(/(^['"]|['"]$)/g, '').trim();
    process.env[key] = value;
  }
});

// 2. Initialize Firebase exactly like firebase-admin.js does
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

// 3. Test
const db = admin.firestore();
db.collection('enquiries').limit(1).get()
  .then(() => {
    console.log('SUCCESS: Authenticated to Firestore!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILED TO AUTHENTICATE:', err.message);
    process.exit(1);
  });
