## How to Build a Modern JS Project

YouTube _How to Build a Modern JS Project_

- [#1 Intro](https://www.youtube.com/watch?v=nLwqM034Jjs)
- [#2 What is a Build Process? (CI/CD)](https://www.youtube.com/watch?v=hZ0vNZGHUIY)
- [#3 ESLint, Prettier & EditorConfig](https://www.youtube.com/watch?v=O4ZIJgOWj_A&t=26s)
- [#4 Pre-commit with Husky & lint-staged](https://www.youtube.com/watch?v=6u9gmwTl3bY)
- [#5 Rollup with CJS, ESM & UMD](https://www.youtube.com/watch?v=ZGa_a164aeM&t=2s)
- [#6 Babel & React](https://www.youtube.com/watch?v=4joAZ2RQNys)
- [#7 Components & Styling](https://www.youtube.com/watch?v=ma0alSz1pZg)
- [#8 Module Systems](https://www.youtube.com/watch?v=K1RE9FspKxw)
- [#9 Storybook](https://www.youtube.com/watch?v=K1RE9FspKxw&t=33s)
- [#10 Snapshot Tests](https://www.youtube.com/watch?v=2jyxFquZ13k)

- GitHub

  - Select a package name that is not yet in use on NPM
  - Create a new repository
    - Public
    - initialize this repository with a README,
    - MIT License
    - Add a Node .gitignore
    - Create Repository
    - Click 'Clone or Download' and copy repository link to clipboard

- Setup Project Folder

  - Change to parent directory of soon-to-be project

    ```
    c:\cbevins\dev\node> git clone https://github.com/cbevins/wildfire-variant.git
    c:\cbevins\dev\node>cd wildfire-variant
    c:\cbevins\dev\node\wildfire-variant> npm init -y
    c:\cbevins\dev\node\wildfire-variant> code .
    ```

  - Create src folder and index.js ...

    ```
    c:\cbevins\dev\node\wildfire-variant> mkdir src
    c:\cbevins\dev\node\wildfire-variant> cd src
    c:\cbevins\dev\node\wildfire-variant\src> touch index.js
    c:\cbevins\dev\node\wildfire-variant\src> code .
    ```

  - Enable Eslint and Prettier extensions in VSCode

  - Update the `package.json` file with keywords, etc.

- Install and Configure 'eslint'

  - From the project directory ...

    ```
    npm install eslint --save-dev
    npm install eslint-plugin-react --save-dev
    npx eslint --init
    ```

    or

    ```
    npm i -D eslint
    npm i -D eslint-plugin-react
    npx eslint --init
    ```

  - Create/edit .eslintrc.json ...

    ```
    {
      "extends": [
        "plugin:react/recommended",
        "standard"
      ],
    }
    ```

  - Create .eslintignore (and .prettierignore)...

    ```
    README.md

    dist

    node_modules
    ```

- Install and configure prettier-eslint

- From the project directory...

  ```
  npm install prettier-eslint --save-dev
  npm install prettier-eslint-cli --save-dev
  ```

  or

  ```
  npm i -D prettier-eslint
  npm i -D prettier-eslint-cli

  ```

- Install and Configure Jest

  - From project folder ...

    ```
    npm i -D jest
    npm i -D eslint-plugin-jest
    ```

  - To enable import/export in Jest, create a .babelrc file ...
    ```
    {
      "env": {
        "test": {
          "presets": ["@babel/env"]
        }
      }
    }
    ```

- Install and configure rollup

  - From project folder ...

    ```
    npm i -D rollup
    npm i -D rollup-plugin-node-resolve
    npm i -D rollup-plugin-terser
    npm i -D rollup-plugin-babel @babel/core @babel/preset-env @bable/preset-react
    npm i -D rimraf
    ```

  - Create a 'rollup.config.js' in project folder ...

    ```
      import { terser } from 'rollup-plugin-terser'

      const bundle = 'dist/variant'
      // const bundle = 'dist/foo'

      export default {
        input: 'src/index.js',
        output: [
          {
            file: `${bundle}.esm.js`,
            format: 'esm'
          },
          {
            file: `${bundle}.esm.min.js`,
            format: 'esm',
            plugins: [terser()]
          },
          {
            file: `${bundle}.cjs.js`,
            format: 'cjs'
          },
          {
            file: `${bundle}.cjs.min.js`,
            format: 'cjs',
            plugins: [terser()]
          }
        ]
      }
    ```

  - In package.json, add

    ```
    "type": "module",
    "scripts": {
        "prebuild": "rimraf dist",
        "build": "rollup -c",
    }
    ```

  - Create .babelrc in project folder ...

  ```
  {
    "presets": [
      ["@babel/env", {
        "modules": false,
        "targets": {
          "browsers": "> 0.25%, ie11, not op_mini, not dead",
          "node": 10
        }
      }],
      "@babel/react"
    ]
  }
  ```

  See [Build a Modern JS Project - #6 Babel & React](https://www.youtube.com/watch?v=4joAZ2RQNys) for configuring `rollup` for React and ReactDOM using `external` and `globals` properties.

## NEXT PROJECTS

- Create github repo
- Clone github repo on desktop
- npm init -y
- Edit package.json to modify:

  - version:
  - scripts:
  - main:
  - exports:
  - module:
  - sideEffects:
  - type:
  - files:
  - scripts:
  - devDependencies

- Copy files:

  - .babelrc
  - .editorconfig
  - .eslintignore
  - .eslintrc.json
  - .prettierignore
  - rollup.config.js

- npm install
