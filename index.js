const express = require('express');
const cors = require('cors'); 
const admin = require('firebase-admin');
const app = express();

app.use(cors()); 
app.use(express.json());

const serviceAccount = require('./api.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/getData', async (req, res) => {
  try {
    const snapshot = await db.collection('123').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/addData', async (req, res) => {
  try {
    const { newData } = req.body;
    const addedDoc = await db.collection('123').add(newData);
    res.status(201).send({ id: addedDoc.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running`);
});

