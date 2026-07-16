import "../Styles/ProfileContent.css";
import BookCard from "./BookCard";

import bookIcon from "../assets/book-icon.png";
import readedCategories from "../assets/readed-categories.png";
import goal from "../assets/goal.png";
import heart from "../assets/heart.png";

function ProfileContent(){
    return(
      <div className="profile-conten-wrapper">

        <div className="reading-books">
            <div className="reading-books-header">
                <img src={bookIcon} />
                <p>Şu Anda Okuyorum</p>
                <a href="">Tümünü Gör</a>
            </div>

            <div className="reading-books-sec">

            </div>
        </div>

        <div className="most-readed-categories">
            <div className="reading-categories-header">
                <img src={readedCategories} />
                <p>En çok okunan kategori</p>
            </div>

            <div className="reading-categories-sec">

                <button>Tüm Kategorileri Gör</button>
            </div>
        </div>

        <div className="reading-stat">
            <div className="reading-stats-header">
                <img src={goal} />
                <p>En çok okunan kategori</p>
            </div>
        </div>

        <div className="fav-books">
            <div className="fav-books-header">
                <img src={heart} />
                <p>Favori Kitaplar</p>
                <a href="">Tümünü Gör</a>
            </div>

            <div className="fav-books-sec">

            </div>
        </div>
        
      </div>
    );
}

export default ProfileContent;