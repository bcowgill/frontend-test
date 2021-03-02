import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Autocomplete from "./Autocomplete";

const displayName = "Autocomplete";

jest.mock("./utils/api");

describe(displayName, () => {
  function renderForTest() {
    const tools = render(<Autocomplete />);

    const input = screen.getByRole("textbox", {
      placeholder: /search for a product/i,
    });
    return { input, tools };
  }

  it("renders correctly with no search term", () => {
    renderForTest();

    screen.getByPlaceholderText("Search for a product");
  });

  it("handles a server error gracefully", async () => {
    const { input } = renderForTest();

    userEvent.paste(input, "error");
    let error;
    await waitFor(() => {
      error = screen.getByTestId(`${displayName}-error`);
    });
    // screen.debug();
    expect(error).toHaveTextContent(
      "error trying to search, please try later."
    );
  });

  it("renders correctly with a popular search term", async () => {
    const { input } = renderForTest();

    userEvent.paste(input, "test");
    let suggestions;
    await waitFor(() => {
      suggestions = screen.queryAllByTestId(`${displayName}-suggestion`);
      if (!suggestions.length) {
        throw new Error("awaiting suggestion list");
      }
    });
    // screen.debug();

    expect(suggestions).toHaveLength(10);
    screen.getByText("SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s");
  });
});
