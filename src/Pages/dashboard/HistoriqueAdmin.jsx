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
        console.log('Récupération des messages réussie');
      } catch (error) {
        console.error('Erreur lors de la récupération des messages: ', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Liste des emprunts :</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default HistoriqueAdmin;
