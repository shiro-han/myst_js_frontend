const CORS_URL = 'https://cors-anywhere.herokuapp.com/'
const API_URL = "https://api-v3.igdb.com/games"
const RAILS_URL = "http://localhost:3000/games"
const API_KEY = 'cfc722389b379cdc9ee497832c009ac3'

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
    .then(json => console.log(json))
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
    myHeaders.append("user-key", API_KEY);
    myHeaders.append("Content-Type", "text/plain");

    const raw = "fields id, name; limit 100;";

    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(CORS_URL + "https://api-v3.igdb.com/genres/", requestOptions)
        .then(resp => resp.json())
        .then(json => console.log(json))
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

    const raw = "fields id, cover.url, name; limit 10; sort popularity desc;";

    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(CORS_URL + "https://api-v3.igdb.com/games", requestOptions)
        .then(resp => resp.json())
        .then(json => console.log(json))
        .catch(error => console.log('error', error));
}

const renderGame = (game) => {
    
}

const postGameToCollection = () => {

}