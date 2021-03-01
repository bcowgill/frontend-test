const mockData = {
  test: {}
}

function wrapJson(payload) {
  return {
    json: () => payload
  }
}

export const fetchSuggestions = (searchTerm) => {
  const payload = mockData[searchTerm] || {};
  return Promise.resolve(wrapJson(payload))
};

export const fetchProductDetail = (id) => {
  const payload = mockData[id] || {};
  return Promise.resolve(wrapJson(payload))
};
