const apiKey = "ff729c7e7bd5336012159cdf6ae532a2";

const cidadesFixas = [
    { nome: "São Paulo", id: "sp" },
    { nome: "Rio Claro", id: "rc" },
    { nome: "Rio de Janeiro", id: "rj" },
    { nome: "Brasília", id: "brasilia" },
    { nome: "New York", id: "ny" },
    { nome: "Tokyo", id: "tokyo" },
    { nome: "Pequim", id: "pequim" },    
    { nome: "Londres", id: "london" },
];

const cidadesAleatorias = ["Quaraí", "Kyoto", "Seoul", "Buenos Aires", "Berlim", "Caracas", "Toronto", "Dubai", "Moscow", "Paris", "Roma", "Madrid", "San Juan", "Bogotá", "Havana", "Lima", "Santiago", "Sydney", "Fortaleza", "Salvador", "Belo Horizonte", "Curitiba", "Luanda", "Cairo", "Quito", "Dallol", "Ghadamés", "Natal", "Manaus", "Belém", "Macapá", "São Luís", "Teresina", "João Pessoa", "Maceió", "Aracaju", "Vitória", "Florianópolis", "Porto Alegre", "Campo Grande", "Cuiabá", "Goiânia", "Palmas"];

const cidadesEscolhidas = cidadesAleatorias
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

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
    const cidadeInput = document.getElementById("cidade-input");
    const cidadeNome = cidadeInput.value.trim();

    if (cidadeNome !== "") {
        const cidadeObj = { nome: cidadeNome, id: `pesquisada-${Date.now()}` };

        adicionarCidadeNoGrid(cidadeObj, true); 
        buscarClima(cidadeObj);

        cidadeInput.value = ""; 
    } else {
        alert("Por favor, digite o nome de uma cidade.");
    }
}

function obterLocalizacao() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                buscarClimaPorCoordenadas(lat, lon, "localizacao");
            },
            (error) => {
                console.error("Erro ao obter localização:", error);
            }
        );
    } else {
        console.error("Geolocalização não suportada pelo navegador.");
    }
}

function buscarClimaPorCoordenadas(lat, lon, id) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    fetch(url)
        .then(response => response.json())
        .then(dados => {
            if (dados.cod === 200) {
                exibirClima(dados, id);
            } else {
                console.error("Erro ao buscar clima por coordenadas:", dados.message);
            }
        })
        .catch(error => console.error("Erro na requisição:", error));
}

function adicionarCidadeNoGrid(cidadeObj, isPesquisa = false) {
    const grid = document.getElementById("clima-container");
    const novoCard = document.createElement("div");
    novoCard.className = "clima-card";
    novoCard.id = cidadeObj.id;
    novoCard.innerHTML = `<h2>${cidadeObj.nome}</h2><p>Carregando...</p>`;

    if (isPesquisa) {
        grid.insertBefore(novoCard, grid.children[1]); 
    } else {
        grid.appendChild(novoCard);
    }
}

function exibirClima(dados, id) {
    const card = document.getElementById(id);
    if (card) {
        const temperatura = dados.main.temp;
        const iconeCodigo = dados.weather[0].icon;
        const iconeURL = `https://openweathermap.org/img/wn/${iconeCodigo}@2x.png`;

        let classeTemperatura = "";
        if (temperatura < 10 && temperatura >= 0) {
            classeTemperatura = "frio";
        } else if (temperatura < 0) {
            classeTemperatura = "abaixo-zero";
        } else if (temperatura >= 10 && temperatura < 25) {
            classeTemperatura = "medio";
        } else if (temperatura >= 25 && temperatura < 40) {
            classeTemperatura = "quente";
        } else if (temperatura >= 40) {
            classeTemperatura = "muito-quente";
        }

        card.className = `clima-card ${classeTemperatura}`;

        card.innerHTML = `
            <h2>${dados.name}</h2>
            <p>
                <img src="${iconeURL}" alt="${dados.weather[0].description}" style="width: 30px; height: auto; vertical-align: middle;">
                ${dados.weather[0].description}
            </p>
            <p>${temperatura}°C</p>
        `;
    }
}

window.onload = () => {
    const climaContainer = document.getElementById("clima-container");
    climaContainer.innerHTML = "";

    const localizacaoCard = document.createElement("div");
    localizacaoCard.className = "clima-card";
    localizacaoCard.id = "localizacao";
    localizacaoCard.innerHTML = `<h2>Localização Atual</h2><p>Carregando...</p>`;
    climaContainer.appendChild(localizacaoCard);

    obterLocalizacao();

    cidadesFixas.forEach((cidade) => {
        adicionarCidadeNoGrid(cidade);
        buscarClima(cidade);
    });

    cidadesExtras.forEach((cidade) => {
        adicionarCidadeNoGrid(cidade);
        buscarClima(cidade);
    });
};
