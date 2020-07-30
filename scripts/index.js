const API_URL = "https://api-v3.igdb.com/games"
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
            genreList = json
        })
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
        .then(json => json.forEach(game => renderGameToCommunityCarousel(game)))
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
                <h2 class="app-text"><u><a data-game-id="${game.id}" href="/game.html">${game.name}</a></u></h2>
                <h3 class="app-text">Now Available</h3>
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
            <h2 class="app-text"><u><a data-game-id="${game.id}" href="/game.html">${game.name}</a></u></h2>
                <h3 class="app-text">Now Available</h3>
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
        span.dataset.id = element.id
        p.appendChild(span);
    })
    return p;
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

document.addEventListener('DOMContentLoaded', () => {
    
    getGenreList()
    getPopularGames()
    
    document.addEventListener('click', function(e) {
        if (genreList.map(obj => obj.name).includes(e.target.innerText)) {
            e.preventDefault()
            document.cookie = `genre=${e.target.dataset.id}`
            document.cookie = `genre_name=${e.target.innerText}`
            window.location.replace("/genre.html")
        }

        if (!!e.target.dataset.gameId){
            e.preventDefault()
            document.cookie = `game=${e.target.dataset.gameId}`
            window.location.replace("/game.html")
        }
    })
    
})