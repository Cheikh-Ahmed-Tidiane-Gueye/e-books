import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const HistoriqueAdmin = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesCollection = collection(db, 'messages');
        const snapshot = await getDocs(messagesCollection);
        const messagesData = snapshot.docs.map((doc, index) => ({
          id: index + 1,
          ...doc.data(),
        }));
        setMessages(messagesData);
        console.log('Récupération réussie');
      } catch (error) {
        console.error('Erreur: ', error);
      }
    };

    fetchMessages();
  }, []);

  const handleClear = async () => {
    try {
      const messagesCollection = collection(db, 'messages');
      const snapshot = await getDocs(messagesCollection);

      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setMessages([]);
      console.log('Historique vidé');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <main className='main-container p-0 text-dark'>
      <div>
        <h2 className='mt-3'>Liste des emprunts :</h2>
        {messages.length > 0 && (
          <div className='mb-4 ms-3'>
            <button className="btn btn-danger btn-sm" onClick={handleClear}>
              Vider l'historique
            </button>
          </div>
        )}
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Notification</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.id}</td>
                <td>{message.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default HistoriqueAdmin;
