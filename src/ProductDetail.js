import React, { useState, useEffect } from "react";
import { fetchProductDetail } from "./utils/api";
import "./ProductDetail.css";

const displayName = "ProductDetail";

function ProductDetail({ productId }) {
  const [errorInfo, setError] = useState({});
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (!productId) return;

    fetchProductDetail(productId)
      .then((productInfo) => setProductInfo(productInfo))
      .catch((error) => {
        setError({
          error,
          message: "error getting product details, please try later.",
        });
      });
  }, [productId]);

  const renderProductInfo = () => {
    if (errorInfo && errorInfo.message) {
      return (
        <div
          data-testid={`${displayName}-error`}
          data-internal-error={errorInfo.error}
          className="detail-error"
        >
          {errorInfo.message}
        </div>
      );
    }
    return (
      <div data-testid={displayName} className="detail-container">
        {productInfo && productInfo.id && (
          <>
            <div data-testid={`${displayName}-image`} className="row">
              <img
                alt={productInfo.title}
                src={productInfo.image}
                className="product-image"
              />
            </div>
            <div data-testid={`${displayName}-title`} className="row">
              <div className="row-title">Name:</div>
              <div className="row-body">{productInfo.title}</div>
            </div>
            <div data-testid={`${displayName}-description`} className="row">
              <div className="row-title">Description:</div>
              <div className="row-body">{productInfo.description}</div>
            </div>
            <div data-testid={`${displayName}-price`} className="row">
              <div className="row-title">Price:</div>
              <div className="row-body">
                {productInfo.price ? `£${productInfo.price}` : ""}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return renderProductInfo();
}

export default ProductDetail;
