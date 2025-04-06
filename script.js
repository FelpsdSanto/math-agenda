document.addEventListener("DOMContentLoaded", function () {
    const formAgendamento = document.getElementById("formAgendamento");
    const tabelaAulas = document.getElementById("tabelaAulas");
    const exportarCSV = document.getElementById("exportarCSV");
    const dataAula = document.getElementById("dataAula");
    const horaAula = document.getElementById("horaAula");

    let aulas = JSON.parse(localStorage.getItem("aulas")) || [];

    const horariosPermitidos = {
        0: ["18:00", "19:00", "20:00", "21:00"], // Segunda-feira
        2: ["18:00", "19:00", "20:00", "21:00"], // Quarta-feira
        4: ["18:00", "19:00", "20:00", "21:00"], // Sexta-feira
        5: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"] // Sábado
    };

    dataAula.addEventListener("change", atualizarHorariosDisponiveis);

    function atualizarHorariosDisponiveis() {
        const dataSelecionada = new Date(dataAula.value);
        const diaSemana = dataSelecionada.getDay();

        horaAula.innerHTML = ""; // Limpa os horários anteriores

        if (horariosPermitidos.hasOwnProperty(diaSemana)) {
            let horariosDisponiveis = [...horariosPermitidos[diaSemana]]; 

            // Remove os horários já agendados para essa data
            aulas.forEach(aula => {
                if (aula.data === dataAula.value) {
                    horariosDisponiveis = horariosDisponiveis.filter(h => h !== aula.hora);
                }
            });

            if (horariosDisponiveis.length === 0) {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "Nenhum horário disponível";
                horaAula.appendChild(option);
            } else {
                horariosDisponiveis.forEach(horario => {
                    const option = document.createElement("option");
                    option.value = horario;
                    option.textContent = horario;
                    horaAula.appendChild(option);
                });
            }
        } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Nenhum horário disponível";
            horaAula.appendChild(option);
        }
    }

    function verificarConflito(data, hora) {
        return aulas.some(aula => aula.data === data && aula.hora === hora);
    }

    formAgendamento.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.getElementById("nomeAluno").value;
        const email = document.getElementById("emailAluno").value;
        const data = dataAula.value;
        const hora = horaAula.value;

        if (!hora) {
            alert("Selecione um horário válido.");
            return;
        }

        if (verificarConflito(data, hora)) {
            alert("Já existe uma aula agendada para esse horário. Escolha outro horário.");
            return;
        }

        aulas.push({ nome, email, data, hora });
        ordenarAulas();
        renderizarAulas();
        atualizarHorariosDisponiveis();
        formAgendamento.reset();
    });

    function ordenarAulas() {
        aulas.sort((a, b) => {
            const dataHoraA = new Date(`${a.data}T${a.hora}`);
            const dataHoraB = new Date(`${b.data}T${b.hora}`);
            return dataHoraA - dataHoraB;
        });

        localStorage.setItem("aulas", JSON.stringify(aulas));
    }

    function renderizarAulas() {
        tabelaAulas.innerHTML = "";

        aulas.forEach((aula, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${aula.nome}</td>
                <td>${aula.email}</td>
                <td>${aula.data}</td>
                <td>${aula.hora}</td>
                <td><button onclick="removerAula(${index})">Remover</button></td>
            `;
            tabelaAulas.appendChild(row);
        });
    }

    window.removerAula = function (index) {
        aulas.splice(index, 1);
        ordenarAulas();
        renderizarAulas();
        atualizarHorariosDisponiveis();
    };

    exportarCSV.addEventListener("click", function () {
        let csvContent = "Aluno,Email,Data,Hora\n";
        aulas.forEach(aula => {
            csvContent += `${aula.nome},${aula.email},${aula.data},${aula.hora}\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "aulas_agendadas.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    ordenarAulas();
    renderizarAulas();
});





