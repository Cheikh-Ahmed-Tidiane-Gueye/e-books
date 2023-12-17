import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { BsJustify, BsPersonCircle } from "react-icons/bs";
import { GiBookshelf } from "react-icons/gi";
import { FaBell } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function Header({ isAdmin, OpenSidebar }) {
  const [messages, setMessages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // const toggleDropdown = () => {
  //   setShowDropdown(!showDropdown);
  // };
  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesCollection = collection(db, "messages");
        const snapshot = await getDocs(messagesCollection);
        const messagesData = snapshot.docs.map((doc, index) => ({
          id: index + 1,
          ...doc.data(),
        }));

        const deletedMessages =
          JSON.parse(localStorage.getItem("deletedMessages")) || [];
        const updatedMessages = messagesData.filter(
          (message) => !deletedMessages.includes(message.id)
        );
        setMessages(updatedMessages);

        console.log("Récupération réussie");
      } catch (error) {
        console.error("Erreur: ", error);
      }
    };

    fetchMessages();
  }, []);

  const handleDeleteNotification = async (id) => {
    try {
      // Suppression de la notification localement
      const updatedMessages = messages.filter((message) => message.id !== id);
      setMessages(updatedMessages);

      // Suppression de la notification dans la base de données Firebase
      const messagesCollection = collection(db, "messages");
      const docRef = doc(messagesCollection, id.toString());
      await deleteDoc(docRef);

      console.log(`Notification avec l'id ${id} supprimée`);
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
    }
  };

  const handleClear = async () => {
    try {
      const messagesCollection = collection(db, "messages");
      const snapshot = await getDocs(messagesCollection);

      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setMessages([]);
      console.log("Historique vidé");
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const countNotifications = () => {
    return messages.length;
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>

      <div className="sidebar-brand py-3 d-flex align-items-center justify-content-center">
        <GiBookshelf className="icon_header mb-2 fs-1" />
        <h2 className="fs-5">E-Book</h2>
      </div>

      <div className="header-right d-flex justify-content-around align-items-center">
        <ul className="notification-drop px-2">
          <Link to="/dashboarduser/modifierprofil">
            <BsPersonCircle className="icon" color="white" />
          </Link>
          {isAdmin && ( // Affiche la cloche seulement si c'est un admin
            <li className="item" onClick={toggleDropdown}>
              <FaBell className="notification-bell  iconbell" />
              <span className="btn__badge pulse-button">
                {countNotifications()}
              </span>
              {showDropdown && (
                <ul className="dropdown-list">
                  <span className="w-100 d-flex justify-content-center">
                    <MdDelete
                      className="delete-icon text-danger supr"
                      onClick={() => handleClear()}
                    />
                  </span>
                  {messages.map((message) => (
                    <div key={message.id} className="notification-item">
                      <h6 className="border border-light notif-li w-100 px-3 my-1">
                        {message.message}
                      </h6>
                      <MdDelete
                        className="delete-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(message.id);
                        }}
                      />
                    </div>
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
