import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar1 from "../components/Navbar1";
import BookCard from "../components/BookCard";
import BookDetails from "../components/BookDetails";

import "../Styles/BooksPage.css";

const BOOKS_PER_PAGE = 24;

function LibraryPage() {
  const [userBooks, setUserBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

useEffect(() => {
  const controller = new AbortController();

  async function loadLibrary() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/user-books/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Kütüphane alınamadı. Durum kodu: ${response.status}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Backend liste formatında veri döndürmedi."
        );
      }

      setUserBooks(data);
    } catch (requestError) {
      if (requestError.name === "AbortError") {
        return;
      }

      console.error(
        "Kütüphane yüklenemedi:",
        requestError
      );

      setError(
        "Kütüphanendeki kitaplar yüklenemedi."
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }

  loadLibrary();

  return () => {
    controller.abort();
  };
}, [navigate]);

  /*
   * Backend UserBookResponse listesi döndürüyor.
   * BookCard ise doğrudan Book nesnesi bekliyor.
   */
  const books = useMemo(() => {
    return userBooks
      .filter((userBook) => userBook?.book)
      .map((userBook) => ({
        ...userBook.book,

        rating:
          userBook.book.externalRating ??
          userBook.book.rating ??
          null,

        userBookId: userBook.id,
        readingStatus: userBook.readingStatus,
        favorite: userBook.favorite,
        userRating: userBook.rating,
      }));
  }, [userBooks]);

  const totalPages = Math.max(
    1,
    Math.ceil(books.length / BOOKS_PER_PAGE)
  );

  const startIndex =
    (currentPage - 1) * BOOKS_PER_PAGE;

  const currentBooks = books.slice(
    startIndex,
    startIndex + BOOKS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const changePage = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }

    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="page-cover">
      <Navbar1 />

      <div className="books-content-cover">
        <main className="books-page">

          {loading && (
            <div className="books-page-message">
              <span className="books-loading-spinner" />

              <p>Kütüphanen yükleniyor...</p>
            </div>
          )}

          {!loading && error && (
            <div className="books-page-message books-error-message">
              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            books.length === 0 && (
              <div className="books-page-message">
                <h2>Kütüphanen henüz boş</h2>

                <p>
                  Kitap detaylarından kütüphanene
                  kitap ekleyebilirsin.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/books")}
                >
                  Kitapları Keşfet
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            books.length > 0 && (
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
                      disabled={currentPage === 1}
                      onClick={() =>
                        changePage(currentPage - 1)
                      }
                    >
                      ← Previous
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((pageNumber) => (
                      <button
                        type="button"
                        key={pageNumber}
                        className={
                          currentPage === pageNumber
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          changePage(pageNumber)
                        }
                      >
                        {pageNumber}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={
                        currentPage === totalPages
                      }
                      onClick={() =>
                        changePage(currentPage + 1)
                      }
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
        </main>
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

export default LibraryPage;