const API_KEY = import.meta.env.VITE_API_KEY;
let selectedBrothId = null;
let selectedProteinId = null;
let selectedBrothDetails = null;
let selectedProteinDetails = null;
let onSlide = false;

// Função para buscar dados da API e preencher os contêineres de seleção
export async function fetchData(type) {
  const brothUrl = 'https://api.tech.redventures.com.br/broths';
  const proteinUrl = 'https://api.tech.redventures.com.br/proteins';

  try {
    const [brothResponse, proteinsResponse] = await Promise.all([
      fetch(brothUrl, { headers: { 'x-api-key': API_KEY } }),
      fetch(proteinUrl, { headers: { 'x-api-key': API_KEY } }),
    ]);

    const broths = await brothResponse.json();
    const proteins = await proteinsResponse.json();

    if (type === 'broths') {
      itemsContainer('broths-container', broths, 'broths');
    } else if (type === 'proteins') {
      itemsContainer('proteins-container', proteins, 'proteins');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  fetchData('broths');
  fetchData('proteins');
});

// Função para buscar os detalhes do pedido na API
export async function fetchOrderDetails() {
  const orderDetailsUrl = 'https://api.tech.redventures.com.br/order';

  const data = {
    brothId: selectedBrothId,
    proteinId: selectedProteinId,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(orderDetailsUrl, options);
    const orderDetails = await response.json();
    return orderDetails;
  } catch (error) {
    console.error('Error fetching order details:', error);
  }
}

export function itemsContainer(containerId, items, type) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found`);
    return;
  }
  container.innerHTML = '';

  let activeItem = null;

  items.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = `carousel_item_${type}`;
    if (index === 0) {
      itemDiv.classList.add(`carousel_item_${type}__active`);
      activeItem = itemDiv;
    }
    itemDiv.classList.add(`${type}-item`);
    itemDiv.dataset.id = item.id;

    const image = document.createElement('img');
    image.src = item.imageInactive;
    image.dataset.activeImage = item.imageActive;
    image.dataset.inactiveImage = item.imageInactive;
    image.alt = item.name;
    image.className = `carousel_img_${type}`;

    const title = document.createElement('h3');
    title.textContent = item.name;
    title.className = `carousel_title_${type}`;

    const description = document.createElement('p');
    description.textContent = item.description;
    description.className = `carousel_description_${type}`;

    const price = document.createElement('p');
    price.textContent = `US: $${item.price}`;
    price.className = `carousel_price_${type}`;

    const indicator = document.createElement('div');
    indicator.className = 'item-indicator';

    itemDiv.addEventListener('click', () => {
      const isSelected = itemDiv.classList.contains('item-active');

      // Desmarca todos os itens e remove a classe 'item-active' de todos os itens da mesma categoria
      document.querySelectorAll(`.${type}-item`).forEach((item) => {
        item.classList.remove('item-active');
        item
          .querySelector('.carousel_title_' + type)
          .classList.remove('title-active');
        item
          .querySelector('.carousel_description_' + type)
          .classList.remove('description-active');
        item
          .querySelector('.carousel_price_' + type)
          .classList.remove('price-active');
        item.querySelector('.carousel_img_' + type).src = item.querySelector(
          '.carousel_img_' + type,
        ).dataset.inactiveImage;
      });

      // Ativa o item clicado se ele não estiver selecionado
      if (!isSelected) {
        itemDiv.classList.add('item-active');
        title.classList.add('title-active');
        description.classList.add('description-active');
        price.classList.add('price-active');
        image.classList.add('image-active');
        image.src = image.dataset.activeImage;
        if (type === 'broths') {
          selectedBrothId = item.id;
          selectedBrothDetails = item;
        } else if (type === 'proteins') {
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
        image.src = image.dataset.inactiveImage;
        if (type === 'broths') {
          selectedBrothId = null;
          selectedBrothDetails = null;
        } else if (type === 'proteins') {
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

    itemDiv.appendChild(image);
    itemDiv.appendChild(title);
    itemDiv.appendChild(description);
    itemDiv.appendChild(price);

    container.appendChild(itemDiv);
  });
}
// Função para rolar suavemente até o contêiner de seleção
export function scrollToChooseContainer() {
  const chooseContainer = document.getElementById('choose-container');
  chooseContainer.scrollIntoView({ behavior: 'smooth' });
}

// Função para exibir o contêiner de seleção e ocultar o contêiner de sucesso
export function newOrder() {
  const containerSuccess = document.getElementById('success');
  const containerChooseOptions = document.getElementById('choose-options');
  const items = document.querySelectorAll('.item');
  const placeOrderButton = document.getElementById('place-myorder');

  items.forEach((item) => {
    item.classList.remove('item-active');
    item.querySelector('.item-title').classList.remove('title-active');
    item
      .querySelector('.item-description')
      .classList.remove('description-active');
    item.querySelector('.item-price').classList.remove('price-active');

    // Atualiza a imagem para a versão inativa
    const image = item.querySelector('.item-image');
    const itemType = item.classList.contains('broth-item')
      ? 'broth'
      : 'protein';
    const itemId = item.dataset.id;
    const selectedItem =
      itemType === 'broth' ? selectedBrothDetails : selectedProteinDetails;
    if (selectedItem && selectedItem.id === itemId) {
      image.src = selectedItem.imageInactive;
    }
  });

  placeOrderButton.classList.remove('button-active');
  containerSuccess.style.display = 'none';
  containerChooseOptions.style.display = 'block';
  location.reload();
}

export async function openOrderContainer() {
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

export function setupCarousel(type) {
  const dots = document.querySelectorAll(`.carousel_dot_${type}`);
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => slideItems(index, type));
  });
}

window.addEventListener('load', () => {
  setupCarousel('broths');
  setupCarousel('proteins');
});

export function slideItems(toIndex, type) {
  if (onSlide) return;
  onSlide = true;

  const itemsArray = Array.from(
    document.querySelectorAll(`.carousel_item_${type}`),
  );
  const itemActive = document.querySelector(`.carousel_item_${type}__active`);
  let newItemActive = null;

  if (toIndex >= itemsArray.length) {
    toIndex = 0;
  } else if (toIndex < 0) {
    toIndex = itemsArray.length - 1;
  }

  newItemActive = itemsArray[toIndex];
  const dotActive = document.querySelector(`.carousel_dot_${type}__active`);
  dotActive.classList.remove(`carousel_dot_${type}__active`);
  const dots = document.querySelectorAll(`.carousel_dot_${type}`);
  dots[toIndex].classList.add(`carousel_dot_${type}__active`);

  newItemActive.classList.add(`carousel_item_${type}__active`);
  newItemActive.classList.remove(`carousel_item_${type}__hidden`);

  itemActive.classList.remove(`carousel_item_${type}__active`);
  itemActive.classList.add(`carousel_item_${type}__hidden`);

  onSlide = false;
}

export function getItemActive(type) {
  const itemActive = document.querySelector(`.carousel_item_${type}__active`);
  const itemsArray = Array.from(
    document.querySelectorAll(`.carousel_item_${type}`),
  );
  const itemActiveIndex = itemsArray.indexOf(itemActive);
  return itemActiveIndex;
}

window.newOrder = newOrder;
window.scrollToChooseContainer = scrollToChooseContainer;
window.openOrderContainer = openOrderContainer;
window.fetchData = fetchData;
window.fetchOrderDetails = fetchOrderDetails;
window.itemsContainer = itemsContainer;
window.setupCarousel = setupCarousel;
window.slideItems = slideItems;
window.getItemActive = getItemActive;
