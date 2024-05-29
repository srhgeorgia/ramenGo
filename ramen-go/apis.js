const API_KEY = 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf';
let selectedBrothId = null;
let selectedProteinId = null;
let selectedBrothDetails = null;
let selectedProteinDetails = null;

// Função para buscar dados da API e preencher os contêineres de seleção
async function fetchData() {
  const brothUrl = 'https://api.tech.redventures.com.br/broths';
  const proteinUrl = 'https://api.tech.redventures.com.br/proteins';

  try {
    const [brothResponse, proteinsResponse] = await Promise.all([
      fetch(brothUrl, { headers: { 'x-api-key': API_KEY } }),
      fetch(proteinUrl, { headers: { 'x-api-key': API_KEY } })
    ]);

    const broths = await brothResponse.json();
    const proteins = await proteinsResponse.json();

    itemsContainer('broth-container', broths, 'broth');
    itemsContainer('protains-container', proteins, 'protein');
    
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Função para buscar os detalhes do pedido na API
async function fetchOrderDetails() {
  const orderDetailsUrl = 'https://api.tech.redventures.com.br/order';

  const data = {
    brothId: selectedBrothId,
    proteinId: selectedProteinId
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(orderDetailsUrl, options);
    const orderDetails = await response.json();
    return orderDetails;
  } catch (error) {
    console.error('Error fetching order details:', error);
  }
}

async function openOrderContainer() {
  const containerSuccess = document.getElementById('success');
  const containerChooseOptions = document.getElementById('choose-options');

  if (!selectedBrothId || !selectedProteinId) {
    alert('Please select both broth and protein to place your order');
    return;
}

  // Busca os detalhes do pedido com base nos IDs selecionados
  const orderDetails = await fetchOrderDetails();

  containerSuccess.style.display = 'block';
  containerChooseOptions.style.display = 'none';

  // Exibir os detalhes do pedido na tela de sucesso
  displayOrderDetails(orderDetails, selectedBrothDetails, selectedProteinDetails);
}

// Adiciona um ouvinte de evento para chamar a função fetchData quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});
