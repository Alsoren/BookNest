import LoginForm from "../components/LoginForm";
import Navbar1 from '../components/Navbar1'
import Icon from "../components/Icon";
import bookIcon from "../assets/booknest-book-icon-transparent.png";
import Mascot from "../assets/book_monster.png";
import "../Styles/LoginPage.css";


function LoginPage() {
  return (
    <><Navbar1 /><div className="login-page">
      <div className="login-card">

        <div className="login-card-left">
          <div className="brand-box-cover">
            <Icon />
          </div>
        </div>

        <div className="login-card-right">
          <div className="login-top-header">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>
                Log in to your account and <br />
                continue your reading journey.
              </p>
            </div>
            <div className="mascot-container">
              <img src={Mascot} alt="BookNest mascot" className="brand-mascot" />
            </div>
          </div>
          <LoginForm />
        </div>

      </div>
    </div></>
  );
}

export default LoginPage;