import {useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { TbLock } from "react-icons/tb";
import { IoIosPerson } from "react-icons/io";
import bookIcon from "../assets/booknest-book-icon-transparent.png";
import "../Styles/RegisterForm.css";
import Checkbox from "./CheckBox";

function RegisterForm() {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [agreeToUpdates, setAgreeToUpdates] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if (name.trim() === "") {
            setError("İsim alanı boş bırakılamaz");
            return;
        }

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

        if (confirmPassword.trim() === "") {
            setError("Şifre tekrar alanı boş bırakılamaz");
            return;
        }

        if (password !== confirmPassword) {
            setError("Şifreler aynı değil");
            return;
        }

        if (!agreeToTerms) {
            setError("Devam etmek için şartları kabul etmelisin");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        const registerData = {
            name: name,
            email: email,
            password: password,
            agreeToUpdates: agreeToUpdates
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(data.message);

                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setAgreeToUpdates(false);
                setAgreeToTerms(false);

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
        <form onSubmit={handleSubmit} className="register-form">
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="input-group">
                <IoIosPerson size={21} color="#B99163" />
                <input
                    type="text"
                    placeholder="Ad Soyad"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>

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

            <div className="input-group">
                <TbLock size={21} color="#B99163" />
                <input
                    type="password"
                    placeholder="Şifreyi doğrula"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />
            </div>

            <div className="section-divider">
                <span className="divider-line"></span>
                <img
                    src={bookIcon}
                    alt="BookNest simgesi"
                    className="brand-icon-alt"
                />
                <span className="divider-line"></span>
            </div>

            <div className="checkbox-row">
                <Checkbox
                    label="Şartları ve koşulları kabul ediyorum"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
            </div>

            <div className="checkbox-row">
                <Checkbox
                    label="Yeni ürünler ve güncellemeler hakkında e-posta ile bilgilendirilmek istiyorum"
                    checked={agreeToUpdates}
                    onChange={(e) => setAgreeToUpdates(e.target.checked)}
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
            </button>
        </form>
    );
}

export default RegisterForm;