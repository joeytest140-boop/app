import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
} from "../utils/constants";

export default function FilterBar({ filters, onChange, onClear }) {
  function handleChange(e) {
    onChange({
      ...filters,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="filter-bar">
      <input
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search tasks..."
      />

      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select name="priority" value={filters.priority} onChange={handleChange}>
        <option value="">All Priorities</option>
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select name="category" value={filters.category} onChange={handleChange}>
        <option value="">All Categories</option>
        {CATEGORY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button className="btn btn-secondary" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}