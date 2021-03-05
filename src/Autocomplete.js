import React, {
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import PropTypes from "prop-types";
import { fetchSuggestions } from "./utils/api";
import "./Autocomplete.css";

// let renders = 0;

const displayName = "Autocomplete";

const Suggest = React.memo(({ id, title, onClick }) => {
  return (
    <button
      data-testid={`${displayName}-suggestion`}
      data-id={id}
      className="search-suggestion"
      onClick={onClick}
    >
      {title}
    </button>
  );
});
Suggest.displayName = "Suggest";
Suggest.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

const THROTTLE = 300;

function Autocomplete({ onClickProduct }) {
  const lastLookupRef = useRef(null)
  const [productId, setProductId] = useState(null)
  const [searchError, setSearchError] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const cancelApi = useCallback(() => {
    if (lastLookupRef.current) {
      clearTimeout(lastLookupRef.current);
      lastLookupRef.current = null;
    }
  }, [lastLookupRef])

  const lookup = useCallback(
    (term) => {
      cancelApi();
      lastLookupRef.current = setTimeout(() => {
        lastLookupRef.current = null;
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
    [setSuggestions, setSearchError, cancelApi]
  );

  useEffect(() => {
    const term = searchTerm.trim();
    if (searchError.message) {
      setSearchError({});
    }
    if (term.length) {
      if (productId) {
        setProductId(null);
        onClickProduct && onClickProduct(null);
      }
      lookup(term);
    } else {
      cancelApi();
      setSuggestions([]);
    }
  }, [
    lookup,
    cancelApi,
    productId,
    searchTerm,
    searchError,
    setSearchError,
    setSuggestions,
    onClickProduct,
  ]);

  const onClickSuggestion = useCallback(
    (event) => {
      const id = event && event.target && event.target.getAttribute("data-id");
      cancelApi();
      setSearchTerm("");
      setSuggestions([]);
      setProductId(id);
      id && onClickProduct && onClickProduct(id);
    },
    [onClickProduct, cancelApi
    ]
  );

  function renderSuggestions() {
    return (
      <div
        title="Choose now, while supplies last!"
        className="search-suggestion-list"
        data-testid={`${displayName}-suggestion-list`}
      >
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

  //console.warn(`${displayName}.render`, renders, productId);
  const details = productId ? "showing-details" : "";
  // ++renders;
  return (
    <div className={`search-container ${details}`.trim()}>
      {/*<input
        data-testid={`${displayName}-renders`}
        type="hidden"
        value={renders}
      />*/}
      <input
        type="text"
        title="Don’t hesitate, search now!"
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
