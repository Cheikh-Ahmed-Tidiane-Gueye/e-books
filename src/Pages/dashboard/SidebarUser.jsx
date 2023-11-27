import { BsFillGrid3X3GapFill } from 'react-icons/bs'
import { FaBook } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { Link } from 'react-router-dom';

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
            <Link style={{textDecoration: 'none', color: 'white'}} to="/dashboarduser/home">
                <li className='sidebar-list-item'>
                    <FaHome className='icon'/> Accueil
                </li>
            </Link>
            <Link style={{textDecoration: 'none', color: 'white'}} to="/dashboarduser/books">
                <li className='sidebar-list-item'>
                    <FaBook className='icon'/> Livres
                </li>
            </Link>
            <Link style={{textDecoration: 'none', color: 'white'}} to="/dashboarduser/books">
                <li className='sidebar-list-item'>
                <BsFillGrid3X3GapFill className='icon'/> Categories
                </li>
            </Link>
            <Link style={{textDecoration: 'none', color: 'white'}} onClick={handleLogout}>
                <li className='sidebar-list-item' >
                    <CiLogout className='icon'/> Deconnection
                </li>
            </Link>
        </ul>
    </aside>
  )
}
