// Dynamic content counter
let dynamicCounter = 0;

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
    alert(`Dynamic button ${num} clicked!`);
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

    // Add keyboard support for modal (ESC key)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Log page load
    console.log('Healing Agent Test Page loaded successfully!');
});
