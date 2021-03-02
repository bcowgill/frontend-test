import React, { useEffect, useState } from "react";
import { fetchSuggestions } from "./utils/api";
import "./Autocomplete.css";

let renders = 0;

const displayName = "Autocomplete";

const Suggest = React.memo(({ title }) => {
  return <div data-testid={`${displayName}-suggestion`}>{title}</div>;
});

function Autocomplete() {
  const [searchError, setSearchError] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSearchError({});
    if (searchTerm.trim().length) {
      fetchSuggestions(searchTerm)
        .then((suggestions) => {
          // throw new Error("simulate an error");
          if (suggestions.length > 10) {
            suggestions.length = 10;
          }
          setSuggestions(suggestions);
        })
        .catch((error) => {
          setSearchError({
            error,
            message: "error trying to search, please try later.",
          });
        });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  function renderSuggestions() {
    return (
      <div data-testid={`${displayName}-suggestion-list`}>
        {suggestions.map((suggestion) => {
          return <Suggest key={suggestion.id} {...suggestion} />;
        })}
      </div>
    );
  }

  // console.warn(`${displayName}.render`, renders);
  ++renders;
  return (
    <div className="search-container">
      <input
        data-testid={`${displayName}-renders`}
        type="hidden"
        value={renders}
      />
      <input
        type="text"
        value={searchTerm}
        className="search-box"
        placeholder="Search for a product"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchError.message && (
        <div
          data-testid={`${displayName}-error`}
          data-internal-error={searchError.error}
          className="search-error"
        >
          {searchError.message}
        </div>
      )}
      {suggestions && renderSuggestions()}
    </div>
  );
}

export default Autocomplete;
