const containerAtracoes = document.getElementById("atracoes-container"); 
const detalhesAtracoes = document.getElementById("detalhes-atracao");

const nomeAtracao = document.getElementById("nome-atracao"); 
const resumoAtracao = document.getElementById("resumo-atracao"); 
const qtdObras = document.getElementById("quantidade-obras"); 

const obrasContainer = document.getElementById("obras-container"); 

const botaoEnviar = document.getElementById("botao-enviar"); 

const modalDetalhes = document.getElementById("modal-detalhes");
const botaoFecharDetalhes = document.getElementById("fechar-detalhes");


let atracaoSelecionada = null; 


botaoFecharDetalhes.addEventListener("click", () => {
    modalDetalhes.hidden = true;
});

//Buscando no banco as atracoes 

async function carregarAtracoes(){

    try {
        const resposta = await fetch("http://127.0.0.1:5000/atracoes");

        const atracoes = await resposta.json(); 

        containerAtracoes.innerHTML = ""; 

        atracoes.forEach((atracao) => {

            //Card 

            const card = document.createElement("div"); 
            card.classList.add("card-atracao"); 

    
            // Imagem da atração
            const imagem = document.createElement("img");

            imagem.src = atracao.link_imagem || "/publico/img/semImagem.jpg";

            imagem.alt = atracao.link_imagem? atracao.nome  : "Imagem não cadastrada";

            card.appendChild(imagem);

             //Conteudo do card 

            const conteudo = document.createElement("div");
            conteudo.classList.add("card-conteudo");  



            const titulo = document.createElement("h3"); 
            titulo.textContent = atracao.nome; 

            const resumo = document.createElement("p"); 
            resumo.textContent = atracao.resumo || "Conheça essa atração do nosso museu!"; 

            const obras = document.createElement("p");
            obras.textContent = "Quantidade de obras: "+ (atracao.qtd_obras ?? 0); 


            //botões 

            const acoes = document.createElement("div"); 
            acoes.classList.add("card-acoes"); 

            const botaoDetalhes = document.createElement("button"); 
            botaoDetalhes.textContent = "Mais detahes"; 
            botaoDetalhes.classList.add("botao-detalhes"); 

            botaoDetalhes.addEventListener("click", () => {
                //Abrir modal com os detalhes da obra
                mostrarDetalhesAtracao(atracao); 
            });

            const botaoEscolher = document.createElement("button");
            botaoEscolher.textContent = "Escolher atração"; 
            botaoEscolher.classList.add("botao-escolher"); 

            // colocando os dados no card
            
            conteudo.appendChild(titulo); 
            conteudo.appendChild(resumo); 
            conteudo.appendChild(obras); 
            conteudo.appendChild(acoes); 

            card.appendChild(conteudo); 

            acoes.appendChild(botaoDetalhes); 
            acoes.appendChild(botaoEscolher); 

            card.appendChild(conteudo); 

            containerAtracoes.appendChild(card); 
          
        });

    } catch(erro){
        console.error("Erro ao carregar atrações", erro); 

        containerAtracoes.textContent = "Não foi possível carregar atrações"; 

    }

}

function mostrarDetalhesAtracao(atracao) {

    const modal = document.getElementById("modal-detalhes");

    const imagem = document.getElementById("imagem-detalhes");
    const titulo = document.getElementById("titulo-detalhes");
    const resumo = document.getElementById("resumo-detalhes");

    imagem.src = atracao.link_imagem || "/publico/img/imagem-indisponivel.jpg";
    imagem.alt = atracao.nome;

    titulo.textContent = atracao.nome;

    resumo.textContent = atracao.resumo || "Conheça essa atração do nosso museu!";

    modal.hidden = false;
}


carregarAtracoes(); 