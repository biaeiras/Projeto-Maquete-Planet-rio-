
const botaoabrir = document.getElementById("abrir-mapa");
const botaoCancelar = document.getElementById("cancelar-mapa");
const botaoConfirmar = document.getElementById("confirmar-localizacao");

const areaMapa = document.getElementById("area-mapa"); 
const mapa = document.getElementById("mapa"); 
const marcador = document.getElementById("marcador");

const posicao = document.getElementById("posicao");
const textoLocalizacao = document.getElementById("texto-localizacao");
const campoX = document.getElementById("coordenada-x");
const campoY = document.getElementById("coordenada-y");

const localizacaoEscolhida = document.getElementById("localizacao-escolhida");
const resumoLocalizacao = document.getElementById("resumo-localizacao");

const formulario = document.getElementById("formulario-atracao")
let coordenadaX = null;
let coordenadaY = null;

//abrir ou fechar o mapa
botaoabrir.addEventListener("click", () => {
    areaMapa.hidden = !areaMapa.hidden; 
});

mapa.addEventListener("click", (evento) => {
  const retangulo = mapa.getBoundingClientRect();

  coordenadaX =((evento.clientX - retangulo.left) / retangulo.width) * 100;

  coordenadaY = ((evento.clientY - retangulo.top) / retangulo.height) * 100;

  // Mostra o marcador no local clicado
  marcador.style.left = coordenadaX + "%";
  marcador.style.top = coordenadaY + "%";
  marcador.style.display = "block";
  

  posicao.textContent =  `Ponto escolhido: X = ${coordenadaX.toFixed(1)}%, Y = ${coordenadaY.toFixed(1)}%`;

  //o botaõ de confirmar inicia como disabled, a partir do momento q o usuário clica em um ponto o botão é liberado 
  botaoConfirmar.disabled = false; 
});

botaoConfirmar.addEventListener("click", () => {
  if (coordenadaX === null || coordenadaY === null) {
    alert("Clique em um ponto do mapa primeiro.");
    return;
  }

  // Preenche os campos que serão enviados ao backend
  campoX.value = coordenadaX.toFixed(2);
  campoY.value = coordenadaY.toFixed(2);

  // Mostra uma confirmação amigável no formulário
  textoLocalizacao.textContent = "Localização selecionada no mapa";

  resumoLocalizacao.textContent =`X: ${coordenadaX.toFixed(1)}% | Y: ${coordenadaY.toFixed(1)}%`;

  localizacaoEscolhida.hidden = false;

  areaMapa.hidden = true; 
});

botaoCancelar.addEventListener("click", () => {
  areaMapa.hidden = true; 
})

formulario.addEventListener("submit", async(evento) => {evento.preventDefault(); 

  const nome = document.getElementById("campo-nome").value; 
  const coordenadaX = document.getElementById("coordenada-x").value; 
  const coordenadaY = document.getElementById("coordenada-y").value; 

  const dados = {
    nome: nome, 
    coordenada_x: Number(coordenadaX), 
    coordenada_y: Number(coordenadaY)
  }; 

  try {
    const resposta = await fetch("http://127.0.0.1:5000/atracoes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resposta.json(); 

    if(resposta.ok){
      alert("Atração cadastrada com sucesso!"); 
      console.log(resultado);

      formulario.reset(); 
    }
    else{
      alert("Erro ao cadastrar atração.");
    }


  } 
  catch(erro){
    console.error("Erro na comunicação com a API", erro); 
    alert("Não foi possível conectar ao servidor");
  }
})

async function carregarAtracoes() {

    const listaAtracoes = document.getElementById("lista-atracoes");

    try {
        const resposta = await fetch("http://127.0.0.1:5000/atracoes");

        const atracoes = await resposta.json();

        listaAtracoes.innerHTML = "";

        atracoes.forEach((atracao) => {

            const linha = document.createElement("tr");

            linha.dataset.id = atracao.id;

            linha.innerHTML = `
                <td>${atracao.nome}</td>

                <td class="opcoes">
                    <button type="button" aria-label="Editar atração">
                        <img class="icone-editar-atracao" src="img/editar.png" alt="Editar atração">
                    </button>

                    <button type="button" class="btn-excluir" aria-label="Excluir atração">
                        <img class="icone-excluir-atracao" src="img/excluir.png" alt="Excluir atração">
                    </button>
                </td>
            `;


            const botaoExcluir = linha.querySelector(".btn-excluir");

            botaoExcluir.addEventListener("click", async () => {

                const confirmar = confirm(`Deseja excluir a atração ${atracao.nome}?`);

                if (!confirmar) {
                    return;
                }

                try {
                    const resposta = await fetch(
                        `http://127.0.0.1:5000/atracoes/${atracao.id}`,
                        {
                            method: "DELETE"
                        }
                    );

                    const resultado = await resposta.json();

                    if (resposta.ok) {
                        alert("Atração excluída com sucesso!");
                        carregarAtracoes();
                    } else {
                        alert(resultado.mensagem);
                    }

                } catch (erro) {
                    console.error("Erro ao excluir atração:", erro);
                    alert("Não foi possível excluir a atração.");
                }
            });

            listaAtracoes.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao carregar atrações:", erro);
    }
}

carregarAtracoes();