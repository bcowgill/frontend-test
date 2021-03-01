import React, { useEffect, useState } from "react";
import { fetchSuggestions } from "./utils/api";
import "./Autocomplete.css";

function Autocomplete() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchTerm.trim().length)
    {
      fetchSuggestions(searchTerm).then((_suggestions) =>
        setSuggestions(_suggestions)
      );
    }
  }, [searchTerm]);

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        className="search-box"
        placeholder="Search for a product"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* TODO: render search suggestions */}
    </div>
  );
}

export default Autocomplete;
