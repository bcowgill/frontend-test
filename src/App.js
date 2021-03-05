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

  const details = productId ? "showing-details" : "";

  return (
    <div title="There's nothing to see here, use the search box!" className={`App ${details}`.trim()}>
      <Autocomplete onClickProduct={onClickProduct} />
      <ProductDetail productId={productId} />
    </div>
  );
}

export default App;
