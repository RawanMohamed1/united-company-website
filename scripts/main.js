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
    
    // Initialize hero carousel
    function initializeHeroCarousel() {
        const carousel = document.getElementById('heroCarousel');
        if (!carousel) return;
        
        // List of actual image filenames from main_photos folder
        const imageFiles = [
            '103719502_3081497118624689_3603711865706086797_n.jpg',
            '103745222_3081497288624672_7035806819195694599_n.jpg',
            '103894369_3081497221958012_7932378924515826907_n.jpg',
            '105281363_3081497385291329_3771730080195603585_n.jpg',
            '123625825_3481855215255542_6815243479254611094_n.1.jpg',
            '123625825_3481855215255542_6815243479254611094_n.jpg',
            '475798136_1137161264588104_2650817527400904564_n.jpg',
            '475804612_1135437218093842_7865573575243314400_n.jpg',
            '475805806_1135437364760494_6641926164117011047_n.jpg',
            '475812738_1135437401427157_5577005070560763215_n.jpg',
            '475828314_1135437248093839_7293170481620386172_n.jpg',
            '475839895_1135437318093832_5145654516400974814_n.jpg',
            '475858266_1135437201427177_6047670304664078730_n.jpg',
            '475901424_1137161314588099_3126045098515271159_n.jpg',
            '475916290_1138509987786565_6829998509998780717_n.jpg',
            '476019066_1137159467921617_275230086562986074_n.jpg',
            '476068831_1138512251119672_5859460203652766652_n.jpg',
            '476072042_1138512124453018_8226822072851904348_n.jpg',
            '476085458_1138503981120499_2886521775950702721_n.jpg',
            '476097701_1138512214453009_7770521575514525378_n.jpg',
            '476103822_1138512121119685_4559982511070173793_n.jpg',
            '476118494_1137433217894242_1622979567234431925_n.jpg',
            '476119244_1138503734453857_1669537233083587622_n.jpg',
            '476120829_1138495144454716_9212981652004308870_n.jpg',
            '476149026_1138512117786352_8331355173519318856_n.jpg',
            '476152382_1138512464452984_4503259029474491899_n.jpg',
            '476161211_1138495181121379_2278124723005595798_n.jpg',
            '476161731_1138512127786351_874705333899691903_n.jpg',
            '476162520_1138512207786343_3149034250781175895_n.jpg',
            '476162984_1138503687787195_6873427970887675651_n.jpg',
            '476163311_1138512254453005_5788602972536324725_n.jpg',
            '476228382_1137432981227599_6459181930824858040_n.jpg',
            '476237021_1137159454588285_877482483283182565_n.jpg',
            '476299873_1138495151121382_4225987171365731772_n.jpg',
            '476304158_1137159514588279_3612043831905186184_n.jpg',
            '476381615_1138509924453238_7848680079408480736_n.jpg',
            '476451749_1137159397921624_1773532837312324372_n.jpg',
            '476457626_1138512247786339_827351852638623411_n.jpg',
            '476458729_1138512137786350_1834474881947303879_n.jpg',
            '476461495_1137161377921426_5561620932890031288_n.jpg',
            '476470208_1138512107786353_8097893643905629541_n.jpg',
            '476540471_1138495284454702_4722386782943744686_n.jpg',
            '476623838_1138512131119684_6114283257017544097_n.jpg',
            '476649774_1138512237786340_1758289328847987193_n.jpg',
            '476835532_1138509977786566_415195104368940796_n.jpg',
            '476856895_1138494991121398_1072254597709369734_n.jpg',
            '476950975_1142737814030449_7893447983518450910_n.jpg',
            '477152370_1142737907363773_550864213481970661_n.jpg',
            '477443734_1142737904030440_97039033531424444_n.jpg',
            '477451596_1142737927363771_3434781278881443299_n.jpg',
            '499152214_17969472269898695_6424149402633683045_n.webp',
            '499257329_17969472278898695_4028129913975068532_n.webp',
            '499281553_17969472251898695_8081734997012600140_n.webp',
            '499752504_17969472260898695_1601571965533513383_n.webp',
            '504426775_1232729461697950_2975734782530116927_n.jpg',
            '505193655_1232729558364607_7997830728427661788_n.jpg',
            '505438350_1232729631697933_768686740700242000_n.jpg',
            '505727047_1232729601697936_4317062176054773091_n.jpg',
            '506442991_1232729511697945_2425617382047921255_n.jpg',
            '506645487_1232729671697929_6370436725368953157_n.jpg',
            '508800594_10077742972333367_5542761228057353097_n.jpg',
            '508802889_10077742585666739_3059726179353692373_n.jpg',
            '508827378_10077742849000046_6417916862971530438_n.jpg',
            '509002554_10077742582333406_2980570786292986571_n.jpg',
            '509173080_10077742842333380_5788896570931383481_n.jpg',
            '509262676_10077742939000037_3763371782563141400_n.jpg',
            '509327375_10077745798999751_3578788545713950102_n.jpg',
            '509361152_10077742859000045_332607664025395929_n.jpg',
            '509361980_10077742952333369_5024258132364654897_n.jpg',
            '509364565_10077742915666706_7447004516805589231_n.jpg',
            '509651270_10077742862333378_6423367042914255189_n.jpg',
            '509712012_10077739125667085_39491471648734798_n.jpg',
            '509724697_10077742945666703_6461327883166863929_n.jpg',
            '510041251_10077742572333407_4750938384932535846_n.jpg',
            '510240329_10077738869000444_1323543498649003680_n.jpg',
            '516503346_1248297376807825_6386015529047030179_n.jpg',
            '516772781_1248297423474487_2418659423958356863_n.jpg',
            '93174141_2921360397971696_8734997022228086784_n.jpg',
            '93501624_2921360231305046_6598421070741504000_n.jpg',
            '93563636_2921360304638372_3570566644293959680_n.jpg',
            '93860344_2921360541305015_6760652259073196032_n.jpg',
            '94262713_2921360467971689_6113956529348542464_n.jpg'
        ];
        
        // Create image paths
        const imagePaths = imageFiles.map(filename => `images/main_photos/${filename}`);
        
        let loadedImages = [];
        let loadingIndex = 0;
        
        function loadNextImage() {
            if (loadingIndex >= imagePaths.length) {
                // All images checked, create carousel
                if (loadedImages.length > 0) {
                    createCarousel(loadedImages);
                } else {
                    console.error('No images could be loaded');
                }
                return;
            }
            
            const src = imagePaths[loadingIndex];
            loadingIndex++;
            
            const img = new Image();
            img.onload = function() {
                loadedImages.push(src);
                console.log('✓ Loaded:', src, 'Total:', loadedImages.length);
                
                // Add image to carousel without recreating everything
                const newImg = document.createElement('img');
                newImg.src = src;
                newImg.alt = `Hero image ${loadedImages.length}`;
                newImg.style.display = 'block';
                newImg.style.position = 'absolute';
                newImg.style.top = '0';
                newImg.style.left = '0';
                newImg.style.width = '100%';
                newImg.style.height = '100%';
                newImg.style.objectFit = 'contain';
                newImg.style.objectPosition = 'center';
                if (loadedImages.length === 1) {
                    newImg.style.opacity = '1';
                    newImg.classList.add('active');
                } else {
                    newImg.style.opacity = '0';
                }
                carousel.appendChild(newImg);
                
                // Start rotation when we have 2+ images and rotation isn't already running
                if (loadedImages.length === 2 && !window.heroCarouselInterval) {
                    setTimeout(() => {
                        let currentIndex = 0;
                        console.log('Starting carousel rotation');
                        
                        window.heroCarouselInterval = setInterval(() => {
                            const allImages = carousel.querySelectorAll('img');
                            if (allImages.length === 0 || allImages.length === 1) {
                                return;
                            }
                            
                            // Remove active class from current image
                            allImages[currentIndex].classList.remove('active');
                            allImages[currentIndex].style.opacity = '0';
                            
                            // Move to next image
                            currentIndex = (currentIndex + 1) % allImages.length;
                            
                            // Add active class to new image
                            allImages[currentIndex].classList.add('active');
                            allImages[currentIndex].style.opacity = '1';
                            
                            console.log('Rotating to image', currentIndex + 1, 'of', allImages.length);
                        }, 4000); // Change image every 4 seconds
                    }, 2000);
                }
                
                // Continue loading
                loadNextImage();
            };
            img.onerror = function() {
                console.warn('Failed to load:', src);
                // Continue with next image
                loadNextImage();
            };
            img.src = src;
        }
        
        function createCarousel(imageList) {
            if (imageList.length === 0) {
                console.error('No images to display');
                return;
            }
            
            console.log('Creating carousel with', imageList.length, 'images');
            
            // Clear existing interval
            if (window.heroCarouselInterval) {
                clearInterval(window.heroCarouselInterval);
                window.heroCarouselInterval = null;
            }
            
            // Always recreate carousel with all loaded images
            carousel.innerHTML = '';
            imageList.forEach((src, index) => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = `Hero image ${index + 1}`;
                img.loading = 'eager';
                img.style.display = 'block';
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                img.style.objectPosition = 'center';
                if (index === 0) {
                    img.style.opacity = '1';
                    img.classList.add('active');
                } else {
                    img.style.opacity = '0';
                }
                carousel.appendChild(img);
            });
            
            // Auto-rotate images (only if more than one image)
            if (imageList.length > 1) {
                // Clear any existing interval
                if (window.heroCarouselInterval) {
                    clearInterval(window.heroCarouselInterval);
                    window.heroCarouselInterval = null;
                }
                
                let currentIndex = 0;
                
                // Start rotation immediately
                function startRotation() {
                    const allImages = carousel.querySelectorAll('img');
                    if (allImages.length === 0 || allImages.length === 1) {
                        console.log('Not enough images to rotate');
                        return;
                    }
                    
                    console.log('Starting rotation with', allImages.length, 'images');
                    
                    window.heroCarouselInterval = setInterval(() => {
                        const images = carousel.querySelectorAll('img');
                        if (images.length === 0 || images.length === 1) {
                            clearInterval(window.heroCarouselInterval);
                            return;
                        }
                        
                        // Remove active class from current image
                        images[currentIndex].classList.remove('active');
                        images[currentIndex].style.opacity = '0';
                        
                        // Move to next image
                        currentIndex = (currentIndex + 1) % images.length;
                        
                        // Add active class to new image
                        images[currentIndex].classList.add('active');
                        images[currentIndex].style.opacity = '1';
                        
                        console.log('Rotating to image', currentIndex + 1, 'of', images.length);
                    }, 4000); // Change image every 4 seconds
                }
                
                // Start rotation after a short delay
                setTimeout(startRotation, 2000);
            }
        }
        
        // Start loading images
        loadNextImage();
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
    
    // Initialize clients data
    function initializeClients() {
        const clientsGrid = document.querySelector('.clients-grid');
        
        const clients = [
            'Sieg Pharma',
            'CMS Systems',
            'Pharma Frites',
            'Biogeneric Pharma',
            'Al-Rowad Club',
            'Roshena Food Industries',
            'Al-Rabie Juices',
            'Presidency of the Republic',
            'High Foods',
            'Swifex',
            'UP Gas',
            'Al-Rowad Company',
            'Lourbal Cosmetics',
            'Dahl Natural Juice',
            'Misr Atsuka',
            'Al-Andalus Pharma',
            'Blue Pharma',
            'Cairo International Airport',
            'Cadbury Food Industries',
            'Al-Maghrabi Farms',
            'Marbout Sharm El-Sheikh Hotel',
            'Daber Amla Oils',
            'Abdel Razek Farms',
            'Dioravit Sanitary Tools',
            'Every Medical Pharma',
            'Ibdco Pharma',
            'Sharm El-Sheikh International Airport',
            'Dina Farms',
            'Stella Makadi Hurghada Hotel',
            'Kentai Engineers Restaurant',
            'Misr Solar Energy'
        ];
        
        clientsGrid.innerHTML = '';
        
        clients.forEach(client => {
            const clientLogo = document.createElement('div');
            clientLogo.className = 'client-logo';
            
            clientLogo.innerHTML = `
                <div class="client-placeholder">${client}</div>
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