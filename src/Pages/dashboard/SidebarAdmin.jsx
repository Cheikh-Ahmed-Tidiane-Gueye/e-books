
import { FaBook } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { FaArchive } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

// import { useHistory } from 'react-router-dom'; // Importez useHistory depuis react-router-dom

export default function SidebarUser({openSidebarToggle, OpenSidebar}) {

    // const history = useHistory(); // Initialisez useHistory

    const handleLogout = () => {
        // Supprimez les informations d'authentification du stockage local
        localStorage.removeItem('isAuthenticated');
        // Redirigez l'utilisateur vers la page de connexion
        window.location.href = '/';
    };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand py-3 d-flex align-items-center justify-content-center'>
                <GiBookshelf  className='icon_header mb-2 fs-1'/>
                <h2>E-Book</h2>
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <Link style={{textDecoration: 'none', color: 'white'}} to='/dashboardadmin/home'>
                <li className='sidebar-list-item'>
                    <FaHome className='icon'/> Accueil
                </li>
            </Link>
            <Link style={{textDecoration: 'none', color: 'white'}} to='/dashboardadmin/books'>
                <li className='sidebar-list-item'>
                    <FaBook className='icon'/> Liste des livres
                </li>
            </Link>
            <li className='sidebar-list-item'>
                <a href="">
                    <FaArchive className='icon'/> Liste livres archivées
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <FaUsers className='icon'/> Liste des Utilisateurs
                </a>
            </li>
            <li className='sidebar-list-item' onClick={handleLogout}>
                <a href="">
                    <CiLogout className='icon'/> Deconnection
                </a>
            </li>
        </ul>
    </aside>
  )
}
