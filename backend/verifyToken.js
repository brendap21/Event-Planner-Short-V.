const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = async function verifyToken(req, res, next) {

    console.log('>> Authorization header:', req.headers.authorization);

    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const idToken = authHeader.split(' ')[1];
    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        req.user = decoded;    // { uid, email, name, ... }
        return next();
    } catch (err) {
        console.error('Token inválido', err);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};