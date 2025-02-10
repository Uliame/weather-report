const apiKey = "API_KEY";

const cidadesFixas = [
    {nome: "São Paulo", id: "sp"},
    {nome: "Rio Claro", id: "rc"},
    {nome: "Rio de Janeiro", id: "rj"},
    {nome: "Brasília", id: "brasilia"},
    {nome: "New York", id: "ny"},
    {nome: "Tokyo", id: "tokyo"},
    {nome: "Pequim", id: "pequim"},	
    {nome: "Londres", id: "london"},
];

const cidadesAleatorias = ["Buenos Aires", "Berlim", "Caracas", "Toronto", "Dubai", "Moscow", "Paris", "Roma", "Madrid", "San Juan", "Bogotá", "Havana", "Lima", "Santiago", "Sydney", "Fortaleza", "Salvador", "Belo Horizonte", "Curitiba", "Luanda", "Cairo", "Quito"];

const cidadesEscolhidas = cidadesAleatorias
    .sort(() => Math.random() - 0.5) 
    .slice(0, 2) 

const cidadesExtras = cidadesEscolhidas.map((cidade, index) => ({
        nome: cidade,
        id: `aleatoria-${index}`
}));
    
const todasCidades = [...cidadesFixas, ...cidadesExtras];

document.getElementById("cidade-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        buscarClimaB();
    }
});

function buscarClima(cidadeObj) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidadeObj.nome}&appid=${apiKey}&units=metric&lang=pt_br`;

    fetch(url)
        .then(response => response.json())
        .then(dados => {
            if (dados.cod === 200) {
                exibirClima(dados, cidadeObj.id);
            } else {
                console.error(`Erro ao buscar clima de ${cidadeObj.nome}:`, dados.message);
            }
        })
        .catch(error => console.error("Erro na requisição:", error));
}

function buscarClimaB() {
    const cidadeInput = document.getElementById("cidade-input").value.trim();
    
    if (cidadeInput !== "") {
        const cidadeObj = { nome: cidadeInput, id: "pesquisada" };


        const container = document.getElementById("clima-container");
        let primeiraCidade = document.getElementById("pesquisada");

        if (!primeiraCidade) {
            primeiraCidade = document.createElement("div");
            primeiraCidade.id = "pesquisada";
            primeiraCidade.classList.add("clima-card");
            container.prepend(primeiraCidade);
        }

        buscarClima(cidadeObj);
    } else {
        alert("Por favor, digite o nome de uma cidade.");
    }
}

function adicionarCidadeNoGrid(cidadeObj) {
    const grid = document.getElementById("clima-container");
    
    const novoCard = document.createElement("div");
    novoCard.className = "clima-card";
    novoCard.id = cidadeObj.id;
    novoCard.innerHTML = `<h2>${cidadeObj.nome}</h2><p>Carregando...</p>`;

    grid.appendChild(novoCard); 
}

function exibirClima(dados, id) {
    const card = document.getElementById(id);
    if (card) {
        const temperatura = dados.main.temp;

        let classeTemperatura = "";
        if (temperatura < 10 && temperatura >= 0) {
            classeTemperatura = "frio"; 
        } else if (temperatura < 0) {
            classeTemperatura = "abaixo-zero";
        }
        else if (temperatura >= 10 && temperatura < 25) {
            classeTemperatura = "medio";
        } else {
            classeTemperatura = "quente";
        }

       
        card.className = `clima-card ${classeTemperatura}`;

        card.innerHTML = `
            <h2>${dados.name}</h2>
            <p>${dados.weather[0].description}</p>
            <p>🌡 ${temperatura}°C</p>
        `;
    }
}

window.onload = () => {
    const climaContainer = document.getElementById("clima-container");
    climaContainer.innerHTML = ""; 

    cidadesFixas.forEach((cidade) => {
        adicionarCidadeNoGrid(cidade);
        buscarClima(cidade);
    });

    cidadesExtras.forEach((cidade) => {
        adicionarCidadeNoGrid(cidade);
        buscarClima(cidade);
    });
};

