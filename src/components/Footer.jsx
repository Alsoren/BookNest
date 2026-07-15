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
            <p>Read, Discover, Connect</p>
            <div className="footer-icon-cover">
                <FaGoogle className="footer-icon"/>
                <IoLogoInstagram className="footer-icon"/>
                <RiTwitterXFill className="footer-icon"/>
                <FaFacebook className="footer-icon"/>
            </div>
            
        </div>

        <div className="footer-mid">

            <div className="footer-links">
                <h3>Explore</h3>
                <a href="/books">Books</a>
                <a href="/categories">Categories</a>
                <a href="/new-releases">New Releases</a>
                <a href="/popular">Most Popular</a>
            </div>

            <div className="footer-links">
                <h3>Community</h3>
                <a href="/forum">Forum</a>
                <a href="/groups">Groups</a>
                <a href="/events">Events</a>
                <a href="/blog">Blog</a>
            </div>

            <div className="footer-links">
                <h3>About Us</h3>
                <a href="/about">About Us</a>
                <a href="/contact">Contact</a>
                <a href="/careers">Careers</a>
                <a href="/privacy">Privacy Policy</a>
            </div>

        </div>

        <div className="footer-right">
            <h3>Subscribe to Our Newsletter</h3>
            <p>Stay updated on new books, events, and more!</p>

            <div className="newsletter-input">
                <input
                type="email"
                placeholder="Enter your email"
                />
                <button><FaPaperPlane /></button>
            </div>
        </div>

    </div>
  );
}

export default Footer;