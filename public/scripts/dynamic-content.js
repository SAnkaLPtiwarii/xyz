document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const hero = document.getElementById('hero');
    const resultSection = document.getElementById('resultSection');
    const resultTitle = document.getElementById('resultTitle');
    const subtitle = document.getElementById('subtitle');
    const mainContent = document.getElementById('mainContent');
    const ctaButton = document.getElementById('ctaButton');
    const backToSearch = document.getElementById('backToSearch');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Modal elements
    const modal = document.getElementById('infoModal');
    const modalService = document.getElementById('modalService');
    const closeBtn = document.querySelector('.close');
    const infoForm = document.getElementById('infoForm');

    // Event listeners
    searchForm.addEventListener('submit', handleSearch);
    backToSearch.addEventListener('click', showSearchPage);
    window.addEventListener('popstate', handlePopState);
    ctaButton.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', outsideClick);
    infoForm.addEventListener('submit', handleFormSubmit);

    function handleSearch(e) {
        e.preventDefault();
        const keyword = searchInput.value.trim();
        if (keyword) {
            updateContent(keyword);
            history.pushState({ keyword }, '', `?keyword=${encodeURIComponent(keyword)}`);
        }
    }

    async function updateContent(keyword) {
        showLoadingSpinner();
        try {
            const response = await fetch(`/api/content?keyword=${encodeURIComponent(keyword)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.json();

            document.title = `${content.title} - DynamiSearch`;
            resultTitle.textContent = `Your Personalized ${keyword} Solution`;
            subtitle.textContent = content.subtitle;
            mainContent.textContent = content.mainContent;
            ctaButton.textContent = content.ctaText;

            hero.style.display = 'none';
            resultSection.style.display = 'block';

            // Smooth scroll to results
            resultSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error fetching content:', error);
            alert('An error occurred while fetching content. Please try again.');
        } finally {
            hideLoadingSpinner();
        }
    }

    function showSearchPage() {
        hero.style.display = 'block';
        resultSection.style.display = 'none';
        searchInput.value = '';
        document.title = 'DynamiSearch - Your Dynamic Service Finder';
        history.pushState(null, '', '/');

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handlePopState(event) {
        if (event.state && event.state.keyword) {
            updateContent(event.state.keyword);
        } else {
            showSearchPage();
        }
    }

    function showLoadingSpinner() {
        loadingSpinner.style.display = 'flex';
    }

    function hideLoadingSpinner() {
        loadingSpinner.style.display = 'none';
    }

    // Modal functions
    function openModal(e) {
        e.preventDefault();
        modalService.textContent = searchInput.value;
        modal.style.display = 'block';
    }




    function closeModal() {
        modal.style.display = 'none';
        // Reset modal content to original form
        modal.querySelector('.modal-content').innerHTML = `
            <span class="close">&times;</span>
            <h2>Request <span id="modalService"></span> Help</h2>
            <form id="infoForm">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone:</label>
                    <input type="tel" id="phone" name="phone">
                </div>
                <div class="form-group">
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" rows="4"></textarea>
                </div>
                <button type="submit" class="submit-btn">Submit Request</button>
            </form>
        `;
        // Re-attach event listeners
        document.querySelector('.close').addEventListener('click', closeModal);
        document.getElementById('infoForm').addEventListener('submit', handleFormSubmit);
    }

    function outsideClick(e) {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        showLoadingSpinner();

        const formData = new FormData(infoForm);
        const data = Object.fromEntries(formData.entries());
        data.service = searchInput.value;

        try {
            const response = await fetch('/api/submit-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Show thank you message
            showThankYouMessage();

            // Reset form
            infoForm.reset();

            // Close modal after a delay
            setTimeout(() => {
                closeModal();
            }, 3000); // Close after 3 seconds
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting your information. Please try again.');
        } finally {
            hideLoadingSpinner();
        }
    }

    function showThankYouMessage() {
        const modalContent = document.querySelector('.modal-content');
        const thankYouMessage = document.createElement('div');
        thankYouMessage.className = 'thank-you-message';
        thankYouMessage.innerHTML = `
            <h2>Thank You!</h2>
            <p>Your information has been submitted successfully.</p>
            <p>We'll get back to you soon regarding your ${searchInput.value} inquiry.</p>
        `;
        modalContent.innerHTML = '';
        modalContent.appendChild(thankYouMessage);
    }

    // Check for keyword in URL on page load
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');
    if (keyword) {
        updateContent(keyword);
    }

    // Add this to your existing main.js file

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^=""]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add a class to header on scroll for a sticky effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Add animation class to result content when it becomes visible
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function handleScrollAnimation() {
        const resultContent = document.querySelector('.result-content');
        if (isElementInViewport(resultContent)) {
            resultContent.classList.add('animate');
        }
    }

    window.addEventListener('scroll', handleScrollAnimation);
});

// Add this to your main.js file or create a new theme.js file

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeToggle.checked = true;
        }
    }

    // Theme toggle event listener
    themeToggle.addEventListener('change', function () {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });
});




