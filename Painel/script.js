// Numeros crescentes

function animarContador(elemento, duracao = 2000) {
    let valorFinal = parseInt(elemento.getAttribute("data-valor"));
    let tipo = elemento.getAttribute("data-format"); // "mil", "milhões", etc.
    let inicio = 0;
    let comeco = null;

    function animar(timestamp) {
        if (!comeco) comeco = timestamp;
        let progresso = (timestamp - comeco) / duracao;

        // limita entre 0 e 1
        if (progresso > 1) progresso = 1;

        // valor atual interpolado suavemente
        let valorAtual = Math.floor(progresso * valorFinal);

        let exibido = "";
        if (tipo === "mil") {
            exibido = "+ " + Math.floor(valorAtual / 1000) + " mil";
        } else if (tipo === "milhões") {
            exibido = "+ " + Math.floor(valorAtual / 1000000) + " milhões";
        } else {
            exibido = "+ " + valorAtual;
        }

        elemento.textContent = exibido;

        if (progresso < 1) {
            requestAnimationFrame(animar);
        }
    }

    requestAnimationFrame(animar);
}

// dispara quando a section entra na tela
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const contadores = entry.target.querySelectorAll(".contador");
            contadores.forEach(contador => animarContador(contador, 2500)); // 2,5s mais suave
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

observer.observe(document.querySelector("#estatisticas"));

// questionario
const perguntas = document.querySelectorAll(".pergunta");
let indice = 0;
let pontos = 0;
let respostasUsuario = []; // armazena as respostas dadas

// inicia mostrando só a primeira pergunta
perguntas.forEach(p => p.classList.remove("ativa"));
perguntas[0].classList.add("ativa");

function configurarPergunta(pergunta) {
    const radios = pergunta.querySelectorAll("input[type=radio]");
    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            // salva a resposta escolhida
            respostasUsuario.push(radio.value);

            if (radio.value === pergunta.dataset.resposta) {
                pontos++;
            }

            pergunta.classList.remove("ativa");
            indice++;
            if (indice < perguntas.length) {
                perguntas[indice].classList.add("ativa");
                configurarPergunta(perguntas[indice]);
            } else {
                // feedback final
                let msg = "";
                if (pontos <= 3) {
                    msg = `Você acertou ${pontos} de ${perguntas.length}. Precisa praticar mais, vem melhorar seu conhecimento com nosso curso!`;
                } else {
                    msg = `Você acertou ${pontos} de ${perguntas.length}. Mandou muito bem, mas a prova tem 30 questões. Vem treinar o restante conosco! 🚀`;
                }
                document.querySelector("#teste h5").textContent = msg;
                document.getElementById("acoesFinais").style.display = "block";
            }
        }, { once: true });
    });
}

configurarPergunta(perguntas[indice]);

function mostrarGabarito() {
    const gabaritoDiv = document.getElementById("gabarito");
    gabaritoDiv.innerHTML = "<h3>Gabarito:</h3>";

    perguntas.forEach((pergunta, i) => {
        const enunciado = pergunta.querySelector("h2").textContent;
        const respostaCorreta = pergunta.querySelector(
            `input[value="${pergunta.dataset.resposta}"]`
        ).parentElement.textContent.trim();

        const respostaUsuarioValue = respostasUsuario[i];
        const respostaUsuario = respostaUsuarioValue
            ? pergunta.querySelector(`input[value="${respostaUsuarioValue}"]`).parentElement.textContent.trim()
            : "Não respondeu";

        const acertou = respostaUsuarioValue === pergunta.dataset.resposta;

        gabaritoDiv.innerHTML += `
      <p>
        <strong>Pergunta ${i + 1}:</strong> ${enunciado}<br>
        <span style="color:${acertou ? 'green' : 'red'};">
          Sua resposta: ${respostaUsuario}
        </span><br>
        <strong style="color:green;">Resposta correta:</strong> 
        <span style="color:green;">${respostaCorreta}</span>
      </p>
    `;
    });

    // adiciona botão de refazer
    gabaritoDiv.innerHTML += `
      <button onclick="refazerQuiz()" style="
        margin-top:15px;
        padding:10px 20px;
        background:#F1C12E;
        color: #000;
        border:none;
        border-radius:5px;
        cursor:pointer;">
        Refazer Quiz
      </button>
    `;

    gabaritoDiv.style.display = "block";
}

function refazerQuiz() {
    pontos = 0;
    indice = 0;
    respostasUsuario = [];

    // limpa seleções
    document.querySelectorAll("input[type=radio]").forEach(r => r.checked = false);

    // esconde todas
    perguntas.forEach(p => p.classList.remove("ativa"));

    // mostra a primeira
    perguntas[0].classList.add("ativa");
    configurarPergunta(perguntas[0]);

    // reseta resultado e gabarito
    document.querySelector("#teste h5").textContent = "Responda 5 questões da prova teórica.";
    document.getElementById("acoesFinais").style.display = "none";
    document.getElementById("gabarito").style.display = "none";
}