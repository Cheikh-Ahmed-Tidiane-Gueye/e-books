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

export default function Cards() {
  const [books, setBooks] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [emprunter, setEmprunter] = useState([]);

  // Fonction pour récupérer le stock d'un livre depuis le localStorage
  // const getStock = (bookId) => {
  //   const stockKey = `stock_${bookId}`;
  //   const stock = localStorage.getItem(stockKey);
  //   return stock ? parseInt(stock, 10) : 5;
  // };

  // Fonction pour mettre à jour le stock dans le localStorage
  // const updateStock = (bookId, newStock) => {
  //   const stockKey = `stock_${bookId}`;
  //   localStorage.setItem(stockKey, newStock.toString());
  // };

 // Message
const addMessage = async (bookTitle) => {
  try {
    const messagesCollection = collection(db, "messages");
    await addDoc(messagesCollection, {
      message: `L'utilisateur a emprunté le livre "${bookTitle}"`,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erreur: ", error);
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
        await updateDoc(bookRef, { stock: stockInitial - 1 });
        setEmprunter((livres) => [...livres, bookId]);


        await addMessage(bookTitle);

        toast.success(`Vous avez emprunté le livre "${bookTitle}"`);
      } else {
        toast.error(`Livre "${bookTitle}" non disponible. Stock épuisé.`);
      }
    }
  } catch (error) {
    console.error("Erreur: ", error);
  }
};


  // Rendre
  const handleRendre = async (bookId, bookTitle) => {
    try {
      const bookRef = doc(db, "books", bookId);
      const bookDoc = await getDoc(bookRef);

      if (bookDoc.exists()) {

        const stockInitial = bookDoc.data().stock;
        
        await updateDoc(bookRef, { stock: stockInitial + 1 });
        setEmprunter((livres) => livres.filter((livre) => livre !== bookId));

        toast.info(`Vous avez rendu le livre "${bookTitle}"`);
      }
    } catch (error) {
      console.error("Erreur: ", error);
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
          ...doc.data(),
        }));
        setBooks(booksData);
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
  const nonArchivedBooks = books.filter((book) => !book.archived);

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
                style={{ width: "100%", height: "250px" }}
              />
              <div className="card-body">
                <h4 className="card-title text-truncate">{book.titre}</h4>
                <h5 className="card-auteur">{book.auteur}</h5>
                <h6 className="card-auteur">{book.genre}</h6>
                <p className="card-text text-truncate">{book.description}</p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-info p-1 me-2"
                    onClick={() => handleEmprunterClick(book.id, book.titre)}
                    disabled={emprunter.includes(book.id)}
                  >
                    Emprunter
                  </button>
                  <button
                    className="btn btn-success p-1"
                    onClick={() => handleRendre(book.id, book.titre)}
                    disabled={!emprunter.includes(book.id)}
                  >
                    Rendre
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
