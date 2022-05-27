# AcaiBolt Portal - 1.0.0-beta

## Project Setup

_Steps below describes setup on Mac, setup on other operating systems may differ slightly._

### Required Tools

1. **Node v14.17.6+**. It can be installed from [here](https://nodejs.org/en/). You can check if node was installed by running command `node --version`.

2. **Yarn v1.22.17+**. Node installation is required for this. To install yarn run a command `npm install --global yarn`. You can check if yarn was installed with the command `yarn --version`.

3. _(Mac only)_ **Homebrew v3.4.4+**. You can install it from [here](https://brew.sh/). You can check if it was installed by running command `brew --version`.

4. _(Mac only)_ **Watchman v2022.03.21.00+**. Homebrew installation is required for this. To install watchman run the command `brew install watchman`. You can check if it was installed by running command `watchman --version`.

### Starting Development Server

1. Install application dependencies with yarn package manager using command `yarn`.

2. Create file `.env.development.local` in the root of the project.

3. Add following env variables to the file created in step 2:

```
REACT_APP_KEYCLOAK_URL=https://keycloak.bolt-us.acaisoft.io/auth
REACT_APP_HASURA_WS_URL=wss://www.hasura.dev.bolt.acaisoft.io/v1/graphql
REACT_APP_HASURA_API_URL=https://www.hasura.dev.bolt.acaisoft.io/v1/graphql
REACT_APP_AUTH_SERVICE=<auth service name>
REACT_APP_AUTH_SERVICE_BASE_URL=<base url to auth service>
```

`REACT_APP_AUTH_SERVICE` currently supports two options: `bolt` and `keycloak`. If no value will be specified, application by default will use bolt auth service. If value is set to `keycloak`, `REACT_APP_AUTH_SERVICE_BASE_URL` will not have any effect on the app because Keycloak handles login and redirecting to its login page by itself.

4. Run command `yarn start` or `yarn start:local`. Application should be available on [port 3000](http://localhost:3000/). The page will reaload if you will make any edits. You will also see error/warning messages in the console.

### Running Tests

There are 3 ways to run tests in the project:

1. `yarn test:all` - most basic command, it just runs all the tests. It is used to check application before push to the remote repository.

2. `yarn test` - runs the tests in the interactive “watch mode“. It reruns tests after edit provides other useful features like running tests by regex pattern.

3. `yarn test:debug` - runs the tests in the interactive “watch mode“ and attaches Node debugger.

## Project Dependencies

The project was created with [Create React App](https://create-react-app.dev/docs/getting-started). This way we don't need to maintain the basic dependencies, like Babel, Webpack, Jest etc. `react-scripts` ensures that we always have a working, thoroughly tested and up-to-date configuration. Currently, we are using **React v18.0.0**.

### Used Packages

#### > react-scripts ([docs](https://create-react-app.dev/docs/getting-started))

Provides a working, thoroughly tested and up-to-date configuration of build and testing tools, polyfills and other goodies. Updating this package alone lets you update all of its dependencies, usually without any additional configuration or migrations.

_Current version: **5.0.0**_

#### > react-router-dom ([docs](https://reactrouter.com/docs/en/v6))

Opinionated routing library for React. Provides different types of routing modes: browser history, hash or in-memory. It allows to define routes inline, wherever they are needed, which allows to create blackboxed, self-sufficient modules that are shareable across multiple projects.

Router links should be treated like `if` statements, rendering different components conditionally based on url match.

_Current version: **6.3.0**_

#### > @material-ui/core ([docs](https://v4.mui.com/getting-started/installation/))

React components that implement Google's Material Design. Contains lots of reusable and functional components. Allows full customization in terms of styling and event handlers.

Material UI allows multiple ways of defining styles, e.g. CSS, SASS, Styled Components or JSS. In this project we use JSS syntax, which is all JavaScript and allows injecting custom theme everywhere.

Material UI components allow to override their style classes by passing `classes` prop. Each component has multiple detailed partial style classes.

_Current version: **4.12.4**_

#### > @apollo/client ([docs](https://www.apollographql.com/docs/react/))

Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. Use it to fetch, cache, and modify application data, all while automatically updating your UI. It also provides helpful mocking utils for testing.

Apollo Client helps you structure code in an economical, predictable, and declarative way that's consistent with modern development practices. The core `@apollo/client` library provides built-in integration with React, and the larger Apollo community maintains [integrations for other popular view layers.](https://www.apollographql.com/docs/react/#community-integrations)

_Current version: **3.5.10**_

#### > @testing-library/react ([docs](https://testing-library.com/docs/react-testing-library/intro/))

The `React Testing Library` is a very light-weight solution for testing React components. It provides light utility functions on top of `react-dom` and `react-dom/test-utils`, in a way that encourages better testing practices. Its primary guiding principle is:

> The more your tests resemble the way your software is used, the more confidence they can give you.

_Current version: **13.0.0**_

#### > prettier ([docs](https://prettier.io/docs/en/index.html))

Opinionated code formatter. Easily integrates with ESLint. Defines own linting ruleset, extensible via `.eslintrc` and `.prettierrc` files.

_Current version: **2.6.2**_

#### > husky ([docs](https://typicode.github.io/husky/#/))

Allows to define hooks for calling scripts on Git events, like commit or push. For example, allows to lint and format code with Prettier before committing code to the repository.

_Current version: **7.0.0**_

## Git workflow and conventions

### Git hooks

Hooks are used to fire off custom scripts whem certain important actions occur. In this project we have configured 2 hooks:

- `pre-commit` - before changes are committed, linters are running to make sure that the committed code follows project style guidelines.

- `pre-push` - running all tests before changes are pushed to the remote repository. If at least one test is failing, push is not executing.

### Commit messages

There are no strict rules for writing commit messages in this project, but generally we stick to the specification named as [Conventional Commits.](https://www.conventionalcommits.org/en/v1.0.0/) It provides an easy set of rules for creating an explict commit history. According to this convention, commits should be structured as follows:

```
<type>(optional scope): description
[optional body]
[optional footer]
```

#### Commit types

- `feat` - new functionality

- `fix` - fix to the existing functionality

- `docs` - changes regarding documentation only

- `chore` - changes that do not affect the content of the source code (ex. package upgrade)

- `refactor` - changes that are neither patches nor new features

- `tests` - everything related to testing

- `perf` - changes in the code that improve performance

- `style` - all kinds of code formatting, whitespace, commas or missing semicolons

- `ci -` changes related to CI (configs, scripts)

- `build` - changes affecting the build process (bundler config, scripts, commands)

- `revert` - revert of the last changes

## Data fetching

The application is fetching data from **Hasura** - in production from the url https://www.hasura.bolt-us.acaisoft.io/v1alpha1/graphql and on dev from the url https://www.hasura.dev.bolt.acaisoft.io/v1/graphql. The requests are send in form of **GraphQL** queries. Apart from queries and mutations, application also retrieves some data using Web Sockets.

## Project Structure

The code in this project has been split between 11 main folders:

- `__mocks__` - folder which contains all of the mocks that can be reused in different test suites.

- `assets` - folder which contains all icons, fonts and images used in the project.

- `components` - folder which contains all reusable components. When a component is used in many places in many different views, it should be put in this folder.

- `config` - folder which contains all of the main project configuration, like constants, route names and theme.

- `containers` - folder which contains all of the components which serves as containers to the other components.

- `contexts` - folder which contains all of the application contexts (they are created using [Context API](https://reactjs.org/docs/context.html#api)).

- `hooks` - this folder contains all of the reusable React hooks, which can be used across all project.

- `layout` - this folder contains all of the components, which provides wraps concrete views in general layout, for example Authorized component extends view layout with the navigation bar.

- `pages` - this folder contains all of concrete views of the application. Every view can have subdirectories similiar to the main ones, like `components` or `hooks`, but they should be created only when created things are specific to the concrete view and could not be reused anywhere else.

- `services` - this folder contains all of the services used in the project.

- `utils` - this folder contains all of the helpful utils, which are used across all project.

## Testing

For testing, application uses **Jest** test runner, which is provided by Create React App. Jest is a JavaScript testing framework designed to ensure correctness of any JavaScript codebase. It allows you to write tests with an approachable, familiar and feature-rich API that gives you results quickly.

There are 2 types of tests implemented in this project:

- **Integration tests**, which are written in order to test if components are working togehter correctly in different parts of the application.

- **Unit tests**, which are written in order to test signle functions or rendering of some of the components.

## Image

- set ENV variables:
  - BOLT_AUTH_SERVICE_BASE_URL
  - BOLT_HASURA_WS_URL
  - BOLT_HASURA_API_URL
- run:

```
make build
```

- tag image bolt-portal-local:latest with proper
