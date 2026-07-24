import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar1 from "../components/Navbar1";
import BookCard from "../components/BookCard";
import BookDetails from "../components/BookDetails";

import "../Styles/BooksPage.css";

const API_BASE_URL = "http://localhost:8080";

function BooksPage() {
  const booksPerPage = 24;

  const { categoryId } = useParams();

  const [books, setBooks] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBook, setSelectedBook] = useState(null);

  const totalPages = Math.ceil(
    books.length / booksPerPage
  );

  const startIndex =
    (currentPage - 1) * booksPerPage;

  const currentBooks = books.slice(
    startIndex,
    startIndex + booksPerPage
  );

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setError("");
        setCurrentPage(1);

        const endpoint = categoryId
          ? `${API_BASE_URL}/api/books/category/${categoryId}`
          : `${API_BASE_URL}/api/books`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(
            `Kitaplar alınamadı. HTTP durum kodu: ${response.status}`
          );
        }

        const data = await response.json();

        let fetchedBooks = [];

        if (Array.isArray(data)) {
          fetchedBooks = data;
        } else if (Array.isArray(data.content)) {
          fetchedBooks = data.content;
        } else {
          throw new Error(
            "Backend beklenen kitap listesini döndürmedi."
          );
        }

        setBooks(fetchedBooks);

        if (
          categoryId &&
          fetchedBooks.length > 0 &&
          Array.isArray(fetchedBooks[0].categories)
        ) {
          const selectedCategory =
            fetchedBooks[0].categories.find(
              (category) =>
                String(category.id) === String(categoryId)
            );

          setCategoryName(
            selectedCategory?.name || "Kategori"
          );
        } else {
          setCategoryName("");
        }
      } catch (fetchError) {
        console.error(
          "Kitaplar çekilirken hata:",
          fetchError
        );

        setBooks([]);

        setError(
          fetchError.message ||
            "Kitaplar yüklenirken bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [categoryId]);

  function goToPreviousPage() {
    setCurrentPage((previousPage) =>
      Math.max(previousPage - 1, 1)
    );
  }

  function goToNextPage() {
    setCurrentPage((previousPage) =>
      Math.min(previousPage + 1, totalPages)
    );
  }

  return (
    <div className="page-cover">
      <Navbar1 />

      <div className="books-content-cover">
        <div className="books-page">

          {loading && (
            <p className="books-message">
              Kitaplar yükleniyor...
            </p>
          )}

          {error && (
            <p className="books-error">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            books.length === 0 && (
              <p className="books-message">
                {categoryId
                  ? "Bu kategoriye ait kitap bulunamadı."
                  : "Veritabanında kitap bulunamadı."}
              </p>
            )}

          {!loading &&
            !error &&
            currentBooks.length > 0 && (
              <>
                <div className="books-grid">
                  {currentBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onClick={() =>
                        setSelectedBook(book)
                      }
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      type="button"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => {
                        const pageNumber = index + 1;

                        return (
                          <button
                            type="button"
                            key={pageNumber}
                            className={
                              currentPage === pageNumber
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setCurrentPage(pageNumber)
                            }
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                    )}

                    <button
                      type="button"
                      onClick={goToNextPage}
                      disabled={
                        currentPage === totalPages
                      }
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
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