import { useEffect, useState } from "react";
import {
    NavLink,
    useLocation,
    useNavigate
} from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";

import Icon from "../components/Icon";
import "../Styles/Navbar1.css";

function Navbar1() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function checkLoginStatus() {
        const token = localStorage.getItem("token");

        setIsLoggedIn(Boolean(token));
    }

    useEffect(() => {
        // Sayfa ilk açıldığında ve URL değiştiğinde çalışır
        checkLoginStatus();
    }, [location.pathname]);

    useEffect(() => {
        // Login veya logout sırasında gönderilen olayı dinler
        window.addEventListener("authChange", checkLoginStatus);

        return () => {
            window.removeEventListener(
                "authChange",
                checkLoginStatus
            );
        };
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");

        setIsLoggedIn(false);

        window.dispatchEvent(new Event("authChange"));

        navigate("/login");
    }

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-logo">
                <Icon />
            </NavLink>

            <div className="navbar-center">

                {!isLoggedIn ? (
                    <>
                      <NavLink
                          to="/home"
                          end
                          className={({ isActive }) =>
                              isActive
                                  ? "navbar-link active"
                                  : "navbar-link"
                          }
                      >
                          Ana Sayfa
                      </NavLink>

                      <NavLink
                          to="/categories"
                          className={({ isActive }) =>
                              isActive
                                  ? "navbar-link active"
                                  : "navbar-link"
                          }
                      >
                          Kategoriler
                      </NavLink>

                      <NavLink
                          to="/about"
                          className={({ isActive }) =>
                              isActive
                                  ? "navbar-link active"
                                  : "navbar-link"
                          }
                      >
                          Hakkımızda
                      </NavLink>
                    </>
                ) : (
                    <>
                      <NavLink
                          to="/home"
                          end
                          className={({ isActive }) =>
                              isActive
                                  ? "navbar-link active"
                                  : "navbar-link"
                          }
                      >
                          Ana Sayfa
                      </NavLink>

                      <NavLink
                          to="/categories"
                          className={({ isActive }) =>
                              isActive
                                  ? "navbar-link active"
                                  : "navbar-link"
                          }
                      >
                          Kütüphanem
                      </NavLink>

                      <NavLink
                          to="/about"
                          className={({ isActive }) =>
                              isActive
                                  ? "navbar-link active"
                                  : "navbar-link"
                          }
                      >
                          Profilim
                      </NavLink>
                    </>
                )}
                
            </div>

            <div className="navbar-right">
                {!isLoggedIn ? (
                    <>
                        <NavLink
                            to="/login"
                            className="login-button"
                        >
                            <FiUser className="navbar-button-icon" />
                            Giriş Yap
                        </NavLink>

                        <NavLink
                            to="/register"
                            className="register-button"
                        >
                            <FiUser className="navbar-button-icon" />
                            Kayıt Ol
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink
                            to="/profile"
                            className="login-button"
                        >
                            <FiUser className="navbar-button-icon" />
                            Profilim
                        </NavLink>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            <FiLogOut className="navbar-button-icon" />
                            Çıkış Yap
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar1;