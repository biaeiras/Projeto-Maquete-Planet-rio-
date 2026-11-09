const containerAtracoes = document.getElementById("atracoes-container"); 
const detalhesAtracoes = document.getElementById("detalhes-atracao");

const nomeAtracao = document.getElementById("nome-atracao"); 
const resumoAtracao = document.getElementById("resumo-atracao"); 
const qtdObras = document.getElementById("quantidade-obras"); 

const obrasContainer = document.getElementById("obras-container"); 

const botaoEnviar = document.getElementById("botao-enviar"); 

let atracaoSelecionada = null; 


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
                //mostrarDetalhesAtracao(atracao); 
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


carregarAtracoes(); 