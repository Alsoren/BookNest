import "../Styles/Navbar.css";
import { BrowserRouter, Link } from "react-router-dom";
import Icon from "./Icon";


function Navbar(){
    return(
        <div className="navbar-wrapper">
            <nav className="navbar">    
              <div className="brand-box-cover"><Icon/></div>
                <ul>
                    <li><a href="/">Ana Sayfa</a></li>
                    <li><a href="/about">Hakkımızda</a></li>
                    <li><a href="/contact">İletişim</a></li>
                </ul>
            </nav>
        </div>

    );
}

export default Navbar;