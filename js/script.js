const apiKey = "API_KEY";


const cidadesFixas = [
    { nome: "São Paulo", id: "sp" },
    { nome: "Rio Claro", id: "rioclaro" },
    { nome: "New York", id: "ny" },
    { nome: "Tokyo", id: "tokyo" }
];


const cidadesAleatorias = ["Londres", "Berlim", "Sydney", "Toronto", "Dubai", "Moscow", "Pequim", "Paris", "Roma", "Madrid"];
const cidadeAleatoria = { nome: cidadesAleatorias[Math.floor(Math.random() * cidadesAleatorias.length)], id: "aleatoria" };



const todasCidades = [...cidadesFixas, cidadeAleatoria];

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
        const cidadeObj = { nome: cidadeInput, id: "resultado" }; // Criando um objeto válido
        buscarClima(cidadeObj);
    } else {
        alert("Por favor, digite o nome de uma cidade.");
    }
}

function exibirClima(dados, id) {
    const card = document.getElementById(id);
    if (card) {
        card.innerHTML = `
            <h2>${dados.name}</h2>
            <p>${dados.weather[0].description}</p>
            <p>${dados.main.temp}°C</p>
        `;
    }
}

window.onload = () => {
    todasCidades.forEach(buscarClima);
};
