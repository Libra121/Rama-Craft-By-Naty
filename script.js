        /* =========================================================
           RAMA CRAFT - Dynamic Logic
        ========================================================= */

        const DEFAULT_PRODUCTS = [
            {
                id: "rc-01",
                name: "Royal Gold & Emerald Epoxy Wall Art",
                category: "Epoxy Wall Art",
                image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
                description: "Premium handmade epoxy wall art with a luxury gold and emerald design.",
                price: "Custom Quote"
            },
            {
                id: "rc-02",
                name: "Custom Illuminated Acrylic Neon Sign",
                category: "Neon Lights",
                image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
                description: "Custom LED neon sign made for bedrooms, businesses, restaurants and events.",
                price: "Custom Quote"
            },
            {
                id: "rc-03",
                name: "Resin Gloss Shine Photo Frame",
                category: "Shine Photos",
                image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
                description: "Turn your favorite photo into a beautiful glossy resin shine frame.",
                price: "Custom Quote"
            },
            {
                id: "rc-04",
                name: "Luxury Backlit Light Box Art",
                category: "Light Boxes",
                image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
                description: "Premium decorative light box with custom artwork and LED illumination.",
                price: "Custom Quote"
            },
            {
                id: "rc-05",
                name: "Epoxy Geode River Decorative Tray",
                category: "Home Decor",
                image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
                description: "Elegant handmade epoxy decorative tray designed for luxury interiors.",
                price: "Custom Quote"
            },
            {
                id: "rc-06",
                name: "Minimalist Linear Neon Wall Accent",
                category: "Neon Lights",
                image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
                description: "Modern minimalist LED neon wall decoration for homes and businesses.",
                price: "Custom Quote"
            }
        ];

        /* STATE */
        let PRODUCTS = JSON.parse(localStorage.getItem("rama_products")) || DEFAULT_PRODUCTS;
        let cart = JSON.parse(localStorage.getItem("rama_cart")) || [];
        const savedUser = JSON.parse(localStorage.getItem("rama_user"));
        let currentUser = savedUser || null;
        let isAdmin = JSON.parse(localStorage.getItem("rama_is_admin")) || false;
        let activeCategory = "All";
        const DEFAULT_CONTENT = {
            announcement: "Custom Luxury Epoxy Arts, Neon Lights & Premium Decor",
            brandName: "RAMA CRAFT",
            brandTagline: "BY NATY",
            heroTitle: "Transform Your Space",
            heroSubtitle: "With Epoxy Art & Custom Lighting",
            heroDescription: "Discover handmade epoxy artwork, custom neon lights, shine photo frames, light boxes and premium home decor crafted by RAMA CRAFT.",
            collectionTitle: "Crafted For Your Space",
            collectionDescription: "Explore our premium handmade products and find something special for your home or business.",
            customTitle: "Create Something",
            customDescription: "Have your own idea? Tell us what you want and RAMA CRAFT will create a custom piece specially for you.",
            customFormTitle: "Request a Custom Order",
            aboutTitle: "Art Made With",
            aboutDescription: "RAMA CRAFT - BY NATY creates premium handmade epoxy artwork, custom lighting and decorative pieces designed to make your space unique.",
            aboutSecondary: "Every piece is carefully designed and crafted with attention to detail, quality and style.",
            footerDescription: "Premium handmade epoxy art, neon lights, shine photos and home decor."
        };
        let siteContent = { ...DEFAULT_CONTENT, ...(JSON.parse(localStorage.getItem("rama_site_content")) || {}) };

        /* DOM ELEMENTS */
        const productsGrid = document.getElementById("products-grid");
        const catalogSearch = document.getElementById("catalog-search");
        const noProducts = document.getElementById("no-products");
        const productModal = document.getElementById("product-modal");
        const cartDrawer = document.getElementById("cart-drawer");
        const cartOverlay = document.getElementById("cart-overlay");
        const authModal = document.getElementById("auth-modal");
        const adminModal = document.getElementById("admin-modal");
        const cartCount = document.getElementById("cart-count");
        const cartItems = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        const authButtonText = document.getElementById("auth-button-text");
        const mobileNav = document.getElementById("mobile-nav");
        const adminBadge = document.getElementById("admin-badge");

        /* INIT */
        document.addEventListener("DOMContentLoaded", () => {
            applySiteContent();
            renderProducts(PRODUCTS);
            updateCartUI();
            updateAuthUI();
            updateAdminUI();
            if (window.location.hash === "#admin" && isAdmin) {
                openAdminModal();
            }
        });

        /* RENDER PRODUCTS */
        function renderProducts(items) {
            if (!productsGrid) return;
            productsGrid.innerHTML = "";

            if (items.length === 0) {
                if (noProducts) noProducts.classList.remove("hidden");
                return;
            }

            if (noProducts) noProducts.classList.add("hidden");

            items.forEach(product => {
                const article = document.createElement("article");
                article.className = "product-card";

                const adminControls = isAdmin ? `
                    <div class="product-admin-actions">
                        <button class="edit-btn" onclick="openEditProduct('${product.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button class="delete-btn" onclick="deleteProduct('${product.id}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                ` : `
                    <button class="gold-btn" style="padding:6px 16px; font-size:12px;" onclick="openProductModal('${product.id}')">View</button>
                `;

                article.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.src='https://via.placeholder.com/300/171717/f6b036?text=RAMA+CRAFT'">
                        <span class="product-category">${escapeHTML(product.category)}</span>
                    </div>
                    <div class="product-body">
                        <h3>${escapeHTML(product.name)}</h3>
                        <p>${escapeHTML(product.description)}</p>
                        <div class="product-bottom">
                            <span class="product-price">${escapeHTML(product.price)}</span>
                            ${adminControls}
                        </div>
                    </div>
                `;
                productsGrid.appendChild(article);
            });
        }

        /* CATEGORY & SEARCH */
        function filterCategory(category) {
            activeCategory = category;
            document.querySelectorAll(".category-btn").forEach(button => {
                button.classList.remove("active");
                const text = button.textContent.trim();
                if ((category === "All" && text === "All Pieces") || text === category) {
                    button.classList.add("active");
                }
            });
            filterAndRender();
        }

        function handleSearch() {
            filterAndRender();
        }

        function filterAndRender() {
            const query = catalogSearch ? catalogSearch.value.toLowerCase().trim() : "";
            const filtered = PRODUCTS.filter(product => {
                const matchesCategory = activeCategory === "All" || product.category === activeCategory;
                const matchesSearch = product.name.toLowerCase().includes(query) ||
                                      product.category.toLowerCase().includes(query) ||
                                      product.description.toLowerCase().includes(query);
                return matchesCategory && matchesSearch;
            });
            renderProducts(filtered);
        }

        function focusSearch() {
            if (!catalogSearch) return;
            catalogSearch.focus();
            catalogSearch.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        /* ADMIN SYSTEM */
        function openAdminModal() {
            if (!adminModal) return;
            adminModal.classList.add("show");
            document.body.classList.add("modal-open");

            if (isAdmin) {
                populateContentForm();
                document.getElementById("admin-login-view").classList.add("hidden");
                document.getElementById("admin-dashboard-view").classList.remove("hidden");
            } else {
                document.getElementById("admin-login-view").classList.remove("hidden");
                document.getElementById("admin-dashboard-view").classList.add("hidden");
            }
        }

        function closeAdminModal() {
            if (!adminModal) return;
            adminModal.classList.remove("show");
            document.body.classList.remove("modal-open");
        }

        function handleAdminLogin(event) {
            event.preventDefault();
            const username = document.getElementById("admin-username")?.value.trim();
            const pass = document.getElementById("admin-password")?.value;
            const extraAdmins = JSON.parse(localStorage.getItem("rama_admin_accounts")) || [];
            const isBuiltInAdmin = username === "Rama Craft" && (pass === "Ramacraft" || pass === "6267@mita");
            const isAddedAdmin = extraAdmins.some(account => account.username === username && account.password === pass);

            if (isBuiltInAdmin || isAddedAdmin) {
                isAdmin = true;
                localStorage.setItem("rama_is_admin", JSON.stringify(true));
                updateAdminUI();
                showToast("Signed in");
                window.open(window.location.href.split("#")[0] + "#admin", "_blank");
                closeAdminModal();
            } else {
                
                          showToast("Incorrect Password");
            }
        }

        function handleAddAdmin(event) {
            event.preventDefault();

            const usernameInput = document.getElementById("new-admin-username");
            const passwordInput = document.getElementById("new-admin-password");
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const extraAdmins = JSON.parse(localStorage.getItem("rama_admin_accounts")) || [];

            if (username === "admin" || extraAdmins.some(account => account.username === username)) {
                showToast("Username already exists");
                return;
            }

            extraAdmins.push({ username, password });
            localStorage.setItem("rama_admin_accounts", JSON.stringify(extraAdmins));
            event.target.reset();
            showToast("New admin added");
        }

        function applySiteContent() {
            const contentElements = {
                "announcement-text": siteContent.announcement,
                "brand-name": siteContent.brandName,
                "brand-tagline": siteContent.brandTagline,
                "hero-title": siteContent.heroTitle,
                "hero-subtitle": siteContent.heroSubtitle,
                "hero-description": siteContent.heroDescription,
                "collection-title": siteContent.collectionTitle,
                "collection-description": siteContent.collectionDescription,
                "custom-title": siteContent.customTitle,
                "custom-description-text": siteContent.customDescription,
                "custom-form-title": siteContent.customFormTitle,
                "about-title": siteContent.aboutTitle,
                "about-description": siteContent.aboutDescription,
                "about-secondary": siteContent.aboutSecondary,
                "footer-description": siteContent.footerDescription
            };

            Object.entries(contentElements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) element.textContent = value;
            });
        }

        function populateContentForm() {
            const fields = {
                "content-announcement": siteContent.announcement,
                "content-brand-name": siteContent.brandName,
                "content-brand-tagline": siteContent.brandTagline,
                "content-hero-title": siteContent.heroTitle,
                "content-hero-subtitle": siteContent.heroSubtitle,
                "content-hero-description": siteContent.heroDescription,
                "content-collection-title": siteContent.collectionTitle,
                "content-collection-description": siteContent.collectionDescription,
                "content-custom-title": siteContent.customTitle,
                "content-custom-description": siteContent.customDescription,
                "content-custom-form-title": siteContent.customFormTitle,
                "content-about-title": siteContent.aboutTitle,
                "content-about-description": siteContent.aboutDescription,
                "content-about-secondary": siteContent.aboutSecondary,
                "content-footer-description": siteContent.footerDescription
            };

            Object.entries(fields).forEach(([id, value]) => {
                const field = document.getElementById(id);
                if (field) field.value = value;
            });
        }

        function handleSaveContent(event) {
            event.preventDefault();
            const fieldMap = {
                announcement: "content-announcement",
                brandName: "content-brand-name",
                brandTagline: "content-brand-tagline",
                heroTitle: "content-hero-title",
                heroSubtitle: "content-hero-subtitle",
                heroDescription: "content-hero-description",
                collectionTitle: "content-collection-title",
                collectionDescription: "content-collection-description",
                customTitle: "content-custom-title",
                customDescription: "content-custom-description",
                customFormTitle: "content-custom-form-title",
                aboutTitle: "content-about-title",
                aboutDescription: "content-about-description",
                aboutSecondary: "content-about-secondary",
                footerDescription: "content-footer-description"
            };

            Object.entries(fieldMap).forEach(([key, id]) => {
                siteContent[key] = document.getElementById(id).value.trim();
            });
            localStorage.setItem("rama_site_content", JSON.stringify(siteContent));
            applySiteContent();
            showToast("Front page updated");
        }

        function togglePasswordVisibility(inputId, button) {
            const input = document.getElementById(inputId);
            if (!input) return;

            const isHidden = input.type === "password";
            input.type = isHidden ? "text" : "password";
            button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
            button.innerHTML = `<i class="fa-solid fa-eye${isHidden ? "-slash" : ""}"></i>`;
        }

        function handleAdminLogout() {
            isAdmin = false;
            localStorage.removeItem("rama_is_admin");
            updateAdminUI();
            closeAdminModal();
            showToast("Logged out");
        }

        function updateAdminUI() {
            if (adminBadge) {
                if (isAdmin) {
                    adminBadge.classList.remove("hidden");
                } else {
                    adminBadge.classList.add("hidden");
                }
            }
            renderProducts(PRODUCTS);
        }

        function handleSaveProduct(event) {
            event.preventDefault();

            const idInput = document.getElementById("edit-product-id").value;
            const name = document.getElementById("prod-name").value.trim();
            const category = document.getElementById("prod-category").value;
            const image = document.getElementById("prod-image").value.trim();
            const price = document.getElementById("prod-price").value.trim();
            const description = document.getElementById("prod-description").value.trim();

            if (idInput) {
                const index = PRODUCTS.findIndex(p => p.id === idInput);
                if (index !== -1) {
                    PRODUCTS[index] = { id: idInput, name, category, image, price, description };
                    showToast("Product updated");
                }
            } else {
                const newProduct = {
                    id: "rc-" + Date.now(),
                    name,
                    category,
                    image,
                    price,
                    description
                };
                PRODUCTS.unshift(newProduct);
                showToast("New product added");
            }

            saveProducts();
            renderProducts(PRODUCTS);
            resetProductForm();
            closeAdminModal();
        }

        function openEditProduct(id) {
            const product = PRODUCTS.find(p => p.id === id);
            if (!product) return;

            openAdminModal();

            document.getElementById("edit-product-id").value = product.id;
            document.getElementById("prod-name").value = product.name;
            document.getElementById("prod-category").value = product.category;
            document.getElementById("prod-image").value = product.image;
            document.getElementById("prod-price").value = product.price;
            document.getElementById("prod-description").value = product.description;

            showImagePreview(product.image);

            document.getElementById("form-title").textContent = "Edit Product";
            document.getElementById("save-prod-btn").textContent = "Save Changes";
            document.getElementById("cancel-edit-btn").classList.remove("hidden");
        }

        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const imageDataUrl = e.target.result;
                document.getElementById("prod-image").value = imageDataUrl;
                showImagePreview(imageDataUrl);
            };
            reader.readAsDataURL(file);
        }

        function showImagePreview(url) {
            const previewContainer = document.getElementById("image-preview-container");
            const previewImg = document.getElementById("image-preview");
            if (previewContainer && previewImg && url) {
                previewImg.src = url;
                previewContainer.classList.remove("hidden");
            }
        }

        function resetProductForm() {
            document.getElementById("product-form").reset();
            document.getElementById("edit-product-id").value = "";
            document.getElementById("form-title").textContent = "Add New Product";
            document.getElementById("save-prod-btn").textContent = "Add Product";
            document.getElementById("cancel-edit-btn").classList.add("hidden");

            const fileInput = document.getElementById("prod-image-file");
            if (fileInput) fileInput.value = "";
            const previewContainer = document.getElementById("image-preview-container");
            if (previewContainer) previewContainer.classList.add("hidden");
        }

        function startNewProduct() {
            resetProductForm();
            const productForm = document.getElementById("product-form");
            if (productForm) productForm.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        function toggleAdminForm() {
            const adminForm = document.getElementById("admin-form");
            if (!adminForm) return;

            adminForm.classList.toggle("hidden");
            if (!adminForm.classList.contains("hidden")) {
                adminForm.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }

        function toggleContentEditor() {
            const contentForm = document.getElementById("content-form");
            if (!contentForm) return;

            contentForm.classList.toggle("hidden");
            if (!contentForm.classList.contains("hidden")) {
                populateContentForm();
                contentForm.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }

        function deleteProduct(id) {
            if (confirm("Are you sure you want to delete this product?")) {
                PRODUCTS = PRODUCTS.filter(p => p.id !== id);
                saveProducts();
                renderProducts(PRODUCTS);
                showToast("Product deleted");
            }
        }

        function saveProducts() {
            localStorage.setItem("rama_products", JSON.stringify(PRODUCTS));
        }

        /* PRODUCT MODAL */
        function openProductModal(id) {
            const product = PRODUCTS.find(item => item.id === id);
            if (!product || !productModal) return;

            productModal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close" onclick="closeProductModal()"><i class="fa-solid fa-xmark"></i></button>
                    <div class="modal-product-grid">
                        <div class="modal-product-image">
                            <img src="${product.image}" alt="${escapeHTML(product.name)}" onerror="this.src='https://via.placeholder.com/300/171717/f6b036?text=RAMA+CRAFT'">
                        </div>
                        <div class="modal-product-info">
                            <span class="modal-category">${escapeHTML(product.category)}</span>
                            <h2>${escapeHTML(product.name)}</h2>
                            <p>${escapeHTML(product.description)}</p>
                            <div class="modal-price">${escapeHTML(product.price)}</div>
                            <div class="modal-actions">
                                <button class="gold-btn" onclick="addToCart('${product.id}')"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                                <button class="outline-btn" onclick="orderProduct('${product.id}')"><i class="fa-brands fa-telegram"></i> Order Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productModal.classList.add("show");
            document.body.classList.add("modal-open");
        }

        function closeProductModal() {
            if (!productModal) return;
            productModal.classList.remove("show");
            document.body.classList.remove("modal-open");
        }

        /* CART */
        function addToCart(id) {
            const product = PRODUCTS.find(item => item.id === id);
            if (!product) return;

            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    image: product.image,
                    price: product.price,
                    quantity: 1
                });
            }

            saveCart();
            updateCartUI();
            showToast("Added to cart");
            closeProductModal();
            toggleCartDrawer(true);
        }

        function orderProduct(id) {
            const product = PRODUCTS.find(item => item.id === id);
            if (!product) return;
            const message = `Hello RAMA CRAFT 👋\n\nI want to order:\nProduct: ${product.name}\nCategory: ${product.category}\nPrice: ${product.price}\n\nPlease give me more details.`;
            window.open("https://t.me/Rama_Craft?text=" + encodeURIComponent(message), "_blank");
        }

        function updateQuantity(id, change) {
            const item = cart.find(product => product.id === id);
            if (!item) return;

            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(product => product.id !== id);
            }

            saveCart();
            updateCartUI();
        }

        function removeFromCart(id) {
            cart = cart.filter(product => product.id !== id);
            saveCart();
            updateCartUI();
            showToast("Item removed");
        }

        function saveCart() {
            localStorage.setItem("rama_cart", JSON.stringify(cart));
        }

        function updateCartUI() {
            if (cartCount) {
                const quantity = cart.reduce((total, item) => total + item.quantity, 0);
                cartCount.textContent = quantity;
            }

            if (!cartItems) return;

            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <h3>Your cart is empty</h3>
                        <p>Add your favorite RAMA CRAFT products.</p>
                    </div>
                `;
                if (cartTotal) cartTotal.textContent = "Custom Quote";
                return;
            }

            cartItems.innerHTML = "";
            cart.forEach(item => {
                const div = document.createElement("div");
                div.className = "cart-item";
                div.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${escapeHTML(item.name)}" onerror="this.src='https://via.placeholder.com/100/171717/f6b036?text=RAMA'">
                    </div>
                    <div class="cart-item-info">
                        <h4>${escapeHTML(item.name)}</h4>
                        <span>${escapeHTML(item.price)}</span>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity('${item.id}', -1)">−</button>
                            <strong>${item.quantity}</strong>
                            <button onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-cart-item" onclick="removeFromCart('${item.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                cartItems.appendChild(div);
            });

            if (cartTotal) cartTotal.textContent = "Custom Quote";
        }

        function toggleCartDrawer(forceOpen = null) {
            if (!cartDrawer) return;
            let shouldOpen = forceOpen !== null ? forceOpen : !cartDrawer.classList.contains("open");

            if (shouldOpen) {
                cartDrawer.classList.add("open");
                if (cartOverlay) cartOverlay.classList.add("show");
                document.body.classList.add("drawer-open");
            } else {
                cartDrawer.classList.remove("open");
                if (cartOverlay) cartOverlay.classList.remove("show");
                document.body.classList.remove("drawer-open");
            }
        }

        function proceedToCheckout() {
            if (cart.length === 0) {
                showToast("Your cart is empty");
                return;
            }
            if (!currentUser) {
                openAuthModal();
                return;
            }
            sendCartToTelegram();
        }

        function sendCartToTelegram() {
            let message = `Hello RAMA CRAFT 👋\n\nI want to order:\nCustomer: ${currentUser.phone}\n\n`;
            cart.forEach((item, index) => {
                message += `${index + 1}. ${item.name} (x${item.quantity})\n`;
            });
            message += `\nPlease send me the price details and delivery info.`;
            window.open("https://t.me/Rama_Craft?text=" + encodeURIComponent(message), "_blank");
            cart = [];
            saveCart();
            updateCartUI();
            toggleCartDrawer(false);
            showToast("Order sent");
        }

        function handleCustomOrderSubmit(event) {
            event.preventDefault();
            const name = document.getElementById("custom-name")?.value.trim();
            const phone = document.getElementById("custom-phone")?.value.trim();
            const craft = document.getElementById("custom-craft")?.value.trim();
            const description = document.getElementById("custom-description")?.value.trim();

            const message = `Hello RAMA CRAFT 👋\n\nCustom Order Request:\nName: ${name}\nPhone: ${phone}\nCraft Type: ${craft}\n\nDetails:\n${description}`;
            window.open("https://t.me/Rama_Craft?text=" + encodeURIComponent(message), "_blank");
            event.target.reset();
            showToast("Opening Telegram...");
        }

        /* AUTH */
        function openAuthModal() {
            if (!authModal) return;
            authModal.classList.add("show");
            document.body.classList.add("modal-open");
            showAuthLogin();
        }

        function closeAuthModal() {
            if (!authModal) return;
            authModal.classList.remove("show");
            document.body.classList.remove("modal-open");
        }

        function openGuestLogin() {
            const loginView = document.getElementById("auth-login-view");
            const guestView = document.getElementById("guest-login-view");
            if (loginView && guestView) {
                loginView.classList.add("hidden");
                guestView.classList.remove("hidden");
            }
        }

        function showAuthLogin() {
            const loginView = document.getElementById("auth-login-view");
            const guestView = document.getElementById("guest-login-view");
            if (loginView && guestView) {
                loginView.classList.remove("hidden");
                guestView.classList.add("hidden");
            }
        }

        function handlePhoneAuth(event) {
            event.preventDefault();
            const countryCode = document.getElementById("country-code")?.value || "+251";
            const phoneInput = document.getElementById("phone-number");
            if (!phoneInput) return;

            const phone = phoneInput.value.trim();
            currentUser = { phone: countryCode + phone };
            saveUser();
            updateAuthUI();
            closeAuthModal();
            const action = event.submitter?.value === "signup" ? "Account created" : "Signed in successfully";
            showToast(action);
        }

        function continueAsGuest(event) {
            event.preventDefault();
            const name = document.getElementById("guest-name")?.value.trim();
            const phone = document.getElementById("guest-phone")?.value.trim();
            currentUser = { name, phone, isGuest: true };
            saveUser();
            updateAuthUI();
            closeAuthModal();
            showToast("Signed in as guest");
        }

        function saveUser() {
            localStorage.setItem("rama_user", JSON.stringify(currentUser));
        }

        function updateAuthUI() {
            if (!authButtonText) return;
            if (!currentUser) {
                authButtonText.textContent = "Sign In";
                return;
            }
            authButtonText.textContent = currentUser.isGuest ? "Guest" : currentUser.phone;
        }

        /* UTILS */
        function toggleMobileNav() {
            if (mobileNav) mobileNav.classList.toggle("open");
        }

        function showToast(message) {
            let toast = document.getElementById("rama-toast");
            if (!toast) {
                toast = document.createElement("div");
                toast.id = "rama-toast";
                toast.className = "toast";
                document.body.appendChild(toast);
            }
            toast.textContent = message;
            toast.classList.add("show");
            clearTimeout(window.ramaToastTimer);
            window.ramaToastTimer = setTimeout(() => {
                toast.classList.remove("show");
            }, 2500);
        }

        function escapeHTML(value) {
            return String(value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
