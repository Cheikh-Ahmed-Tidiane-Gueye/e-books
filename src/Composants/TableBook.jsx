import { useState, useEffect } from "react";
import './composant.css';
// import recherche from '../assets/gif/recherche.gif';
import poubelle from '../assets/gif/poubelle.gif';
import archiver from '../assets/gif/archiver.gif';
import voir from '../assets/gif/voir.gif';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import toast, { Toaster } from 'react-hot-toast';

export default function TableBook() {

    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
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

    const indexOfLastElement = currentPage * elementsPerPage;
    const indexOfFirstElement = indexOfLastElement - elementsPerPage;

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredlivres, setFilteredlivres] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const fetchLivresFromDatabase = async () => {
        const livresSnapshot = await getDocs(collection(db, 'books'));
        const livresData = livresSnapshot.docs.map(doc => ({ livreId: doc.id, ...doc.data() }));
        setLivres(livresData);
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
            url: url
        };

        try {
            const docRef = await addDoc(collection(db, 'books'), nouvellivre);
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
    };

    useEffect(() => {
        if (alerte) {
            setTimeout(() => {
                setAlerte(null);
            }, 3000);
        }
    }, [alerte]);

    const supprimerlivre = async (livreId) => {
        try {
            await deleteDoc(doc(db, 'books', livreId));
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


    return (
      <>
        <div
          className="contener-fluid d-flex justify-content-end align-items-center mx-4"
          data-aos="fade-down-right"
        >
          <div className={`search ${isSearchActive ? "active" : ""}`}>
            <div className="iconSearch" onClick={handleIconClick}>
              {/* <img src= alt="search" /> */}
            </div>
            <div className="input">
              <input
                type="search"
                placeholder="Rechercher"
                id="mysearch"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

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
                style={{ display: showDetailsModal ? "block" : "none", height: "500px" }}
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
                        className="btn btn-info btn-rounded text-light mx-4 w-75"
                        onClick={ajouterlivre}
                      >
                        <h6 className="p-0 m-0">Ajouter</h6>
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
                      <tr key={livre.livreId} className="">
                        <td className="">{livre.titre}</td>
                        <td className="">{livre.auteur}</td>
                        <td className="td-limit">{livre.description}</td>
                        <td className="">{livre.genre}</td>
                        <td className=""></td>
                        <td className="d-flex">
                          <button className="sup rounded-circle mx-1">
                            <img
                              src={voir}
                              alt="detail"
                              className="rounded-circle buttonAction"
                              onClick={() => handleShowDetailsModal(livre)}
                            />
                          </button>
                          <button className="sup rounded-circle mx-1">
                            <img
                              src={archiver}
                              alt="archiver"
                              className="rounded-circle buttonAction"
                              // onClick={}
                            />
                          </button>
                          <button className="sup rounded-circle mx-1">
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
