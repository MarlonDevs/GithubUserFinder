const search = document.querySelector(".search a");
const input = document.querySelector(".search input");
const main = document.querySelector(".container");
const card = document.querySelector(".card");

const url = "https://api.github.com/users/";

search.addEventListener("click", searchUser);

function searchUser(e){
    e.preventDefault();

    if(input.value === ""){
        viewError("Escriba un usuario de Github.");
        return;
    }

    callApiUser(input.value);
}

async function callApiUser(user) {
    const userUrl = url + user;
    const repoUrl = `${url}${user}/repos`;

    try {
        const data = await Promise.all([fetch(userUrl), fetch(repoUrl)]);
        
        if (data[0].status === 404) {
            viewError("Este usuario no existe.");
            return
        }

        const dataUser = await data[0].json();
        const dataRepo = await data[1].json();

        viewData(dataUser);
        viewRepos(dataRepo);
    } catch (error) {
        console.log(error);
    }
}

function viewData(dataUser) {
    clearHTML();

    const {avatar_url, bio, followers, following, name, public_repos} = dataUser;
    const container = document.createElement("div");
    
    container.innerHTML = `
            <div class="row-left">
                    <img src="${avatar_url}" alt"User">
                </div>
                <div class="row-right">
                    <h3>${name}</h3>
                    <p>${bio}</p>
                    <div class="stats-user">
                        <p>${followers} <span>Followers</span></p>
                        <p>${following} <span>Following</span></p>
                        <p>${public_repos} <span>Repos</span></p>
                    </div>
                    <h3>Repositorios:</h3>
                    <div class="link-repos"></div>
                </div>
            </div>`;
    card.appendChild(container);
}

function viewRepos(repos) {
    const reposContainer = document.querySelector(".link-repos")
    repos 
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .forEach(element => {
            const link = document.createElement("a");
            link.innerText = element.name;
            link.href = element.html_url;
            link.target = "_blank";
            reposContainer.appendChild(link);
        });
}

function viewError(sms){
    const newSms = "Warning: " + sms;
    const error = document.createElement("h5");
    error.innerText = newSms;
    error.style.color = "red";
    main.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}

function clearHTML(){
    card.innerHTML = "";
}