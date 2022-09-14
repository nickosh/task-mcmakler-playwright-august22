# task-mcmakler-playwright-august22

Task project for McMakler company: automated webapp testing with Javascript and Playwright framework.

---

Recommended Node.js version: 16.16.0

Recommended NPM version: 8.18.0

Node.js packages used: Playwright 1.25.0, expect-playwright 0.8.0, axe-core 4.4.3, prettier 2.7.1

---

**How to run automation:**
You will need already installed Node.js and NPM packages into system. Please check this link for more details: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/

Recommended to use any terminal app that you prefer.

1. Go to project folder and run packages installation with command: `npm install`
2. Now you able to run automation with command: `npx playwright test`
3. After automation run is finished you able to see results in your terminal output.
   Additionally you can run command `npx playwright show-report` to see results in browser.

---

Webapp under test: https://admin-advertisement.herokuapp.com

Webapp's API under test: https://admin-advertisement.herokuapp.com/api/advertisements/

**Testing goal:**

We have two flows:

1. Create new advertisement
2. Edit any existing advertisement

What you need to do → API + E2E testing:

1. Create test cases for flow above
2. Implement scenarios for created cases

**Project conditions:**
* Javascript/Typescript are the preferred programming languages
* Use any Framework you’re comfortable with
* Use any structure or pattern you’re comfortable with
* Include a README file, in which you explain how to set up the project, how to run
tests etc.

---

E2E functional test suite - `tests/e2e.spec.js`

UI functional test suite - `tests/ui.spec.js`

API functional test suite - `tests/api.spec.js`

19 automated tests prepared for this project.

---

Company's feedback which I received:

"The page object model, wasn't fully used, only selectors in the page file. No helpers for API functions. Test files are too big to be easily understood. Test data is not separated from the logic. Playwright was not correctly configured, the browser was running in non-headless mode."
