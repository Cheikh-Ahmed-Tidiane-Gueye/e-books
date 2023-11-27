import { useState } from 'react'
import Header from './Header'
import HomeAdmin from './HomeAdmin'
import SidebarAdmin from './SidebarAdmin'
import { Outlet } from 'react-router-dom'

export default function DashboarAdmin() {

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <SidebarAdmin openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
      <Outlet/>
    </div>
  );
}
  