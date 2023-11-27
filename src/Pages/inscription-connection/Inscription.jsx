import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, collection } from 'firebase/firestore';
import { auth, db, createUser } from '../../config/firebaseConfig';


import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard,MDBCardBody } from 'mdb-react-ui-kit';
import profilIcon from '../../assets/gif/profil.gif'
import emailIcon from '../../assets/gif/message.gif'
import passIcon from '../../assets/gif/chiffrement.gif'

// import { FaSquareFacebook } from "react-icons/fa6"
import { FcGoogle } from "react-icons/fc"
// import { FaInstagram } from "react-icons/fa"
// import { FaXTwitter } from "react-icons/fa6"

import AOS from 'aos';
import 'aos/dist/aos.css'; 

import toast, { Toaster } from 'react-hot-toast';

export default function Inscription({setIsAuthenticated}) {

    // AOS animation
    AOS.init({
        duration: 1000, // Durée de l'animation en millisecondes
        easing: 'ease-in-out', // Type d'interpolation
        delay: 500, // Délai avant le début de l'animation
    });

    //Cree un utilisateur pour s'authentifier et ajouter les données à Firestore

    // Initialisation des états pour chaque champ du formulaire
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const navigate = useNavigate();

    /* Fonctions pour gérer les changements dans chaque champ du formulaire 
    et Met à jour l'état l' lorsque la valeur du champ change*/
    const handlePrenomChange = (e) => {
      setPrenom(e.target.value);
    };

    const handleNomChange = (e) => {
      setNom(e.target.value);
    };

    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handlePasswordChange = (e) => { 
      setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value);
    };

    // Fonction pour gérer la soumission du formulaire
    const handleInscription = async (e) => {
      e.preventDefault();

      // Vérifier si les mots de passe correspondent
      if (password !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas.");
        return;
      }

      try {
        // Création de l'utilisateur dans Firebase Auth
        const userCredential = await createUser(auth, email, password);
        const user = userCredential.user;

        // Ajouter des informations à Firestore
        await addDoc(collection(db, 'utilisateurs'), {
          userId: user.uid,
          prenom: prenom,
          nom: nom,
          email: email
        });
        
        // Effacer les champs du formulaire après inscription réussie
        setPrenom("")
        setNom("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        toast.success("Inscription reussit")
        console.log('Données utilisateur ajoutées à Firestore avec succès.');
        
        // Ajout d'un délai de 3 secondes avant la redirection
        setTimeout(() => {
          setIsAuthenticated(true);
          navigate('/');
        }, 1000); // 3000 millisecondes = 3 secondes

      } catch (error) {

        toast.error("Vous n'avez pas put vous inscrire, reessayer")
        console.error('Erreur lors de l\'inscription : ', error);
        // Gérer les erreurs ici, si nécessaire.
      }
    };
    

    // Fonction pour s'inscrire avec google
    const handleGoogleSignIn = async () => {

      const provider = new GoogleAuthProvider();

      try {

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Effectuer ici des actions avec l'utilisateur authentifié via Google si nécessaire
        console.log("Utilisateur Google authentifié :", user);
        setIsAuthenticated(true);
        navigate('/connection');

      } catch (error) {

        console.error("Erreur lors de la connexion avec Google :", error);
        // Gérer les erreurs ici
      }
    };

    const handleGoogleClick = () => {
      handleGoogleSignIn();
    };
      
  return (
    <MDBContainer fluid className='px-5 background-radial-gradient overflow-hidden'>
     <Toaster />
      <MDBRow>

        <MDBCol md='7' sm='12' className='text-center text-md-start d-flex flex-column justify-content-center p-5'>

          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}} data-aos="fade-right">
            <span style={{color: 'hsl(218, 81%, 75%)'}}> E-Book </span> <br />
            Tous un monde de livre<br />
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}} data-aos="fade-right">
            Ouvrez un monde de connaissances et d'aventures entre les pages.
            Découvrez un univers foisonnant de savoirs et d'épopées, où chaque page devient le point de départ d'une aventure inoubliable.
          </p>

        </MDBCol>

        <MDBCol md='5' sm='12' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
          <form action=""  onSubmit={handleInscription}>
            <MDBCard className='my-5 bg-glass' data-aos="zoom-in">
                <MDBCardBody className='p-3'>
                    
                    <div className="livreLogo flex py-3 text-info">
                        <h1>Inscription</h1>
                    </div>

                    <div className="input-group my-4">
                    <span className="input-group-text bg-glass">
                        <img src={profilIcon} alt="User" className="img-fluid icon"/>
                    </span>
                    <input onChange={handlePrenomChange} type="text" aria-label="Prenom" name="prenom" placeholder="Prenom" id="prenom" className="form-control"/>
                    <input onChange={handleNomChange} type="text" aria-label="Nom" name="nom" placeholder="Nom" id="nom" className="form-control"/>
                    </div>

                    <div className="input-group my-4">
                    <span className="input-group-text bg-glass" id="basic-addon1">
                        <img src={emailIcon} alt="Email" className="img-fluid icon"/>
                    </span>
                    <input onChange={handleEmailChange} type="email" className="form-control" placeholder="Email" name="emal" id="email" aria-label="email" aria-describedby="basic-addon1" required="required"/>
                    </div>

                    <div className="input-group my-4">
                    <span className="input-group-text bg-glass" id="basic-addon3">
                        <img src={passIcon} alt="Password" className="img-fluid icon"/>
                    </span>
                    <input onChange={handlePasswordChange} type="password"className="form-control" placeholder="Mot de passe" aria-describedby="basic-addon1" required="required"/>
                    </div>

                    <div className="input-group my-4">
                    <span className="input-group-text bg-glass" id="basic-addon3">
                        <img src={passIcon} alt="confirmePassword" className="img-fluid icon"/>
                    </span>
                    <input onChange={handleConfirmPasswordChange} type="password"className="form-control" placeholder="Confirmer votre mot de passe" aria-describedby="basic-addon1" required="required"/>
                    </div>


                <MDBBtn className='w-100 my-4' size='md'>S'inscrire</MDBBtn>

                <div className="text-center">

                    {/* <!-- Register buttons --> */}
                    <div className="text-center">
                      <p>Ou <Link to='/' style={{textDecoration: 'none'}}>Se connecter</Link></p>
                      {/* <button type="button" className="btn btn-link btn-floating mx-1">
                          <FaSquareFacebook />
                      </button> */}
      
                      <button onClick={handleGoogleClick} className="googleLogin btn btn-link btn-floating mx-1">
                          <FcGoogle />
                      </button>
      
                      {/* <button type="button" className="btn btn-link btn-floating mx-1">
                          <FaInstagram />
                      </button>
      
                      <button type="button" className="btn btn-link btn-floating mx-1">
                          <FaXTwitter />
                      </button> */}
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
