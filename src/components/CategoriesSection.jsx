import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import "../Styles/CategoriesSection.css";

import stars from "../assets/stars-icon.png";
import save from "../assets/save-icon.png";
import explore from "../assets/explore-icon.png";

import CategoryCard from "./CategoryCard";

const API_URL = "http://localhost:8080";

function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/categories`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Kategoriler alınamadı. HTTP durum kodu: ${response.status}`
          );
        }

        const data = await response.json();

        /*
         * Backend doğrudan liste döndürüyorsa:
         * [
         *   { id: 1, name: "Roman" },
         *   { id: 2, name: "Bilim Kurgu" }
         * ]
         */
        if (Array.isArray(data)) {
          setCategories(data);
          return;
        }

        /*
         * Backend Page<Category> döndürüyorsa:
         * {
         *   content: [...]
         * }
         */
        if (Array.isArray(data.content)) {
          setCategories(data.content);
          return;
        }

        throw new Error(
          "Backend beklenen kategori listesini döndürmedi."
        );
      } catch (requestError) {
        if (requestError.name === "AbortError") {
          return;
        }

        console.error(
          "Kategoriler alınırken hata oluştu:",
          requestError
        );

        setError(
          requestError.message ||
            "Kategoriler yüklenemedi."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      controller.abort();
    };
  }, []);

  /*
   * Ana sayfada yalnızca ilk 5 kategori gösterilir.
   */
  const visibleCategories = categories.slice(0, 5);

  return (
    <div className="wrap">
      <section className="categories-section">
        <div className="categories-header">
          <h2>Kategorileri Keşfet</h2>

          <Link
            to="/categories"
            className="all-categories-link"
          >
            Tüm Kategoriler
            <FaArrowRight />
          </Link>
        </div>

        {loading && (
          <p className="categories-message">
            Kategoriler yükleniyor...
          </p>
        )}

        {!loading && error && (
          <p className="categories-message categories-error">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          visibleCategories.length === 0 && (
            <p className="categories-message">
              Henüz kategori bulunmuyor.
            </p>
          )}

        {!loading &&
          !error &&
          visibleCategories.length > 0 && (
            <div className="categories-cards">
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/books/category/${category.id}`}
                  className="category-card-link"
                >
                  <CategoryCard
                    category={category}
                  />
                </Link>
              ))}
            </div>
          )}
      </section>

      <div className="features-section">
        <div className="feature">
          <img
            src={stars}
            alt=""
            aria-hidden="true"
          />

          <div>
            <h2>Sana Özel Öneriler</h2>

            <p>
              İlgi alanlarına göre kişiselleştirilmiş
              kitap önerileri al.
            </p>
          </div>
        </div>

        <div className="feature">
          <img
            src={save}
            alt=""
            aria-hidden="true"
          />

          <div>
            <h2>Okuma Listelerin</h2>

            <p>
              Favori kitaplarını kaydet, okuma
              hedeflerini takip et.
            </p>
          </div>
        </div>

        <div className="feature">
          <img
            src={explore}
            alt=""
            aria-hidden="true"
          />

          <div>
            <h2>Kolay Keşif</h2>

            <p>
              Kategoriler, listeler ve incelemelerle
              yeni kitapları keşfet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesSection;