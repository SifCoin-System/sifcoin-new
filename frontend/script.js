// Modal
var modal = document.getElementById("myModal");
var btn = document.getElementById("openModalBtn");
var span = document.getElementsByClassName("close")[0];

// Quando o botão for clicado, abre o modal
btn.onclick = function() {
    modal.style.display = "block";
}

// Quando o "x" (fechar) for clicado, fecha o modal
span.onclick = function() {
    modal.style.display = "none";
}

// Quando clicar fora do modal, fecha o modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Função para gerar PDF
function downloadPDF() {
    const reportContent = document.getElementById("report-content");
    console.log(reportContent)
    const options = {
        margin:       0.5,
        filename:     'Relatorio.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(reportContent).save();
}