import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export default function ArchivedBookAdmin() {
  const [books, setBooks] = useState([]);

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

  const archivedBooks = books.filter((book) => book.archived);

  console.log(archivedBooks);

  return (
    <>
      <main className="main-container p-0 text-dark">
        <h3 className="p-4">Liste des livres archivés</h3>
        <div className="row">
          {archivedBooks.map((book) => (
          <div key={book.id} className="col-md-4 col-sm-6 my-3">
            <div className="card colcard ">
              <img
                src={book.url}
                className="card-img couv"
                alt=""
                style={{ width: "100%", height: "350px" }}
              />
              <div className="card-body">
                <h4 className="card-title text-truncate">
                  Titre: {book.titre}
                </h4>
                <h5 className="card-auteur">Auteur: {book.auteur}</h5>
                <h6 className="card-auteur">Genre: {book.genre}</h6>
                <p className="card-text text-truncate">
                  Description: {book.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        </div>
      </main>
    </>
  );
}
