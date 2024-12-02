// Mock data para simulação de carregamento dinâmico
fetch('http://localhost:5000/produtos/')
.then( resposta => resposta.json() )
.then( (produtos) => {
    const productList = document.getElementById('product-list').getElementsByTagName('tbody')[0];
    produtos.forEach(produto => {
    const row = productList.insertRow();
    row.insertCell(0).textContent = produto.id;
    row.insertCell(1).textContent = produto.nome;
    row.insertCell(2).textContent = `R$ ${produto.faixas_preco[0].preco_faixa}`;
});
})
.catch( err => console.error("Deu ruim: ", err))

fetch('http://localhost:5000/clientes/')
.then( resposta => resposta.json() )
.then( (clientes) => {
    const clientList = document.getElementById('client-list').getElementsByTagName('tbody')[0];
    clientes.forEach(cliente => {
        const row = clientList.insertRow();
        row.insertCell(0).textContent = cliente.id;
        row.insertCell(1).textContent = cliente.nome;
        row.insertCell(2).textContent = cliente.telefone;
    });
})
.catch( err => console.error("Deu ruim: ", err))

fetch('http://localhost:5000/vendas/')
.then( resposta => resposta.json() )
.then( (topProducts) => {
    const topProductsList = document.getElementById('top-products').getElementsByTagName('tbody')[0];
    // Agrupar por ID e somar as quantidades
        const agrupado = topProducts.reduce((acc, venda) => {
            if (!acc[venda.produto.id]) {
                acc[venda.produto.id] = { id: venda.produto.id, nome: venda.produto.nome, quantidade: 0, valor: 0 };
            }
            acc[venda.produto.id].quantidade += venda.quantidade;
            acc[venda.produto.id].valor += venda.quantidade * venda.valor;
            return acc;
        }, {});
        
        console.log(agrupado)
        // Converter o objeto agrupado em um array e ordenar pela quantidade (decrescente)
        const ordenado = Object.values(agrupado).sort((a, b) => b.quantidade - a.quantidade);
        
        console.log(ordenado);
  

        ordenado.forEach(venda => {
            const row = topProductsList.insertRow();
            row.insertCell(0).textContent = venda.nome;
            row.insertCell(1).textContent = venda.quantidade;
            row.insertCell(2).textContent = venda.valor;
    });
})
.catch( err => console.error("Deu ruim: ", err))

fetch('http://localhost:5000/vendas/')
.then( resposta => resposta.json() )
.then( (data) => {
    // Mock de dados para o gráfico de vendas
    const vendasDia = [
        { data: '01/11/2024', valor: 500 },
        { data: '02/11/2024', valor: 600 },
        { data: '03/11/2024', valor: 700 },
        { data: '04/11/2024', valor: 600 },
        { data: '05/11/2024', valor: 800 },
    ];
    // Criar gráfico de vendas
    const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: vendasDia.map(venda => venda.data),
            datasets: [{
                label: 'Vendas por Dia',
                data: vendasDia.map(venda => venda.valor),
                borderColor: '#4CAF50',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
})
.catch( err => console.error("Deu ruim: ", err))


fetch('http://localhost:5000/movimentos/')
.then( resposta => resposta.json() )
.then( (data) => {
    let totalEntradas = 0;
    let totalSaidas = 0;
    data.map( movimento =>{
        // Atualiza os totais de entradas e saídas
        subTotal = (movimento.valor * movimento.quantidade)
        movimento.tipo === "entrada" ? totalEntradas += subTotal : totalSaidas += subTotal;
    })

    // Exibe os totais
    document.getElementById("total-entradas").textContent = totalEntradas.toFixed(2).replace('.', ',');
    document.getElementById("total-saidas").textContent = totalSaidas.toFixed(2).replace('.', ',');
    document.getElementById("saldo").textContent = (totalEntradas - totalSaidas).toFixed(2).replace('.', ',');
})
.catch( err => console.error("Deu ruim: ", err))

function converterData(data) {
    const [dia, mes, ano] = data.split('/'); // Divide a data em dia, mês e ano
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`; // Retorna a data no formato yyyy-mm-dd
}