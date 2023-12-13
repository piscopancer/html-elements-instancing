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
  const content = await fetch(`/elements/${name}.html`).then(async (res) => await res.text())
  const tempParent = document.createElement('div')
  tempParent.innerHTML = content
  return tempParent.firstChild.content.cloneNode(true).children
}

const addPersonForm = /** @type {HTMLFormElement} */ (document.forms['add-person'])
const addButton = /** @type {HTMLButtonElement} */ (addPersonForm.elements['add'])
addButton.onclick = (e) => {
  const nameInput = /** @type {HTMLInputElement} */ (addPersonForm.elements['name'])
  const surnameInput = /** @type {HTMLInputElement} */ (addPersonForm.elements['surname'])
  addPerson({
    name: nameInput.value,
    surname: surnameInput.value,
  })
  nameInput.value = ''
  surnameInput.value = ''
  nameInput.focus()
}

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
