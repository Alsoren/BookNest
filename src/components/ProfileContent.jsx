import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../Styles/ProfileContent.css";

import bookIcon from "../assets/book-icon.png";
import readedCategories from "../assets/readed-categories.png";
import goal from "../assets/goal.png";
import heart from "../assets/heart.png";

const API_URL = "http://localhost:8080";

function ProfileContent() {
  const [readingBooks, setReadingBooks] = useState([]);
  const [readingLoading, setReadingLoading] = useState(true);
  const [readingError, setReadingError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchReadingBooks() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setReadingLoading(true);
        setReadingError("");

        const response = await fetch(
          `${API_URL}/api/user-books/me/status/READING`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: abortController.signal,
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Kitaplar alınamadı. HTTP durum kodu: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Backend beklenen liste formatını döndürmedi.");
        }

        setReadingBooks(data.slice(0, 5));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("READING kitapları alınamadı:", error);
          setReadingError("Okuduğun kitaplar yüklenemedi.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setReadingLoading(false);
        }
      }
    }

    fetchReadingBooks();

    return () => {
      abortController.abort();
    };
  }, [navigate]);

  return (
    <main className="profile-content-wrapper">
      <section className="profile-panel reading-books">
        <header className="profile-panel-header">
          <div className="profile-panel-title">
            <img src={bookIcon} alt="" aria-hidden="true" />
            <h2>Şu Anda Okuyorum</h2>
          </div>

          <Link className="profile-panel-link" to="/library">
            Tümünü Gör
          </Link>
        </header>

        <div className="reading-books-list">
          {readingLoading && (
            <div className="profile-state-message">
              <span className="profile-loading-spinner" />
              <p>Kitaplar yükleniyor...</p>
            </div>
          )}

          {!readingLoading && readingError && (
            <div className="profile-state-message profile-error-message">
              <p>{readingError}</p>
            </div>
          )}

          {!readingLoading &&
            !readingError &&
            readingBooks.length === 0 && (
              <div className="profile-state-message">
                <p>Şu anda okuduğun bir kitap bulunmuyor.</p>
                <Link to="/books">Kitapları keşfet</Link>
              </div>
            )}

          {!readingLoading &&
            !readingError &&
            readingBooks.map((userBook) => {
              const book = userBook.book;
              const firstCategory = book?.categories?.[0]?.name;

              return (
                <article
                  className="reading-book-card"
                  key={userBook.id}
                >
                  <img
                    className="reading-book-cover"
                    src={book.imageUrl}
                    alt={`${book.title} kitap kapağı`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = bookIcon;
                    }}
                  />

                  <div className="reading-book-details">
                    <div className="reading-book-text">
                      <h3 title={book.title}>{book.title}</h3>
                      <p className="reading-book-author">
                        {book.author}
                      </p>
                    </div>

                    <div className="reading-book-meta">
                      {firstCategory && (
                        <span className="reading-book-category">
                          {firstCategory}
                        </span>
                      )}

                      <span className="reading-book-rating">
                        <span aria-hidden="true">★</span>

                        {book.externalRating != null
                          ? book.externalRating.toFixed(1)
                          : "—"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </section>

      <section className="profile-panel most-readed-categories">
        <header className="profile-panel-header">
          <div className="profile-panel-title">
            <img
              src={readedCategories}
              alt=""
              aria-hidden="true"
            />
            <h2>En Çok Okunan Kategori</h2>
          </div>
        </header>

        <div className="reading-categories-section">
          <p className="profile-placeholder-text">
            Kategori istatistikleri burada gösterilecek.
          </p>

          <button type="button" className="profile-secondary-button">
            Tüm Kategorileri Gör
          </button>
        </div>
      </section>

      <section className="profile-panel reading-stat">
        <header className="profile-panel-header">
          <div className="profile-panel-title">
            <img src={goal} alt="" aria-hidden="true" />
            <h2>Okuma İstatistikleri</h2>
          </div>
        </header>

        <div className="profile-placeholder-area">
          <p className="profile-placeholder-text">
            Okuma hedefleri ve istatistikleri burada gösterilecek.
          </p>
        </div>
      </section>

      <section className="profile-panel fav-books">
        <header className="profile-panel-header">
          <div className="profile-panel-title">
            <img src={heart} alt="" aria-hidden="true" />
            <h2>Favori Kitaplar</h2>
          </div>

          <Link className="profile-panel-link" to="/favorite-books">
            Tümünü Gör
          </Link>
        </header>

        <div className="favorite-books-section">
          <p className="profile-placeholder-text">
            Favori kitapların burada gösterilecek.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ProfileContent;