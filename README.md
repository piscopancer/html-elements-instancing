## Vanilla way to create HTML instances

![App's UI](https://imgur.com/wrrBIo8.png)

## Overview

This mockup project uses `fetch` to read the contents of `HTML` files and parse string contents as actual markup using `DOMParser` API.

Some code details are explained as you read further. The rest (code I did not find interesting) is not present below but can be examined by your own efforts.

### Reading HTML contents

The code snippet below includes a function that reads the so-called "template" as string before making it an actual `HTMLElement`.

```js
async function getTemplateContent(name) {
  const content = await fetch(`/elements/${name}.html`).then(async (res) => await res.text())
  return new DOMParser().parseFromString(content, 'text/html').body.firstChild
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
 * @returns {HTMLFormElement}
 */
async function getTemplateContent(name) {
  // ...
}
```

## Adding a person

The following function is responsible for "creating a new Person". There is no state management in the application and none on the variables are updated. The only responsibility of this function is instacing a new `person.html` card and filling its inputs with correspoing `person.name` and `person.surname` values.

Unintuitevely, **events** cannot be set to the instantiated `HTMLElement` before it was appended. Even though the can, they get **unset** after the element gets appended. In order to overcome such tricky behavior, events must be set for the actual `HTMLElement`. Consider the `deleteButton` example below.

```js
/**
 * @param {TPerson} person
 */
async function addPerson(person) {
  const peopleList = document.querySelector('ul#people')
  const _personForm = await getTemplateContent('person')
  _personForm.id = crypto.randomUUID()
  _personForm.elements['person-name'].value = person.name
  _personForm.elements['person-surname'].value = person.surname
  const personForm = _personForm.cloneNode(true)
  peopleList.append(personForm)

  /** @type {HTMLButtonElement} */
  const deleteButton = personForm.elements['delete']
  deleteButton.onclick = (e) => {
    e.preventDefault()
    console.log(_personForm.id)
    document.getElementById(_personForm.id).remove()
  }
}
```
