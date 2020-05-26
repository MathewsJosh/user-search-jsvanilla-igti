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
let filteredUsers = [];

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
  barraBuscar.focus();

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
      name: name.first + " " + name.last,
      gender,
      picture: picture.thumbnail,
      age: user.dob.age,
    };
  });
  render();
}

function render() {
  barraBuscar.addEventListener("input", handleEnterClick);
}

function handleEnterClick() {
  if (barraBuscar.value === "") {
	botaoBuscar.disabled = true;
	barraBuscar.focus();
  } else {
	barraBuscar.focus();
    botaoBuscar.disabled = false;
    document.body.addEventListener("keyup", function (e) {
      if (e.keyCode == 13) renderSearch();
    });
    botaoBuscar.addEventListener("click", (e) => {
      renderSearch();
    });
  }
  barraBuscar.focus();
}

function renderSearch() {
  const query = barraBuscar.value.toLowerCase();

  filteredUsers = allUsers.filter((user) => {
    if (query === "") return 0;
    else return user.name.toLowerCase().includes(query);
  });

  if (filteredUsers == 0) {
    // Se nenhum usuário for encontrado, avisa
    let usersNotFilteredHTML = `
	<div id="foundText">${filteredUsers.length} user(s) found!
	<br><br><br><br> Please Try Again!</$>
	</div>`;
    usersToFilter.innerHTML = usersNotFilteredHTML;
  } else {
    //Se encontrar usuários, Mostra e chama Stats
    let usersNotFilteredHTML = `<div class="foundResults"><h4 id="foundText">${filteredUsers.length} user(s) found:</h4>`;
    filteredUsers.forEach((user) => {
      const { name, gender, picture, age } = user;
      const usersAuxHTML = `
			<div class="filteredUsers">
				<div>
					<img class="thumbs" src="${picture}" alt="${name}">
				</div>
				<div>
					<div class="users-text">${name}, ${age}</div>
				</div>
			</div>
		`;
      usersNotFilteredHTML += usersAuxHTML;
    });
    usersNotFilteredHTML += "</div>";
    usersToFilter.innerHTML = usersNotFilteredHTML;
    renderStats();
  }
}

function renderStats() {
  countTotals();
  //averageAges.toFixed(2);

  let usersFilteredHTML = "<div>";
  const usersAuxHTML = `
		<div>
		<h4 id="foundText">Stats</h4>
			<div class="statsTable">
				<div>
				Total Male:
				</div>
				<div class="alignResults">
				${totalMale}
				</div>
		  	</div>
			<div class="statsTable">
				<div>
				Total Female: 
				</div>
				<div class="alignResults">
				${totalFemale}
				</div>
			</div>
			<div class="statsTable">
				<div>
				Total Sum of Ages: 
				</div>
				<div class="alignResults">
				${totalAges}
				</div>
			</div>
			<div class="statsTable">
				<div>
				Average Ages: 
				</div>
				<div class="alignResults">
				${averageAges.toFixed(2)}
				</div>
		  	</div>
		</div>
		  `;
  usersFilteredHTML += usersAuxHTML;
  usersFilteredHTML += "</div>";
  usersFiltered.innerHTML = usersFilteredHTML;
  resetCounters();
}

function countTotals() {
  filteredUsers.forEach((user) => {
    totalAges += user.age;
    if (user.gender === "female") totalFemale++;
    if (user.gender === "male") totalMale++;
  });
  averageAges = totalAges / filteredUsers.length;
}

function resetCounters(){
	totalAges=0;
	totalMale=0;
	totalFemale=0;
	averageAges=0;
}

function renderClearList() {
  usersToFilter.innerHTML = "No filtered users";
  usersFiltered.innerHTML = "Nothing to display";
}
