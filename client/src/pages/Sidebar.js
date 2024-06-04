import React, { useState } from 'react';
import "../Sidebar.css";

function Sidebar({ filters, selectedFilter, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange(value);
  };

  const handleSuggestedFilterClick = (filter) => {
    setSearchTerm("#" + filter);
    onFilterChange(filter);
  };

  return (
    <div className="sidebar">
      <h2>Search Hashtags</h2>
      <input
        type="text"
        placeholder="Search hashtags"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <h2>Suggested Hashtags</h2>
      <ul className="suggested-filters">
        {filters.map((filter) => (
          <li key={filter} onClick={() => handleSuggestedFilterClick(filter)}>
            #{filter}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
