import React, { useState, useCallback } from "react";
import ProductDetail from "./ProductDetail";
import Autocomplete from "./Autocomplete";
import "./App.css";

function App() {
  const [productId, setProductId] = useState();

  const onClickProduct = useCallback(
    (id) => {
      setProductId(id);
    },
    [setProductId]
  );

  return (
    <div className="App">
      <Autocomplete onClickProduct={onClickProduct} />
      <ProductDetail productId={productId} />
    </div>
  );
}

export default App;
