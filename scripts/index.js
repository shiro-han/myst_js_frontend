const API_URL = "https://api-v3.igdb.com/games"


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

const getPopularGames = () => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", API_KEY);
    myHeaders.append("Content-Type", "text/plain");

    const raw = "fields id, cover.url, name, genres.name, platforms.name; where themes != (42); limit 3; sort popularity desc;";

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
        row.className = 'row app-text'
        row.innerHTML = `
            <div class="col-3">
                <img src= ${imgURL(game.cover.url)} class="d-block w-150" alt="Game cover">
            </div>
            <div class="col-9 my-auto pl-5">
                <h2 class="app-text"><a class='app-text' data-game-id="${game.id}" href="/game.html">${game.name}</a></h2>
                <h4 class="app-text">Now Available</h4>
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
        row.className = 'row app-text'
        row.innerHTML = `
            <div class="col-3">
                <img src= ${imgURL(game.cover.url)} class="d-block w-150" alt="Game cover">
            </div>
            <div class="col-9 my-auto pl-5">
            <h2 class="app-text"><a class='app-text' data-game-id="${game.id}" href="/game.html">${game.name}</a></h2>
            <h4 class="app-text">Now Available</h4>
            </div>
        `
        row.children[1].append(pElement(game, 'genres'), pElement(game, 'platforms'))
        container.appendChild(row)
        carousel.appendChild(item)
    }
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