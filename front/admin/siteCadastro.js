
//CADASTRO
const botaoabrir = document.getElementById("abrir-mapa");
const botaoCancelar = document.getElementById("cancelar-mapa");
const botaoConfirmar = document.getElementById("confirmar-localizacao");

const areaMapa = document.getElementById("area-mapa"); 
const mapa = document.getElementById("mapa"); 
const marcador = document.getElementById("marcador");
const marcadoresExistentes = document.getElementById("marcadores-existentes");

const posicao = document.getElementById("posicao");
const textoLocalizacao = document.getElementById("texto-localizacao");
const campoX = document.getElementById("coordenada-x");
const campoY = document.getElementById("coordenada-y");

const localizacaoEscolhida = document.getElementById("localizacao-escolhida");
const resumoLocalizacao = document.getElementById("resumo-localizacao");

const formulario = document.getElementById("formulario-atracao")
const modalEdicao = document.getElementById("modal-edicao"); 
const botaoFecharModal = document.getElementById("fechar-modal");
const botaoCancelarEdicao = document.getElementById("cancelar-edicao");
const formularioEdicao = document.getElementById("formulario-edicao"); 

const botaoSair = document.getElementById("botao-sair"); 

let coordenadaX = null;
let coordenadaY = null;

//EDICAO

const botaoAbrirMapaEdicao = document.getElementById("abrir-mapa-edicao");
const botaoCancelarMapaEdicao = document.getElementById("cancelar-mapa-edicao");
const botaoConfirmarMapaEdicao = document.getElementById("confirmar-localizacao-edicao");

const areaMapaEdicao = document.getElementById("area-mapa-edicao");
const mapaEdicao = document.getElementById("mapa-edicao");
const marcadorEdicao = document.getElementById("marcador-edicao");

const posicaoEdicao = document.getElementById("posicao-edicao");
const textoLocalizacaoEdicao = document.getElementById("texto-localizacao-edicao");

const campoXEdicao = document.getElementById("coordenada-x-edicao");
const campoYEdicao = document.getElementById("coordenada-y-edicao");

const marcadoresExistentesEdicao = document.getElementById("marcadores-existentes-edicao");
// Coordenadas próprias do mapa de edição
let coordenadaXEdicao = null;
let coordenadaYEdicao = null;

let idAtracaoEditando= null; 

//MODAL CONFIGURAÇÃO DO MAPA

const modalConfigurarMapa = document.getElementById("modal-configurar-mapa"); 
const botaoConfigurarMapa = document.getElementById("botao-configurar-mapa"); 
const botaoFecharMapa= document.getElementById("fechar-modal-mapa"); 
const botaoCancelarMapa = document.getElementById("cancelar-mapa-config");
const arquivoMapa = document.getElementById("arquivo-mapa"); 
const preVisualizacaoMapa = document.getElementById("previsualizacao-mapa"); 
const botaoSalvarMapa = document.getElementById("salvar-mapa"); 


//abrir ou fechar o mapa
botaoabrir.addEventListener("click", () => {
    areaMapa.hidden = !areaMapa.hidden; 

    if(!areaMapa.hidden){
      mostrarMarcadoresExistentes(); 
    }
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

  //pega a localização das atrações já cadastradas no banco 
  const respostaAtracoes = await fetch("http://127.0.0.1:5000/atracoes");
  const atracoesExistentes=  await respostaAtracoes.json(); 

  console.log("Coordenadas escolhidas:", coordenadaX, coordenadaY);
  console.log("Atrações existentes:", atracoesExistentes);

  if(verificarLocalizacaoOcupada(Number(coordenadaX), Number(coordenadaY), atracoesExistentes)) {
    alert("Esse local está muito próximo de outra atração. Escolha outro ponto.")
    return; 
  }

  console.log(
    "Local ocupado?",
    verificarLocalizacaoOcupada(
        Number(coordenadaX),
        Number(coordenadaY),
        atracoesExistentes
    )
  );

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
      mostrarMarcadoresExistentes();
      
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

formularioEdicao.addEventListener("submit", async(evento) => {evento.preventDefault(); 

  const nome = document.getElementById("nome-edicao").value; 
  const coordenadaX = document.getElementById("coordenada-x-edicao").value; 
  const coordenadaY = document.getElementById("coordenada-y-edicao").value; 

  const dados = {
    nome: nome, 
    coordenada_x: Number(coordenadaX), 
    coordenada_y: Number(coordenadaY)
  }; 

  try {
    const resposta = await fetch(`http://127.0.0.1:5000/atracoes/${idAtracaoEditando}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resposta.json(); 

    if(resposta.ok){
      alert("Atração atualizada com sucesso!"); 
      console.log(resultado);

      fecharModalEdicao(); 
      carregarAtracoes(); 
      mostrarMarcadoresExistentes();
    }
    else{
      alert(resultado.mensagem);
    }


  } 
  catch(erro){
    console.error("Erro na comunicação com a API", erro); 
    alert("Não foi possível conectar ao servidor");
  }
})

arquivoMapa.addEventListener("change", ()=>{
  const arquivo = arquivoMapa.files[0];
  if (arquivo) {
        const urlImagem = URL.createObjectURL(arquivo);

        preVisualizacaoMapa.src = urlImagem;
        botaoSalvarMapa.disabled = false;
    } else {
        botaoSalvarMapa.disabled = true;
    }

  console.log("Arquivo selecionado:", arquivo);
  console.log("URL da imagem:", urlImagem);

});


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
                    <button type="button" class="btn-editar" aria-label="Editar atração">
                        <img class="icone-editar-atracao" src="img/editar.png" alt="Editar atração">
                    </button>

                    <button type="button" class="btn-excluir" aria-label="Excluir atração">
                        <img class="icone-excluir-atracao" src="img/excluir.png" alt="Excluir atração">
                    </button>
                </td>
            `;

            const botaoEditar = linha.querySelector(".btn-editar");

            botaoEditar.addEventListener("click", () => {

                const modal = document.getElementById("modal-edicao");

                idAtracaoEditando = atracao.id; 

                document.getElementById("nome-edicao").value = atracao.nome;

                document.getElementById("coordenada-x-edicao").value = atracao.coordenada_x;
                document.getElementById("coordenada-y-edicao").value = atracao.coordenada_y;

                document.getElementById("texto-localizacao-edicao").textContent = `X: ${atracao.coordenada_x}% | Y: ${atracao.coordenada_y}%`;

                modal.hidden = false;
            });

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
                        mostrarMarcadoresExistentes(); 
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


function fecharModalEdicao(){
  modalEdicao.hidden = true;
}


carregarAtracoes();
botaoFecharModal.addEventListener("click", fecharModalEdicao); 
botaoCancelarEdicao.addEventListener("click", fecharModalEdicao);

//abrir ou fechar o mapa de edicao
botaoAbrirMapaEdicao.addEventListener("click", () => {
  areaMapaEdicao.hidden = !areaMapaEdicao.hidden; 

  if (!areaMapaEdicao.hidden) {
      mostrarMarcadoresExistentesEdicao();
  }

});

mapaEdicao.addEventListener("click", (evento) => {

    const retangulo = mapaEdicao.getBoundingClientRect();

    coordenadaXEdicao = ((evento.clientX - retangulo.left) / retangulo.width) * 100;

    coordenadaYEdicao = ((evento.clientY - retangulo.top) / retangulo.height) * 100;

    // Mostra o marcador no local clicado
    marcadorEdicao.style.left = coordenadaXEdicao + "%";
    marcadorEdicao.style.top = coordenadaYEdicao + "%";
    marcadorEdicao.style.display = "block";

    posicaoEdicao.textContent = `Ponto escolhido: X = ${coordenadaXEdicao.toFixed(1)}%, Y = ${coordenadaYEdicao.toFixed(1)}%`;

    botaoConfirmarMapaEdicao.disabled = false;
});

botaoCancelarMapaEdicao.addEventListener("click", () => {
  areaMapaEdicao.hidden = true; 
})

botaoConfirmarMapaEdicao.addEventListener("click", () => {
  if (coordenadaXEdicao  === null || coordenadaYEdicao  === null) {
    alert("Clique em um ponto do mapa primeiro.");
    return;
  }

  // Preenche os campos que serão enviados ao backend
  campoXEdicao.value = coordenadaXEdicao.toFixed(2);
  campoYEdicao.value = coordenadaYEdicao.toFixed(2);

 
  textoLocalizacaoEdicao.textContent =`Nova localização: X: ${coordenadaXEdicao.toFixed(1)}% | Y: ${coordenadaYEdicao.toFixed(1)}%`;

  areaMapaEdicao.hidden = true;
});

botaoSair.addEventListener("click", () => {
  window.location.href= "/logout"; 
})

botaoConfigurarMapa.addEventListener("click", () => {
    modalConfigurarMapa.hidden = false;
});

botaoFecharMapa.addEventListener("click", () => {
    modalConfigurarMapa.hidden = true;
});

botaoCancelarMapa.addEventListener("click", () => {
    modalConfigurarMapa.hidden = true;
});


//Não permitir que outra atração seja cadastrada no mesmo lugar

function verificarLocalizacaoOcupada(x, y, atracoes, idIgnorado = null){
  const distanciaMinimia = 3; 

  for(const atracao of atracoes){

    //Ignorar a atração atual quando estiver no modo editar 

    if(atracao.id === idIgnorado){
      continue; 
    }

    const diferencaX = x - atracao.coordenada_x; 
    const diferencaY = y - atracao.coordenada_y; 

    //distancia 

    const distancia = Math.sqrt(diferencaX ** 2 + diferencaY **2); 

    if(distancia < distanciaMinimia){
      return true; 
    }
  }
  return false; 
}

async function mostrarMarcadoresExistentes(){
  try{
    const resposta = await fetch("http://127.0.0.1:5000/atracoes"); 
    const atracoes = await resposta.json(); 

    marcadoresExistentes.innerHTML = ""; 

    atracoes.forEach((atracao) => {
      const marcadorVerde = document.createElement("div"); 

      marcadorVerde.classList.add("marcador-existente"); 

      marcadorVerde.style.left = atracao.coordenada_x + "%";
      marcadorVerde.style.top = atracao.coordenada_y + "%";

      marcadoresExistentes.appendChild(marcadorVerde);

    });
  }catch (erro) {
        console.error("Erro ao mostrar marcadores:", erro);
    }
}

async function mostrarMarcadoresExistentesEdicao() {
    try {
        const resposta = await fetch("http://127.0.0.1:5000/atracoes");
        const atracoes = await resposta.json();

        marcadoresExistentesEdicao.innerHTML = "";

        atracoes.forEach((atracao) => {
            const marcadorVerde = document.createElement("div");

            marcadorVerde.classList.add("marcador-existente");

            marcadorVerde.style.left = atracao.coordenada_x + "%";
            marcadorVerde.style.top = atracao.coordenada_y + "%";

            marcadoresExistentesEdicao.appendChild(marcadorVerde);
        });

    } catch (erro) {
        console.error("Erro ao mostrar marcadores no mapa de edição:", erro);
    }
}

botaoSalvarMapa.addEventListener("click", async () => {
    const arquivo = arquivoMapa.files[0];

    if (!arquivo) {
        alert("Selecione uma imagem primeiro.");
        return;
    }

    const dados = new FormData();
    dados.append("imagem", arquivo);

    try {
        const resposta = await fetch("/mapa", {
            method: "POST",
            body: dados
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Mapa atualizado com sucesso!");

            modalConfigurarMapa.hidden = true;

            // Atualiza as imagens dos dois mapas
            document.querySelectorAll("#mapa img, #mapa-edicao img").forEach(imagem => {
                imagem.src = "/mapa-atual?t=" + Date.now();
            });

            arquivoMapa.value = "";
            botaoSalvarMapa.disabled = true;

        } else {
            alert(resultado.mensagem);
        }

    } catch (erro) {
        console.error("Erro ao salvar mapa:", erro);
        alert("Não foi possível salvar o mapa.");
    }
});