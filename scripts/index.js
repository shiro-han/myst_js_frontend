const CORS_URL = 'https://damp-taiga-79758.herokuapp.com/'
const API_URL = "https://api-v3.igdb.com/games"
const RAILS_URL = "http://localhost:3000/"
const API_KEY = 'cfc722389b379cdc9ee497832c009ac3'
let genreList = []

const getGame = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", API_KEY);
    myHeaders.append("Content-Type", "text/plain");
    
    const raw = `fields id, aggregated_rating, cover.url, first_release_date, genres.name, name, platforms.name, screenshots.url, similar_games.id, similar_games.name, similar_games.cover.url, storyline, summary; where id = ${id};`;
    
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    
    fetch(CORS_URL+API_URL, requestOptions)
        .then(resp => resp.json())
        .then(json => {
            console.log(json[0]);
        })
        .catch(error => console.log('error', error));
}

const runSearch = (term) => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", API_KEY);
    myHeaders.append("Content-Type", "text/plain");

    const raw = `fields game.id, game.name, game.cover.url; search \"${term}\"; limit 50; where game.category = 0;`;

    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(CORS_URL + "https://api-v3.igdb.com/search", requestOptions)
        .then(resp => resp.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
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
            for (let obj in json) {
                genreList.push(json[obj])
            }
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
        .then(json => console.log(json))
        .catch(error => console.log('error', error));
}

const getPopularGames = () => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", API_KEY);
    myHeaders.append("Content-Type", "text/plain");

    const raw = "fields id, cover.url, name, genres.name, platforms.name; limit 3; sort popularity desc;";

    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(CORS_URL + "https://api-v3.igdb.com/games", requestOptions)
        .then(resp => resp.json())
        .then(json => {console.log(json); json.forEach(game => renderGameToCommunityCarousel(game))})
        .catch(error => console.log('error', error));
}

const renderGameToCommunityCarousel = (game) => {
    const carousel = document.querySelector('#community-carousel')
    if (!carousel.children[0]) {
        let item = document.createElement('div');
        item.className = 'carousel-item active'
        let container = document.createElement('div')
        container.className = 'container'
        item.appendChild(container)
        let row = document.createElement('div')
        row.className = 'row'
        row.innerHTML = `
            <div class="col-3">
                <img src= ${imgURL(game.cover.url)} class="d-block w-150" alt="Game cover">
            </div>
            <div class="col-9">
                <h2><u>${game.name}</u></h2>
                <h3>Now Available</h3>
            </div>
        `
        row.children[1].append(pElement(game, 'genres'), pElement(game, 'platforms'))
        container.appendChild(row)
        carousel.appendChild(item)
    }
    else {
        let item = document.createElement('div');
        item.className = 'carousel-item'
        let container = document.createElement('div')
        container.className = 'container'
        item.appendChild(container)
        let row = document.createElement('div')
        row.className = 'row'
        row.innerHTML = `
            <div class="col-3">
                <img src= ${imgURL(game.cover.url)} class="d-block w-150" alt="Game cover">
            </div>
            <div class="col-9">
                <h2><u>${game.name}</u></h2>
                <h3>Now Available</h3>
            </div>
        `
        row.children[1].append(pElement(game, 'genres'), pElement(game, 'platforms'))
        container.appendChild(row)
        carousel.appendChild(item)
    }
}

const pElement = (game, element) => {
    let p = document.createElement('p')
    p.innerText = `${element}: `
    game[element].forEach(element => {
        let span = document.createElement('span');
        span.className = 'badge badge-secondary'
        span.innerText = element.name
        p.appendChild(span);
    })
    return p;
}

// const platformsElement = (array) => {
//     return array.map(platform => `${platform.name}`).join(', ')
// }

const imgURL = (url, size = 'cover_big') => {
    return 'http:' + url.replace('thumb', size)
}

const fetchRailsUsers = () => {
    fetch (RAILS_URL + 'users')
        .then(resp => resp.json())
        .then(json => console.log(json))
}

const postGameToRails = (gameObj) => {
    let myHeaders = new Headers();
    myHeaders.append('content-type', 'application/json');
    myHeaders.append('accept', 'application/json')

    let bodyObj = {
        name: gameObj.name,
        api_id: gameObj.id
    }

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(bodyObj)
    }

    fetch(RAILS_URL + 'games', requestOptions)
        .then(resp => resp.json())
        .then(json => console.log(json))
}

const addGameToCollection = (userID, railsID) => {
    let myHeaders = new Headers();
    myHeaders.append('content-type', 'application/json');
    myHeaders.append('accept', 'application/json')

    let bodyObj = {
        user_id: userID,
        game_id: railsID
    }

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(bodyObj)
    }

    fetch(RAILS_URL + 'user_games', requestOptions)
        .then(resp => resp.json())
        .then(json => console.log(json))
}

const registerUser = (userObj) => {
    let myHeaders = new Headers();
    myHeaders.append('content-type', 'application/json');
    myHeaders.append('accept', 'application/json')

    let bodyObj = {
        username: userObj.username,
        bio: userObj.bio,
        email: userObj.email,
        profile_pic: userObj.profile_pic
    }

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(bodyObj)
    }

    fetch(RAILS_URL + 'users', requestOptions)
        .then(resp => resp.json())
        .then(json => console.log(json))
}

document.addEventListener('DOMContentLoaded', () => {
    const genreList = getGenreList()
    
    getPopularGames()
    
    document.addEventListener('click', function(e) {
        if (genreList.includes(e.target.innerText)) {
            e.preventDefault()
            document.cookie = `genre=${e.target.innerText}`
            window.location.replace("/genre.html")
        }
    })
    
})