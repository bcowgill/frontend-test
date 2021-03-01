const mockData = {
  test: {},
  // ProductDetail data...
  test1: {
    image: "",
    title: "TEST1 Product Title",
    description: "TEST1 Product Description",
    price: "£12.45",
  },
};

function wrapApi(key) {
  if (/error/.test(key)) {
    // Some server error which invokes the catch blcok
    return Promise.reject(key);
  }
  return Promise.resolve(wrapJson(mockData[key] || {}));
}

function wrapJson(payload) {
  return {
    json: () => payload,
  };
}

export const fetchSuggestions = (searchTerm) => {
  return wrapApi(searchTerm);
};

export const fetchProductDetail = (id) => {
  return wrapApi(id);
};
