# Web Engineering Take Home Test

This is a technical excercise involving both some refactoring of existing code and changes to meet some requirements. The exercise uses a React application which currently has no tests and a does not meet the given requirements.

## Getting Started

This application is bootstrapped from a create-react-app application. To get started, initialize a git repository, you will then need to run `yarn install` from the root directory. After it has finished installing the required dependencies, get started by running `yarn start` which will start the development server on `localhost:3000`, and `yarn server` which will start a fake backend.

The project aims to display product search suggestions given a user's search query and will display a product card with more detailed product information when selecting one of the search suggestions.

The project has 2 main components:

- The `Autocomplete` component renders a text input and fetches an array of search suggestions given the users inputted search query, rendering these suggestions as a list below the input.
- The `ProductDetail` component recieves a product ID as a prop and fetches product information for the given ID, rendering the returned product data in a card style.

The fetching logic for both of these components in contained within `utils/api.js` which exports a couple of helper functions for retrieving either search suggestions or product information from a fake API.

## The Problem

The project is currently unfinished, requiring some new feature development and some refactoring to the current solution. We would like you to alter the application in order to adhere to the following requirements:

DONE 1. When a user has typed a search query, the search suggestions should be shown in a list below the text input.
DONE 2. Only show the top 10 suggestions at a time. If more suggestions have been returned by the API, you may assume that only the first 10 should be shown.
DONE 3. If the user has not entered a search query, we should not fetch or display any search suggestions.
4. When the user selects a suggestion, the product detail should be fetched and displayed in a card style matching the designs.
5. When the user selects a suggestion, the search suggestions should be removed and the text input should be cleared.
6. The application is not responsive and does not match the designs. Please look at the `/designs` directory and alter the application to be as close to the intended designs as possible. Please note that there are designs for desktop and mobile so your solution should be fully responsive and you should assume `600px` to be the breakpoint between desktop and mobile.
7. Currently, a request for suggestions is fired on every keystroke, this should be made more efficient by debouncing the network request.

You may also notice a number of bad practices being displayed throughout the code, please make corrections where you see fit.

The application only includes 1 test. We would like you to write tests to prove your changes work, as well as any other tests that you think are required to demonstrate that the components within the application behave as expected.

DONE The project has been bootstrapped to use Jest as a test runner and Testing Library for testing utilities but feel free to use whatever testing library you are comfortable with (just make sure we can use the command `yarn test` to run the tests).

Some stretch goals you might want to consider are:

1. Display loading states when the product detail and search suggestions are being fetched.
2. Make sure the application is fully keyboard-accessible.
DONE 3. The application currently doesn't account for errors when fetching (response failures, request timeouts etc.), how could this be handled within the application?

## Your Solution

Please feel free to spend as much or as little time as you want on improving the application, typically 2-3 hours is enough. What's important is that you are happy with the work that you produce so you can take more time if you want to. We’re looking for simple, clean, readable code. Please try to avoid over-engineering or gold plating. Commit to the git repo as often as needed and keep your commits atomic.

We don’t want lots of explanatory comments in the code, but if you run out of time and would still like to refactor something then feel free to add a comment in the relevant place. Likewise, you can comment with any other narrations that are relevant.

Feel free to use the internet to look up anything you need. Once you are done, please reply to the email you received containing this test, sending a link to your new git repository. Make sure that your `master` branch compiles, runs in the latest version of chrome, and has passing unit tests.
