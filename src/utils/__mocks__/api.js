import backend from "../../../db.json";

const mockData = {
  // AutoComplete search data...
  test: backend.search,

  // ProductDetail data...
  test1: {
    id: "test1",
    title: "TEST1 Product Title",
  },
  test2: {
    id: "test2",
    image: "data:IMAGE",
    title: "TEST2 Product Title",
    description: "TEST2 Product Description",
    price: "12.45",
  },
};
// Populate mock ProductDetail data from db.json
backend.products.forEach((product) => {
  mockData[product.id] = product;
});

function wrapApi(key) {
  if (/error/.test(key)) {
    // Some server error which invokes the catch blcok
    return Promise.reject(key);
  }
  return Promise.resolve(mockData[key] || {});
}

export const fetchSuggestions = (searchTerm) => {
  return wrapApi(searchTerm);
};

export const fetchProductDetail = (id) => {
  return wrapApi(id);
};
