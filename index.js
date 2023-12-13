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
  const content = await fetch(`/elements/${name}.html`).then(async (res) => await res.text())
  return new DOMParser().parseFromString(content, 'text/html').body.firstChild
}

/** @type {HTMLFormElement} */
const addPersonForm = document.forms['add-person']
/** @type {HTMLButtonElement} */
const addButton = addPersonForm.elements['add']
addButton.onclick = (e) =>
  addPerson({
    name: addPersonForm.elements['name'].value,
    surname: addPersonForm.elements['surname'].value,
  })

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
