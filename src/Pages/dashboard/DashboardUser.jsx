import { useState } from 'react'
import Header from './Header'
// import HomeUser from './HomeUser'
import SidebarUser from './SidebarUser';
import { Outlet } from 'react-router-dom';

export default function DashboarUser() {

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <SidebarUser openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
      <Outlet/>
    </div>
  );
}
  