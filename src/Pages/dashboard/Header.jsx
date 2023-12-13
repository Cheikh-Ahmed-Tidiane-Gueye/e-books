import React, { useState, useEffect } from "react";
import { BsFillBellFill, BsPersonCircle, BsJustify } from "react-icons/bs";
import { GiBookshelf } from "react-icons/gi";
import { Drawer, ButtonToolbar, Button, Placeholder } from "rsuite";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig.js";

export default function Header({ OpenSidebar }) {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState();
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };

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
        <h2>E-Book</h2>
      </div>
      <div className="header-right">
        <BsFillBellFill
          className="icon"
          size={"xs"}
          onClick={() => {
            setOpen(true);
            handleOpen("xs");
          }}
        />
        <BsPersonCircle className="icon" />
      </div>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Drawer.Body>
          <main className="main-container p-0 text-dark">
            <div>
              {/* <h2 className="mt-3">Liste des emprunts :</h2> */}
              {messages.length > 0 && (
                <div className="mb-4 ms-3">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleClear}
                  >
                    Vider l'historique
                  </button>
                </div>
              )}
              <table className="table table-striped mt-4">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Notification</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id}>
                      <td>{message.id}</td>
                      <td>{message.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </Drawer.Body>
      </Drawer>
    </header>
  );
}
