"use strict"; //O JavaScript acusa mais erros

/**
 * Estado da aplicação (state)
 */
//IDs do .html
let barraBuscar = null;
let botaoBuscar = null;
let usersToFilter = null;
let usersFiltered = null;

//Strings de .innerHTML's
let usersNotFilteredHTML = "";

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

  fetchUsers();
  handleEnterClick();
});
/**
 * Método Async/await que faz o site esperar um carregamento/download
 * antes de executar as próximas operações
 */
async function fetchUsers() {
  const link =
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo";
  const res = await fetch(link);
  const json = await res.json();

  mapAndSort(json);
}

/**
 * Função que mapeia e ordena alfabeticamente todos os usuários
 */
function mapAndSort(json) {
  allUsers = json.results.map((user) => {
    const { name, gender, picture, age } = user;

    return {
      name: name.first + " " + name.last,
      gender,
      picture: picture.thumbnail,
      age: user.dob.age,
    };
  });
  //Organiza o array a partir do nome usando .sort()
  allUsers.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

/**
 * Função que lida com a barra textual inicialmente focando-a, depois
 * lendo seus valores a partir de um evento "keyup"
 *
 *
 * Se Enter for pressionado, chama renderSearch()
 *
 *
 * Se o botaoBuscar for clicado, chama renderSearch()
 */
function handleEnterClick() {
  function onKeyUpNome(e) {
    if (barraBuscar.value !== "") {
      botaoBuscar.disabled = false;
      if (e.keyCode === 13) {
        renderSearch();
      }
    }
  }
  barraBuscar.focus();
  barraBuscar.addEventListener("keyup", onKeyUpNome);
  botaoBuscar.addEventListener("click", function () {
    renderSearch();
  });
}
/**
 * Método que filtra o array de usuários com o função .filter
 *
 * Reseta os displays se não encontrar o usuário no array
 *
 * ou
 *
 * Mostra os usuários encontrados juntamente de suas estatísticas
 */
function renderSearch() {
  //Deixa os valores lidos da barra de busca em minúsculo
  const query = barraBuscar.value.toLowerCase();

  //Filtra o array de acordo com o que for digitado na barra de busca
  filteredUsers = allUsers.filter((user) => {
    if (query === "") return 0;
    else return user.name.toLowerCase().includes(query);
  });

  if (filteredUsers.length === 0) {
    // Se nenhum usuário for encontrado, alerta e limpa a lista
    renderClearList();
    window.alert("No user(s) found!\n\nPlease Try Again!");
  } else {
    //Se encontrar usuários, Mostra e chama renderStats
    showUsersAndStats();
    renderStats();
  }
}

/**
 * Exibe os usuários filtrados na div 
 */
function showUsersAndStats() {
  usersNotFilteredHTML = `<div class="foundResults"><h4 id="foundText">${filteredUsers.length} user(s) found:</h4>`;
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
}

/**
 * Método que controla os contadores e exibe os dados dos 
 * usuários no segundo display
 */
function renderStats() {
  countTotals();
  showStats();
  resetCounters();
}
/**
 * Metodo para exibir os dados dos usuários no segundo display
 * usando .innerHTML
 */
function showStats() {
  let usersFilteredHTML = "<div>";
  const usersAuxHTML = `
		<div class="renderStatsTable">
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
}

/**
 * Método que faz a contagem de Homens, Mulheres, Idades e calcula a média
 */
function countTotals() {
  filteredUsers.forEach((user) => {
    totalAges += user.age;
    if (user.gender === "female") totalFemale++;
    if (user.gender === "male") totalMale++;
  });
  averageAges = totalAges / filteredUsers.length;
  barraBuscar.focus();
}
/**
 * Método de reset dos contadores e focus na barraBuscar
 */
function resetCounters() {
  totalAges = 0;
  totalMale = 0;
  totalFemale = 0;
  averageAges = 0;
  barraBuscar.focus();
}
/**
 * Método que limpa os displays
 */
function renderClearList() {
  usersToFilter.innerHTML = "No filtered users";
  usersFiltered.innerHTML = "Nothing to display";
  barraBuscar.focus();
}
