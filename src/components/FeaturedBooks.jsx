import "../Styles/FeaturedBooks.css";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";

import books from "../data/books";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";

function FeaturedBooks() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [canGoLeft, setCanGoLeft] = useState(false);
  const [canGoRight, setCanGoRight] = useState(true);

  const sliderRef = useRef(null);

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

    if (!firstCard) return;

    const cardsContainer =
      slider.querySelector(".book-cards");

    const gap = parseFloat(
      window.getComputedStyle(cardsContainer).columnGap
    );

    const cardWidth = firstCard.offsetWidth;

    slider.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  }

  useEffect(() => {
    updateButtons();

    window.addEventListener("resize", updateButtons);

    return () => {
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  return (
    <section className="featured-section">

      <div className="section-header">
        <h2>Featured Books</h2>

        <Link to="/bookspage" className="view-all">
          View All
          <FaArrowRight />
        </Link>
      </div>

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
                onClick={() => setSelectedBook(book)}
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