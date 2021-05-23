// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { resetGlobals, setGlobals } from '8-helpers/test-utils';

// This is a test file so it can use dev dependencies
/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom/extend-expect';

beforeEach(() => {
  setGlobals();
});

afterEach(() => {
  resetGlobals();
});

/* eslint-enable import/no-extraneous-dependencies */
