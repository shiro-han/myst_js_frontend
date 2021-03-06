const CORS_URL = 'https://damp-taiga-79758.herokuapp.com/'
const RAILS_URL = "http://localhost:3000/"
const API_KEY = 'cfc722389b379cdc9ee497832c009ac3'

let userID;
let gameID;
let genreID;
let genreName;
let searchTerm;
let errorMessage;
// let genreList = []

$(function(){
    $("#navbar").load("foundational_ui.html #navigation"); 
    $("#footer").load("foundational_ui.html #sticky-footer"); 
});

function getCookies() {
    if (document.cookie) {
        cookieArray = document.cookie.split(';')
        for (let i = 0; i < cookieArray.length; i++) {
            if (cookieArray[i].includes('game')) {
                gameID = parseInt(cookieArray[i].split('=')[1])
            }
            if (cookieArray[i].includes('genre=')) {
                genreID = cookieArray[i].split('=')[1]
            }
            if (cookieArray[i].includes('genre_name')) {
                genreName = cookieArray[i].split('=')[1]
            }
            if (cookieArray[i].includes('search-term')) {
                searchTerm = cookieArray[i].split('=')[1]
            }
            if (cookieArray[i].includes('userid')) {
                userID = parseInt(cookieArray[i].split('=')[1])
            }
            if (cookieArray[i].includes('error')) {
                errorMessage = cookieArray[i].split('=')[1];
            }
        }
    }
}

const getGenresNav = () => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", "cfc722389b379cdc9ee497832c009ac3");
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("Cookie", "__cfduid=dc4622210358dc9f2e6fbe9dcb5a930ca1595946479");

    const raw = "fields name; limit 100;";

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(CORS_URL + "https://api-v3.igdb.com/genres/", requestOptions)
        .then(response => response.json())
        .then(json => renderGenresNav(json))
        .catch(error => console.log('error', error));
}

const renderGenresNav = (genres) => {
    const genreDropdown = document.querySelector('.dropdown-menu')
    genres.forEach(genre => {
        let a = document.createElement('a')
        a.className = "dropdown-item"
        a.setAttribute('href', "/genre.html")
        a.innerText = genre.name
        a.dataset.id = genre.id
        genreDropdown.append(a)
    })
    checkLogin()
}

const imgURL = (url, size = 'cover_big') => {
    return 'http:' + url.replace('thumb', size)
}

const pElement = (game, attr) => {
    let p = document.createElement('p')
    p.innerText = `${attr.charAt(0).toUpperCase() + attr.slice(1)}: `
    game[attr].forEach(element => {
        let span = document.createElement('span');
        span.className = 'badge badge-secondary genre-badge'
        span.innerText = element.name
        span.dataset.id = element.id
        p.appendChild(span);
    })
    return p;
}

const getGenreList = () => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", "cfc722389b379cdc9ee497832c009ac3");
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("Cookie", "__cfduid=dc4622210358dc9f2e6fbe9dcb5a930ca1595946479");

    const raw = "fields name; limit 100;";

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(CORS_URL + "https://api-v3.igdb.com/genres/", requestOptions)
        .then(response => response.json())
        .then(json => {
            genreList = json
        })
        .catch(error => console.log('error', error));
}

const checkLogin = () => {
    if (!userID) {
        let navItem = document.getElementById('library')
        navItem.innerText = 'Log In'
    } else {
        let navItemContainer = document.querySelector('.navbar-nav')
        let logOut = document.createElement('li')
        logOut.className = 'nav-item active'
        logOut.innerHTML = `<a id="log-out" class="nav-link" href="/">Logout</a>`
        navItemContainer.append(logOut)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getGenreList()
    getCookies()
    getGenresNav()
})

document.addEventListener("click", function(e) {
    if (e.target.innerText === "Log In" || e.target.innerText === "Library") {
        e.preventDefault()
        if (document.cookie.includes('userid=')) {
            window.location.replace('/collection.html')
        } else {
            document.cookie = "error=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            window.location.replace('/login.html')
        }
    }
    if (genreList.map(obj => obj.name).includes(e.target.innerText)) {
        e.preventDefault()
        document.cookie = `genre=${e.target.dataset.id}`
        document.cookie = `genre_name=${e.target.innerText}`
        window.location.replace("/genre.html")
    }
    if (e.target.innerText === "Logout") {
        e.preventDefault();
        document.cookie = "userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.replace('/');
    }
})

document.addEventListener("submit", function(e) {
    if (e.target.classList.contains("form-inline")) {
        e.preventDefault()
        let search = document.querySelector('.form-control').value
        document.cookie = `search-term=${search}`
        window.location.replace('/search.html')
    }
})