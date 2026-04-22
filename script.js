// Dynamic content counter
let dynamicCounter = 0;

// Tab switching
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    if (tab === 'healing') {
        document.getElementById('healing-tab').classList.add('active');
    } else {
        document.getElementById('skills-tab').classList.add('active');
    }
}

// Generate dynamic content
function generateDynamicContent() {
    dynamicCounter++;
    const content = document.getElementById('dynamicContent');
    const newElement = document.createElement('div');
    newElement.className = 'status-message success';
    newElement.id = `dynamicElement${dynamicCounter}`;
    newElement.innerHTML = `
        <strong>Dynamic Element #${dynamicCounter}</strong>
        <p>Generated at ${new Date().toLocaleTimeString()}</p>
        <button id="dynamicBtn${dynamicCounter}" onclick="handleDynamicClick(${dynamicCounter})">
            Click Me
        </button>
    `;
    content.appendChild(newElement);
}

// Handle dynamic button click
function handleDynamicClick(num) {
    // Don't use alert() as it blocks Selenium operations
    console.log(`Dynamic button ${num} clicked!`);
    
    // AUTOMATICALLY trigger ad popup on first click to test Skill Registry
    if (num === 1) {
        // Show popup overlay that will block subsequent clicks
        setTimeout(() => {
            triggerAdPopup();
            console.log('[TEST] Ad popup auto-triggered after first click - subsequent clicks will be blocked');
        }, 500);
    }
    
    // Show visual feedback
    const feedback = document.createElement('div');
    feedback.className = 'status-message success';
    feedback.textContent = `✓ Dynamic button ${num} clicked successfully!`;
    feedback.style.marginTop = '15px';
    event.target.parentElement.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
}

// Open modal
function openModal() {
    document.getElementById('modal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// Toggle element visibility
function toggleElement() {
    const element = document.getElementById('conditionalElement');
    element.classList.toggle('hidden-element');
    element.classList.toggle('visible-element');
}

// ========== SKILL REGISTRY TEST FUNCTIONS ==========

// Test 1: Ad Popup
function triggerAdPopup() {
    document.getElementById('adPopup').classList.add('show');
    updateStatus('adPopupStatus', '⚠️ Ad popup is now blocking interactions', 'warning');
    updateStatus('adPopupStatus2', '⚠️ Ad popup is now blocking interactions', 'warning');
}

function closeAdPopup() {
    document.getElementById('adPopup').classList.remove('show');
    updateStatus('adPopupStatus', '✅ Ad popup closed by skill', 'success');
    updateStatus('adPopupStatus2', '✅ Ad popup closed by skill', 'success');
}

// Test 2: Cookie Banner
function triggerCookieBanner() {
    document.getElementById('cookieBanner').classList.add('show');
    updateStatus('cookieBannerStatus', '⚠️ Cookie banner is blocking page', 'warning');
    updateStatus('cookieBannerStatus2', '⚠️ Cookie banner is blocking page', 'warning');
}

function closeCookieBanner() {
    document.getElementById('cookieBanner').classList.remove('show');
    updateStatus('cookieBannerStatus', '✅ Cookie banner accepted by skill', 'success');
    updateStatus('cookieBannerStatus2', '✅ Cookie banner accepted by skill', 'success');
}

// Test 3: Newsletter Popup
function triggerNewsletterPopup() {
    document.getElementById('newsletterPopup').classList.add('show');
    updateStatus('newsletterStatus', '⚠️ Newsletter popup is blocking submit', 'warning');
    updateStatus('newsletterStatus2', '⚠️ Newsletter popup is blocking submit', 'warning');
}

function closeNewsletterPopup() {
    document.getElementById('newsletterPopup').classList.remove('show');
    updateStatus('newsletterStatus', '✅ Newsletter popup dismissed by skill', 'success');
    updateStatus('newsletterStatus2', '✅ Newsletter popup dismissed by skill', 'success');
}

// Test 4: Scroll to Hidden Element
function scrollToHiddenElement() {
    const hiddenBtn = document.getElementById('hiddenButton2') || document.getElementById('hiddenButton');
    if (hiddenBtn) {
        hiddenBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        updateStatus('scrollStatus', '✅ Scrolled to hidden element', 'success');
        updateStatus('scrollStatus2', '✅ Scrolled to hidden element', 'success');
        setTimeout(() => {
            hiddenBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            hiddenBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                hiddenBtn.style.background = '';
                hiddenBtn.style.transform = '';
            }, 1000);
        }, 500);
    }
}

// Test 5: Loading Spinner
function triggerLoadingSpinner() {
    document.getElementById('loadingSpinner').classList.add('show');
    updateStatus('loadingStatus', '⚠️ Loading spinner is active', 'warning');
    updateStatus('loadingStatus2', '⚠️ Loading spinner is active', 'warning');
    
    // Auto-remove after 5 seconds to simulate loading complete
    setTimeout(() => {
        document.getElementById('loadingSpinner').classList.remove('show');
        updateStatus('loadingStatus', '✅ Loading complete', 'success');
        updateStatus('loadingStatus2', '✅ Loading complete', 'success');
    }, 5000);
}

// Test 6: Stale Element (DOM Mutation)
function causeStaleElement() {
    const container = document.getElementById('staleContainer');
    const oldButton = container.innerHTML;
    
    updateStatus('staleStatus', '⚠️ DOM re-rendering...', 'warning');
    updateStatus('staleStatus2', '⚠️ DOM re-rendering...', 'warning');
    
    // Simulate React/Vue re-render by replacing DOM
    setTimeout(() => {
        container.innerHTML = oldButton;
        updateStatus('staleStatus', '✅ DOM stabilized, element re-rendered', 'success');
        updateStatus('staleStatus2', '✅ DOM stabilized, element re-rendered', 'success');
    }, 2000);
}

// Test 7: Multiple Popups
function triggerMultiplePopups() {
    updateStatus('multiPopupStatus', '⚠️ Triggering sequential popups...', 'warning');
    updateStatus('multiPopupStatus2', '⚠️ Triggering sequential popups...', 'warning');
    
    // Show cookie banner first
    setTimeout(() => {
        document.getElementById('cookieBanner').classList.add('show');
    }, 500);
    
    // Then newsletter popup
    setTimeout(() => {
        document.getElementById('newsletterPopup').classList.add('show');
    }, 2000);
    
    // Then promo popup
    setTimeout(() => {
        document.getElementById('promoPopup').classList.add('show');
    }, 3500);
}

function closePromoPopup() {
    document.getElementById('promoPopup').classList.remove('show');
    updateStatus('multiPopupStatus', '✅ All popups dismissed', 'success');
    updateStatus('multiPopupStatus2', '✅ All popups dismissed', 'success');
}

// Test 8: Enable Email Input
function enableEmailInput() {
    const input = document.getElementById('skillEmailInput');
    input.disabled = false;
    input.focus();
    updateStatus('emailInputStatus', '✅ Email input enabled', 'success');
}

// Helper: Update status messages
function updateStatus(elementId, message, type) {
    const statusEl = document.getElementById(elementId);
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `status ${type}`;
    }
}

// Add click feedback for all buttons without onclick
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('button:not([onclick])').forEach(button => {
        button.addEventListener('click', function() {
            const feedback = document.createElement('div');
            feedback.className = 'status-message success';
            feedback.textContent = `✓ ${this.textContent || this.id} clicked successfully!`;
            this.parentElement.appendChild(feedback);
            setTimeout(() => feedback.remove(), 3000);
        });
    });

    // Close modal on background click
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Close popups on background click
    document.querySelectorAll('.popup-overlay').forEach(popup => {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });

    // Add keyboard support for modal (ESC key)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.querySelectorAll('.popup-overlay, .cookie-banner, .loading-overlay').forEach(el => {
                el.classList.remove('show');
            });
        }
    });

    // Log page load
    console.log('Healing Agent & Skill Registry Test Page loaded successfully!');
});
