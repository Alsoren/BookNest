import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Styles/BookDetails.css";

const API_BASE_URL = "http://localhost:8080";

function BookDetails({ book, onClose }) {
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const image =
    book.imageUrl || `/book-images/book-${book.id}.jpg`;

  const handleAddToLibrary = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/user-books`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            bookId: book.id,
            readingStatus: "WANT_TO_READ",
            favorite: false,
            rating: null,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (response.status === 409) {
        setError("Bu kitap zaten kütüphanende bulunuyor.");
        return;
      }

      if (!response.ok) {
        let errorMessage = "Kitap kütüphaneye eklenemedi.";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData.message ||
            errorData.error ||
            errorMessage;
        } catch {
          // Backend JSON hata cevabı göndermediyse
          // varsayılan hata mesajı kullanılır.
        }

        throw new Error(errorMessage);
      }

      setMessage("Kitap kütüphanene başarıyla eklendi.");

      // Başarılı mesajı kısa süre gösterip popup'ı kapatır.
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (requestError) {
      console.error(
        "Kitap kütüphaneye eklenemedi:",
        requestError
      );

      setError(
        requestError.message ||
          "Kitap kütüphaneye eklenirken bir hata oluştu."
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="popup-overlay"
      onMouseDown={onClose}
    >
      <div
        className="popup"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Kitap detaylarını kapat"
        >
          ✕
        </button>

        <div className="popup-content">
          <h2>{book.title}</h2>

          <p>
            <strong>Author:</strong> {book.author}
          </p>

          <p>
            <strong>Rating:</strong>{" "}
            ⭐ {book.externalRating ?? book.rating ?? "Puan yok"}
          </p>

          <button
            type="button"
            className="add-to-lib"
            onClick={handleAddToLibrary}
            disabled={adding}
          >
            {adding
              ? "Adding..."
              : "Add to library"}
          </button>

          {message && (
            <p className="book-details-success">
              {message}
            </p>
          )}

          {error && (
            <p className="book-details-error">
              {error}
            </p>
          )}
        </div>

        <div className="popup-image">
          <img
            src={image}
            alt={`${book.title} kitap kapağı`}
          />
        </div>

        <div className="popup-description">
          <h3>Description</h3>

          <p>
            {book.description ||
              "Bu kitap için henüz açıklama eklenmemiş."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;