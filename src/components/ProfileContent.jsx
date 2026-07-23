import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../Styles/ProfileContent.css";

import bookIcon from "../assets/book-icon.png";
import readedCategories from "../assets/readed-categories.png";
import goal from "../assets/goal.png";
import heart from "../assets/heart.png";

import CategoryProgressBar from "./CategoryProgressBar";

const API_URL = "http://localhost:8080";

/*
 * Kategorilerin tam sayı yüzdelerini hesaplar.
 *
 * Math.round her kategoriye ayrı uygulanırsa
 * toplam %99 veya %101 çıkabilir.
 *
 * Bu fonksiyon yüzdelerin toplamını kesin olarak
 * %100 yapar.
 */
function calculateCategoryPercentages(
  categories,
  totalCategoryCount
) {
  if (totalCategoryCount === 0) {
    return categories.map((category) => ({
      ...category,
      percentage: 0,
    }));
  }

  return categories.map((category) => {
    const bookCount =
      Number(category.bookCount) || 0;

    const percentage =
      Math.round(
        (bookCount / totalCategoryCount) *
          100
      );

    return {
      ...category,
      percentage,
    };
  });
}

function ProfileContent() {
  const [readingBooks, setReadingBooks] =
    useState([]);

  const [readingLoading, setReadingLoading] =
    useState(true);

  const [readingError, setReadingError] =
    useState("");

  const [topCategories, setTopCategories] =
    useState([]);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  const [
    categoriesError,
    setCategoriesError,
  ] = useState("");

  const navigate = useNavigate();

  /*
   * Kullanıcının READING durumundaki
   * kitaplarını getirir.
   */
  useEffect(() => {
    const controller =
      new AbortController();

    async function fetchReadingBooks() {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

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
              Authorization:
                `Bearer ${token}`,
            },

            signal: controller.signal,
          }
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");

          navigate("/login", {
            replace: true,
          });

          return;
        }

        if (!response.ok) {
          throw new Error(
            `Kitaplar alınamadı. HTTP durum kodu: ${response.status}`
          );
        }

        const data =
          await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Backend beklenen liste formatını döndürmedi."
          );
        }

        setReadingBooks(
          data.slice(0, 5)
        );
      } catch (requestError) {
        if (
          requestError.name !==
          "AbortError"
        ) {
          console.error(
            "READING kitapları alınamadı:",
            requestError
          );

          setReadingError(
            "Okuduğun kitaplar yüklenemedi."
          );
        }
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setReadingLoading(false);
        }
      }
    }

    fetchReadingBooks();

    return () => {
      controller.abort();
    };
  }, [navigate]);

  /*
   * Kullanıcının en çok tercih ettiği
   * kategorileri getirir.
   */
  useEffect(() => {
    const controller =
      new AbortController();

    async function loadCategoryStatistics() {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setCategoriesLoading(false);

        navigate("/login", {
          replace: true,
        });

        return;
      }

      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const response = await fetch(
          `${API_URL}/api/user-books/me/top-categories`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            signal: controller.signal,
          }
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");

          navigate("/login", {
            replace: true,
          });

          return;
        }

        if (!response.ok) {
          throw new Error(
            `Kategori bilgileri alınamadı: ${response.status}`
          );
        }

        const categoryData =
          await response.json();

        if (
          !Array.isArray(categoryData)
        ) {
          throw new Error(
            "Kategori verisi liste formatında değil."
          );
        }

        /*
         * bookCount değeri sayıya çevrilir.
         * Boş kategoriler çıkarılır.
         * Büyükten küçüğe sıralanır.
         */
        const sortedCategories =
          categoryData
            .map((category) => ({
              ...category,

              bookCount:
                Number(
                  category.bookCount
                ) || 0,
            }))
            .filter(
              (category) =>
                category.bookCount > 0
            )
            .sort(
              (
                firstCategory,
                secondCategory
              ) =>
                secondCategory.bookCount -
                firstCategory.bookCount
            );

        /*
         * Ekranda maksimum 5 kategori tutulur.
         */
        const totalCategoryCount =
          sortedCategories.reduce(
            (total, category) =>
              total + category.bookCount,
            0
          );

        const firstFiveCategories =
          sortedCategories.slice(0, 5);

        const firstFiveWithPercentages =
          calculateCategoryPercentages(
            firstFiveCategories,
            totalCategoryCount
          );

        setTopCategories(
          firstFiveWithPercentages
        );  
      } catch (requestError) {
        if (
          requestError.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "Kategori istatistikleri alınamadı:",
          requestError
        );

        setCategoriesError(
          "Kategori istatistikleri yüklenemedi."
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategoryStatistics();

    return () => {
      controller.abort();
    };
  }, [navigate]);

  return (
    <main className="profile-content-wrapper">
      {/* Şu anda okuyorum */}

      <section className="profile-panel reading-books">
        <header className="profile-panel-header">
          <div className="profile-panel-title">
            <img
              src={bookIcon}
              alt=""
              aria-hidden="true"
            />

            <h2>Şu Anda Okuyorum</h2>
          </div>

          <Link
            className="profile-panel-link"
            to="/library"
          >
            Tümünü Gör
          </Link>
        </header>

        <div className="reading-books-list">
          {readingLoading && (
            <div className="profile-state-message">
              <span className="profile-loading-spinner" />

              <p>
                Kitaplar yükleniyor...
              </p>
            </div>
          )}

          {!readingLoading &&
            readingError && (
              <div className="profile-state-message profile-error-message">
                <p>{readingError}</p>
              </div>
            )}

          {!readingLoading &&
            !readingError &&
            readingBooks.length === 0 && (
              <div className="profile-state-message">
                <p>
                  Şu anda okuduğun bir
                  kitap bulunmuyor.
                </p>

                <Link to="/books">
                  Kitapları keşfet
                </Link>
              </div>
            )}

          {!readingLoading &&
            !readingError &&
            readingBooks.map(
              (userBook) => {
                const book =
                  userBook?.book;

                if (!book) {
                  return null;
                }

                const firstCategory =
                  book.categories?.[0]
                    ?.name;

                const rating =
                  book.externalRating != null
                    ? Number(
                        book.externalRating
                      ).toFixed(1)
                    : "—";

                return (
                  <article
                    className="reading-book-card"
                    key={userBook.id}
                  >
                    <img
                      className="reading-book-cover"
                      src={
                        book.imageUrl ||
                        bookIcon
                      }
                      alt={`${book.title} kitap kapağı`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror =
                          null;

                        event.currentTarget.src =
                          bookIcon;
                      }}
                    />

                    <div className="reading-book-details">
                      <div className="reading-book-text">
                        <h3
                          title={
                            book.title
                          }
                        >
                          {book.title}
                        </h3>

                        <p className="reading-book-author">
                          {book.author}
                        </p>
                      </div>

                      <div className="reading-book-meta">
                        {firstCategory && (
                          <span className="reading-book-category">
                            {
                              firstCategory
                            }
                          </span>
                        )}

                        <span className="reading-book-rating">
                          <span
                            aria-hidden="true"
                          >
                            ★
                          </span>

                          {rating}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
        </div>
      </section>

      {/* En çok okunan kategoriler */}

      <section className="profile-panel most-readed-categories">
        <header className="profile-panel-header">
          <div className="profile-panel-title">
            <img
              src={readedCategories}
              alt=""
              aria-hidden="true"
            />

            <h2>
              En Çok Okunan Kategoriler
            </h2>
          </div>
        </header>

        <div className="category-progress-list">
          {categoriesLoading && (
            <p className="category-state-message">
              Kategoriler yükleniyor...
            </p>
          )}

          {!categoriesLoading &&
            categoriesError && (
              <p className="category-state-message category-error">
                {categoriesError}
              </p>
            )}

          {!categoriesLoading &&
            !categoriesError &&
            topCategories.length === 0 && (
              <p className="category-state-message">
                Henüz kategori istatistiği bulunmuyor.
              </p>
            )}

          {!categoriesLoading &&
            !categoriesError &&
            topCategories.map(
              (category, index) => (
                <CategoryProgressBar
                  key={category.categoryId}
                  rank={index + 1}
                  categoryName={category.categoryName}
                  bookCount={category.bookCount}
                  percentage={category.percentage}
                />
              )
            )}
        </div>
        
      </section>

      {/* Okuma istatistikleri */}

      <section className="profile-panel reading-stat">
        <header className="profile-panel-header">
          <div className="profile-panel-title">
            <img
              src={goal}
              alt=""
              aria-hidden="true"
            />

            <h2>
              Okuma İstatistikleri
            </h2>
          </div>
        </header>

        <div className="profile-placeholder-area">
          <p className="profile-placeholder-text">
            Okuma hedefleri ve
            istatistikleri burada
            gösterilecek.
          </p>
        </div>
      </section>

      {/* Favori kitaplar */}

      <section className="profile-panel fav-books">
        <header className="profile-panel-header">
          <div className="profile-panel-title">
            <img
              src={heart}
              alt=""
              aria-hidden="true"
            />

            <h2>Favori Kitaplar</h2>
          </div>

          <Link
            className="profile-panel-link"
            to="/favorite-books"
          >
            Tümünü Gör
          </Link>
        </header>

        <div className="favorite-books-section">
          <p className="profile-placeholder-text">
            Favori kitapların burada
            gösterilecek.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ProfileContent;