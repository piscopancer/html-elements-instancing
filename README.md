## Vanilla way to create HTML instances

![App's UI](https://imgur.com/wrrBIo8.png)

## Overview

This mockup project uses `fetch` to read the contents of `HTML` files and parse string contents as actual markup using `DOMParser` API.

Some code details are explained as you read further. The rest (code I did not find interesting) is not present below but can be examined by your own efforts.

### Reading HTML contents

The function below reads the `*.html` files in the `elements` folder as string. Every file contains the only `<template>...</template>` with whatever contents. The idea is to "parse" the contents as a string by appending them to a temporary parent `div`, cloning the content's (template's) children and returning them.

```js
async function htmlElementsFromTemplate(name) {
  const content = await fetch(`/elements/${name}.html`).then(async (res) => await res.text())
  const tempParent = document.createElement('div')
  tempParent.innerHTML = content
  return tempParent.firstChild.content.cloneNode(true).children
}
```

For the sake of conveniece, function is "typed" using jsdoc. The `'person'` literal string would correspond to the actual name of the `HTML` file located by the path `elements/*.html`. The only file in the `elements` folder in the project is, ultimately, `person.html`.

As you add more `HTML` files in the element, should you consider updating jsdoc `TTemplatesIds` type definition (e.g `'person' | 'product-card' | 'inventory-item'`).

```js
/**
 * GLOBAL
 * @typedef {'person'} TTemplatesIds
 * @typedef {{name: string, surname: string}} TPerson
 */

/**
 * @param {TTemplatesIds} name
 * @returns {HTMLCollection}
 */
async function htmlElementsFromTemplate(name) {
  // ...
}
```

## Adding a person

The following function is responsible for "creating a new Person". There is no state management in the application and none on the variables are updated. The only responsibility of this function is instacing a new `person.html` card and filling its inputs with correspoing `person.name` and `person.surname` values.

Because `htmlElementsFromTemplate` function returns a collection of `HTMLElement`'s, as there may be multiple of them inside `template` tag...

```html
<!-- elements/some-teplate.html -->
<template>
  <!-- We need to work with this form element afterwards and we do not care about paragraphs. -->
  <form></form>
  <p></p>
  <p></p>
</template>
```

... we should get a particular element from this template by its index or artificially limit ourselves to creating only one child element. You choose.

Unintuitevely, **events** cannot be set to the instantiated `HTMLElement` before it was appended. Even though the can, they get **unset** after the element gets appended. In order to overcome such tricky behavior, events must be set for the actual `HTMLElement` **after** it gets appended. Consider the `deleteButton` example below.

```js
/**
 * @param {TPerson} person
 */
async function addPerson(person) {
  const peopleList = document.querySelector('ul#people')
  const _personForm = (await htmlElementsFromTemplate('person'))[0]
  _personForm.id = crypto.randomUUID()
  _personForm.elements['person-name'].value = person.name
  _personForm.elements['person-surname'].value = person.surname

  peopleList.append(_personForm)

  const deleteButton = /** @type {HTMLButtonElement} */ (_personForm.elements['delete'])
  deleteButton.addEventListener('click', () => {
    document.getElementById(_personForm.id).remove()
  })
}
```
