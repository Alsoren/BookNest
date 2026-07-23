import "../Styles/FeaturedBooks.css";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";

import BookCard from "./BookCard";
import BookDetails from "./BookDetails";

const API_BASE_URL = "http://localhost:8080";

function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [canGoLeft, setCanGoLeft] = useState(false);
  const [canGoRight, setCanGoRight] = useState(false);

  const sliderRef = useRef(null);

  // Backend'den gelen ilk 12 kitabı gösterir.
  const featuredBooks = books.slice(0, 12);

  function updateButtons() {
    const slider = sliderRef.current;

    if (!slider) return;

    const isAtStart = slider.scrollLeft <= 5;

    const isAtEnd =
      slider.scrollLeft + slider.clientWidth >=
      slider.scrollWidth - 5;

    setCanGoLeft(!isAtStart);
    setCanGoRight(!isAtEnd);
  }

  function slide(direction) {
    const slider = sliderRef.current;

    if (!slider) return;

    const firstCard = slider.querySelector(".book-card");
    const cardsContainer = slider.querySelector(".book-cards");

    if (!firstCard || !cardsContainer) return;

    const computedStyle =
      window.getComputedStyle(cardsContainer);

    const gap =
      parseFloat(computedStyle.columnGap) || 0;

    const cardWidth = firstCard.offsetWidth;

    slider.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  }

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/books`
        );

        if (!response.ok) {
          throw new Error(
            `Kitaplar alınamadı. HTTP durum kodu: ${response.status}`
          );
        }

        const data = await response.json();

        // Endpoint doğrudan dizi döndürüyorsa:
        if (Array.isArray(data)) {
          setBooks(data);
        }
        // Spring Page<Book> döndürüyorsa:
        else if (Array.isArray(data.content)) {
          setBooks(data.content);
        } else {
          throw new Error(
            "Backend beklenen kitap listesini döndürmedi."
          );
        }
      } catch (fetchError) {
        console.error("Kitaplar çekilirken hata:", fetchError);

        setError(
          fetchError.message ||
            "Kitaplar yüklenirken bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  useEffect(() => {
    // Kitaplar render edildikten sonra slider sınırlarını hesaplar.
    const animationFrameId = requestAnimationFrame(
      updateButtons
    );

    window.addEventListener("resize", updateButtons);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener(
        "resize",
        updateButtons
      );
    };
  }, [books]);

  return (
    <section className="featured-section">
      <div className="section-header">
        <h2>Featured Books</h2>

        <Link to="/bookspage" className="view-all">
          View All
          <FaArrowRight />
        </Link>
      </div>

      {loading && (
        <p className="featured-message">
          Kitaplar yükleniyor...
        </p>
      )}

      {error && (
        <p className="featured-error">
          {error}
        </p>
      )}

      {!loading && !error && featuredBooks.length === 0 && (
        <p className="featured-message">
          Veritabanında gösterilecek kitap bulunamadı.
        </p>
      )}

      {!loading && !error && featuredBooks.length > 0 && (
        <div className="book-slider-cover">
          {canGoLeft && (
            <button
              type="button"
              className="slider-arrow slider-arrow-left"
              onClick={() => slide(-1)}
              aria-label="Önceki kitaplar"
            >
              <FaChevronLeft />
            </button>
          )}

          <div
            ref={sliderRef}
            className="book-slider"
            onScroll={updateButtons}
          >
            <div className="book-cards">
              {featuredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() =>
                    setSelectedBook(book)
                  }
                />
              ))}
            </div>
          </div>

          {canGoRight && (
            <button
              type="button"
              className="slider-arrow slider-arrow-right"
              onClick={() => slide(1)}
              aria-label="Sonraki kitaplar"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      )}

      {selectedBook && (
        <BookDetails
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </section>
  );
}

export default FeaturedBooks;