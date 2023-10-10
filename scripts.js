import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
import { getElement, setNightTheme, setDayTheme, previewHTML, formOptions, openClose } from './abstractions.js'

const html = {
    showmore: {
        list: getElement('list-items'),
        listBtn: getElement('list-button'),//document.querySelector('[data-list-button]'),
        message: getElement('list-message'),//document.querySelector('[data-list-message]'),
        close: getElement('list-close'),//document.querySelector('[data-list-close]'),
        active: getElement('list-active') //document.querySelector('[data-list-active]')
    },

    search: {
        authors: getElement('search-authors'),//document.querySelector('[data-search-authors]'),
        genres: getElement('search-genres'),//document.querySelector('[data-search-genres]'),
        cancel: getElement('search-cancel'),//document.querySelector('[data-search-cancel]'),
        btn: getElement('header-search'),//document.querySelector('[data-header-search]'),
        overlay: getElement('search-overlay'),//document.querySelector('[data-search-overlay]'),
        title: getElement('search-title'),//document.querySelector('[data-search-title]'),
        form: getElement('search-form'),//document.querySelector('[data-search-form]')
    },

    setting: {
        cancel: document.querySelector('[data-settings-cancel]'),
        overlay: document.querySelector('[data-settings-overlay]'),
        form: document.querySelector('[data-settings-form]'),
        btn: document.querySelector('[data-header-settings]'),
        theme: document.querySelector('[data-settings-theme]')
    },

    description: {
        overlay: document.querySelector('[data-list-active]'),
        imgBlur: document.querySelector('[data-list-blur]'),
        img: document.querySelector('[data-list-image]'),
        title: document.querySelector('[data-list-title]'),
        subTitle: document.querySelector('[data-list-subtitle]'),
        descrip: document.querySelector('[data-list-description]')
    }
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

let page = 1; //number of pages displayed
let matches = books //all books in our data file

const starting = document.createDocumentFragment()

for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    element.innerHTML = previewHTML(author, image, title)

    starting.appendChild(element)
}

html.showmore.list.appendChild(starting)

html.search.genres.appendChild(formOptions(genres))

html.search.authors.appendChild(formOptions(authors))

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setting.theme.value = 'night'
    setNightTheme()
} else {
    html.setting.theme.value = 'day'
    setDayTheme()
}

html.showmore.listBtn.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
html.showmore.listBtn.disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0


html.showmore.listBtn.innerHTML = showmoreHtml()

openClose(html.search.cancel, html.search.overlay)

openClose(html.setting.cancel, html.setting.overlay)

openClose(html.search.btn, html.search.overlay)

openClose(html.setting.btn, html.setting.overlay)

openClose(html.showmore.close, html.showmore.active)

html.setting.form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
        setNightTheme()
    } else {
        setDayTheme()
    }
    
    html.setting.overlay.open = false
})

html.search.form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        html.showmore.message.classList.add('list__message_show')
    } else {
        html.showmore.message.classList.remove('list__message_show')
    }

    html.showmore.list.innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = previewHTML(author, image, title)

        newItems.appendChild(element)
    }

    html.showmore.list.appendChild(newItems)
    html.showmore.listBtn.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    html.showmore.listBtn.innerHTML = showmoreHtml()

    window.scrollTo({top: 0, behavior: 'smooth'});
    html.search.overlay.open = false
})

html.showmore.listBtn.addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = previewHTML(author, image, title)

        docfragment.appendChild(element)
    }

    html.showmore.list.appendChild(fragment)
    page += 1
})

html.showmore.list.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        html.description.overlay.open = true
        html.description.imgBlur.src = active.image
        html.description.img.src = active.image
        html.description.title.innerText = active.title
        html.description.subTitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        html.description.descrip.innerText = active.description
    }
})
