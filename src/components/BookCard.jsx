import "../Styles/BookCard.css"
import { FaStar } from "react-icons/fa";


function BookCard({ book, onClick }) {
  const image = `/book-images/book-${book.id}.jpg`;

  return (
    <div className="book-card" onClick={onClick}>
      
      <img src={image} alt={book.title} />

      <div className="book-card-content">
        <p>{book.author}</p>

        <span><FaStar color="#F5CC41" /> {book.externalRating}</span>
      </div>
    </div>
  );
}

export default BookCard