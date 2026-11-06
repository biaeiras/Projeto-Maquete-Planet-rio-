
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
