var URL = 'http://localhost:5000/movimentos/'

fetch(URL)
.then( resposta => resposta.json() )
.then( dados => populateReportTable(dados))
.catch( err => console.error("Deu ruim: ", err))

// Função para exibir os dados de transações no relatório
function populateReportTable(transactions) {
    console.log(transactions);

    const reportTableBody = document.getElementById("report-table-body");
    let totalEntradas = 0;
    let totalSaidas = 0;

    transactions.forEach(transaction => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.data}</td>
            <td>${transaction.descricao}</td>
            <td>R$ ${transaction.valor}</td>
            <td>${transaction.quantidade}</td>
            `;
        reportTableBody.appendChild(row);

        // Atualiza os totais de entradas e saídas
        subTotal = (transaction.valor * transaction.quantidade)
        transaction.tipo === "entrada" ? totalEntradas += subTotal : totalSaidas += subTotal;
    });

    // Exibe os totais
    document.getElementById("total-entradas").textContent = totalEntradas.toFixed(2).replace('.', ',');
    document.getElementById("total-saidas").textContent = totalSaidas.toFixed(2).replace('.', ',');
    document.getElementById("total").textContent = (totalEntradas - totalSaidas).toFixed(2).replace('.', ',');
}

// Função para salvar o produto
document.getElementById("formAdd").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = new FormData(event.target)

    const jsonData = {
        descricao: form.get('descricao'),
        tipo: form.get('tipo'),
        valor: parseFloat(form.get('valor')),
        quantidade: parseInt(form.get('quantidade')),
        data: form.get('data')
    };

    console.log(jsonData);

    fetch(URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(jsonData),
    }).then(response => {
        console.log('Resposta do servidor:', response);
        if(response.ok)
            document.location.reload(true);
    }).catch(error => {
        console.error('Erro ao enviar dados:', error);
    });
});

// Evento de clique no botão de filtrar
document.getElementById('filtrar').addEventListener('click', () => {
    const dataInicial = document.getElementById('data-inicial').value ? new Date(document.getElementById('data-inicial').value) : null;
    const dataFinal = document.getElementById('data-final').value ? new Date(document.getElementById('data-final').value) : null;
    filtrarDados(dataInicial, dataFinal);
});

function filtrarDados(dataInicial, dataFinal) {
    fetch(URL) 
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('report-table-body');
            tbody.innerHTML = '';  // Limpa a tabela

            // Filtra os dados entre as datas selecionadas
            const movimentosFiltrados = data.filter(movimento => {
                const dataMovimento = new Date(parseDateBR(movimento.data));
                return (!dataInicial || dataMovimento >= dataInicial) &&
                       (!dataFinal || dataMovimento <= dataFinal);
            });

            populateReportTable(movimentosFiltrados)
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
}

function parseDateBR(dateStr) {
    const [dia, mes, ano] = dateStr.split('/').map(Number); // Separa e converte os componentes para números
    return new Date(ano, mes - 1, dia); // Meses começam em 0 (Janeiro = 0)
}