import { useState } from "react";
import Navbar1 from "../components/Navbar1";
import BookCard from "../components/BookCard";
import BookDetails from "../components/BookDetails";
import books from "../data/books";
import "../Styles/BooksPage.css";

function BooksPage() {
  const booksPerPage = 24;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);

  const totalPages = Math.ceil(books.length / booksPerPage);

  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = books.slice(
    startIndex,
    startIndex + booksPerPage
  );

  return (
    <div className="page-cover">
      <Navbar1 />

      <div className="books-content-cover">
        <div className="books-page">

          <div className="books-grid">
            {currentBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {selectedBook && (
        <BookDetails
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}

export default BooksPage;