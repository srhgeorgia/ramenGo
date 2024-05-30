// Função para exibir o contêiner de seleção e ocultar o contêiner de sucesso
function newOrder() {
  const containerSuccess = document.getElementById('success');
  const containerChooseOptions = document.getElementById('choose-options');
  const items = document.querySelectorAll('.item');
  const placeOrderButton = document.getElementById('place-myorder');

  items.forEach(item => {
    item.classList.remove('item-active');
    item.querySelector('.item-title').classList.remove('title-active');
    item.querySelector('.item-description').classList.remove('description-active');
    item.querySelector('.item-price').classList.remove('price-active');

    // Atualiza a imagem para a versão inativa
    const image = item.querySelector('.item-image');
    const itemType = item.classList.contains('broth-item') ? 'broth' : 'protein';
    const itemId = item.dataset.id;
    const selectedItem = itemType === 'broth' ? selectedBrothDetails : selectedProteinDetails;
    if (selectedItem && selectedItem.id === itemId) {
      image.src = selectedItem.imageInactive;
    }
  });

  placeOrderButton.classList.remove('button-active');
  containerSuccess.style.display = 'none';
  containerChooseOptions.style.display = 'block';
}

function newOrderAndRefresh() {
  // Adiciona o código para limpar o estado atual ou executar outras ações necessárias para um novo pedido
  newOrder();

  // Recarrega a página automaticamente
  location.reload();
}

// Função para criar e preencher os contêineres de itens
function itemsContainer(containerId, items, type) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found`);
    return;
  }
  container.innerHTML = '';

  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.classList.add(`${type}-item`);
    itemDiv.dataset.id = item.id;

    const image = document.createElement('img');
    image.alt = item.name;
    image.className = 'item-image';

    const title = document.createElement('h3');
    title.textContent = item.name;
    title.className = 'item-title';

    const description = document.createElement('p');
    description.textContent = item.description;
    description.className = 'item-description';

    const price = document.createElement('p');
    price.textContent = `US: $${item.price}`;
    price.className = 'item-price';

    itemDiv.addEventListener('click', () => {
      const isSelected = itemDiv.classList.contains('item-active');
      const otherItemType = type === 'broth' ? 'protein' : 'broth';

      // Desmarca todos os itens e remove a classe 'item-active' de todos os itens da mesma categoria
      document.querySelectorAll(`.${type}-item`).forEach(item => {
        item.classList.remove('item-active');
        item.querySelector('.item-title').classList.remove('title-active');
        item.querySelector('.item-description').classList.remove('description-active');
        item.querySelector('.item-price').classList.remove('price-active');
        item.querySelector('.item-image').classList.remove('image-active');
      });

      // Ativa o item clicado se ele não estiver selecionado
      if (!isSelected) {
        itemDiv.classList.add('item-active');
        title.classList.add('title-active');
        description.classList.add('description-active');
        price.classList.add('price-active');
        image.classList.add('image-active');
        image.src = item.imageActive; // Atualiza a imagem para a versão ativa
        if (type === 'broth') {
          selectedBrothId = item.id;
          selectedBrothDetails = item;
        } else if (type === 'protein') {
          selectedProteinId = item.id;
          selectedProteinDetails = item;
        }
      } else {
        // Se o item já estiver selecionado, limpa a seleção
        itemDiv.classList.remove('item-active');
        title.classList.remove('title-active');
        description.classList.remove('description-active');
        price.classList.remove('price-active');
        image.classList.remove('image-active');
        image.src = item.imageInactive; // Reverte para a imagem inativa quando o item é desmarcado
        if (type === 'broth') {
          selectedBrothId = null;
          selectedBrothDetails = null;
        } else if (type === 'protein') {
          selectedProteinId = null;
          selectedProteinDetails = null;
        }
      }

      const placeOrderButton = document.getElementById('place-myorder');
      if (selectedBrothId && selectedProteinId) {
        placeOrderButton.classList.add('button-active');
      } else {
        placeOrderButton.classList.remove('button-active');
      }
    });

    // Define a imagem inicial como inativa
    image.src = item.imageInactive;

    itemDiv.appendChild(image);
    itemDiv.appendChild(title);
    itemDiv.appendChild(description);
    itemDiv.appendChild(price);

    container.appendChild(itemDiv);
  });
} 
// Função para rolar suavemente até o contêiner de seleção
function scrollToChooseContainer() {
  const chooseContainer = document.getElementById('choose-container');
  chooseContainer.scrollIntoView({ behavior: 'smooth' });
}

// Função para exibir os detalhes do pedido
function displayOrderDetails(orderDetails) {
  const successDiv1 = document.getElementById('sucess-div1');
  successDiv1.innerHTML = ''; 

  const header = document.getElementById('welcome-header');
  header.classList.add('header-active');

  const title = document.createElement('h3');
  title.textContent = 'Your order:';
  title.className = 'order-title';

  const orderDescription = document.createElement('p');
  orderDescription.textContent = `${orderDetails.description}`;
  orderDescription.className = 'order-description';

  const orderImage = document.createElement('img');
  orderImage.className = 'order-image';
  orderImage.src = orderDetails.image;
  orderImage.alt = orderDetails.description;

  successDiv1.append(title, orderDescription, orderImage);
}

// Adiciona um ouvinte de evento para chamar a função fetchData quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});