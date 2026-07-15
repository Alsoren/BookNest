import "../Styles/Icon.css";
import bookIcon from "../assets/booknest-book-icon-transparent.png";


function Icon(){
    return(
          <div className="brand-box " >
            <img src={bookIcon} alt="BookNest icon" className="brand-icon" />
            <h1 className="brand-logo">BookNest</h1>
          </div>
    );
}

export default Icon;