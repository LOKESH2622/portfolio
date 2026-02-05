/**
 * Contact Form Handler
 * Handles form submission and sends data to backend
 */

function initializeContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (!contactForm) {
    console.warn('Contact form not found. Retrying...');
    // Retry after a short delay if form doesn't exist yet
    setTimeout(initializeContactForm, 500);
    return;
  }

  console.log('✓ Contact form found and initializing...');

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Form submitted');

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    console.log('Form data:', formData);

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
      // Use relative URL so it works on both localhost and production
      const apiUrl = `${window.location.origin}/api/contact`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      
      let result;
      const contentType = response.headers.get('content-type');
      
      // Check if response has JSON content
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      
      console.log('Response result:', result);

      if (response.ok && result.success) {
        showMessage('✓ Message sent successfully! I will get back to you soon.', 'success');
        contactForm.reset();
      } else {
        showMessage(result.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage('Network error: Could not reach the server. Please try again.', 'error');
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
  
  // Create HTML with icon and message
  if (type === 'success') {
    messageDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${message}</span>
      </div>
    `;
  } else {
    messageDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${message}</span>
      </div>
    `;
  }
  
  messageDiv.style.cssText = `
    padding: 16px 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 16px;
    animation: slideIn 0.3s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    ${type === 'success' 
      ? 'background-color: #d4edda; color: #000; border: 2px solid #28a745;' 
      : 'background-color: #f8d7da; color: #721c24; border: 2px solid #dc3545;'}
  `;

  // Insert message before form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.parentNode.insertBefore(messageDiv, contactForm);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Auto-remove success message after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.style.animation = 'slideOut 0.3s ease-in-out';
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }
}
