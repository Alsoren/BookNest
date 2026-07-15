import "../Styles/ProfileHeader.css";
import heroImage1 from "../assets/hero-section.png";
import heroImage2 from "../assets/hero-section2.png";
import messageIcon from "../assets/message-icon.png";
import saveIcon from "../assets/save-icon.png";
import bookIcon from "../assets/book-icon.png";
import book_monster from "../assets/book_monster.png";

function HeroSection() {
  return (
    <div className="hero-wrapper">
      <section className="hero-section">

        <div className="hero-image left-hero-image">
          <img src={heroImage1} alt="Book reading" />
        </div>

        <div className="hero-content">
          <div>
            <div className="profile-avatar">
              <img src={book_monster} alt="Profile" />
            </div>
          </div>
          <div className="profile-infos">
            <h1>Ahmet Alp Keleş</h1>
            <p>@Allsoren</p>
            <p>hakkımdalar kısmı burda yazıyor burayı kendim dolduruyorum</p>

            <div className="profile-stats">
              <div className="stat readed-book">
                <img src={bookIcon} />
                <div>
                  <p className="stat-number">21</p>
                  <p className="stat-title">Okunan Kitap</p>
                </div>
              </div>
              <div className="stat my-lists">
                <img src={saveIcon} />
                <div>
                  <p className="stat-number">18</p>
                  <p className="stat-title">Okuma Listem</p>
                </div>
              </div>
              <div className="stat num-comment">
                <img src={messageIcon} />
                <div>
                  <p className="stat-number">82</p>
                  <p className="stat-title">Yorumlar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-image right-hero-image">
          <img src={heroImage2} alt="Book reading" />
        </div>

      </section>
    </div>
  );
}

export default HeroSection;