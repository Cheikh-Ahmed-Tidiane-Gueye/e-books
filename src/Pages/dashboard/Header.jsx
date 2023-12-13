import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { BsFillBellFill, BsPersonCircle, BsJustify } from "react-icons/bs";
import { GiBookshelf } from "react-icons/gi";
import { Dropdown } from "rsuite";

export default function Header({ OpenSidebar }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesCollection = collection(db, "messages");
        const snapshot = await getDocs(messagesCollection);
        const messagesData = snapshot.docs.map((doc, index) => ({
          id: index + 1,
          ...doc.data(),
        }));
        setMessages(messagesData);
        console.log("Récupération réussie");
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

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="sidebar-brand py-3 d-flex align-items-center justify-content-center">
        <GiBookshelf className="icon_header mb-2 fs-1" />
        <h2 className="fs-5">E-Book</h2>
      </div>
      <div className="header-right">
        <Dropdown
          title={<BsFillBellFill className="icon" />}
          placement="bottomEnd"
          className="px-3"
        >
          <Dropdown.Item>
            {messages.map((message) => (
              <p key={message.id} className="border rounded-pill p-1 bg-secondary text-light">
                <span>{message.id}</span>
                <span>{message.message}</span>
              </p>
            ))}
          </Dropdown.Item>
        </Dropdown>

        <BsPersonCircle className="icon" />
      </div>
    </header>
  );
}
