import { useState, useEffect } from "react";
import Cards from "../../Composants/Cards";
import Search from "../../Composants/Search";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebaseConfig.js";

export default function BooksUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]); // Changement de nom
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [livres, setLivres] = useState([]);

  useEffect(() => {
    const fetchLivres = async () => {
      try {
        const livresCollection = collection(db, "books");
        const snapshot = await getDocs(livresCollection);
        const livresData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLivres(livresData);
      } catch (error) {
        console.error("Erreur: ", error);
      }
    };

    fetchLivres();
  }, []);

  const filterBooksByTitleAndAuthor = (searchTerm) => {
    console.log("filterBooksByTitleAndAuthor called with:", searchTerm);
    const filteredBooks = livres.filter((book) => {
      const fullName = `${book.titre} ${book.auteur}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredBooks(filteredBooks); // Changement de nom
  };

  useEffect(() => {
    filterBooksByTitleAndAuthor(searchTerm);
  }, [searchTerm, livres]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleIconClick = () => {
    setIsSearchActive(!isSearchActive);
  };

  return (
    <main className="main-container text-dark">
      <h3 className="p-3">Listes des livres</h3>
      {/* Search */}
      <Search
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        filterBooks={filterBooksByTitleAndAuthor}
        handleIconClick={handleIconClick}
        isSearchActive={isSearchActive}
      />
      {/* Fin search */}
      <Cards livres={filteredBooks} />{" "}
      {/* Utilisation du nom correct pour les livres filtrés */}
    </main>
  );
}
