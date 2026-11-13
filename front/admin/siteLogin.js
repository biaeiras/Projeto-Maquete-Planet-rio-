const formulario = document.getElementById("form-login"); 
const mensagem = document.getElementById("mensagem"); 

formulario.addEventListener("submit", async (evento) => {

    evento.preventDefault(); 

    const email = document.getElementById("email").value; 

    const senha = document.getElementById("senha").value;

    try{
        const resposta = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json(); 

        if (resposta.ok) {
            window.location.href = "/admin/cadastro";
        } else {
            mensagem.textContent = dados.mensagem;
            mensagem.style.color = "red";
        }

    } catch (erro) {
        console.error("Erro ao realizar login:", erro);
        mensagem.textContent = "Não foi possível conectar ao servidor.";
        mensagem.style.color = "red";
    }
    

});
