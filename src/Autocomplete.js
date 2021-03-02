import PropTypes from "prop-types";
import React, { useEffect, useState, useCallback } from "react";
import { fetchSuggestions } from "./utils/api";
import "./Autocomplete.css";

let renders = 0;

const displayName = "Autocomplete";

const Suggest = React.memo(({ id, title, onClick }) => {
  return (
    <div
      data-testid={`${displayName}-suggestion`}
      data-id={id}
      onClick={onClick}
    >
      {title}
    </div>
  );
});
Suggest.displayName = "Suggest";
Suggest.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

const THROTTLE = 300;

// TODO better to use a non-state variable useRef for this if more than one in the app...
let lastLookup = null;
function cancelApi() {
  if (lastLookup) {
    clearTimeout(lastLookup);
    lastLookup = null;
  }
}

function Autocomplete({ onClickProduct }) {
  const [searchError, setSearchError] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const lookup = useCallback(
    (term) => {
      cancelApi();
      lastLookup = setTimeout(() => {
        lastLookup = null;
        fetchSuggestions(term)
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
              term,
              message: "error trying to search, please try later.",
            });
          });
      }, THROTTLE);
    },
    [setSuggestions, setSearchError]
  );

  useEffect(() => {
    const term = searchTerm.trim();
    if (searchError.message) {
      setSearchError({});
    }
    if (term.length) {
      lookup(term);
    } else {
      cancelApi();
      setSuggestions([]);
    }
  }, [searchTerm, searchError, setSearchError, setSuggestions, lookup]);

  const onClickSuggestion = useCallback(
    (event) => {
      const id = event && event.target && event.target.getAttribute("data-id");
      cancelApi();
      setSearchTerm("");
      setSuggestions([]);
      id && onClickProduct && onClickProduct(id);
    },
    [onClickProduct]
  );

  function renderSuggestions() {
    return (
      <div data-testid={`${displayName}-suggestion-list`}>
        {suggestions.map((suggestion) => {
          return (
            <Suggest
              key={suggestion.id}
              {...suggestion}
              onClick={onClickSuggestion}
            />
          );
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
Autocomplete.propTypes = {
  onClickProduct: PropTypes.func,
};

export default Autocomplete;
