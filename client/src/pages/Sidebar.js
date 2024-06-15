// Filtration Sidebar Sub-Component (shows up in main Feed component)

import React, { useState } from 'react';
import "../Sidebar.css";

function Sidebar({ filters, selectedFilter, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle changes in the search input (this also changes the filter by running handleFilterChange in Feed.js)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange(value);
  };

  // When suggested filters are clicked, update the input to the filter with a # at the front
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
        {/* Display a suggested filter for every filter specified in the filters prop passed from Feed.js */}
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
