function createBudget(event) {
    event.preventDefault();
    const produto = document.getElementById("produto").value;
    const quantidade = document.getElementById("quantidade-orcamento").value;
    const valor = document.getElementById("valor-orcamento").value;

    const budgetList = document.getElementById("budget-list");

    const budgetItem = document.createElement("div");
    budgetItem.classList.add("budget-item");
    budgetItem.innerHTML = `
        <p>${produto} - Quantidade: ${quantidade} - Valor Estimado: R$ ${valor}</p>
        <div>
            <button class="approve-btn" onclick="approveBudget(this)">Aprovar</button>
            <button class="delete-btn" onclick="deleteBudget(this)">Excluir</button>
        </div>
    `;

    budgetList.appendChild(budgetItem);
    document.querySelector(".budget-form").reset();
}

function approveBudget(button) {
    const budgetItem = button.parentElement.parentElement;
    budgetItem.style.backgroundColor = "#d0f0c0"; // Cor verde-claro para indicar aprovado
    button.remove(); // Remove o botão de aprovação após aprovado
}

function deleteBudget(button) {
    const budgetItem = button.parentElement.parentElement;
    budgetItem.remove(); // Remove o orçamento da lista
}

fetch('http://localhost:5000/produtos/')
.then( resposta => resposta.json() )
.then( (dados) => {
    const produtos = document.querySelector("#produto");
    dados.map( item => {produtos.innerHTML += `<option value="${item.id}">${item.nome}</option>`})
})
.catch( err => console.error("Deu ruim: ", err))