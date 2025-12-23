/* -------------------------------------------

QCode Website Initialization
Content loading, modals, and event handlers

------------------------------------------- */

(function ($) {
    "use strict";

    $(function() {
        var projectDetailsModal = $('#projectDetailsModal');
        var imprintModal = $('#imprintModal');

        console.log('QCode initialization started');
        console.log('Project details modal found:', projectDetailsModal.length);
        console.log('Imprint modal found:', imprintModal.length);

        /**
         * Update imprint link text based on current language
         */
        function updateImprintLink() {
            try {
                var translation = QCodeContent.getTranslation();
                var linkText = QCodeContent.currentLanguage === 'de' ? 'Impressum' : 'Imprint';
                var links = $('[data-imprint-trigger]');
                console.log('Found imprint links:', links.length);
                links.text(linkText);
            } catch (error) {
                console.error('Error updating imprint link:', error);
            }
        }

        /**
         * Render imprint content in modal
         */
        function renderImprintContent() {
            try {
                var translation = QCodeContent.getTranslation();
                console.log('Rendering imprint for language:', QCodeContent.currentLanguage);

                if (translation && translation.imprint) {
                    // Set title
                    $('#imprint-modal-title').html(translation.imprint.title);

                    // Render sections
                    var contentHTML = '';
                    translation.imprint.sections.forEach(function(section) {
                        contentHTML += '<div class="mil-mb-60">';
                        contentHTML += '<h4 class="mil-light mil-mb-30">' + section.heading + '</h4>';
                        contentHTML += '<p class="mil-light-soft">' + section.content + '</p>';
                        contentHTML += '</div>';
                    });
                    $('#imprint-modal-content').html(contentHTML);
                    console.log('Imprint content rendered successfully');
                } else {
                    console.error('Imprint data not found in translation');
                }
            } catch (error) {
                console.error('Error rendering imprint content:', error);
            }
        }

        /**
         * Load content from JSON and initialize all components
         */
        QCodeContent.load(function(data) {
            console.log('Content loaded:', data);
            QCodeContent.initAll();

            // Update imprint link text based on language
            updateImprintLink();

            // Reinitialize scroll animations after content is loaded
            setTimeout(function() {
                ScrollTrigger.refresh();
            }, 100);
        });

        /**
         * Open project details modal when clicking on portfolio items
         */
        $(document).on('click', '.mil-portfolio-item-inline', function(e) {
            e.preventDefault();
            var projectId = $(this).data('project-id');
            console.log('Portfolio item clicked, project ID:', projectId);

            if (projectId) {
                QCodeContent.renderProjectDetails(projectId);
                projectDetailsModal.addClass('mil-active');
                $('body').css('overflow', 'hidden');
            } else {
                console.error('No project ID found on clicked item');
            }
        });

        /**
         * Open imprint modal - event delegation
         */
        $(document).on('click', '[data-imprint-trigger]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Imprint trigger clicked (event delegation)');
            renderImprintContent();
            imprintModal.addClass('mil-active');
            $('body').css('overflow', 'hidden');
        });

        /**
         * Open imprint modal - direct binding (backup)
         */
        $('body').on('click', 'a[data-imprint-trigger]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Imprint trigger clicked (direct binding)');
            renderImprintContent();
            imprintModal.addClass('mil-active');
            $('body').css('overflow', 'hidden');
        });

        /**
         * Close modals via close button
         */
        $('.mil-modal-close').on('click', function(e) {
            console.log('Modal close button clicked');
            $('.mil-modal').removeClass('mil-active');
            $('body').css('overflow', '');
        });

        /**
         * Close modals by clicking outside
         */
        $('.mil-modal').on('click', function(e) {
            if (e.target === this) {
                console.log('Clicked outside modal content');
                $(this).removeClass('mil-active');
                $('body').css('overflow', '');
            }
        });

        /**
         * Prevent modal content clicks from closing modal
         */
        $('.mil-modal-content').on('click', function(e) {
            e.stopPropagation();
        });

        /**
         * Close modals with ESC key
         */
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' && $('.mil-modal.mil-active').length > 0) {
                console.log('ESC key pressed, closing modals');
                $('.mil-modal').removeClass('mil-active');
                $('body').css('overflow', '');
            }
        });

        /**
         * Update imprint link when language changes
         */
        $(document).on('languageChanged', function() {
            console.log('Language changed event received');
            updateImprintLink();
        });

        console.log('QCode initialization complete');
    });

})(jQuery);

