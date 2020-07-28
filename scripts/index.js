const CORS_URL = 'https://cors-anywhere.herokuapp.com/'
const API_URL = "https://api-v3.igdb.com/games"
const RAILS_URL = "http://localhost:3000/"
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
    .then(json => {console.log(json[0]); renderGame(json[0]); postGameToRails(json[0])})
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
    let div = document.createElement('div')
    div.dataset.id = game.id
    div.innerHTML = `
    <h1>${game.name}</h1>
    <h2>Console: ${platformsString(game.platforms)}</h2>
    <p>${game.summary}</p>
    <img src = ${imgURL(game.cover.url)}>
    `
    document.body.appendChild(div)
}

const platformsString = (array) => {
    return array.map(platform => `${platform.name}`).join(', ')
}

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