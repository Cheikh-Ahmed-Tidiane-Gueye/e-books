import {BsFillBellFill, BsPersonCircle, BsJustify} from 'react-icons/bs'
import { GiBookshelf } from "react-icons/gi";
export default function Header({OpenSidebar}) {
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
        <BsFillBellFill className="icon" />
        <BsPersonCircle className="icon" />
      </div>
    </header>
  );
}
