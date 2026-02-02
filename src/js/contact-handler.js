/**
 * Contact Form Handler
 * Handles form submission and sends data to backend
 */

function initializeContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    // Disable submit button during submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showMessage('✓ Message sent successfully! I will get back to you soon.', 'success');
        contactForm.reset();
      } else {
        showMessage(result.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage('An error occurred. Please try again later.', 'error');
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

/**
 * Show message feedback to user
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showMessage(message, type = 'info') {
  // Remove existing message if any
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message form-message-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    padding: 12px 15px;
    margin-bottom: 15px;
    border-radius: 5px;
    font-weight: 500;
    animation: slideIn 0.3s ease-in-out;
    ${type === 'success' 
      ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
      : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
  `;

  // Insert message before form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.parentNode.insertBefore(messageDiv, contactForm);
  }

  // Auto-remove success message after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.style.animation = 'slideOut 0.3s ease-in-out';
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }
}

// Initialize when components are loaded
document.addEventListener('DOMContentLoaded', initializeContactForm);

// Also initialize if called after components are already loaded
if (document.querySelector('.contact-form')) {
  initializeContactForm();
}
