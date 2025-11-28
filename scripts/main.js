// Main JavaScript for United Company Website

document.addEventListener('DOMContentLoaded', function() {
    // Language Toggle
    const languageToggle = document.getElementById('languageToggle');
    const languageText = document.getElementById('languageText');
    const body = document.body;
    
    // Get saved language from localStorage or default to 'en'
    let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
    
    // Apply saved language on page load
    function applyLanguage(lang) {
        if (lang === 'ar') {
            body.classList.add('arabic');
            document.documentElement.setAttribute('lang', 'ar');
            document.documentElement.setAttribute('dir', 'rtl');
            languageText.textContent = 'EN';
            languageToggle.setAttribute('aria-pressed', 'true');
            updateLanguage('ar');
        } else {
            body.classList.remove('arabic');
            document.documentElement.setAttribute('lang', 'en');
            document.documentElement.setAttribute('dir', 'ltr');
            languageText.textContent = 'AR';
            languageToggle.setAttribute('aria-pressed', 'false');
            updateLanguage('en');
        }
    }
    
    // Apply saved language when page loads
    applyLanguage(currentLanguage);
    
    languageToggle.addEventListener('click', function() {
        if (currentLanguage === 'en') {
            // Switch to Arabic
            currentLanguage = 'ar';
            localStorage.setItem('preferredLanguage', 'ar');
            applyLanguage('ar');
        } else {
            // Switch to English
            currentLanguage = 'en';
            localStorage.setItem('preferredLanguage', 'en');
            applyLanguage('en');
        }
    });
    
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNav = document.getElementById('mobileNav');
    
    mobileMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = mobileNav.classList.contains('active');
        if (isOpen) {
            mobileNav.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
        } else {
            mobileNav.classList.add('active');
            mobileMenu.setAttribute('aria-expanded', 'true');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileNav.classList.contains('active')) {
            if (!mobileNav.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileNav.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Prevent clicks inside mobile nav from closing it
    mobileNav.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Mobile dropdown toggle
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            dropdown.classList.toggle('active');
        });
    });
    
    // Desktop dropdown - prevent navigation on Products link
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            dropdown.classList.toggle('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                mobileNav.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
                
                // Get header height
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 80;
                
                // Calculate scroll position accounting for header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                // Small delay to ensure menu closes before scrolling
                setTimeout(() => {
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });
    
    // Initialize hero carousel
    initializeHeroCarousel();
    
    // Initialize services
    initializeServices();
    
    // Initialize clients
    initializeClients();
    
    // Function to update language across the site
    function updateLanguage(lang) {
        // Update all elements with data-en and data-ar attributes
        document.querySelectorAll('[data-en][data-ar]').forEach(element => {
            // Skip if element is inside a dropdown toggle link (those use spans)
            const parentLink = element.closest('a.dropdown-toggle, a.mobile-dropdown-toggle');
            if (parentLink && element !== parentLink.querySelector('span')) {
                return; // Skip, let the span handle it
            }
            
            // For span elements (like in dropdown toggles or logo), just update text
            if (element.tagName === 'SPAN') {
                if (lang === 'ar') {
                    element.textContent = element.getAttribute('data-ar');
                } else {
                    element.textContent = element.getAttribute('data-en');
                }
            } 
            // For elements with children, preserve them
            else if (element.children.length > 0) {
                const children = Array.from(element.children);
                const childrenHTML = children.map(child => child.outerHTML).join('');
                if (lang === 'ar') {
                    element.innerHTML = element.getAttribute('data-ar') + childrenHTML;
                } else {
                    element.innerHTML = element.getAttribute('data-en') + childrenHTML;
                }
            }
            // Simple text elements
            else {
                if (lang === 'ar') {
                    element.textContent = element.getAttribute('data-ar');
                } else {
                    element.textContent = element.getAttribute('data-en');
                }
            }
        });
        
        // Update select options
        document.querySelectorAll('option[data-en][data-ar]').forEach(option => {
            if (lang === 'ar') {
                option.textContent = option.getAttribute('data-ar');
            } else {
                option.textContent = option.getAttribute('data-en');
            }
        });
        
        // Re-initialize services with correct language
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            initializeServices();
        }
    }
    
    // Initialize hero carousel - Optimized for faster loading
    function initializeHeroCarousel() {
        const carousel = document.getElementById('heroCarousel');
        if (!carousel) return;
        
        // List of known images in the main_photos folder (updated with new pexels images)
        const knownImages = [
            'pexels-cmrcn-29224559.jpg',
            'pexels-cmrcn-29224601.jpg',
            'pexels-cottonbro-5532845.jpg',
            'pexels-criticalimagery-29386091.jpg',
            'pexels-daniel-dan-47825192-7598915.jpg',
            'pexels-francesco-ungaro-17588186.jpg',
            'pexels-jakub-pabis-147246622-15978381.jpg',
            'pexels-jakubzerdzicki-30749458.jpg',
            'pexels-jan-van-der-wolf-11680885-19563057.jpg',
            'pexels-jan-van-der-wolf-11680885-31389461.jpg',
            'pexels-janzakelj-9389356.jpg',
            'pexels-kateryna-babaieva-1423213-2760344.jpg',
            'pexels-minasenishino-28910500.jpg',
            'pexels-nc-farm-bureau-mark-2889347.jpg',
            'pexels-nc-farm-bureau-mark-3869173.jpg',
            'pexels-ono-kosuki-5974053.jpg',
            'pexels-padrinan-16679540.jpg',
            'pexels-paparazziratzfatzzi-8490955.jpg',
            'pexels-pavel-danilyuk-7937300.jpg',
            'pexels-pixabay-159358.jpg',
            'pexels-rolledalloys-metal-supply-8940223.jpg',
            'pexels-ron-lach-8879639.jpg',
            'pexels-sejio402-27354191.jpg',
            'pexels-shvetsa-5953714.jpg',
            'pexels-spacex-586019 (1).jpg',
            'pexels-spacex-586019.jpg',
            'pexels-srattha-nualsate-2695613-13060858.jpg',
            'pexels-tima-miroshnichenko-6790087.jpg'
        ];
        
        // Create image paths and shuffle for random order
        const imagePaths = knownImages.map(filename => `images/main_photos/${filename}`)
            .sort(() => Math.random() - 0.5);
        
        let loadedImages = [];
        let carouselStarted = false;
        let firstImageDisplayed = false;
        
        // Function to start carousel rotation
        function startCarouselRotation() {
            if (carouselStarted || loadedImages.length < 2) return;
            
            carouselStarted = true;
            
            // Clear any existing interval
            if (window.heroCarouselInterval) {
                clearInterval(window.heroCarouselInterval);
            }
            
            let currentIndex = 0;
            const allImages = carousel.querySelectorAll('img');
            
            window.heroCarouselInterval = setInterval(() => {
                if (allImages.length < 2) return;
                
                allImages[currentIndex].classList.remove('active');
                allImages[currentIndex].style.opacity = '0';
                
                currentIndex = (currentIndex + 1) % allImages.length;
                
                allImages[currentIndex].classList.add('active');
                allImages[currentIndex].style.opacity = '1';
            }, 4000);
        }
        
        // Function to add image to carousel as soon as it loads (progressive loading)
        function addImageToCarousel(src) {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Hero image ${loadedImages.length + 1}`;
            img.style.display = 'block';
            img.style.position = 'absolute';
            img.style.top = '0';
            img.style.left = '0';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.objectPosition = 'center';
            img.loading = 'eager'; // Load immediately for hero images
            
            // First image should be visible immediately
            if (!firstImageDisplayed) {
                img.style.opacity = '1';
                img.classList.add('active');
                firstImageDisplayed = true;
            } else {
                img.style.opacity = '0';
            }
            
            carousel.appendChild(img);
            loadedImages.push(src);
            
            // Start rotation as soon as we have 2 images
            if (loadedImages.length === 2 && !carouselStarted) {
                setTimeout(() => {
                    startCarouselRotation();
                }, 1000);
            }
        }
        
        // Preload all images in parallel for faster loading
        imagePaths.forEach((src) => {
            const img = new Image();
            img.onload = function() {
                addImageToCarousel(src);
            };
            img.onerror = function() {
                console.warn('Failed to load:', src);
            };
            // Start loading immediately
            img.src = src;
        });
    }
    
    // Initialize services data
    function initializeServices() {
        const servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid) return;
        
        // Get current language
        const currentLang = body.classList.contains('arabic') ? 'ar' : 'en';
        
        const services = [
            {
                icon: 'fas fa-industry',
                title: 'Industrial Supplies',
                slug: 'industrial-supplies',
                titleAr: 'مستلزمات المصانع',
                description: 'Supply of all industrial safety materials and stainless steel plates for various applications.',
                descriptionAr: 'توريد جميع مواد الأمن الصناعي وألواح الاستانلس ستيل للتطبيقات المختلفة.',
                features: [
                    'Industrial safety equipment',
                    'Stainless steel plates',
                    'Factory supplies',
                    'Safety compliance materials'
                ],
                featuresAr: [
                    'معدات السلامة الصناعية',
                    'ألواح الاستانلس ستيل',
                    'مستلزمات المصانع',
                    'مواد الامتثال للسلامة'
                ]
            },
            {
                icon: 'fas fa-building',
                title: 'Steel Structures',
                slug: 'steel-structures',
                titleAr: 'المنشآت المعدنية',
                description: 'Manufacturing of iron trusses, crystal works, factory fences, barriers, and flooring equipment.',
                descriptionAr: 'تصنيع الجمالونات الحديدية وأعمال الكريتال وأسوار المصانع والحواجز والمعدات الأرضية.',
                features: [
                    'Iron trusses fabrication',
                    'Crystal structural works',
                    'Factory fencing',
                    'Industrial barriers'
                ],
                featuresAr: [
                    'تصنيع الجمالونات الحديدية',
                    'أعمال الكريتال الهيكلية',
                    'أسوار المصانع',
                    'الحواجز الصناعية'
                ]
            },
            {
                icon: 'fas fa-wrench',
                title: 'Welding Services',
                slug: 'welding-services',
                titleAr: 'خدمات اللحام',
                description: 'Professional welding services including argon, copper, stainless steel, and aluminum welding.',
                descriptionAr: 'خدمات لحام احترافية تشمل لحام الأرجون والنحاس والاستانلس ستيل والألومنيوم.',
                features: [
                    'Argon welding',
                    'Stainless steel welding',
                    'Aluminum welding',
                    'Copper welding'
                ],
                featuresAr: [
                    'لحام الأرجون',
                    'لحام الاستانلس ستيل',
                    'لحام الألومنيوم',
                    'لحام النحاس'
                ]
            },
            {
                icon: 'fas fa-utensils',
                title: 'Kitchen Equipment',
                slug: 'kitchen-equipment',
                titleAr: 'تجهيزات المطابخ',
                description: 'Complete kitchen solutions for hotels, tourist villages, and hospitals including cookers, oil pans, and grills.',
                descriptionAr: 'حلول مطابخ كاملة للفنادق والقرى السياحية والمستشفيات بما في ذلك البوتاجازات وقلابات الزيت والشوايات.',
                features: [
                    'Hotel kitchen equipment',
                    'Hospital kitchen solutions',
                    'Commercial cooking appliances',
                    'Custom fabrication'
                ],
                featuresAr: [
                    'تجهيزات مطابخ الفنادق',
                    'حلول مطابخ المستشفيات',
                    'أجهزة الطهي التجارية',
                    'التصنيع حسب الطلب'
                ]
            },
            {
                icon: 'fas fa-pipe',
                title: 'Piping Systems',
                slug: 'piping-systems',
                titleAr: 'أنظمة المواسير',
                description: 'Installation of all types of pipes including fire networks, steam systems, and central air conditioning.',
                descriptionAr: 'تركيب جميع أنواع المواسير بما في ذلك شبكات الحريق وشبكات البخار وشبكات التكييف المركزي.',
                features: [
                    'Fire protection systems',
                    'Steam pipe networks',
                    'HVAC piping',
                    'Industrial pipeline installation'
                ],
                featuresAr: [
                    'أنظمة الحماية من الحرائق',
                    'شبكات أنابيب البخار',
                    'أنابيب التكييف',
                    'تركيب خطوط الأنابيب الصناعية'
                ]
            },
            {
                icon: 'fas fa-oil-can',
                title: 'Tanks & Reservoirs',
                slug: 'tanks-reservoirs',
                titleAr: 'الخزانات والتنكات',
                description: 'Manufacturing of all types of tanks including stainless steel, double jacket, single, and carbon steel tanks.',
                descriptionAr: 'تصنيع جميع أنواع الخزانات بما في ذلك الاستانلس ستيل والدبل جاكيت والسنجل والكربون ستيل.',
                features: [
                    'Stainless steel tanks',
                    'Double jacket tanks',
                    'Heat exchangers',
                    'Custom tank fabrication'
                ],
                featuresAr: [
                    'خزانات الاستانلس ستيل',
                    'خزانات الدبل جاكيت',
                    'المبادلات الحرارية',
                    'تصنيع الخزانات حسب الطلب'
                ]
            },
            {
                icon: 'fas fa-stairs',
                title: 'Ladders',
                slug: 'ladders',
                titleAr: 'السلالم',
                description: 'Manufacturing of industrial ladders, safety ladders, and access equipment for various applications.',
                descriptionAr: 'تصنيع السلالم الصناعية وسلالم السلامة ومعدات الوصول للتطبيقات المختلفة.',
                features: [
                    'Industrial ladders',
                    'Safety ladders',
                    'Access equipment',
                    'Custom ladder fabrication'
                ],
                featuresAr: [
                    'سلالم صناعية',
                    'سلالم السلامة',
                    'معدات الوصول',
                    'تصنيع سلالم حسب الطلب'
                ]
            }
        ];
        
        servicesGrid.innerHTML = '';
        
        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            
            const productPage = `${service.slug}.html`;
            
            serviceCard.innerHTML = `
                <a href="${productPage}" style="text-decoration: none; color: inherit; display: block;">
                    <div class="service-icon">
                        <i class="${service.icon}"></i>
                    </div>
                    <div class="service-content">
                        <h3 class="service-title" data-en="${service.title}" data-ar="${service.titleAr}">${currentLang === 'ar' ? service.titleAr : service.title}</h3>
                        <p class="service-description" data-en="${service.description}" data-ar="${service.descriptionAr}">${currentLang === 'ar' ? service.descriptionAr : service.description}</p>
                        <ul class="service-features">
                            ${service.features.map((feature, index) => 
                                `<li data-en="${feature}" data-ar="${service.featuresAr[index]}">${currentLang === 'ar' ? service.featuresAr[index] : feature}</li>`
                            ).join('')}
                        </ul>
                        <div style="margin-top: 20px;">
                            <span class="btn" style="display: inline-block;" data-en="View Details" data-ar="عرض التفاصيل">${currentLang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                        </div>
                    </div>
                </a>
            `;
            
            servicesGrid.appendChild(serviceCard);
        });
    }
    
    // Initialize clients data - Show only logos, no text placeholders
    function initializeClients() {
        const clientsGrid = document.querySelector('.clients-grid');
        
        // List of all available logo filenames in images/clients folder
        const logoFilenames = [
            'Al-Rabie_Juices-removebg-preview.png',
            'Al-Rowad_Club-removebg-preview.png',
            'Biogeneric_Pharma-removebg-preview.png',
            'CMS-removebg-preview.png',
            'Roshtan-removebg-preview.png',
            'farm_frites-removebg-preview.png',
            'swifx-removebg-preview.png',
            'misr-removebg-preview.png',
            'pladis-removebg-preview.png',
            'mag-removebg-preview.png',
            'sigma_Parma-removebg-preview.png',
            'dohler-removebg-preview.png',
            'galaxy-removebg-preview.png',
            'minapharm-removebg-preview.png',
            'otsuka-removebg-preview.png',
            'SunnyPharma-removebg-preview.png',
            'egyptair-removebg-preview.png',
            'cropped-ssh-logo-234x78-removebg-preview.png',
            '1681990051801-removebg-preview.png',
            'edit-removebg-preview.png',
            'images-removebg-preview.png',
            'logo-removebg-preview.png',
            'Screenshot 2025-11-28 114659.png',
            'Screenshot_2025-11-28_114540-removebg-preview.png'
        ];
        
        clientsGrid.innerHTML = '';
        
        // Display only logos - no text placeholders
        logoFilenames.forEach(logoFilename => {
            const clientLogo = document.createElement('div');
            clientLogo.className = 'client-logo';
            
            // Extract client name from filename for alt text
            const altText = logoFilename.replace('-removebg-preview.png', '').replace('.png', '').replace(/_/g, ' ');
            
            clientLogo.innerHTML = `
                <img src="images/clients/${logoFilename}" alt="${altText}" loading="lazy">
            `;
            
            clientsGrid.appendChild(clientLogo);
        });
    }
    
    // Update copyright year dynamically
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright p');
    copyrightElements.forEach(element => {
        const enText = element.getAttribute('data-en');
        const arText = element.getAttribute('data-ar');
        if (enText && enText.includes('2023')) {
            const updatedEnText = enText.replace('2023', currentYear.toString());
            const updatedArText = arText ? arText.replace('2023', currentYear.toString()) : '';
            element.setAttribute('data-en', updatedEnText);
            if (updatedArText) {
                element.setAttribute('data-ar', updatedArText);
            }
            // Update displayed text based on current language
            const isArabic = body.classList.contains('arabic');
            element.textContent = isArabic && updatedArText ? updatedArText : updatedEnText;
        }
    });
});