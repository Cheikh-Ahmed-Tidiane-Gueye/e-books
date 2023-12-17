import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const ModifierProfil = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const utilisateursCollection = collection(db, 'utilisateurs');
        const utilisateursQuery = query(utilisateursCollection, where('userId', '==', user.uid));

        try {
          const utilisateursSnapshot = await getDocs(utilisateursQuery);

          if (utilisateursSnapshot.size === 1) {
            utilisateursSnapshot.forEach((doc) => {
              setUserData(doc.data());
            });
          } else {
            console.error("Aucun utilisateur trouvé.");
          }
        } catch (error) {
          console.error("Erreur:", error);
        }
      } else {
        setUserData(null);
      }
    };

    fetchUserData();
  }, []);

  return (
    <main className="main-container p-0 text-dark">
      <h2 className='text-start mt-5'>Modifier le Profil</h2>

      {userData && (
        <div className='text-start mt-5 fs-4'>
          <p>Nom: {userData.nom}</p>
          <p>Prenom: {userData.prenom}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
    </main>
  );
};

export default ModifierProfil;
