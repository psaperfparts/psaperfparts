// =========================================================
// 1. BASE DE DADOS DOS PRODUTOS
// =========================================================
const products = [
    {
        id: "keyring",
        isCarousel: true,
        category: "Acessórios",
        price: 7.99,
        variants: [
            { img: "https://ae-pic-a1.aliexpress-media.com/kf/S7b3d1b02f4f34f7e8308d65b3a0a3cceW.jpg_220x220q75.jpg_.avif", title: "PORTA CHAVES PEUGEOT", desc: "Design clássico Peugeot em metal." },
            { img: "https://ae-pic-a1.aliexpress-media.com/kf/Sb2716344f73541e4ba3bcd2ac2a995ccP.jpg_220x220q75.jpg_.avif", title: "PORTA CHAVES CITROËN", desc: "Design premium duplo chevron." },
            { img: "https://ae-pic-a1.aliexpress-media.com/kf/S579b05c0cdb34dd587520b68760aabc2i.jpg_220x220q75.jpg_.avif", title: "PORTA CHAVES 206", desc: "Edição especial gravada a laser." }
        ]
    },
    { name: "SHORT SHIFTER V2", price: 69.99, cat: "Performance", img: "https://ae-pic-a1.aliexpress-media.com/kf/S7e489e6596544d05905c5c509c09a6247.jpg_220x220q75.jpg_.avif", desc: "Reduz curso em 40%. Oferta de manete ralliart." },
    { name: "Manete Replica Ralliart", price: 19.90, cat: "Interior", img: "https://ae-pic-a1.aliexpress-media.com/kf/S353710e13f0d4ab3b6b57e27a5b5168e9.jpg_220x220q75.jpg_.avif", desc: "Punho ergonómico compatível com PSA." },
    { name: "Filtro Cónico HighFlow", price: 34.50, cat: "Admissão", img: "https://ae-pic-a1.aliexpress-media.com/kf/S7d8d217983054190978735508c582664X.jpg_220x220q75.jpg_.avif", desc: "Melhor fluxo de ar e som desportivo." },
    { name: "Espaçadores 20mm", price: 45.00, cat: "Chassis", img: "https://ae-pic-a1.aliexpress-media.com/kf/S4945d7a8d0524021980839e4a3b1f1f1Y.jpg_220x220q75.jpg_.avif", desc: "Melhor estabilidade e estética wide." },
    { name: "Molas Rebaixamento", price: 129.99, cat: "Chassis", img: "https://ae-pic-a1.aliexpress-media.com/kf/S6c0e5a62e08846989643f878a876a444G.jpg_220x220q75.jpg_.avif", desc: "Kit de molas -30mm para eixo frontal." }
];

let currentKeyringIdx = 0;

// =========================================================
// 2. FUNÇÕES GLOBAIS DO CARRINHO (Usadas por todas as páginas)
// =========================================================

// Atualiza o contador de itens no ícone do carrinho
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('psa_cart')) || [];
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = cart.length;
    }
}

// Adiciona um produto ao LocalStorage
function addToCart(name, price, img) {
    let cart = JSON.parse(localStorage.getItem('psa_cart')) || [];
    cart.push({ name, price, img });
    localStorage.setItem('psa_cart', JSON.stringify(cart));
    updateCartCount();
    alert("✅ " + name + " adicionado ao carrinho!");
}

// =========================================================
// 3. LÓGICA DA PÁGINA PRINCIPAL (INDEX)
// =========================================================

function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    if (!grid) return; // Sai se não estiver na página index.html
    
    grid.innerHTML = '';

    items.forEach(p => {
        let cardHtml = '';
        if (p.isCarousel) {
            const current = p.variants[currentKeyringIdx];
            cardHtml = `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card">
                        <div class="card-img-container">
                            <button class="arrow-btn arrow-left" onclick="changeKeyring(-1, event)">❮</button>
                            <img src="${current.img}" class="card-img-top">
                            <div class="card-overlay">${current.desc}</div>
                            <button class="arrow-btn arrow-right" onclick="changeKeyring(1, event)">❯</button>
                        </div>
                        <div class="card-body text-center">
                            <span class="category-label">${p.category}</span>
                            <h6 class="fw-bold">${current.title}</h6>
                            <p class="h5 text-danger fw-bold">${p.price.toFixed(2)}€</p>
                            <button onclick="addKeyringToCart()" class="btn-buy">Adicionar</button>
                        </div>
                    </div>
                </div>`;
        } else {
            cardHtml = `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card">
                        <div class="card-img-container">
                            <img src="${p.img}" class="card-img-top">
                            <div class="card-overlay">${p.desc}</div>
                        </div>
                        <div class="card-body text-center">
                            <span class="category-label">${p.cat}</span>
                            <h6 class="fw-bold">${p.name}</h6>
                            <p class="h5 text-danger fw-bold">${p.price.toFixed(2)}€</p>
                            <button onclick="addToCart('${p.name}', ${p.price}, '${p.img}')" class="btn-buy">Adicionar</button>
                        </div>
                    </div>
                </div>`;
        }
        grid.innerHTML += cardHtml;
    });
}

// Lógica de Ordenação
function sortProducts() {
    const sortElement = document.getElementById('sortPrice');
    if (!sortElement) return;
    
    const val = sortElement.value;
    let sorted = [...products];

    if (val === 'low') sorted.sort((a, b) => a.price - b.price);
    if (val === 'high') sorted.sort((a, b) => b.price - a.price);

    renderProducts(sorted);
}

// Funções do Carrossel de Porta-Chaves
function changeKeyring(dir, event) {
    event.stopPropagation();
    const keyringProd = products.find(p => p.id === 'keyring');
    currentKeyringIdx += dir;
    
    if (currentKeyringIdx < 0) currentKeyringIdx = keyringProd.variants.length - 1;
    if (currentKeyringIdx >= keyringProd.variants.length) currentKeyringIdx = 0;
    
    // Refresh visual (mantém ordenação atual)
    sortProducts(); 
}

function addKeyringToCart() {
    const keyringProd = products.find(p => p.id === 'keyring');
    const current = keyringProd.variants[currentKeyringIdx];
    addToCart(current.title, keyringProd.price, current.img);
}

// =========================================================
// 4. INICIALIZAÇÃO AUTOMÁTICA
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Se estivermos no index.html (onde existe o product-grid)
    if (document.getElementById('product-grid')) {
        renderProducts(products);
    }
});
// 3. LÓGICA DE ORDENAÇÃO
function sortProducts() {
    // Procura o elemento <select> no HTML
    const sortElement = document.getElementById('sortPrice');
    if (!sortElement) return;
    
    const val = sortElement.value;
    let sorted = [...products]; // Cria uma cópia da lista original

    // Ordena com base no valor escolhido
    if (val === 'low') {
        sorted.sort((a, b) => a.price - b.price); // Menor para Maior
    } else if (val === 'high') {
        sorted.sort((a, b) => b.price - a.price); // Maior para Menor
    }
    // Se for 'default', ele usa a ordem original da lista

    // Re-renderiza os produtos no ecrã com a nova ordem
    renderProducts(sorted);
}