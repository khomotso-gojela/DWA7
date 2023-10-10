import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

/**
 * fetch a html element
 * @param {string} element 
 * @returns {HTMLElement}
 */
export function getElement(element) {
    console.log(`[data-${element}]`)
    return document.querySelector(`[data-${element}]`)
}

/**
 * sets theme to night theme
 */
export function setNightTheme() {
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
}

/**
 * sets theme to day theme
 */
export function setDayTheme() {
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

/**
 * Set inner html for book previews
 * @param {string} author 
 * @param {string} image 
 * @param {string} title 
 * @returns {string}
 */
export function previewHTML(author, image, title) {
    return `
    <img
        class="preview__image"
        src="${image}"
    />
    
    <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
    </div>
`
}

/**
 * Populates form select input with options
 * @param {object} obj - object with select input options
 * @returns {DocumentFragment}
 */
export function formOptions(obj) {

    const frag = document.createDocumentFragment()
    const firstGenreElement = document.createElement('option')
    firstGenreElement.value = 'any'
    firstGenreElement.innerText = 'All'
    frag.appendChild(firstGenreElement)
    
    for (const [id, name] of Object.entries(obj)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        frag.appendChild(element)
    }
    
    return frag
    
}

/**
 * Opens and closes overlays
 * @param {HTMLElement} element 
 */
export function openClose(element,overlay) {
    element.addEventListener('click',()=>{
        if (overlay.open == true) {
            overlay.open = false
        } else {
            overlay.open = true
        }
    })
}