import { useState, useEffect } from "react";
import Cards from "../../Composants/Cards";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebaseConfig.js";
import Search from "../../Composants/Search.jsx";

export default function BooksUser() {
  const [livres, setLivres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

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

  const handleIconClick = () => {
    setIsSearchActive(!isSearchActive);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fonction pour filtrer les livres en fonction du terme de recherche
  const filterBooks = (term) => {
    setSearchTerm(term);
  };

  // Fonction pour filtrer les livres en fonction du terme de recherche
  const filteredLivres = livres.filter((livre) =>
    livre.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="main-container text-dark">
      <h3 className="p-3">Listes des livres</h3>
      {/* Search */}
      <Search
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleIconClick={handleIconClick}
        isSearchActive={isSearchActive}
      />
      {/* Fin search */}
      <Cards livres={filteredLivres} />
    </main>
  );
}
