import "../Styles/CategoriesSection.css";

import stars from "../assets/stars-icon.png";
import save from "../assets/save-icon.png";
import explore from "../assets/explore-icon.png";

import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import categories from "../data/categories";
import CategoryCard from "./CategoryCard";

function CategoriesSection() {
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

        <div className="categories-cards">
          {visibleCategories.map((category) => (
              <Link to={`/books/category/${category.id}`}>

                <CategoryCard
                  key={category.id}
                  category={category}
                />

              </Link>
          ))}
        </div>

      </section>
      

      <div className="features-section">

        <div className="feature">
          <img src={stars} />
          <div>
            <h2>Sana Özel Öneriler</h2>
            <p>İlk alanlarına göre kişiselleştirilmiş kitap önerileri al.</p>
          </div>
        </div>

        <div className="feature">
          <img src={save} />
          <div>
            <h2>Okuma Listelerin</h2>
            <p>Favori kitaplarını kaydet, okuma hedeflerini takip et.</p>
          </div>
        </div>

        <div className="feature">
          <img src={explore} />
          <div>
            <h2>Kolay Keşif</h2>
            <p>Kategoriler, listeler ve incelemelerle yeni kitapları keşfet.</p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default CategoriesSection;