var URL = 'http://localhost:5000/clientes/'

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
            <td>${transaction.id}</td>
            <td>${transaction.nome}</td>
            <td>${transaction.telefone}</td>
            <td> <input type="checkbox" ${transaction.whatsapp ? 'checked': ''}></td>
        `;
        reportTableBody.appendChild(row);

        // Atualiza os totais de entradas e saídas
        subTotal = (transaction.valor * transaction.quantidade)
        transaction.tipo === "entrada" ? totalEntradas += subTotal : totalSaidas += subTotal;
    });

    // Exibe os totais
    document.getElementById("total-saidas").textContent = totalSaidas.toFixed(2).replace('.', ',');
}

// Função para salvar o produto
document.getElementById("formAdd").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = new FormData(event.target)

    const jsonData = {
        nome: form.get('nome'),
        telefone: form.get('telefone'),
        whatsapp: true,
        
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

fetch('http://localhost:5000/produtos/')
.then( resposta => resposta.json() )
.then( (dados) => {
    const produtos = document.querySelector("#produto");
    dados.map( item => {produtos.innerHTML += `<option value="${item.id}">${item.nome}</option>`})
})
.catch( err => console.error("Deu ruim: ", err))

fetch('http://localhost:5000/clientes/')
.then( resposta => resposta.json() )
.then( (dados) => {
    const clientes = document.querySelector("#cliente");
    dados.map( item => {clientes.innerHTML += `<option value="${item.id}">#${item.id} - ${item.nome}</option>`})
})
.catch( err => console.error("Deu ruim: ", err))

function getData(){
    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês começa do 0, então adicione +1
    const dd = String(hoje.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}