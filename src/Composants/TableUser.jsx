import { useState, useEffect } from "react";
import "./composant.css";

import Search from "./Search.jsx";

import { MdBlock } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import { db, auth, deleteFirebaseUser } from "../config/firebaseConfig.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { deleteUser } from "firebase/auth";

import AOS from "aos";
import "aos/dist/aos.css";

import toast, { Toaster } from "react-hot-toast";

export default function TableUser() {
  // Initialisation des états avec useState
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [elementsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Calcul des index pour la pagination
  const indexOfLastUser = currentPage * elementsPerPage;
  const indexOfFirstUser = indexOfLastUser - elementsPerPage;

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Effet useEffect pour récupérer les utilisateurs depuis Firestore
  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const utilisateursCollection = collection(db, "utilisateurs");
        const utilisateursSnapshot = await getDocs(utilisateursCollection);

        const utilisateursData = [];
        utilisateursSnapshot.forEach((doc) => {
          utilisateursData.push({ id: doc.id, ...doc.data() });
        });

        setUtilisateurs(utilisateursData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
      }
    };

    fetchUtilisateurs();
  }, []);

  // Gestion du changement de terme de recherche
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Gestion de l'activation/désactivation de la recherche
  const handleIconClick = () => {
    setIsSearchActive(!isSearchActive);
  };

  // Filtrage des utilisateurs en fonction du terme de recherche
  const filterUsers = (searchTerm) => {
    const filteredUsers = utilisateurs.filter((user) => {
      const fullName = `${user.prenom} ${user.nom} ${user.email}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    return filteredUsers;
  };

  // Filtrage des utilisateurs en cours
  const filteredUsers = filterUsers(searchTerm);
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleBlockUser = async (userId) => {
    try {
      const userRef = doc(db, "utilisateurs", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const isBlocked = userDoc.data().blocked; // Vérifie si l'utilisateur est déjà bloqué

        await updateDoc(userRef, {
          blocked: !isBlocked, // Inverse l'état de blocage de l'utilisateur dans Firestore
        });

        const updatedUsers = utilisateurs.map((user) =>
          user.id === userId ? { ...user, blocked: !isBlocked } : user
        );
        setUtilisateurs(updatedUsers);

        if (isBlocked) {
          toast.success("L'utilisateur a été débloqué avec succès.");
        } else {
          toast.success("L'utilisateur a été bloqué avec succès.");
        }
      } else {
        console.error("L'utilisateur n'existe pas.");
        toast.error("Erreur : l'utilisateur n'existe pas.");
      }
    } catch (error) {
      console.error(
        "Erreur lors du blocage/deblocage de l'utilisateur :",
        error
      );
      toast.error("Erreur lors du blocage/deblocage de l'utilisateur.");
    }
  };


  return (
    <>
      {/* Composant Search pour la barre de recherche */}
      <Search
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        filterBooks={filterUsers}
        handleIconClick={handleIconClick}
        isSearchActive={isSearchActive}
      />
      {/* Contenu de la table d'utilisateurs */}
      <div className="container-fluid" data-aos="fade-up">
        <Toaster />
        <div className="row d-flex justify-content-center">
          <div className="col-12">
            <table
              className="table table-striped align-middle mb-0 bg-white my-3"
              id="table-eleve"
            >
              {/* En-tête de la table */}
              <thead>
                <tr className="">
                  <th>Prenom</th>
                  <th>Nom</th>
                  <th>Adresse email</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {/* Corps de la table */}
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index}>
                    {/* Colonnes des données utilisateur */}
                    <td>{user.prenom}</td>
                    <td>{user.nom}</td>
                    <td>{user.email}</td>
                    {/* Action sur l'utilisateur (bouton Block) */}
                    <td className="d-flex justify-content-center">
                      <button
                        className="btn-md rounded-circle mx-1"
                        onClick={() => handleBlockUser(user.id)}
                        disabled={user.blocked}
                      >
                        <MdBlock />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <nav>
              <ul className="pagination justify-content-center p-1">
                {Array.from({
                  length: Math.ceil(filteredUsers.length / elementsPerPage),
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
