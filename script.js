const list = document.querySelector('.main__list')
const input = document.querySelector('.main__input')

input.addEventListener('input', debounce())

/* Запрос к GitHub API */
function getRepo(name) {
    return Promise.resolve()
        .then(function () {
            return fetch(`https://api.github.com/search/repositories?q=${name}&per_page=5`)
                .then(function(response){
                    return response.json()
                })
        })
}

function debounce() {
    let flag = false
    let timeoutId

    function deb() {
        if (flag) {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(function () {
                flag = false
                updateValue.apply(this, arguments)
            }, 500)
        } else {
            flag = true
            timeoutId = setTimeout(function () {
                flag = false
                updateValue.apply(this, arguments)
            }, 500)
        }
    }

    return deb
}

/* Обновление/создание значения инпута */
function updateValue() {
    if (input.value.length === 0) {
        clearInput()
    } else {
        getRepo(input.value)
            .then(function (posts) {
                return posts.items
            })
            .then(function (items) {
                if (items === undefined) {

                } else {
                    return items
                }
            })
            .then(function (filterItems) {
                updateDropDown(filterItems)
            })
            .catch(function (err) {
                return err
            })
    }
}

/*Создание dropDown*/
function updateDropDown(items) {
    clearInput()
    input.classList.add('active')
    const fragment = document.createDocumentFragment()
    for (let rep of items) {
        const item = document.createElement('div')
        item.classList.add('main__item-dropdown')
        item.insertAdjacentHTML('afterbegin', `<span>${rep.name}</span>`)
        item.addEventListener('click', function () {
            createEl(rep.name, rep.owner.login, rep.stargazers_count)
        })
        fragment.appendChild(item)
    }
    input.after(fragment)
}

/* Создание элемента списка */
function createEl(name, owner, stars) {
    input.value = ''
    clearInput()
    const item = document.createElement('div')
    item.insertAdjacentHTML('afterbegin', `<span>Name: ${name}</span>`)
    item.insertAdjacentHTML('beforeend', `<span>Owner: ${owner}</span>`)
    item.insertAdjacentHTML('beforeend', `<span>Stars: ${stars}</span>`)
    const btn = document.createElement('button')
    btn.textContent = 'Удалить'
    function listen() {
        item.removeEventListener('click', listen)
        item.remove()
    }
    btn.addEventListener('click', listen)

    item.insertAdjacentElement('beforeend', btn)


    item.classList.add('main__item-list')
    list.insertAdjacentElement("afterbegin", item)
}

/* Очистка инпута и удаление dropDown menu*/
function clearInput() {
    input.classList.remove('active')
    const items = document.querySelectorAll('.main__item-dropdown')
    if (items.length > 0) {
        for (let item of items) {
            item.remove()
        }
    }
}






