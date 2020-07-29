const CORS_URL = 'https://damp-taiga-79758.herokuapp.com/'
const API_URL = "https://api-v3.igdb.com/games"
const RAILS_URL = "http://localhost:3000/"
const API_KEY = 'cfc722389b379cdc9ee497832c009ac3'

let genreID = parseInt(document.cookie.split('genre=')[1], 10)
let genreList = []

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

const getGamesForGenre = (genreID) => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", API_KEY);
    myHeaders.append("Content-Type", "text/plain");

    const raw = `fields id, cover.url, name, genres; where genres = ${genreID}; limit 25; sort popularity desc;`;

    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(CORS_URL + "https://api-v3.igdb.com/games/", requestOptions)
        .then(resp => resp.json())
        .then(json => renderPage(json))
        .catch(error => console.log('error', error));
}

const renderPage = (games) => {
    console.log(games)
    let game = 0
    let n = 4
    for (let i = 0; i < n;)
    // <div class="row">
    //     <div class="col-3 text-center">
    //         <a href="/game.html">
    //             <img class="grid-image" src="https://images.igdb.com/igdb/image/upload/t_cover_big/co203s.jpg" style="width: 10rem;">
    //             <p class ="grid-title">Rune Factory 4 Special</p>
    //         </a>
    //     </div>
    //     <div class="col-3">
    //         <a href="/game.html">
    //             <img class="grid-image" src="https://images.igdb.com/igdb/image/upload/t_cover_big/co203s.jpg" style="width: 10rem;">
    //             <p class ="grid-title">Rune Factory 4 Special</p>
    //         </a>
    //     </div>
    //     <div class="col-3">
    //         <a href="/game.html">
    //             <img class="grid-image" src="https://images.igdb.com/igdb/image/upload/t_cover_big/co203s.jpg" style="width: 10rem;">
    //             <p class ="grid-title">Rune Factory 4 Special</p>
    //         </a>
    //     </div>
    //     <div class="col-3">
    //         <a href="/game.html">
    //             <img class="grid-image" src="https://images.igdb.com/igdb/image/upload/t_cover_big/co203s.jpg" style="width: 10rem;">
    //             <p class ="grid-title">Rune Factory 4 Special</p>
    //         </a>
    //     </div>
    // </div>
}

const imgURL = (url, size = 'cover_big') => {
    return 'http:' + url.replace('thumb', size)
}

const returnGameDiv = (game) => {
    const gameDiv = document.createElement('div')
    gameDiv.className = "col-3 text-center"
    let a = doucment.createElement('a')
    a.setAttribute('href', '/game.html')
    a.innerHTML = `
        <img class="grid-image" src="${game.cover.url}" style="width: 10rem;">
        <p class ="grid-title">${game.name}</p>
    `
    gameDiv.appendChild(a)
    return gameDiv
}

document.addEventListener('DOMContentLoaded', () => {
    getGenreList()
    getGamesForGenre(genreID)
    
    document.addEventListener('click', function(e) {
        if (genreList.map(obj => obj.name).includes(e.target.innerText)) {
            e.preventDefault()
            document.cookie = `genre=${e.target.dataset.id}`
            window.location.replace("/genre.html")
        }
    })
    
})