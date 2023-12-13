## Vanilla way to create HTML instances

![App's UI](https://imgur.com/wrrBIo8.png)

### Overview

This mockup project uses `fetch` to read the contents of `HTML` files and parse string contents as actual markup using `DOMParser` API.

Some code details are explained as you read further. The rest (code I did not find interesting) is not present below but can be examined by your own efforts.

### Reading HTML contents

The code snippet below reads the so-called "template" before making it an actual `HTMLElement`.

```js
async function getTemplateContent(name) {
  const content = await fetch(`/elements/${name}.html`).then(async (res) => await res.text())
  return new DOMParser().parseFromString(content, 'text/html').body.firstChild
}
```

For the sake of conveniece, function is "typed" using jsdoc. `'person'` literal string would correspond to the actual name of the `HTML` file located by the path `elements/*.html`. The only file in the `elements` folder in the project is, ultimately, `person.html`.

```js
/**
 * GLOBAL
 * @typedef {'person'} TTemplatesIds
 * @typedef {{name: string, surname: string}} TPerson
 */

/**
 * @param {TTemplatesIds} name
 * @returns {HTMLFormElement}
 */
async function getTemplateContent(name) {
  // ...
}
```
