export const fetchSuggestions = (searchTerm) => {
  return fetch(`http://localhost:3001/search?q=${searchTerm}`).then((res) =>
    res.json()
  );
};

export const fetchProductDetail = (id) => {
  return fetch(`http://localhost:3001/products/${id}`).then((res) =>
    res.json()
  );
};
