import RegisterForm from "../components/RegisterForm";
import Icon from "../components/Icon";
import Navbar1 from '../components/Navbar1'
import bookIcon from "../assets/booknest-book-icon-transparent.png";
import Mascot from "../assets/book_monster.png";
import "../Styles/RegisterPage.css";


function RegisterPage() {
  return (
    <><Navbar1 /><div className="register-page">
      <div className="register-card">

        <div className="register-card-left">
          <div className="brand-box-cover">
            <Icon />
          </div>
        </div>

        <div className="register-card-right">
          <div className="register-top-header">
            <div className="register-header">
              <h1>Create Account</h1>
              <p>
                Join our community and start your reading journey.
              </p>
            </div>
            <div className="mascot-container">
              <img src={Mascot} alt="BookNest mascot" className="brand-mascot" />
            </div>
          </div>
          <RegisterForm />
        </div>

      </div>
    </div></>
  );
}

export default RegisterPage;