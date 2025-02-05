async function buscarClima() 
{
    const apiKey = "CHAVE_DA_API"; 
    const cidade = document.getElementById("cidade").value;
    
    if (cidade === "") 
    {
        alert("Digite o nome de uma cidade!");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    try
    {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (resposta.ok) 
        {
            document.getElementById("resultado").innerHTML = `
                <h2>${dados.name}, ${dados.sys.country}</h2>
                <p>Temperatura: ${dados.main.temp}°C</p>
                <p>Clima: ${dados.weather[0].description}</p>
                <p>Umidade: ${dados.main.humidity}%</p>
                <p>Vento: ${dados.wind.speed} m/s</p>
            `;
        } else 
        {
            document.getElementById("resultado").innerHTML = `<p>Cidade não encontrada.</p>`;
        }
    } catch (error) {
        document.getElementById("resultado").innerHTML = `<p>Erro ao buscar os dados.</p>`;
        console.error(error);
    }
}



