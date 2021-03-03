/* eslint-disable react/jsx-filename-extension */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProductDetail from "./ProductDetail";

jest.mock("./utils/api");

const displayName = "ProductDetail";

describe(displayName, () => {
  it("renders correctly with minimal props", async () => {
    render(<ProductDetail productId="test1" />);

    await waitFor(() => {
      screen.getByTestId(`${displayName}-title`);
    });

    screen.getByText(/test1 product title/i);
    expect(screen.queryAllByText(/£/)).toHaveLength(0);
  });

  it("handles an api error gracefully", async () => {
    render(<ProductDetail productId="errorNotJson" />);

    let error;
    await waitFor(() => {
      error = screen.getByTestId(`${displayName}-error`);
    });

    expect(error).toHaveTextContent(
      /error getting product details, please try later/i
    );
  });

  it("renders correctly with all props", async () => {
    render(<ProductDetail productId="test2" />);

    await waitFor(() => {
      screen.getByTestId(`${displayName}-price`);
    });

    screen.getByTestId(`${displayName}-image`);
    screen.getByText("TEST2 Product Title");
    screen.getByText("TEST2 Product Description");
    screen.getByText("£12.40");
  });

  it("renders currency formatted £x,xxx.00", async () => {
    render(<ProductDetail productId="test3" />);

    await waitFor(() => {
      screen.getByTestId(`${displayName}-price`);
    });

    screen.getByTestId(`${displayName}-image`);
    screen.getByText("TEST3 Product Title");
    screen.getByText("£1,234,332.00");
  });
});
