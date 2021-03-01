import React from "react";
import {render, screen} from '@testing-library/react'

import Autocomplete from "./Autocomplete";

jest.mock("./utils/api");

describe("Autocomplete", () => {
  it("renders correctly with no search term", () => {
    render(<Autocomplete />);
    // screen.debug();

    const input = screen.getByRole('textbox', {placeholder: /search for a product/i})

    expect(input).toBeInTheDocument();
    screen.getByPlaceholderText('Search for a product')
  });
});
