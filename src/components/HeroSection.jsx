import "../Styles/HeroSection.css";
import heroImage1 from "../assets/hero-section.png";
import heroImage2 from "../assets/hero-section2.png";
import { Link } from "react-router-dom";
import { FiBookOpen, FiUser, FiUsers, FiMessageCircle } from "react-icons/fi";

function HeroSection() {


  return (
    <div className="hero-wrapper">
      <section className="hero-section">
        <div className="hero-image" id="right-pic-hero">
          <img src={heroImage2} alt="Book reading" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Okuma yolculuğun <br />
            <span>Burada başlıyor</span>
          </h1>
          <p className="hero-description">
            BookNest ile kitapları keşfet, kendi okuma listeni oluştur ve
            seninle aynı zevklere sahip okuyucularla bağlantı kur.
          </p>

          <div className="hero-buttons">
            <Link to="/bookspage" className="view-all">
              <button className="primary-btn">
                <FiBookOpen />
                Kitapları Keşfet
              </button>
            </Link>

            <Link to="/register">
              <button className="secondary-btn" >
                <FiUser />
                Hesap Oluştur
              </button>
            </Link>

          </div>

          <div className="hero-stats">
            <div className="stat-box">
              <FiUsers className="stat-icon" />
              <div>
                <h3>10K+</h3>
                <p>Aktif Okuyucu</p>
              </div>
            </div>

            <div className="stat-box">
              <FiBookOpen className="stat-icon" />
              <div>
                <h3>25K+</h3>
                <p>Kitap</p>
              </div>
            </div>

            <div className="stat-box">
              <FiMessageCircle className="stat-icon" />
              <div>
                <h3>15K+</h3>
                <p>Topluluk Gönderisi</p>
              </div>
            </div>
          </div>

        </div>

        <div className="hero-image" id="left-pic-hero">
          <img src={heroImage1} alt="Book reading" />
        </div>
      </section>
    </div>
  );
}

export default HeroSection;