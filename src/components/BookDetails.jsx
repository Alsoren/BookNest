import "../Styles/BookDetails.css";

function BookDetails({ book, onClose }) {
  const image = `/book-images/book-${book.id}.jpg`;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="popup-content">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Rating:</strong> ⭐ {book.rating}</p>

          <button className="add-to-lib" onClick={onClose}>
          Add to library
          </button>

        </div>

        <div className="popup-image">
          <img src={image} alt={book.title} />
        </div>

        <div className="popup-description">
          <h3>Description</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptates, maxime? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Doloremque, officia.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;