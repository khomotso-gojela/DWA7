
//set InnnerText(2)
//set Theme
//open/close overlays
//get html element

function htmlText() {
    return `
    <img
        class="preview__image"
        src="${this.image}"
    />
    
    <div class="preview__info">
        <h3 class="preview__title">${this.title}</h3>
        <div class="preview__author">${authors[this.author]}</div>
    </div>
`
}

/**
 * updates the showmore button inner Text
 * @returns {string}
 */
function showmoreHtml() {
    return `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`
}


/**
 * sets theme to night theme
 */
function setNightTheme() {
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
}

/**
 * sets theme to day theme
 */
function setDayTheme() {
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

html.search.cancel.addEventListener('click', () => {
    html.search.overlay.open = false
})

html.setting.cancel.addEventListener('click', () => {
    html.setting.overlay.open = false
})

/**
 * Opens and closes overlays
 * @param {HTMLElement} element 
 */
function openClose(element) {
    element.addEventListener('click',()=>{
        if (element.open == true) {
            element.open = false
        } else if(element.open == false) {
            element.open = true
        }
    })
}

document.querySelector('[data-list-items]'),

function getElement(element) {
    console.log(`[data-${element}]`)
    return document.querySelector(`[data-${element}]`)
}