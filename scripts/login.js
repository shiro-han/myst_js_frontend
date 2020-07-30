const RAILS_URL = "http://localhost:3000/users"

let userList = []

function getUsers() {
    fetch(RAILS_URL)
        .then(resp => resp.json())
        .then(json => userList = json)
        .catch(error => console.log('error', error))
}

getUsers()

document.addEventListener("submit", function(e) {
    e.preventDefault();
    let username = document.getElementById('username-input').value;
    for (let user in userList) {
        if (userList[user]["username"] === username) {
            document.cookie = `userid=${userList[user]['id']}`
            window.location.replace('/collection.html')
        }
    }
    let errorMessage = document.getElementById('usernameHelp')
    errorMessage.innerText = "That username doesn't exist. Please try again."
    errorMessage.classList.add('error');
})