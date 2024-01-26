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
// getting all data
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
    res.status(201).send({ id: addedDoc.id }); // sending the id back to client if he wants to retrive/ update /delete data later 
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// to update the data we will have to pass the document id as well 
app.put('/updateData/:id', async (req, res) => {
  try {
    const docRef = db.collection('123').doc(req.params.id);
    await docRef.update(req.body);
    res.status(200).send('Updated');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// we will habe to pass the id as well
app.delete('/deleteData/:id', async (req, res) => {
  try {
    const docRef = db.collection('123').doc(req.params.id);
    await docRef.delete();
    res.status(200).send('Deleted');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// getting only a single record by passing id
app.get('/getData/:id', async (req, res) => {
  try {
    const docRef = db.collection('123').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).send('Not found');
    } else {
      res.status(200).send({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running`);
});

