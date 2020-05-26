"use strict"; //O JavaScript acusa mais erros

/**
 * Estado da aplicação (state)
 */

//IDs do .html
let barraBuscar = null;
let botaoBuscar = null;
let usersToFilter = null;
let usersFiltered = null;

//Objetos da api
let allUsers = [];
let allFiltered = [];

//Contadores
let totalMale = 0;
let totalFemale = 0;
let totalAges = 0;
let averageAges = 0;

window.addEventListener("load", () => {
  barraBuscar = document.querySelector("#barraBuscar");
  botaoBuscar = document.querySelector("#botaoBuscar");
  usersToFilter = document.querySelector("#usersToFilter");
  usersFiltered = document.querySelector("#usersFiltered");

  fetchUsers();
});

async function fetchUsers() {
  const link =
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo";
  const res = await fetch(link);
  const json = await res.json();

  allUsers = json.results.map((user) => {
    const { name, gender, picture, age } = user;

    return {
      name: user.name.title + ". " + user.name.first + " " + user.name.last,
      gender,
      picture: user.picture.thumbnail,
      age: user.dob.age,
    };
  });
  //console.log(allUsers);
  render();
}

function render() {}
