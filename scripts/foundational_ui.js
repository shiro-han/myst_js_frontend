const CORS_URL = 'https://damp-taiga-79758.herokuapp.com/'
const RAILS_URL = "http://localhost:3000/users"
const API_KEY = 'cfc722389b379cdc9ee497832c009ac3'

$(function(){
    $("#navbar").load("foundational_ui.html #navigation"); 
    $("#footer").load("foundational_ui.html #sticky-footer"); 
});

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
}

document.addEventListener('DOMContentLoaded', () => {
    getGenresNav()

    document.addEventListener("click", function(e) {
        if (e.target.innerText === "Library") {
            e.preventDefault()
            if (document.cookie.includes('username=')) {
                window.location.replace('/collection.html')
            } else {
                window.location.replace('/login.html')
            }
        }
    })
})