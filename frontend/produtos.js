var URL = 'http://localhost:5000/produtos/'

fetch(URL)
.then( resposta => resposta.json() )
.then( dados => displayProduct(dados))
.catch( err => console.error("Deu ruim: ", err))

// Função para adicionar uma nova faixa de preço
function addPriceTier() {
    const priceTiersContainer = document.getElementById("price-tiers");
    const newTier = document.createElement("div");
    newTier.classList.add("price-tier");
    newTier.innerHTML = `
        <label for="quantidade-minima">Quantidade Mínima:</label>
        <input type="number" name="quantidade-minima" required min="1">
        
        <label for="quantidade-maxima">Quantidade Máxima:</label>
        <input type="number" name="quantidade-maxima" required min="1">
        
        <label for="preco">Preço (R$):</label>
        <input type="number" name="preco" required min="0" step="0.01">
    `;
    priceTiersContainer.appendChild(newTier);
}

// Função para salvar o produto
document.getElementById("product-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const nomeProduto = document.getElementById("nome-produto").value;
    const descricaoProduto = document.getElementById("descricao-produto").value;
    const priceTiers = Array.from(document.querySelectorAll("#price-tiers .price-tier")).map(tier => {
        return {
            qtd_minima: parseInt(tier.querySelector("input[name='quantidade-minima']").value),
            qtd_maxima: parseInt(tier.querySelector("input[name='quantidade-maxima']").value),
            preco_faixa: parseFloat(tier.querySelector("input[name='preco']").value)
        };
    });

    const produto = {
        nome: nomeProduto,
        descricao: descricaoProduto,
        faixas_preco: priceTiers
    };

    console.log(produto);

    // Enviando para a API 
    fetch(URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(produto),
    }).then(response => {
        console.log('Resposta do servidor:', response);
        if(response.ok)
            // Exibir o produto na lista de produtos
            displayProduct([produto]);
    }).catch(error => {
        console.error('Erro ao enviar dados:', error);
    });

    // Limpar o formulário
    document.getElementById("product-form").reset();
    document.getElementById("price-tiers").innerHTML = "";
    addPriceTier(); 
});

// Função para exibir o produto na lista de produtos cadastrados
function displayProduct(produtos) {
    const productList = document.getElementById("product-list");
    
    produtos.map( produto =>{
        const productItem = document.createElement("li");
        
        let priceDetails = "";
        produto.faixas_preco.forEach(preco => {
            priceDetails += `<p>De ${preco.qtd_minima} até ${preco.qtd_maxima} unidades: R$ ${preco.preco_faixa}</p>`;
        });
        
        productItem.innerHTML = `
        <strong>${produto.nome}</strong> - ${produto.descricao}
        ${priceDetails}
        `;
        productList.appendChild(productItem);
    })
}