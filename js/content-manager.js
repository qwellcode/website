/* -------------------------------------------

QCode Content Manager
Loads and manages content from content.json

------------------------------------------- */

(function ($) {
    "use strict";

    window.QCodeContent = {
        data: null,
        loaded: false,
        currentLanguage: null,

        /**
         * Get language from URL parameter
         */
        getLanguageFromURL: function() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('lang');
        },

        /**
         * Set URL parameter for language
         */
        setURLLanguage: function(langCode) {
            const url = new URL(window.location);
            url.searchParams.set('lang', langCode);
            window.history.pushState({}, '', url);
        },

        /**
         * Load content from JSON file
         */
        load: function (callback) {
            $.getJSON('content.json', function (data) {
                window.QCodeContent.data = data;
                window.QCodeContent.loaded = true;

                // Priority: URL parameter > localStorage > default
                const urlLang = window.QCodeContent.getLanguageFromURL();
                const savedLang = localStorage.getItem('qcode_language');

                if (urlLang && data.translations[urlLang]) {
                    window.QCodeContent.currentLanguage = urlLang;
                    localStorage.setItem('qcode_language', urlLang);
                    console.log('Language loaded from URL:', urlLang);
                } else if (savedLang && data.translations[savedLang]) {
                    window.QCodeContent.currentLanguage = savedLang;
                    console.log('Language loaded from localStorage:', savedLang);
                } else {
                    window.QCodeContent.currentLanguage = data.config.defaultLanguage;
                    console.log('Language set to default:', data.config.defaultLanguage);
                }

                console.log('Content loaded. Current language:', window.QCodeContent.currentLanguage);

                if (callback) callback(data);
            }).fail(function (jqxhr, textStatus, error) {
                console.error('Failed to load content.json:', error);
            });
        },

        /**
         * Get available languages
         */
        getLanguages: function() {
            if (!this.loaded || !this.data) return [];
            return this.data.config.languages;
        },

        /**
         * Set current language
         */
        setLanguage: function(langCode) {
            if (!this.data || !this.data.translations[langCode]) {
                console.error('Language not found:', langCode);
                return false;
            }
            this.currentLanguage = langCode;
            localStorage.setItem('qcode_language', langCode);
            return true;
        },

        /**
         * Get current translation data
         */
        getTranslation: function() {
            if (!this.loaded || !this.data || !this.currentLanguage) return null;
            return this.data.translations[this.currentLanguage];
        },

        /**
         * Merge project translation with shared assets
         */
        mergeProjectAssets: function(project) {
            if (!this.data || !this.data.projectAssets || !project.id) return project;
            const assets = this.data.projectAssets[project.id];
            if (!assets) return project;
            return { ...project, ...assets };
        },

        /**
         * Get all projects
         */
        getProjects: function (featured = null) {
            const translation = this.getTranslation();
            if (!translation || !translation.projects) return [];
            let projects = translation.projects.map(p => this.mergeProjectAssets(p));
            if (featured !== null) {
                projects = projects.filter(p => p.featured === featured);
            }
            return projects;
        },

        /**
         * Get single project by ID or slug
         */
        getProject: function (identifier) {
            const translation = this.getTranslation();
            if (!translation || !translation.projects) return null;
            const project = translation.projects.find(p => p.id === identifier || p.slug === identifier);
            return project ? this.mergeProjectAssets(project) : null;
        },

        /**
         * Get team members
         */
        getTeam: function (featured = null) {
            const translation = this.getTranslation();
            if (!translation || !translation.team) return [];
            let team = translation.team;
            if (featured !== null) {
                team = team.filter(t => t.featured === featured);
            }
            return team;
        },

        /**
         * Get single team member
         */
        getTeamMember: function (id) {
            const translation = this.getTranslation();
            if (!translation || !translation.team) return null;
            return translation.team.find(t => t.id === id);
        },

        /**
         * Get services
         */
        getServices: function () {
            const translation = this.getTranslation();
            if (!translation || !translation.services) return [];
            return translation.services;
        },

        /**
         * Get testimonials
         */
        getTestimonials: function () {
            const translation = this.getTranslation();
            if (!translation || !translation.testimonials) return [];
            return translation.testimonials;
        },

        /**
         * Get blog posts
         */
        getBlogPosts: function (featured = null) {
            const translation = this.getTranslation();
            if (!translation || !translation.blog) return [];
            let posts = translation.blog;
            if (featured !== null) {
                posts = posts.filter(p => p.featured === featured);
            }
            return posts;
        },

        /**
         * Get site info
         */
        getSiteInfo: function () {
            const translation = this.getTranslation();
            if (!translation || !translation.site) return {};
            return translation.site;
        },

        /**
         * Get partners
         */
        getPartners: function() {
            const translation = this.getTranslation();
            if (!translation || !translation.partners) return [];
            return translation.partners;
        },

        /**
         * Get imprint data
         */
        getImprint: function() {
            const translation = this.getTranslation();
            if (!translation || !translation.imprint) return null;
            return translation.imprint;
        },

        /**
         * Render featured projects in portfolio section
         */
        renderFeaturedProjects: function (selector) {
            const projects = this.getProjects(true);
            const container = $(selector);

            if (!container.length) {
                console.warn('Portfolio container not found:', selector);
                return;
            }

            container.empty();

            console.log('Rendering', projects.length, 'featured projects');

            projects.forEach((project, index) => {
                const html = `
                    <div class="mil-portfolio-item-inline mil-up mil-more" data-project-id="${project.id}">
                        <div class="mil-cover-frame">
                            <img src="${project.thumbnail}" alt="${project.title}">
                        </div>
                        <div class="mil-descr">
                            <h4 class="mil-mb-5">${project.title}</h4>
                            <p class="mil-text-sm mil-light-soft">${project.category}</p>
                        </div>
                    </div>
                `;
                container.append(html);
            });
        },

        /**
         * Render single project details in modal
         */
        renderProjectDetails: function(projectId) {
            const project = this.getProject(projectId);
            if (!project) {
                console.error('Project not found:', projectId);
                return;
            }

            const container = $('#project-details-content');
            if (!container.length) {
                console.error('Project details container not found');
                return;
            }

            // Build images gallery HTML
            let imagesHTML = '';
            if (project.images && project.images.length > 0) {
                imagesHTML = `
                    <div class="mil-mb-60">
                        <div class="row">
                            ${project.images.map((img, index) => `
                                <div class="col-lg-${index === 0 ? '12' : '6'} mil-mb-30">
                                    <div class="mil-image-frame mil-${index === 0 ? 'fw' : 'horizontal'}">
                                        <a href="${img}" data-fancybox="project-gallery">
                                            <img src="${img}" alt="${project.title} - Image ${index + 1}">
                                        </a>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Build technologies HTML
            let techHTML = '';
            if (project.technologies && project.technologies.length > 0) {
                techHTML = `
                    <div class="mil-mb-30">
                        <h5 class="mil-light mil-mb-20">Technologies</h5>
                        <div class="mil-labels">
                            ${project.technologies.map(tech => `
                                <span class="mil-label mil-upper mil-accent">${tech}</span>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Build highlights HTML
            let highlightsHTML = '';
            if (project.highlights && project.highlights.length > 0) {
                highlightsHTML = `
                    <div class="mil-mb-30">
                        <h5 class="mil-light mil-mb-20">Key Features</h5>
                        <ul class="mil-service-list mil-light">
                            ${project.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            // Build project info HTML
            let projectInfoHTML = '';
            if (project.year || project.client || project.services) {
                projectInfoHTML = `
                    <div class="mil-mb-60">
                        <div class="row">
                            ${project.year ? `
                                <div class="col-md-4 mil-mb-30">
                                    <h6 class="mil-muted mil-mb-10">Year</h6>
                                    <p class="mil-light-soft">${project.year}</p>
                                </div>
                            ` : ''}
                            ${project.client ? `
                                <div class="col-md-4 mil-mb-30">
                                    <h6 class="mil-muted mil-mb-10">Client</h6>
                                    <p class="mil-light-soft">${project.client}</p>
                                </div>
                            ` : ''}
                            ${project.services && project.services.length > 0 ? `
                                <div class="col-md-4 mil-mb-30">
                                    <h6 class="mil-muted mil-mb-10">Services</h6>
                                    <p class="mil-light-soft">${project.services.join(', ')}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }

            // Assemble the complete HTML
            const html = `
                <h2 class="mil-light mil-mb-30">${project.title}</h2>
                <p class="mil-accent mil-upper mil-mb-15">${project.category}</p>
                <p class="mil-light-soft mil-text-lg mil-mb-60">${project.shortDescription || project.description}</p>

                ${imagesHTML}

                ${project.longDescription ? `
                    <div class="mil-mb-60">
                        <h5 class="mil-light mil-mb-20">About This Project</h5>
                        <p class="mil-light-soft" style="white-space: pre-line;">${project.longDescription}</p>
                    </div>
                ` : ''}

                ${techHTML}
                ${highlightsHTML}
                ${projectInfoHTML}
            `;

            container.html(html);

            // Reinitialize Fancybox for the gallery
            if (typeof $.fancybox !== 'undefined') {
                $('[data-fancybox="project-gallery"]').fancybox({
                    buttons: ["slideShow", "zoom", "fullScreen", "close"],
                    loop: false,
                    protect: true
                });
            }

            console.log('Project details rendered:', project.title);
        },

        /**
         * Render team members
         */
        renderTeam: function (selector, featured = true) {
            const team = this.getTeam(featured);
            const container = $(selector);
            container.empty();

            team.forEach((member, index) => {
                const offsetClass = index % 2 === 1 ? 'mil-offset-card' : '';
                const social = [];
                if (member.social.linkedin) social.push(`<a href="${member.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>`);
                if (member.social.twitter) social.push(`<a href="${member.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>`);
                if (member.social.github) social.push(`<a href="${member.social.github}" target="_blank"><i class="fab fa-github"></i></a>`);
                if (member.social.dribbble) social.push(`<a href="${member.social.dribbble}" target="_blank"><i class="fab fa-dribbble"></i></a>`);

                const html = `
                    <div class="col-lg-3 col-md-6">
                        <div class="mil-team-card ${offsetClass} mil-up mil-mb-30">
                            <div class="mil-cover-frame">
                                <img src="${member.image}" alt="${member.name}">
                            </div>
                            <div class="mil-description">
                                <div class="mil-secrc-text">
                                    <h5 class="mil-mb-5"><a href="#.">${member.name}</a></h5>
                                    <p class="mil-link mil-light-soft mil-mb-10">${member.role}</p>
                                    <p class="mil-text-sm mil-mb-15">${member.bio}</p>
                                    ${social.length > 0 ? `
                                    <ul class="mil-social-icons mil-center">
                                        ${social.map(s => `<li>${s}</li>`).join('')}
                                    </ul>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.append(html);
            });
        },

        /**
         * Render testimonials for review slider
         */
        renderTestimonials: function () {
            const testimonials = this.getTestimonials();
            const swiperWrapper = $('.mil-reviews-slider .swiper-wrapper');
            const pagination = $('.mil-revi-pagination');

            if (!swiperWrapper.length) {
                console.warn('Reviews slider container not found');
                return;
            }

            swiperWrapper.empty();

            console.log('Rendering', testimonials.length, 'testimonials');

            testimonials.forEach((testimonial, index) => {
                const slideHtml = `
                    <div class="swiper-slide">
                        <div class="mil-review-frame mil-center" data-swiper-parallax="-200" data-swiper-parallax-opacity="0">
                            <h5 class="mil-up mil-mb-10">${testimonial.author}</h5>
                            <p class="mil-mb-5 mil-upper mil-up mil-mb-30">${testimonial.role}</p>
                            <p class="mil-text-xl mil-up">${testimonial.text}</p>
                        </div>
                    </div>
                `;
                swiperWrapper.append(slideHtml);
            });

            console.log('Testimonials rendered successfully');

            // Reinitialize the Swiper slider after rendering
            this.initReviewsSlider();
        },

        /**
         * Initialize or reinitialize the reviews slider
         */
        initReviewsSlider: function() {
            const testimonials = this.getTestimonials();

            // Destroy existing slider if it exists
            if (window.reviewsSwiper) {
                window.reviewsSwiper.destroy(true, true);
            }

            // Create pagination menu based on number of testimonials
            const menu = testimonials.map((t, i) => `<div class="mil-custom-dot mil-slide-${i + 1}"></div>`);

            // Initialize new Swiper instance
            window.reviewsSwiper = new Swiper('.mil-reviews-slider', {
                pagination: {
                    el: '.mil-revi-pagination',
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + '">' + (menu[index]) + '</span>';
                    },
                },
                speed: 800,
                effect: 'fade',
                parallax: true,
                navigation: {
                    nextEl: '.mil-revi-next',
                    prevEl: '.mil-revi-prev',
                },
            });

            console.log('Reviews slider initialized with', testimonials.length, 'testimonials');
        },

        /**
         * Update reviews section title
         */
        updateReviewsSection: function() {
            const translation = this.getTranslation();
            if (!translation || !translation.site || !translation.site.sections || !translation.site.sections.reviews) {
                console.warn('Reviews section data not found');
                return;
            }

            // Update reviews section title
            const reviewsTitle = $('#reviews-title');
            if (reviewsTitle.length && translation.site.sections.reviews.title) {
                reviewsTitle.html(translation.site.sections.reviews.title);
                console.log('Reviews section title updated');
            }
        },

        /**
         * Render services
         */
        renderServices: function (selector) {
            const services = this.getServices();
            const container = $(selector);

            if (!container.length) {
                console.warn('Services container not found:', selector);
                return;
            }

            container.empty();
            console.log('Rendering', services.length, 'services');

            services.forEach((service) => {
                const html = `
                    <div class="col-lg-4" data-rendered="true">
                        <div class="mil-service-card-lg mil-mb-60">
                            <h4 class="mil-muted mil-up mil-mb-30">${service.title}</h4>
                            <p class="mil-descr mil-light-soft mil-up mil-mb-30">${service.description}</p>
                            <ul class="mil-service-list mil-light mil-mb-30">
                                ${service.highlights.map(h => `<li class="mil-up">${h}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
                container.append(html);
            });
        },

        /**
         * Render blog posts
         */
        renderBlogPosts: function (selector, featured = true) {
            const posts = this.getBlogPosts(featured);
            const container = $(selector);
            container.empty();

            posts.forEach((post) => {
                const html = `
                    <div class="col-lg-6">
                        <a href="publication.html" class="mil-blog-card mil-mb-60">
                            <div class="mil-cover-frame mil-up">
                                <img src="${post.thumbnail}" alt="${post.title}">
                            </div>
                            <div class="mil-post-descr">
                                <div class="mil-labels mil-up mil-mb-30">
                                    <div class="mil-label mil-upper mil-accent">${post.category}</div>
                                    <div class="mil-label mil-upper">${this.formatDate(post.date)}</div>
                                </div>
                                <h4 class="mil-up mil-mb-30">${post.title}</h4>
                                <p class="mil-post-text mil-up mil-mb-30">${post.excerpt}</p>
                                <div class="mil-link mil-dark mil-arrow-place mil-up">
                                    <span>Read more</span>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                container.append(html);
            });
        },

        /**
         * Update social links
         */
        updateSocialLinks: function () {
            const site = this.getSiteInfo();
            if (!site.social) return;

            $('.mil-social-icons').each(function () {
                const container = $(this);
                const isDark = container.hasClass('mil-dark');
                container.empty();

                site.social.forEach(social => {
                    const html = `
                        <li><a href="${social.url}" target="_blank" rel="noopener noreferrer" data-no-swup class="social-icon"><i class="${social.icon}"></i></a></li>
                    `;
                    container.append(html);
                });
            });

            console.log('Social links updated');
        },

        /**
         * Update hero section
         */
        updateHeroSection: function() {
            const site = this.getSiteInfo();
            if (!site || !site.hero) {
                console.warn('Site or hero data not found');
                return;
            }

            // Update hero headline (h1 in banner)
            const heroHeadline = $('.mil-banner h1');
            if (heroHeadline.length) {
                heroHeadline.html(site.hero.headline);
                console.log('Hero headline updated');
            }

            // Update hero description (paragraph in banner)
            const heroDesc = $('.mil-banner-content p.mil-light-soft').first();
            if (heroDesc.length && site.hero.description) {
                heroDesc.text(site.hero.description);
                console.log('Hero description updated');
            }

            // Update primary CTA button
            if (site.hero.primaryCTA) {
                const primaryBtn = $('.mil-banner .mil-button').first();
                if (primaryBtn.length) {
                    primaryBtn.find('span').text(site.hero.primaryCTA.text);
                    primaryBtn.attr('href', site.hero.primaryCTA.link);
                }
            }

            console.log('Hero section updated for language:', this.currentLanguage);
        },

        /**
         * Update about section
         */
        updateAboutSection: function() {
            const site = this.getSiteInfo();
            if (!site || !site.about) {
                console.warn('About section data not found');
                return;
            }

            // Update about section title
            const aboutTitle = $('#about h2').first();
            if (aboutTitle.length && site.about.sectionTitle) {
                aboutTitle.html(site.about.sectionTitle);
            }

            // Update about description paragraphs
            if (site.about.description && Array.isArray(site.about.description)) {
                const aboutParagraphs = $('#about .mil-mb-90 p');
                site.about.description.forEach((text, index) => {
                    if (aboutParagraphs.eq(index).length) {
                        aboutParagraphs.eq(index).html(text);
                    }
                });
            }

            // Update quote
            if (site.about.quote && site.about.quote.text) {
                const quoteText = $('#about .mil-quote');
                if (quoteText.length) {
                    quoteText.html(site.about.quote.text);
                }
            }

            console.log('About section updated for language:', this.currentLanguage);
        },

        /**
         * Update navigation labels
         */
        updateNavigation: function() {
            const site = this.getSiteInfo();
            if (!site || !site.navigation) {
                console.warn('Navigation data not found');
                return;
            }

            const nav = site.navigation;

            // Update main menu items
            if (nav.about) $('#nav-about').text(nav.about);
            if (nav.services) $('#nav-services').text(nav.services);
            if (nav.portfolio) $('#nav-portfolio').text(nav.portfolio);

            // Update menu frame labels
            if (nav.contact) $('#menu-contact, #footer-contact').text(nav.contact);
            if (nav.follow) $('#menu-follow').text(nav.follow);
            if (nav.legal) $('#footer-legal').text(nav.legal);

            // Update back to top text
            if (nav.backToTop) $('#back-to-top-text').text(nav.backToTop);

            // Update scroll down text
            if (nav.scrollDown) {
                const scrollText = nav.scrollDown + ' - ' + nav.scrollDown + ' - ';
                $('#scroll-down-text').text(scrollText);
            }

            console.log('Navigation updated for language:', this.currentLanguage);
        },

        /**
         * Update section titles and texts
         */
        updateSectionTexts: function() {
            const site = this.getSiteInfo();
            if (!site || !site.sections) {
                console.warn('Sections data not found');
                return;
            }

            // Update services section
            if (site.sections.services) {
                if (site.sections.services.suptitle) {
                    $('#services-suptitle').html(site.sections.services.suptitle);
                }
                if (site.sections.services.title) {
                    $('#services-title').html(site.sections.services.title);
                }
            }

            // Update portfolio section
            if (site.sections.portfolio) {
                if (site.sections.portfolio.title) {
                    $('#portfolio-title').html(site.sections.portfolio.title);
                }
                if (site.sections.portfolio.footer && site.sections.portfolio.footer.text) {
                    $('#portfolio-footer-text').html(site.sections.portfolio.footer.text);
                }
            }

            console.log('Section texts updated for language:', this.currentLanguage);
        },

        /**
         * Update footer section
         */
        updateFooter: function() {
            const site = this.getSiteInfo();
            if (!site || !site.footer) {
                console.warn('Footer data not found');
                return;
            }

            // Update footer tagline
            if (site.footer.tagline) {
                const footerTagline = $('#footer-tagline');
                if (footerTagline.length) {
                    footerTagline.html(site.footer.tagline);
                }
            }

            // Update footer copyright
            if (site.footer.copyright) {
                const footerCopyright = $('#footer-copyright');
                if (footerCopyright.length) {
                    footerCopyright.html(site.footer.copyright);
                }
            }

            console.log('Footer updated for language:', this.currentLanguage);
        },

        /**
         * Update contact information
         */
        updateContactInfo: function () {
            const site = this.getSiteInfo();
            if (!site.contact) return;

            // Update email
            if (site.contact.email) {
                $('a[href^="mailto:"]').attr('href', 'mailto:' + site.contact.email);
                $('.mil-contact-email').text(site.contact.email);
            }

            // Update locations
            if (site.contact.locations && site.contact.locations.length > 0) {
                site.contact.locations.forEach((location, index) => {
                    const selector = index === 0 ? '.mil-contact-location-1' : '.mil-contact-location-2';
                    $(selector).find('h6').text(location.name);
                    $(selector).find('p').html(`${location.address} <span class="mil-no-wrap">${location.phone}</span>`);
                });
            }

            console.log('Contact info updated');
        },

        /**
         * Format date
         */
        formatDate: function (dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        },

        /**
         * Render partners
         */
        renderPartners: function () {
            const partnersList = this.getPartners();
            if (!partnersList || partnersList.length === 0) return;

            const container = $('.mil-infinite-show .swiper-wrapper');
            if (!container.length) return;

            container.empty();

            // Duplicate partners for infinite scroll effect
            const partners = [...partnersList, ...partnersList];

            partners.forEach(partner => {
                const html = `
                    <div class="swiper-slide">
                        <a href="${partner.url}" class="mil-partner-frame" style="width: ${partner.width};">
                            <img src="${partner.logo}" alt="${partner.name}">
                        </a>
                    </div>
                `;
                container.append(html);
            });
        },

        /**
         * Render language switcher - Simple one-click toggle between EN/DEU
         */
        renderLanguageSwitcher: function(selector) {
            const languages = this.getLanguages();
            const container = $(selector);
            if (!container.length || !languages.length) return;

            container.empty();

            // Find current and other language
            const currentLang = languages.find(l => l.code === this.currentLanguage);
            const otherLang = languages.find(l => l.code !== this.currentLanguage);

            if (!currentLang || !otherLang) {
                console.warn('Language configuration error');
                return;
            }

            // Get labels (use label field, fallback to uppercase code)
            const currentLabel = currentLang.label || currentLang.code.toUpperCase();
            const otherLabel = otherLang.label || otherLang.code.toUpperCase();

            // Create toggle button showing "Current | Other" with simple text labels
            const html = `
                <button class="mil-lang-btn" data-lang="${currentLang.code}" disabled>
                    <span class="mil-lang-label">${currentLabel}</span>
                </button>
                <span class="mil-lang-divider">|</span>
                <button class="mil-lang-btn mil-lang-inactive" data-lang="${otherLang.code}"
                        title="Switch to ${otherLang.name}">
                    <span class="mil-lang-label">${otherLabel}</span>
                </button>
            `;
            container.append(html);

            // Add click handler with proper context binding
            const self = this;
            container.find('.mil-lang-btn:not([disabled])').off('click').on('click', function(e) {
                e.preventDefault();
                const langCode = $(this).data('lang');
                console.log('Language toggle clicked, switching from', self.currentLanguage, 'to', langCode);
                self.switchLanguage(langCode);
            });

            console.log('Language switcher rendered:', currentLabel, '|', otherLabel);
        },

        /**
         * Switch language and reload content
         */
        switchLanguage: function(langCode) {
            console.log('Switching language to:', langCode);

            if (this.setLanguage(langCode)) {
                // Update URL parameter
                this.setURLLanguage(langCode);

                // Reload all content (this will also re-render the language switcher)
                this.initAll();

                // Trigger custom event for language change
                $(document).trigger('languageChanged', [langCode]);

                // Refresh ScrollTrigger after content change
                if (typeof ScrollTrigger !== 'undefined') {
                    setTimeout(function() {
                        ScrollTrigger.refresh();
                    }, 100);
                }

                console.log('Language switched successfully to:', langCode);
            }
        },

        /**
         * Initialize all content on page
         */
        initAll: function () {
            if (!this.loaded) {
                console.warn('Content not loaded yet');
                return;
            }

            console.log('Initializing all content for language:', this.currentLanguage);

            // Update navigation labels
            this.updateNavigation();

            // Update section texts
            this.updateSectionTexts();

            // Update hero section
            this.updateHeroSection();

            // Update about section
            this.updateAboutSection();

            // Update footer
            this.updateFooter();

            // Render language switcher
            if ($('.mil-language-switcher').length) {
                this.renderLanguageSwitcher('.mil-language-switcher');
            }

            // Render portfolio items
            if ($('.mil-portfolio-grid').length) {
                this.renderFeaturedProjects('.mil-portfolio-grid');
            }

            // Render services
            if ($('#services .container .row').length) {
                const servicesRow = $('#services .container .row').last();
                // Always re-render services on language change
                this.renderServices(servicesRow);
            }

            // Render testimonials/reviews
            if ($('.mil-reviews-slider').length) {
                this.updateReviewsSection();
                this.renderTestimonials();
            }

            // Render partners
            this.renderPartners();

            // Update social links
            this.updateSocialLinks();

            // Render blog posts
            if ($('.mil-blog-posts-container').length) {
                this.renderBlogPosts('.mil-blog-posts-container', true);
            }

            // Update contact info
            this.updateContactInfo();

            console.log('Content initialization complete');
        }
    };

})(jQuery);

