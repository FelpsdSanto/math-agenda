document.addEventListener("DOMContentLoaded", function () {
    const tabelaAulas = document.getElementById("tabelaAulas");
    const exportarCSV = document.getElementById("exportarCSV");
    let aulas = JSON.parse(localStorage.getItem("aulas")) || [];

    function ordenarAulas() {
        aulas.sort((a, b) => {
            const dataA = new Date(a.data + ' ' + a.hora);
            const dataB = new Date(b.data + ' ' + b.hora);
            return dataA - dataB;
        });
    }

    function renderizarAulas() {
        ordenarAulas(); // Ordena as aulas antes de renderizar
        tabelaAulas.innerHTML = "";
        aulas.forEach(aula => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${aula.nome}</td>
                <td>${aula.email}</td>
                <td>${aula.data}</td>
                <td>${aula.hora}</td>
            `;
            tabelaAulas.appendChild(row);
        });
    }

    exportarCSV.addEventListener("click", function () {
        let csvContent = "Aluno,Email,Data,Hora\n";
        aulas.forEach(aula => {
            csvContent += `${aula.nome},${aula.email},${aula.data},${aula.hora}\n`;
        });
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "aulas_agendadas_professora.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    renderizarAulas();
});
