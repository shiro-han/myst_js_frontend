const formLogin = document.querySelector('#login')
const formRegister = document.querySelector('#register')
let userList = []

function getUsers() {
    fetch(RAILS_URL + 'users')
        .then(resp => resp.json())
        .then(json => userList = json)
        .catch(error => console.log('error', error))
}

const registerUser = (userObj) => {
    let myHeaders = new Headers();
    myHeaders.append('content-type', 'application/json');
    myHeaders.append('accept', 'application/json');

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

getUsers()

formLogin.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Clicked")
    let username = document.getElementById('username-input').value;
    let userFound = false
    for (let user in userList) {
        if (userList[user]["username"] === username) {
            userFound = true
            document.cookie = `userid=${userList[user]['id']}`
            window.location.replace('/collection.html')
        }
    }
    if (userFound === false) {
        let errorMessage = document.getElementById('loginHelp')
        errorMessage.innerText = "That username doesn't exist. Please try again."
        errorMessage.classList.add('error');
    }
})

formRegister.addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.children;
})