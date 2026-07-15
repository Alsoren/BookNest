import "../Styles/CategoryCard.css";

function CategoryCard({ category }) {
  const backgroundImage =
    `/category-images/${category.id}.png`;

  const iconImage =
    `/category-icons/${category.id}.png`;

  const formattedCount = new Intl.NumberFormat(
    "tr-TR"
  ).format(category.count);

  return (
    <div className="category-card">

      <img
        className="category-background-image"
        src={backgroundImage}
        alt=""
      />

      <div className="category-dark-overlay"></div>

      <div className="category-card-content">
        <img
          className="category-icon"
          src={iconImage}
          alt={`${category.name} ikonu`}
        />

        <h3 className="category-card-title">
          {category.name}
        </h3>

        <p className="category-book-count">
          {formattedCount} kitap
        </p>
      </div>

    </div>
  );
}

export default CategoryCard;