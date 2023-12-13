import { useState, useEffect } from "react";
import './composant.css';
// import recherche from '../assets/gif/recherche.gif';
import poubelle from '../assets/gif/poubelle.gif';
import archiver from '../assets/gif/archiver.gif';
import voir from '../assets/gif/voir.gif';
import editer from "../assets/gif/editer.gif";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";


import { db } from '../config/firebaseConfig.js';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import toast, { Toaster } from 'react-hot-toast';
import Search from "./Search.jsx";

export default function TableBook() {
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    delay: 200,
  });

  const [livres, setLivres] = useState([]);
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");

  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [url, setUrl] = useState("");
  const [alerte, setAlerte] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [elementsPerPage] = useState(5);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Ajoutez un nouvel état pour suivre le livre à éditer
  const [selectedEditBook, setSelectedEditBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const indexOfLastElement = currentPage * elementsPerPage;
  const indexOfFirstElement = indexOfLastElement - elementsPerPage;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredlivres, setFilteredlivres] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchLivresFromDatabase = async () => {
    const livresSnapshot = await getDocs(collection(db, "books"));
    const livresData = livresSnapshot.docs.map((doc) => ({
      livreId: doc.id,
      ...doc.data(),
    }));

    setLivres(livresData); // Mettre à jour l'état avec les données de la base de données
    setFilteredlivres(livresData); // Utiliser les données pour l'affichage
  };

  useEffect(() => {
    fetchLivresFromDatabase();
  }, []);

  useEffect(() => {
    const filteredBooks = livres.filter((livre) => {
      const fullName = `${livre.titre} ${livre.auteur}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredlivres(filteredBooks);
  }, [searchTerm, livres]);

const ajouterlivre = async () => {
  if (!titre || !auteur || !description || !genre || !url) {
    setAlerte("Veuillez remplir tous les champs avant d'ajouter un livre.");
    return;
  }

  if (selectedEditBook) {
    // Si un livre est en cours d'édition, mettez à jour ses données au lieu d'ajouter un nouveau livre
    try {
      await updateDoc(doc(db, "books", selectedEditBook.livreId), {
        titre: titre,
        auteur: auteur,
        description: description,
        genre: genre,
        url: url,
      });

      fetchLivresFromDatabase();
      setTitre("");
      setAuteur("");
      setDescription("");
      setGenre("");
      setUrl("");
      toast.success("Livre mis à jour avec succès");
      setSelectedEditBook(null); // Réinitialisation de selectedEditBook à null
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre :", error);
    }
  } else {
    // Si aucun livre n'est en cours d'édition, ajoutez un nouveau livre
    const livreExiste = livres.some(
      (livre) => livre.titre === titre && livre.auteur === auteur
    );

    if (livreExiste) {
      setAlerte("Ce livre existe déjà.");
      return;
    }

    const nouvellivre = {
      titre: titre,
      auteur: auteur,
      description: description,
      genre: genre,
      url: url,
    };

    try {
      const docRef = await addDoc(collection(db, "books"), {
        ...nouvellivre,
        stock: 5,
      });
      console.log("Document ajouté avec l'ID :", docRef.id);
      fetchLivresFromDatabase();
      setTitre("");
      setAuteur("");
      setDescription("");
      setGenre("");
      setUrl("");
      toast.success("Livre ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du document :", error);
    }
  }
};

  useEffect(() => {
    setIsEditing(!!selectedEditBook);
  }, [selectedEditBook]);

  useEffect(() => {
    if (alerte) {
      setTimeout(() => {
        setAlerte(null);
      }, 3000);
    }
  }, [alerte]);

  const supprimerlivre = async (livreId) => {
    try {
      await deleteDoc(doc(db, "books", livreId));
      toast.error("Livre supprimé");
      console.log("Document supprimé avec l'ID :", livreId);
      fetchLivresFromDatabase();
    } catch (error) {
      console.error("Erreur lors de la suppression du document :", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleIconClick = () => {
    setIsSearchActive(!isSearchActive);
  };

  // Ouverture du modal pour les details
  const handleShowDetailsModal = (livre) => {
    setSelectedBook(livre);
    setShowDetailsModal(true);
  };

  // fermeture du modal pour les details
  const handleCloseDetailsModal = () => {
    setSelectedBook(null);
    setShowDetailsModal(false);
  };

  const filterBooks = (searchTerm) => {
    const filteredBooks = livres.filter((livre) => {
      const fullName = `${livre.titre} ${livre.auteur}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    
    setFilteredlivres(filteredBooks);
  };
  // Archivage

  const handleArchive = async (livreId, nouvelArchivage, livre) => {
    try {
      await updateDoc(doc(db, "books", livreId), {
        archived: nouvelArchivage,
      });

      // Mettre à jour l'état local avec l'état archivé actualisé
      setFilteredlivres((livresPrecedents) =>
        livresPrecedents.map((livrePrecedent) =>
          livrePrecedent.livreId === livreId
            ? { ...livrePrecedent, archived: nouvelArchivage }
            : livrePrecedent
        )
      );

      toast.success(
        `Le livre "${livre.titre}" a été ${
          nouvelArchivage ? "archivé" : "désarchivé"
        }.`
      );
    } catch (error) {
      console.error("Erreur :", error);
      toast.error(
        `Erreur lors de l'archivage/désarchivage du livre "${livre.titre}`
      );
    }
  };

  // Fin de l'archivage

  // Fonction pour mettre à jour les informations du livre sélectionné dans les champs de saisie
  const handleEditBook = (livre) => {
    setSelectedEditBook(livre); // Mettre à jour l'état pour le livre à éditer
    setShowDetailsModal(false); // Fermer le modal des détails (si ouvert)
    setTitre(livre.titre);
    setAuteur(livre.auteur);
    setDescription(livre.description);
    setGenre(livre.genre);
    setUrl(livre.url);
  };

  // Modifiez la logique d'affichage des champs de saisie en fonction de l'état de selectedEditBook
  useEffect(() => {
    if (selectedEditBook) {
      setTitre(selectedEditBook.titre);
      setAuteur(selectedEditBook.auteur);
      setDescription(selectedEditBook.description);
      setGenre(selectedEditBook.genre);
      setUrl(selectedEditBook.url);
    } else {
      setTitre("");
      setAuteur("");
      setDescription("");
      setGenre("");
      setUrl("");
    }
  }, [selectedEditBook]);


  return (
    <>
      {/* Search */}
      <Search
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        filterBooks={filterBooks}
        handleIconClick={handleIconClick}
        isSearchActive={isSearchActive}
      />
      {/* Fin search */}
      <div className="container-fluid" data-aos="fade-up">
        <Toaster />
        <div className="row d-flex justify-content-center">
          <div className="alerte text-center mt-4 rounded-5">{alerte}</div>
          <div className="col-12">
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
                      Détails du Livre
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
            <table
              className="table table-striped align-middle mb-0 bg-white my-3"
              id="table-eleve"
            >
              <thead>
                <tr className="w-100">
                  <th className="py-3 px-1">
                    <div className="form-outline">
                      <input
                        type="text"
                        id="formControlSm"
                        className="form-control form-control-sm"
                        autoComplete="on"
                        placeholder="Titre"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                      />
                    </div>
                  </th>
                  <th className="py-3 px-1">
                    <div className="form-outline">
                      <input
                        type="text"
                        id="formControlSm"
                        className="form-control form-control-sm"
                        autoComplete="on"
                        placeholder=" Auteur"
                        value={auteur}
                        onChange={(e) => setAuteur(e.target.value)}
                      />
                    </div>
                  </th>
                  {/* Champs de saisie pour la description */}
                  <th className="py-3 px-1">
                    <div className="form-outline">
                      <input
                        type="text"
                        id="formControlSm"
                        className="form-control form-control-sm"
                        autoComplete="on"
                        placeholder=" Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </th>
                  {/* Champs de saisie pour le genre */}
                  <th className="py-3 px-1">
                    <div className="form-outline">
                      <input
                        type="text"
                        id="formControlSm"
                        className="form-control form-control-sm"
                        autoComplete="on"
                        placeholder=" Genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                      />
                    </div>
                  </th>
                  {/* Champs de saisie pour le url */}
                  <th className="py-3 px-1">
                    <div className="form-outline">
                      <input
                        type="url"
                        id="formControlSm"
                        className="form-control form-control-sm"
                        autoComplete="on"
                        placeholder=" URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                  </th>
                  {/* Bouton d'ajout d'un nouvel livre */}
                  <th colSpan="3" className="py-3">
                    <button
                      type="button"
                      className="btn btn-success btn-rounded text-light mx-4 w-75"
                      onClick={ajouterlivre}
                    >
                      <h6 className="p-0 m-0">
                        {isEditing ? "Mettre à jour" : "Ajouter"}
                      </h6>
                    </button>
                  </th>
                </tr>
                <tr className="">
                  <th>Titre</th>
                  <th>auteur</th>
                  <th>description</th>
                  <th>genre</th>
                  <th></th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredlivres
                  .slice(indexOfFirstElement, indexOfLastElement)
                  .map((livre) => (
                    <tr
                      key={livre.livreId}
                      className={livre.archived ? "livre-archive" : ""}
                    >
                      <td className="td-limit">{livre.titre}</td>
                      <td className="td-limit">{livre.auteur}</td>
                      <td className="td-limit">{livre.description}</td>
                      <td className="td-limit">{livre.genre}</td>
                      <td className="td-limit"></td>
                      <td className="d-flex">
                        <button className="btn-md rounded-circle mx-1">
                          <img
                            src={voir}
                            alt="detail"
                            className="rounded-circle buttonAction "
                            onClick={() => handleShowDetailsModal(livre)}
                          />
                        </button>
                        <button
                          className="btn-md rounded-circle mx-1"
                          onClick={() => handleEditBook(livre)}
                        >
                          <img
                            src={editer}
                            alt="éditer"
                            className="rounded-circle buttonAction"
                          />
                        </button>
                        <button
                          className="btn-md rounded-circle mx-1 btn-archiver"
                          onClick={() =>
                            handleArchive(livre.livreId, !livre.archived, livre)
                          }
                        >
                          <img
                            src={archiver}
                            alt="archiver"
                            className="rounded-circle buttonAction"
                          />
                        </button>

                        <button className="btn-md rounded-circle mx-1">
                          <img
                            src={poubelle}
                            alt="supprimer"
                            className="rounded-circle buttonAction"
                            onClick={() => supprimerlivre(livre.livreId)}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <nav>
              <ul className="pagination justify-content-center p-1">
                {Array.from({
                  length: Math.ceil(filteredlivres.length / elementsPerPage),
                }).map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      index + 1 === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
