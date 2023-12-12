import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

// import { collection } from 'firebase/firestore';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { sendPasswordResetEmail } from 'firebase/auth';

import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";

import passIcon from "../../assets/gif/chiffrement.gif";
import emailIcon from "../../assets/gif/message.gif";

// import { FaSquareFacebook } from "react-icons/fa6"
import { FcGoogle } from "react-icons/fc";
// import { FaInstagram } from "react-icons/fa"
// import { FaXTwitter } from "react-icons/fa6"

import AOS from "aos";
import "aos/dist/aos.css";

import toast, { Toaster } from "react-hot-toast";

// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  // CDBInput,
  CDBCard,
  CDBCardBody,
  CDBBtn,
  CDBContainer,
} from "cdbreact";

export default function Connection({ setIsAuthenticated }) {
  AOS.init({
    duration: 800, // Durée de l'animation en millisecondes
    easing: "ease-in-out", // Type d'interpolation
    delay: 200, // Délai avant le début de l'animation
  });

  // Authentification grace à Firebase authentification

  // Initialisation des états pour chaque champ du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // modal mot de pass oublier
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // pour rediriger l'utilisateur vers la page voulue
  const navigate = useNavigate();

  /* Fonctions pour gérer les changements dans chaque champ du formulaire 
    et Met à jour l'état l' lorsque la valeur du champ change*/
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const isAdmin =
      email === "med@gmail.com" || email === "cheikhahmedtidiane220@gmail.com";

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      setEmail("");
      setPassword("");

      toast.success("Connexion reussie");

      // les informations d'authentification du stockage local
      localStorage.setItem("isAuthenticated", "true");

      // Ajout d'un délai de 3 secondes avant la redirection
      setTimeout(() => {
        setIsAuthenticated(true);
        if (isAdmin) {
          navigate("/dashboardadmin/home");
        } else {
          navigate("/dashboarduser/home");
        }
      }, 1000);
    } catch (error) {
      toast.error("Échec de la connexion. Veuillez vérifier vos informations.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Effectuez ici des actions avec l'utilisateur authentifié via Google si nécessaire
      console.log("Utilisateur Google authentifié :", user);
      setIsAuthenticated(true);

      // Redirection vers la page souhaitée après la connexion
      navigate("/dashboarduser"); // ou '/dashboardadmin' si c'est un admin
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google :", error);
      // Gérer les erreurs ici
    }
  };

  // 
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Email de réinitialisation envoyé !");
      handleClose(); // Ferme le modal après l'envoi de l'e-mail
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'e-mail de réinitialisation.");
      console.error(error);
    }
  };

  return (
    <MDBContainer
      fluid
      className="p-md-0 p-sm-1 background-radial-gradient overflow-hidden"
    >
      <Toaster />

      {/* Modal mot de passe oublier */}
      <Modal
        show={show}
        onHide={handleClose}
        className="d-flex justify-content-center"
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier votre mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center p-0 m-0">
          <CDBContainer className="p-0 m-0">
            <CDBCard style={{ width: "31rem" }}>
              <CDBCardBody className="p-4 d-flex flex-column justify-content-center">
                <div className="text-center mt-4 mb-2">
                  <p className="h4">Envoyer un lien de réinitialisation à</p>
                </div>
                <form onSubmit={handleForgotPassword}>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="email"
                    name="email"
                    id="email2"
                    aria-label="email"
                    aria-describedby="basic-addon1"
                    required="required"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} // Met à jour l'email
                  />
                  <CDBBtn
                    color="info"
                    type="submit"
                    className="btn-block my-3 mx-0"
                  >
                    Envoyer
                  </CDBBtn>
                </form>
              </CDBCardBody>
            </CDBCard>
          </CDBContainer>
        </Modal.Body>
      </Modal>
      {/* Fin Modal */}
      <MDBRow className="flex">
        <MDBCol
          md="6"
          sm="10"
          className="position-relative"
          style={{ height: "100vh" }}
        >
          <div
            id="radius-shape-1"
            className="position-absolute rounded-circle shadow-5-strong"
          ></div>
          <div
            id="radius-shape-2"
            className="position-absolute shadow-5-strong"
          ></div>

          <form action="" onSubmit={handleLogin}>
            <MDBCard className="my-5 bg-glass" data-aos="zoom-in">
              <MDBCardBody className="p-5">
                <div className="livreLogo flex py-3 text-info">
                  <h1>Connexion</h1>
                </div>

                <div className="input-group my-4">
                  <span className="input-group-text bg-glass" id="basic-addon1">
                    <img
                      src={emailIcon}
                      alt="email"
                      className="img-fluid icon"
                    />
                  </span>
                  <input
                    onChange={handleEmailChange}
                    type="email"
                    className="form-control"
                    placeholder="email"
                    name="email"
                    id="email"
                    aria-label="email"
                    aria-describedby="basic-addon1"
                    required="required"
                    autoComplete="off"
                  />
                </div>

                <div className="input-group my-4">
                  <span className="input-group-text bg-glass" id="basic-addon3">
                    <img
                      src={passIcon}
                      alt="Password"
                      className="img-fluid icon"
                    />
                  </span>
                  <input
                    onChange={handlePasswordChange}
                    type="password"
                    className="form-control"
                    placeholder="Mot de passe"
                    aria-describedby="basic-addon1"
                    required="required"
                    autoComplete="off"
                  />
                </div>

                <button
                  className=" btn btn-primary btn-md w-100 my-4"
                  size="md"
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </button>

                <div className="text-center">
                  {/* <!-- Register buttons --> */}
                  <div className="text-center">
                    <p>
                      Vous n'avez pas de compte ?{" "}
                      <Link
                        to="/inscription"
                        style={{ textDecoration: "none" }}
                      >
                        Insrivez-vous ici
                      </Link>
                    </p>

                    <p className="" onClick={handleShow}>
                      <Link
                        to=""
                        style={{ textDecoration: "none", color: "red" }}
                      >
                        Mot de passe oublié ?
                      </Link>
                    </p>

                    <button
                      onClick={handleGoogleSignIn}
                      className="googleLogin btn btn-link btn-floating mx-1"
                    >
                      <FcGoogle />
                    </button>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
