/* ===========================================
   Koderka Form Handling
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

/**
 * Initialize contact form with validation and AJAX submission
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const successAlert = document.getElementById('form-success');
  const errorAlert = document.getElementById('form-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous alerts
    hideAlerts();

    // Validate form
    if (!validateForm(form)) {
      return;
    }

    // Get form data
    const formData = new FormData(form);

    // Disable submit button and show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
      </svg>
      Sending...
    `;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        form.reset();
        clearValidation(form);
        showAlert(successAlert);

        // Scroll to success message
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Server error
        const data = await response.json();
        throw new Error(data.error || 'Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showAlert(errorAlert);
      errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      // Restore submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // Real-time validation on blur
  form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
    field.addEventListener('blur', () => {
      validateField(field);
    });

    field.addEventListener('input', () => {
      // Remove error state when user starts typing
      if (field.classList.contains('is-invalid')) {
        clearFieldValidation(field);
      }
    });
  });
}

/**
 * Validate the entire form
 */
function validateForm(form) {
  let isValid = true;

  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

/**
 * Validate a single field
 */
function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Required check
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }

  // Email validation
  if (isValid && field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }

  // Min length check
  if (isValid && field.minLength > 0 && value.length < field.minLength) {
    isValid = false;
    errorMessage = `Please enter at least ${field.minLength} characters`;
  }

  // Update UI
  if (!isValid) {
    showFieldError(field, errorMessage);
  } else {
    clearFieldValidation(field);
  }

  return isValid;
}

/**
 * Show error for a field
 */
function showFieldError(field, message) {
  field.classList.add('is-invalid');

  // Remove existing error message
  const existingError = field.parentNode.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }

  // Add error message
  const errorEl = document.createElement('div');
  errorEl.className = 'form-error';
  errorEl.textContent = message;
  field.parentNode.appendChild(errorEl);
}

/**
 * Clear validation state for a field
 */
function clearFieldValidation(field) {
  field.classList.remove('is-invalid');
  const errorEl = field.parentNode.querySelector('.form-error');
  if (errorEl) {
    errorEl.remove();
  }
}

/**
 * Clear all validation states
 */
function clearValidation(form) {
  form.querySelectorAll('.is-invalid').forEach(field => {
    clearFieldValidation(field);
  });
}

/**
 * Show an alert
 */
function showAlert(alertEl) {
  if (alertEl) {
    alertEl.style.display = 'block';
  }
}

/**
 * Hide all alerts
 */
function hideAlerts() {
  document.querySelectorAll('.alert').forEach(alert => {
    alert.style.display = 'none';
  });
}
