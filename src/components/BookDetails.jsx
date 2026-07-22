import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Checkbox from "./CheckBox";

import "../Styles/BookDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

function BookDetails({ book, onClose }) {
  const [libraryState, setLibraryState] =
    useState("checking");

  /*
   * checking     -> kontrol ediliyor
   * found        -> kitap kütüphanede
   * not-found    -> kitap kütüphanede değil
   * unauthorized -> oturum geçersiz
   * error        -> başka hata
   */

  const [libraryBook, setLibraryBook] =
    useState(null);

  const [processing, setProcessing] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const image =
    book.imageUrl ||
    `/book-images/book-${book.id}.jpg`;

  /*
   * Kitabın kullanıcının kütüphanesinde olup
   * olmadığını kontrol eder. useCallback ile
   * sarmalandı ki hem useEffect'ten hem de
   * 409/404 gibi durumlarda elle tekrar
   * çağrılabilsin.
   */
  const checkLibrary = useCallback(
    async (signal) => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLibraryBook(null);
        setLibraryState("unauthorized");
        return;
      }

      try {
        setLibraryState("checking");
        setMessage("");
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/user-books/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal,
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          setLibraryBook(null);
          setLibraryState("unauthorized");
          return;
        }

        if (response.status === 403) {
          setLibraryBook(null);
          setLibraryState("error");

          setError(
            "Kütüphane bilgisine erişilemedi."
          );

          return;
        }

        if (!response.ok) {
          throw new Error(
            `Kütüphane kontrolü başarısız: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Backend liste formatında veri döndürmedi."
          );
        }

        const existingUserBook = data.find(
          (userBook) =>
            Number(userBook?.book?.id) ===
            Number(book.id)
        );

        if (existingUserBook) {
          setLibraryBook(existingUserBook);
          setLibraryState("found");
        } else {
          setLibraryBook(null);
          setLibraryState("not-found");
        }
      } catch (requestError) {
        if (requestError.name === "AbortError") {
          return;
        }

        console.error(
          "Kütüphane kontrol hatası:",
          requestError
        );

        setLibraryBook(null);
        setLibraryState("error");

        setError(
          requestError.message ||
            "Kitabın kütüphane durumu kontrol edilemedi."
        );
      }
    },
    [book.id]
  );

  /*
   * Popup açıldığında kitap kullanıcının
   * kütüphanesinde bulunuyor mu kontrol edilir.
   */
  useEffect(() => {
    const controller = new AbortController();

    checkLibrary(controller.signal);

    return () => {
      controller.abort();
    };
  }, [checkLibrary]);

  /*
   * Kitap kütüphanede değilse ekler.
   * İlk status WANT_TO_READ olur.
   */
  const handleAddToLibrary = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setProcessing(true);
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

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (response.status === 403) {
        setError(
          "Bu işlemi yapmaya yetkin yok. Sayfayı yenileyip tekrar deneyin."
        );
        return;
      }

      if (response.status === 409) {
        setError(
          "Bu kitap zaten kütüphanende bulunuyor."
        );

        /*
         * Backend "zaten var" diyorsa, frontend'in
         * state'i gerçek duruma senkronize edilmeli.
         */
        checkLibrary();
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Kitap kütüphaneye eklenemedi."
        );
      }

      const savedUserBook =
        await response.json();

      setLibraryBook(savedUserBook);
      setLibraryState("found");

      setMessage(
        "Kitap kütüphanene başarıyla eklendi."
      );
    } catch (requestError) {
      console.error(
        "Kitap ekleme hatası:",
        requestError
      );

      setError(
        requestError.message ||
          "Kitap kütüphaneye eklenemedi."
      );
    } finally {
      setProcessing(false);
    }
  };

  /*
   * Kitabın okuma durumunu değiştirir.
   *
   * Aynı anda tek bir readingStatus tutulduğu için
   * READING ve READ aynı anda seçili olamaz.
   */
  const handleStatusChange = async (
    newReadingStatus
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    /*
     * Zaten seçili olan duruma tekrar istek atma.
     */
    if (
      libraryBook?.readingStatus ===
      newReadingStatus
    ) {
      return;
    }

    try {
      setProcessing(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/user-books/me/book/${book.id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            readingStatus: newReadingStatus,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (response.status === 403) {
        setError(
          "Bu işlemi yapmaya yetkin yok. Sayfayı yenileyip tekrar deneyin."
        );
        return;
      }

      if (response.status === 404) {
        throw new Error(
          "Kitap kütüphanende bulunamadı."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Okuma durumu güncellenemedi."
        );
      }

      const updatedUserBook =
        await response.json();

      /*
       * Backend'den gelen yeni UserBook state'e yazılır.
       * Böylece seçili kutu otomatik değişir.
       */
      setLibraryBook(updatedUserBook);

      if (newReadingStatus === "READING") {
        setMessage(
          "Kitap, okuyorum olarak işaretlendi."
        );
      }

      if (newReadingStatus === "READ") {
        setMessage(
          "Kitap, bitirdim olarak işaretlendi."
        );
      }
    } catch (requestError) {
      console.error(
        "Okuma durumu güncelleme hatası:",
        requestError
      );

      setError(
        requestError.message ||
          "Okuma durumu değiştirilemedi."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveFromLibrary = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const confirmed = window.confirm(
      `"${book.title}" kitabını kütüphanenden çıkarmak istediğine emin misin?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessing(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/user-books/me/book/${book.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (response.status === 403) {
        setError(
          "Bu işlemi yapmaya yetkin yok. Sayfayı yenileyip tekrar deneyin."
        );
        return;
      }

      if (response.status === 404) {
        setLibraryBook(null);
        setLibraryState("not-found");
        setMessage(
          "Kitap zaten kütüphanende bulunmuyor."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Kitap kütüphaneden çıkarılamadı."
        );
      }

      setLibraryBook(null);
      setLibraryState("not-found");

      setMessage(
        "Kitap kütüphanenden çıkarıldı."
      );
    } catch (requestError) {
      console.error(
        "Kütüphaneden çıkarma hatası:",
        requestError
      );

      setError(
        requestError.message ||
          "Kitap kütüphaneden çıkarılamadı."
      );
    } finally {
      setProcessing(false);
    }
  };

  const currentStatus =
    libraryBook?.readingStatus;

  const isReading =
    currentStatus === "READING";

  const isFinished =
    currentStatus === "READ";

  return (
    <div
      className="popup-overlay"
      onMouseDown={onClose}
    >
      <div
        className="popup"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
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
            <strong>Yazar:</strong>{" "}
            {book.author}
          </p>

          <p>
            <strong>Puan:</strong>{" "}
            ⭐{" "}
            {book.externalRating ??
              book.rating ??
              "Puan yok"}
          </p>

          {libraryState === "checking" && (
            <button
              type="button"
              className="add-to-lib"
              disabled
            >
              Kontrol ediliyor...
            </button>
          )}

          {libraryState === "not-found" && (
            <button
              type="button"
              className="add-to-lib"
              onClick={handleAddToLibrary}
              disabled={processing}
            >
              {processing
                ? "Ekleniyor..."
                : "Kütüphaneme Ekle"}
            </button>
          )}

          {libraryState === "found" &&
            libraryBook && (
              <div className="library-book-controls">
                <p className="current-reading-status">
                  Okuma durumunu seç:
                </p>

                <div className="reading-status-options">
                  <Checkbox
                    type="radio"
                    name="readingStatus"
                    value="READING"
                    label="Okuyorum"
                    checked={isReading}
                    disabled={processing}
                    onChange={() => {
                      if (!isReading) {
                        handleStatusChange("READING");
                      }
                    }}
                  />

                  <Checkbox
                    type="radio"
                    name="readingStatus"
                    value="READ"
                    label="Bitirdim"
                    checked={isFinished}
                    disabled={processing}
                    onChange={() => {
                      if (!isFinished) {
                        handleStatusChange("READ");
                      }
                    }}
                  />
                </div>

                {processing && (
                  <p className="status-processing">
                    Durum güncelleniyor...
                  </p>
                )}

                <button
                  type="button"
                  className="remove-from-library"
                  onClick={handleRemoveFromLibrary}
                  disabled={processing}
                >
                  {processing
                    ? "İşlem yapılıyor..."
                    : "Kütüphanemden Çıkar"}
                </button>
              </div>
            )}

          {libraryState ===
            "unauthorized" && (
            <button
              type="button"
              className="add-to-lib"
              onClick={() =>
                navigate("/login")
              }
            >
              Giriş Yap
            </button>
          )}

          {libraryState === "error" && (
            <button
              type="button"
              className="add-to-lib"
              onClick={() => checkLibrary()}
            >
              Tekrar Dene
            </button>
          )}

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
          <h3>Açıklama</h3>

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