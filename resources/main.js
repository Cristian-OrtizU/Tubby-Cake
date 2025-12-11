document.addEventListener('DOMContentLoaded', function() {
    
    // 1. ANIMACIONES DE SCROLL (Infinitas / Re-activables)
    const animElements = document.querySelectorAll('.anim-hidden');

    const observerOptions = {
        threshold: 0.1, // Se activa al ver el 10% del elemento
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si entra en pantalla: ANIMA
                entry.target.classList.add('active');
            } else {
                // Si sale de pantalla: RESTAURA (para que se anime otra vez al volver)
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    animElements.forEach(el => observer.observe(el));


    // 2. HEADER DINÁMICO (Efecto Resize al hacer scroll)
    const headerTop = document.querySelector('.header-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            headerTop.style.padding = "5px 0"; 
        } else {
            headerTop.style.padding = "10px 0"; 
        }
    });


    // 3. LÓGICA DE CARRITO INTELIGENTE
    const btnsCompra = document.querySelectorAll('.btn-tubby');
    const cartCounter = document.getElementById('cart-count-number');
    let count = 0;

    btnsCompra.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Verificar si el botón es en realidad un enlace de navegación (como el de LOGIN o IR AL MENU)
            // Si el href apunta a un archivo .html o una sección, NO sumar al carrito.
            const href = this.getAttribute('href');
            
            if (this.tagName === 'A' && href && href !== '#' && !href.startsWith('javascript')) {
                // Es un enlace de navegación, dejar que el navegador lo siga
                return;
            }

            // Si es un botón de compra real o un enlace con href="#":
            if(this.type !== 'submit') {
                // Efecto visual de presión
                this.style.transform = "scale(0.95)";
                setTimeout(() => this.style.transform = "scale(1)", 100);
                
                count++;
                if(cartCounter) {
                    cartCounter.innerText = `(${count})`;
                    cartCounter.style.color = "#E21E25";
                    setTimeout(() => cartCounter.style.color = "inherit", 300);
                }
                alert('¡Delicia agregada al carrito! 🧁');
            }
        });
    });


    // 4. MOSTRAR / OCULTAR CONTRASEÑA (LOGIN)
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#inputPassword');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            // Alternar tipo input
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Alternar icono
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    document.addEventListener('DOMContentLoaded', function() {
    
        // =========================================
        // 1. ANIMACIONES Y UI (Lo que ya tenías)
        // =========================================
        
        // Animaciones de Scroll
        const animElements = document.querySelectorAll('.anim-hidden');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
                else entry.target.classList.remove('active');
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
        animElements.forEach(el => observer.observe(el));
    
        // Header Dinámico
        const headerTop = document.querySelector('.header-top');
        window.addEventListener('scroll', () => {
            if (headerTop) {
                headerTop.style.padding = window.scrollY > 50 ? "5px 0" : "10px 0";
            }
        });
    
        // Toggle Password
        const togglePassword = document.querySelector('#togglePassword');
        const passwordInput = document.querySelector('#inputPassword');
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function () {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.querySelector('i').classList.toggle('fa-eye');
                this.querySelector('i').classList.toggle('fa-eye-slash');
            });
        }
    
    
        // =========================================
        // 2. LÓGICA DEL CARRITO (LOCALSTORAGE)
        // =========================================
    
        // A. Inicializar contador del header al cargar
        updateHeaderCount();
    
        // B. Detectar clics en botones "AGREGAR AL CARRITO"
        const addBtns = document.querySelectorAll('.btn-add-cart');
        addBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Obtener datos del producto desde el HTML
                const id = this.getAttribute('data-id');
                const nombre = this.getAttribute('data-nombre');
                const precio = parseFloat(this.getAttribute('data-precio'));
    
                addToCart(id, nombre, precio);
    
                // Animación pequeña del botón
                this.style.transform = "scale(0.95)";
                setTimeout(() => this.style.transform = "scale(1.05)", 100);
            });
        });
    
        // C. Si estamos en la página carrito.html, cargar la tabla
        const cartItemsContainer = document.getElementById('cart-items-container');
        if (cartItemsContainer) {
            renderCartPage();
        }
    });
    
    /* --- FUNCIONES GLOBALES DEL CARRITO --- */
    
    // 1. Agregar producto al LocalStorage
    function addToCart(id, nombre, precio) {
        let cart = JSON.parse(localStorage.getItem('tubbyCart')) || [];
        
        // Verificar si ya existe para solo sumar cantidad
        const existingProduct = cart.find(item => item.id === id);
    
        if (existingProduct) {
            existingProduct.cantidad += 1;
        } else {
            cart.push({ id, nombre, precio, cantidad: 1 });
        }
    
        localStorage.setItem('tubbyCart', JSON.stringify(cart));
        updateHeaderCount();
        alert(`¡${nombre} agregado al carrito! 🧁`);
    }
    
    // 2. Actualizar el numerito en el Header
    function updateHeaderCount() {
        const cart = JSON.parse(localStorage.getItem('tubbyCart')) || [];
        const countSpan = document.getElementById('cart-count-number');
        
        if (countSpan) {
            // Sumar todas las cantidades
            const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
            countSpan.innerText = totalItems > 0 ? `(${totalItems})` : '';
        }
    }
    
    // 3. Dibujar la tabla en carrito.html
    function renderCartPage() {
        const cart = JSON.parse(localStorage.getItem('tubbyCart')) || [];
        const container = document.getElementById('cart-items-container');
        const emptyMsg = document.getElementById('empty-cart-msg');
        const cartFooter = document.getElementById('cart-footer');
        const totalSpan = document.getElementById('cart-total');
    
        container.innerHTML = '';
        let total = 0;
    
        if (cart.length === 0) {
            emptyMsg.style.display = 'block';
            cartFooter.style.display = 'none';
            return;
        } else {
            emptyMsg.style.display = 'none';
            cartFooter.style.display = 'flex';
        }
    
        cart.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
    
            const row = `
                <tr>
                    <td class="fw-bold">${item.nombre}</td>
                    <td>$${item.precio}</td>
                    <td>
                        <button class="btn btn-sm btn-light border" onclick="changeQty(${index}, -1)">-</button>
                        <span class="mx-2">${item.cantidad}</span>
                        <button class="btn btn-sm btn-light border" onclick="changeQty(${index}, 1)">+</button>
                    </td>
                    <td>$${subtotal}</td>
                    <td><button class="btn btn-sm text-danger" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
            container.innerHTML += row;
        });
    
        totalSpan.innerText = total;
    }
    
    // 4. Cambiar cantidad (+ o -)
    window.changeQty = function(index, change) {
        let cart = JSON.parse(localStorage.getItem('tubbyCart')) || [];
        
        cart[index].cantidad += change;
    
        if (cart[index].cantidad <= 0) {
            cart.splice(index, 1); // Eliminar si baja a 0
        }
    
        localStorage.setItem('tubbyCart', JSON.stringify(cart));
        renderCartPage();
        updateHeaderCount();
    };
    
    // 5. Eliminar item
    window.removeItem = function(index) {
        let cart = JSON.parse(localStorage.getItem('tubbyCart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('tubbyCart', JSON.stringify(cart));
        renderCartPage();
        updateHeaderCount();
    };
    
    // 6. Vaciar todo
    window.clearCart = function() {
        if(confirm('¿Estás seguro de vaciar el carrito?')) {
            localStorage.removeItem('tubbyCart');
            renderCartPage();
            updateHeaderCount();
        }
    };
});
