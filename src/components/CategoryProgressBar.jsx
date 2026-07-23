import "../Styles/CategoryProgressBar.css";

function CategoryProgressBar({
  rank,
  categoryName,
  bookCount,
  percentage,
}) {
  const safePercentage = Math.min(
    Math.max(Number(percentage) || 0, 0),
    100
  );

  return (
    <div className="category-progress-item">
      <div className="category-progress-header">
        <div className="category-progress-name">
          <span className="category-progress-rank">
            {rank}.
          </span>

          <span className="category-progress-title">
            {categoryName}
          </span>
        </div>

        <strong className="category-progress-percentage">
          {safePercentage}%
        </strong>
      </div>

      <div className="category-progress-content">
        <div
          className="category-progress-track"
          role="progressbar"
          aria-label={`${categoryName} kategorisi`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safePercentage}
        >
          <div
            className="category-progress-fill"
            style={{
              width: `${safePercentage}%`,
            }}
          />
        </div>

        <span className="category-progress-count">
          {bookCount} kitap
        </span>
      </div>
    </div>
  );
}

export default CategoryProgressBar;