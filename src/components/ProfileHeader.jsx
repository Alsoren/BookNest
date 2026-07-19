import "../Styles/ProfileHeader.css";

import heroImage1 from "../assets/hero-section.png";
import heroImage2 from "../assets/hero-section2.png";
import messageIcon from "../assets/message-icon.png";
import saveIcon from "../assets/save-icon.png";
import bookIcon from "../assets/book-icon.png";
import bookMonster from "../assets/book_monster.png";

function ProfileHeader({ profile }) {
  return (
    <div className="profile-wrapper">
      <section className="profile-section">

        <div className="profile-hero-image left-prohero-image">
          <img src={heroImage1} alt="Kitap okuyan kişi" />
        </div>

        <div className="profile-content">
          <div>
            <div className="profile-avatar">
              <img src={bookMonster} alt="Profil görseli" />
            </div>
          </div>

          <div className="profile-infos">
            <h1>{profile.name}</h1>

            <p>{profile.email}</p>

            <p>
              Güncellemeler:{" "}
              {profile.agreeToUpdates ? "Açık" : "Kapalı"}
            </p>

            <div className="profile-stats">
              <div className="stat readed-book">
                <img src={bookIcon} alt="" />

                <div>
                  <p className="stat-number">21</p>
                  <p className="stat-title">Okunan Kitap</p>
                </div>
              </div>

              <div className="stat my-lists">
                <img src={saveIcon} alt="" />

                <div>
                  <p className="stat-number">18</p>
                  <p className="stat-title">Okuma Listem</p>
                </div>
              </div>

              <div className="stat num-comment">
                <img src={messageIcon} alt="" />

                <div>
                  <p className="stat-number">82</p>
                  <p className="stat-title">Yorumlar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-image right-prohero-image">
          <img src={heroImage2} alt="Kitap okuyan kişi" />
        </div>

      </section>
    </div>
  );
}

export default ProfileHeader;