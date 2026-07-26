import {useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { TbLock } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import bookIcon from "../assets/booknest-book-icon-transparent.png";
import "../Styles/LoginForm.css";
import Checkbox from "./CheckBox";

function LoginForm() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if (email.trim() === "") {
            setError("Email alanı boş bırakılamaz");
            return;
        }

        if (password.trim() === "") {
            setError("Şifre alanı boş bırakılamaz");
            return;
        }

        if (password.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        const loginData = {
            email: email,
            password: password
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(data.message);

                if (rememberMe) {
                    localStorage.setItem("token", data.token);
                } else {
                    sessionStorage.setItem("token", data.token);
                }

                setEmail("");
                setPassword("");

                localStorage.setItem("token", data.token);

                window.dispatchEvent(new Event("authChanged"));

                navigate("/home");

            } else {
                setError(data.message);
            }

        } catch (error) {
            setError("Backend'e bağlanılamadı. Backend çalışıyor mu kontrol et.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="input-group">
                <MdOutlineMail size={21} color="#B99163" />
                <input
                    type="email"
                    placeholder="E-posta adresi"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </div>

            <div className="input-group">
                <TbLock size={21} color="#B99163" />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>

            <div className="remember-row">
                <Checkbox
                    label="Beni hatırla"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Giriş yapılıyor..." : "Giriş yap"}
            </button>

            <div className="section-divider">
                <span className="divider-line"></span>
                <img
                    src={bookIcon}
                    alt="BookNest simgesi"
                    className="brand-icon-alt"
                />
                <span className="divider-line"></span>
            </div>

            <a href="#" className="forgot-password">
                Şifremi unuttum
                <IoIosArrowForward className="forgot-icon" />
            </a>
        </form>
    );
}

export default LoginForm;