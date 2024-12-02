function updateDashboard(periodo) {
    let salesCount = document.getElementById("sales-count");
    let salesValue = document.getElementById("sales-value");
    let salesTitle = document.querySelector(".sales-info h3");

    switch (periodo) {
        case 'dia':
            salesTitle.innerText = "Vendas do Dia";
            salesCount.innerText = "50";
            salesValue.innerText = "1.200,00";
            break;
        case 'semana':
            salesTitle.innerText = "Vendas da Semana";
            salesCount.innerText = "300";
            salesValue.innerText = "7.000,00";
            break;
        case 'mes':
            salesTitle.innerText = "Vendas do Mês";
            salesCount.innerText = "1200";
            salesValue.innerText = "25.000,00";
            break;
    }
}