import "../Styles/Footer.css";
import { FaGoogle } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
import Icon from "../components/Icon";

function Footer() {
  return (
    <div className="footer-cover">

      <div className="footer-left">
        <Icon />
        <p>Oku, Keşfet, Bağlantı Kur</p>

        <div className="footer-icon-cover">
          <FaGoogle className="footer-icon" />
          <IoLogoInstagram className="footer-icon" />
          <RiTwitterXFill className="footer-icon" />
          <FaFacebook className="footer-icon" />
        </div>
      </div>

      <div className="footer-mid">

        <div className="footer-links">
          <h3>Keşfet</h3>
          <a href="/books">Kitaplar</a>
          <a href="/categories">Kategoriler</a>
          <a href="/new-releases">Yeni Çıkanlar</a>
          <a href="/popular">En Popülerler</a>
        </div>

        <div className="footer-links">
          <h3>Topluluk</h3>
          <a href="/forum">Forum</a>
          <a href="/groups">Gruplar</a>
          <a href="/events">Etkinlikler</a>
          <a href="/blog">Blog</a>
        </div>

        <div className="footer-links">
          <h3>Hakkımızda</h3>
          <a href="/about">Hakkımızda</a>
          <a href="/contact">İletişim</a>
          <a href="/careers">Kariyer</a>
          <a href="/privacy">Gizlilik Politikası</a>
        </div>

      </div>

      <div className="footer-right">
        <h3>Bültenimize Abone Olun</h3>
        <p>Yeni kitaplardan, etkinliklerden ve gelişmelerden haberdar olun!</p>

        <div className="newsletter-input">
          <input
            type="email"
            placeholder="E-posta adresinizi girin"
          />

          <button>
            <FaPaperPlane />
          </button>
        </div>
      </div>

    </div>
  );
}

export default Footer;