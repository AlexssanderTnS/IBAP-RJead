const perguntas = document.querySelectorAll(".pergunta");
let indice = 0;
let pontos = 0;

// inicia mostrando só a primeira pergunta
perguntas.forEach(p => p.classList.remove("ativa"));
perguntas[0].classList.add("ativa");

function configurarPergunta(pergunta) {
    const radios = pergunta.querySelectorAll("input[type=radio]");
    radios.forEach(radio => {
        radio.addEventListener("change", () => {
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
                    msg = `Você acertou ${pontos} de ${perguntas.length}. Mandou muito bem, mas a prova tem 30 questões. Vem treinar o restante conosco!  🚀`;
                }
                // mostra no lugar do <h5> Resultado
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
        ).parentElement.textContent;

        gabaritoDiv.innerHTML += `
      <p><strong>Pergunta ${i + 1}:</strong> ${enunciado}<br>
      <strong>Resposta correta:</strong> ${respostaCorreta}</p>
    `;
    });

    gabaritoDiv.style.display = "block";
}