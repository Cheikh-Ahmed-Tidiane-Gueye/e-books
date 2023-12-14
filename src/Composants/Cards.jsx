import { useState, useEffect } from 'react'
import "./composant.css";
import voir from '../assets/gif/voir.gif';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../config/firebaseConfig.js';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export default function Cards({ livres }) {
  const [books, setBooks] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  // const [emprunter, setEmprunter] = useState([]);
  const [emprunts, setEmprunts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        setCurrentUser(user);
        console.log("Utilisateur :", user);
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de l'utilisateur :",
          error
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // Message
  const addMessage = async (bookTitle) => {
    try {
      const messagesCollection = collection(db, "messages");
      const userName = currentUser
        ? currentUser.displayName
        : "Utilisateur inconnu";

      await addDoc(messagesCollection, {
        message: `${userName} a emprunté le livre "${bookTitle}"`,
        timestamp: serverTimestamp(),
      });
      
    } catch (error) {
      console.error("Erreur: ", error);
    }
  }
// Données de l'emprunt / infos 

const InfoEmprunts = async (bookTitle, userId, userName) => {
  try {
    const infosUserCollection = collection(db, "livre&user");

    await addDoc(infosUserCollection, {
      bookTitle,
      userId,
      userName,
      Timestamp: serverTimestamp(),
    });

    console.log("Informations d'emprunt stockées avec succès.");
  } catch (error) {
    console.error("Erreur:", error);
  }
};


// Emprunter
const handleEmprunterClick = async (bookId, bookTitle) => {
  try {
    const bookRef = doc(db, "books", bookId);
    const bookDoc = await getDoc(bookRef);

    if (bookDoc.exists()) {
      const stockInitial = bookDoc.data().stock;

      if (stockInitial > 0) {
        console.log("EmprunterClick: Stock initial", stockInitial);

        await updateDoc(bookRef, {
          stock: stockInitial - 1,
          emprunter: true,
          rendre: false,
          isEmprunte: true,
        });

        setEmprunts((livres) => [...livres, bookId]);

        await InfoEmprunts(bookTitle, currentUser.uid, currentUser.displayName);
        await addMessage(bookTitle);
        toast.success(`Vous avez emprunté le livre "${bookTitle}"`);
      } else {
        toast.error(`Livre "${bookTitle}" non disponible. Stock épuisé.`);
      }
    }
  } catch (error) {
    console.error("Erreur handleEmprunterClick: ", error);
  }
};

// Rendre
const handleRendre = async (bookId, bookTitle) => {
  try {
    const bookRef = doc(db, "books", bookId);
    const bookDoc = await getDoc(bookRef);

    if (bookDoc.exists()) {
      const stockInitial = bookDoc.data().stock;

      console.log("Rendre: Stock initial", stockInitial);

      await updateDoc(bookRef, {
        stock: stockInitial + 1,
        emprunter: false,
        rendre: true,
        isEmprunte: false,
      });

      setEmprunts((livres) => livres.filter((livre) => livre !== bookId));

      toast.info(`Vous avez rendu le livre "${bookTitle}"`);
    }
  } catch (error) {
    console.error("Erreur handleRendre: ", error);
  }
};



    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      delay: 200,
    });

    useEffect(() => {
      const fetchBooks = async () => {
        try {
          const booksCollection = collection(db, "books");
          const snapshot = await getDocs(booksCollection);
          const booksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            emprunter: doc.data().emprunter,
            isEmprunte: doc.data().isEmprunte || false,
            ...doc.data(),
          }));
          setBooks(booksData);
          setEmprunts(booksData.filter(book => book.isEmprunte).map(book => book.id));
          console.log("Récupération réussie");
        } catch (error) {
          console.error("Erreur: ", error);
          console.log("Échec");
        }
      };
      
      

      fetchBooks();
    }, []);

    // Ouverture du modal pour les details
    const handleShowDetailsModal = (book) => {
      setSelectedBook(book);
      setShowDetailsModal(true);
    };

    // fermeture du modal pour les details
    const handleCloseDetailsModal = () => {
      setSelectedBook(null);
      setShowDetailsModal(false);
    };

    // filtre des livres non archivés
    const nonArchivedBooks = livres.filter((book) => !book.archived);

    return (
      <div className="container-fluid cards">
        <ToastContainer />
        <div className="row">
          {nonArchivedBooks.map((book) => (
            <div key={book.id} className="col-md-4 col-sm-6 my-3">
              <div className="card colcard ">
                <img
                  src={book.url}
                  className="card-img couv"
                  alt=""
                  style={{ width: "100%", height: "350px" }}
                />
                <div className="card-body">
                  <h4 className="card-title text-truncate">{book.titre}</h4>
                  <h5 className="card-auteur">{book.auteur}</h5>
                  <h6 className="card-auteur">{book.genre}</h6>
                  <p className="card-text text-truncate">{book.description}</p>
                  <div className="d-flex justify-content-between mt-2">
                  <button
                    className="btn btn-info p-1 me-2"
                    onClick={() => {
                      if (emprunts.includes(book.id)) {
                        handleRendre(book.id, book.titre);
                      } else {
                        handleEmprunterClick(book.id, book.titre);
                      }
                    }}
                  >
                    {emprunts.includes(book.id) ? "Rendre" : "Emprunter"}
                  </button>
                    <button className="sup rounded-circle mx-1">
                      <img
                        src={voir}
                        alt="detail"
                        className="rounded-circle buttonAction"
                        onClick={() => handleShowDetailsModal(book)}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Modal detail */}
          <div
            className={`modal fade ${showDetailsModal ? "show" : ""}`}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            style={{
              display: showDetailsModal ? "block" : "none",
              height: "500px",
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div
                  className="modal-header text-light"
                  style={{ backgroundColor: "#263043" }}
                >
                  <h5 className="modal-title" id="exampleModalLabel">
                    Détails du book
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={handleCloseDetailsModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {selectedBook && (
                    <div>
                      <h5 className="">{selectedBook.titre}</h5>
                      <p>Auteur: {selectedBook.auteur}</p>
                      <p className="" style={{ wordWrap: "break-word" }}>
                        Description: {selectedBook.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* fin */}
        </div>
      </div>
    );
  } 