import React, { useState, useEffect } from "react";
import memoize from "lodash/memoize";
import { fetchProductDetail } from "./utils/api";
import "./ProductDetail.css";

const displayName = "ProductDetail";

/* wipro site blocking... make a random image */
const image = memoize((image) => {
  if (!image) {
    return null;
  }
  const range = 4;
  const min = 400;
  const step = 100;
  const width = min + Math.round(range * Math.random()) * step;
  const height = min + Math.round(range * Math.random()) * step;
  return `https://picsum.photos/${width}/${height}`;
});

// toLocaleString works in browser, but not under jest...
function formatMoney(
  amount,
  decimalCount = 2,
  decimal = ".",
  thousands = ",",
  unit = "£"
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      unit +
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
}

function ProductDetail({ productId }) {
  const [errorInfo, setError] = useState({});
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (!productId) {
      setProductInfo(null);
      return;
    }

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

    const price =
      productInfo && productInfo.price ? formatMoney(productInfo.price) : "";
    const titleTooltip =
      productInfo &&
      `At ${price} the ${productInfo.title} is practically a steal, after all, it features: ${productInfo.description}`;
    return (
      <div
        title={titleTooltip}
        data-testid={displayName}
        className="detail-container"
      >
        {productInfo && productInfo.id && (
          <>
            <div data-testid={`${displayName}-image`} className="row">
              <img
                alt={productInfo.title}
                src={image(productInfo.image)}
                className="product-image"
              />
            </div>
            <div
              title={productInfo.title}
              data-testid={`${displayName}-title`}
              className="row"
            >
              <div
                id={`${displayName}-title-${productInfo.id}`}
                className="row-title hidden"
              >
                Name:
              </div>
              <div
                aria-labelledby={`${displayName}-title-${productInfo.id}`}
                className="row-body"
              >
                {productInfo.title}
              </div>
            </div>
            <div
              title={productInfo.description}
              data-testid={`${displayName}-description`}
              className="row"
            >
              <div
                id={`${displayName}-description-${productInfo.id}`}
                className="row-title hidden"
              >
                Description:
              </div>
              <div
                aria-labelledby={`${displayName}-description-${productInfo.id}`}
                className="row-body subtle ellipsis"
              >
                {productInfo.description}
              </div>
            </div>
            <div
              title={`Yours for the low, low price of ${price} order now, we have operators standing by!`}
              data-testid={`${displayName}-price`}
              className="row"
            >
              <div
                id={`${displayName}-price-${productInfo.id}`}
                className="row-title hidden"
              >
                Price:
              </div>
              <div
                aria-labelledby={`${displayName}-price-${productInfo.id}`}
                className="row-body"
              >
                {price}
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
