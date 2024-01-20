import React, { useState } from 'react';
import { db, storage } from './firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function App() {
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState(''); // State to store the uploaded document ID
  const [inputDocumentId, setInputDocumentId] = useState('');
  const [retrievedFileUrl, setRetrievedFileUrl] = useState('');

  const onFileChange = event => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const uploadDocument = async () => {
    if (file) {
      try {
        const storageRef = ref(storage, `documents/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        const docRef = await addDoc(collection(db, 'documents'), {
          name: file.name,
          url: downloadUrl
        });
        setDocumentId(docRef.id); // Update the document ID state
        alert(`Document uploaded successfully. Document ID: ${docRef.id}`);
      } catch (error) {
        console.error('Error uploading document:', error);
        alert('Error uploading document');
      }
    }
  };

  const retrieveDocument = async () => {
    try {
      const docRef = doc(db, 'documents', inputDocumentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRetrievedFileUrl(docSnap.data().url);
        console.log('Document data:', docSnap.data());
      } else {
        console.log('No such document!');
        alert('No such document!');
      }
    } catch (error) {
      console.error('Error retrieving document:', error);
      alert('Error retrieving document');
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={uploadDocument}>Upload Document</button>
      {documentId && <p>Uploaded Document ID: {documentId}</p>}
      <br />
      <input 
        type="text" 
        value={inputDocumentId} 
        onChange={(e) => setInputDocumentId(e.target.value)} 
        placeholder="Enter document ID to retrieve" 
      />
      <button onClick={retrieveDocument}>Retrieve Document</button>
      {retrievedFileUrl && (
        <div>
          <p>Document Retrieved:</p>
          <a href={retrievedFileUrl} target="_blank" rel="noopener noreferrer">Download Document</a>
        </div>
      )}
    </div>
  );
}

export default App;
