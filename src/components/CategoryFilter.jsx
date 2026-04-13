export default function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div className="container">
      <div className="chips-row">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={activeCategory === category.id ? "chip chip--active" : "chip"}
            onClick={() => onSelect(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
