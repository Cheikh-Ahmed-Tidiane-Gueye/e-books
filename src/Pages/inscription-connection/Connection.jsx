import { useState } from 'react';
 
import { Link, useNavigate } from 'react-router-dom';

// import { collection } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { sendPasswordResetEmail } from 'firebase/auth';

import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard,MDBCardBody } from 'mdb-react-ui-kit';

import emailIcon from '../../assets/gif/message.gif'
import passIcon from '../../assets/gif/chiffrement.gif'

// import { FaSquareFacebook } from "react-icons/fa6"
import { FcGoogle } from "react-icons/fc"
// import { FaInstagram } from "react-icons/fa"
// import { FaXTwitter } from "react-icons/fa6"

import AOS from 'aos';
import 'aos/dist/aos.css';

import toast, { Toaster } from 'react-hot-toast';

export default function Connection({setIsAuthenticated}) {
    AOS.init({
        duration: 800, // Durée de l'animation en millisecondes
        easing: 'ease-in-out', // Type d'interpolation
        delay: 200, // Délai avant le début de l'animation
    });

    // Authentification grace à Firebase authentification

    // Initialisation des états pour chaque champ du formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // pour rediriger l'utilisateur vers la page voulue
    const navigate = useNavigate();

    /* Fonctions pour gérer les changements dans chaque champ du formulaire 
    et Met à jour l'état l' lorsque la valeur du champ change*/
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    }

    const handleLogin = async (e) => {
      e.preventDefault();
      const isAdmin = email === 'med@gmail.com' || email === 'cheikhahmedtidiane220@gmail.com';

      try {
          await signInWithEmailAndPassword(auth, email, password);

          setEmail('');
          setPassword('');

          toast.success("Connection reussit")
          
          // les informations d'authentification du stockage local
          localStorage.setItem('isAuthenticated', 'true');

          // Ajout d'un délai de 3 secondes avant la redirection
          setTimeout(() => {
            setIsAuthenticated(true);
            if (isAdmin) {
              navigate('/dashboardadmin');
            } else {
              navigate('/dashboarduser');
            }
          }, 1000); // 3000 millisecondes = 3 secondes
         
      }catch (error) {
        toast.error('Échec de la connexion. Veuillez vérifier vos informations.');
        console.error(error);
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
        navigate('/dashboarduser'); // ou '/dashboardadmin' si c'est un admin
      } catch (error) {
        console.error("Erreur lors de la connexion avec Google :", error);
        // Gérer les erreurs ici
      }
    };

  return (
    <MDBContainer fluid className='p-md-0 p-sm-1 background-radial-gradient overflow-hidden'>
      <Toaster />
      <MDBRow className='flex'>

        <MDBCol md='6' sm='10' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
          
          <form action="" onSubmit={handleLogin}>
            <MDBCard className='my-5 bg-glass' data-aos="zoom-in">
                <MDBCardBody className='p-5'>
                    
                    <div className="livreLogo flex py-3 text-info">
                        <h1>Connection</h1>
                    </div>

                    <div className="input-group my-4">
                    <span className="input-group-text bg-glass" id="basic-addon1">
                        <img src={emailIcon} alt="email" className="img-fluid icon"/>
                    </span>
                    <input onChange={handleEmailChange} type="email" className="form-control" placeholder="email" name="email" id="email" aria-label="email" aria-describedby="basic-addon1" required="required"/>
                    </div>

                    <div className="input-group my-4">
                    <span className="input-group-text bg-glass" id="basic-addon3">
                        <img src={passIcon} alt="Password" className="img-fluid icon"/>
                    </span>
                    <input onChange={handlePasswordChange} type="password"className="form-control" placeholder="Mot de passe" aria-describedby="basic-addon1" required="required"/>
                    </div>


                <MDBBtn className='w-100 my-4' size='md'>Se connecter</MDBBtn>

                <div className="text-center">

                    {/* <!-- Register buttons --> */}
                    <div className="text-center">
                    <p>Ou <Link to='/inscription' style={{textDecoration: 'none'}}>S'inscrire</Link></p>
                      <p><Link to='' style={{textDecoration: 'none', color: "red"}}>Mot de passe oublier</Link></p>
                    {/* <button type="button" className="btn btn-link btn-floating mx-1">
                        <FaSquareFacebook />
                    </button> */}
    
                    <button onClick={handleGoogleSignIn} className="googleLogin btn btn-link btn-floating mx-1">
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
