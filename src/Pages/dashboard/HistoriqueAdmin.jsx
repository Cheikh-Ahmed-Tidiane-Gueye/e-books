import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const HistoriqueAdmin = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesCollection = collection(db, 'messages');
        const snapshot = await getDocs(messagesCollection);
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
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

  return (
    <div className='m-4 '>
      <h2 className='text-dark fs-4'>Historique des emprunts :</h2>
      <ul>
        {messages.map((message) => (
          <li className='text-dark' key={message.id}>{message.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default HistoriqueAdmin;
