import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { BsJustify, BsPersonCircle } from "react-icons/bs";
import { GiBookshelf } from "react-icons/gi";
import { FaBell } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function Header({ OpenSidebar }) {
  const [messages, setMessages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [nbrNotif, setNbrNotif] = useState(0);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const fetchMessages = () => {
      try {
        const messagesCollection = collection(db, "messages");

        const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
          const messagesData = snapshot.docs.map((doc, index) => ({
            id: index + 1,
            ...doc.data(),
          }));

          setMessages(messagesData);

          console.log("Mise à jour en temps réel réussie");
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Erreur: ", error);
      }
    };

    fetchMessages();
  }, []);

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
          <li className="item" onClick={toggleDropdown}>
            <Link to="/dashboarduser/modifierprofil">
              <BsPersonCircle className="icon" color="white" />
            </Link>
            <FaBell className="notification-bell  iconbell" />
            <span className="btn__badge pulse-button">{countNotifications()}</span>
            {showDropdown && (
              <ul className="dropdown-list">
                {messages.map((message) => (
                  <div key={message.id} className="notification-item">
                    <li className="notif-li">
                      {message.id}: {message.message}
                    </li>
                    <MdDelete className="delete-icon" />
                  </div>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
