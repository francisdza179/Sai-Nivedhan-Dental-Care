document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }



  // Sticky Header Shrink
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('shrunk');
    } else {
      header.classList.remove('shrunk');
    }
  });

  // Scroll Reveal Animation
  const revealObserverOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      // Toggle current item
      item.classList.toggle('active');
    });
  });
  // Content Protection (Temporarily Disabled for Development)
  /*
  document.addEventListener('contextmenu', event => event.preventDefault());
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
  });

  // Prevent Ctrl+C, Ctrl+U, etc.
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's')) {
      e.preventDefault();
    }
  });
  */


  // Transformations Carousel
  if (typeof Swiper !== 'undefined') {
    const transformSwiper = new Swiper('.transformations-swiper', {
      slidesPerView: 1.1,
      spaceBetween: 20,
      centeredSlides: true,
      loop: true,
      speed: 750, /* matches CSS transition: 0.75s */
      autoplay: false,
      grabCursor: true,
      // Prevent Swiper from intercepting drags on the comparison sliders
      noSwiping: true,
      noSwipingSelector: '.ba-slider',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '#transform-next',
        prevEl: '#transform-prev',
      },
      breakpoints: {
        // Tablet
        768: { slidesPerView: 1.5, spaceBetween: 28 },
        // Desktop: ~1.8 shows center + clear side peeks, matching reference layout
        1024: { slidesPerView: 1.82, spaceBetween: 32 }
      }
    });

    // Initialize Before/After Sliders with Global Event Delegation
    // This ensures clones and original slides both work perfectly.
    initBASliders();
  }

  function initBASliders() {
    let activeSlider = null;

    const move = (e) => {
      if (!activeSlider) return;
      
      const rect = activeSlider.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let x = clientX - rect.left;
      
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      
      const position = (x / rect.width) * 100;
      const clipPercent = 100 - position;
      
      // Update Image Clipping and Handle Position
      activeSlider.querySelector('.before-img-overlay').style.clipPath = `inset(0 ${clipPercent}% 0 0)`;
      activeSlider.querySelector('.slider-handle').style.left = `${position}%`;
    };

    const start = (e) => {
      const slider = e.target.closest('.ba-slider');
      if (slider) {
        activeSlider = slider;
        activeSlider.classList.add('dragging');
        // If it's a click/touch, move it immediately
        move(e);
      }
    };

    const stop = () => {
      if (activeSlider) {
        activeSlider.classList.remove('dragging');
        activeSlider = null;
      }
    };

    // Global listeners for smooth dragging
    document.addEventListener('mousedown', start);
    document.addEventListener('touchstart', start, { passive: false });
    
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Lightbox Logic for Transformations Page
  const cards = document.querySelectorAll('.minimalist-card');
  const lightbox = document.getElementById('transformation-lightbox');
  
  if (cards.length > 0 && lightbox) {
    const closeBtn = document.getElementById('lightbox-close');
    const afterImg = lightbox.querySelector('.lightbox-after-img');
    const beforeImg = lightbox.querySelector('.lightbox-before-img');
    const categoryEl = document.getElementById('lightbox-category');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    const handle = lightbox.querySelector('.slider-handle');
    const beforeOverlay = lightbox.querySelector('.before-img-overlay');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        // Populate data
        afterImg.src = card.dataset.after;
        beforeImg.src = card.dataset.before;
        categoryEl.textContent = card.dataset.category;
        titleEl.textContent = card.dataset.title;
        descEl.textContent = card.dataset.desc;
        
        // Reset slider to 50%
        handle.style.left = '50%';
        beforeOverlay.style.clipPath = 'inset(0 50% 0 0)';

        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
    });

    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Lightbox BA Slider Logic
    let activeLightboxSlider = null;

    const moveLightboxSlider = (e) => {
      if (!activeLightboxSlider) return;
      const rect = activeLightboxSlider.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const position = (x / rect.width) * 100;
      const clipPercent = 100 - position;
      activeLightboxSlider.querySelector('.before-img-overlay').style.clipPath = `inset(0 ${clipPercent}% 0 0)`;
      activeLightboxSlider.querySelector('.slider-handle').style.left = `${position}%`;
    };

    const startLightboxSlider = (e) => {
      const slider = e.target.closest('.lightbox-ba-slider');
      if (slider) {
        activeLightboxSlider = slider;
        activeLightboxSlider.classList.add('dragging');
        moveLightboxSlider(e);
      }
    };

    const stopLightboxSlider = () => {
      if (activeLightboxSlider) {
        activeLightboxSlider.classList.remove('dragging');
        activeLightboxSlider = null;
      }
    };

    document.addEventListener('mousedown', startLightboxSlider);
    document.addEventListener('touchstart', startLightboxSlider, { passive: false });
    window.addEventListener('mousemove', moveLightboxSlider);
    window.addEventListener('touchmove', moveLightboxSlider, { passive: false });
    window.addEventListener('mouseup', stopLightboxSlider);
    window.addEventListener('touchend', stopLightboxSlider);
  }

  // Developer Testing Panel Key Storage & UI Sync
  const devPanel = document.getElementById('dev-test-panel');
  const devAccessKeyInput = document.getElementById('dev-access-key');
  const saveKeyBtn = document.getElementById('save-key-btn');
  const keyStatusMsg = document.getElementById('key-status-msg');

  if (devPanel) {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' || 
                        window.location.protocol === 'file:';
    if (isLocalhost || window.location.search.includes('dev=true')) {
      devPanel.style.display = 'block';
    } else {
      devPanel.style.display = 'none';
    }
  }

  if (devAccessKeyInput && saveKeyBtn && keyStatusMsg) {
    // Load existing key from localStorage
    const savedKey = localStorage.getItem('web3forms_test_key');
    if (savedKey) {
      devAccessKeyInput.value = savedKey;
      keyStatusMsg.textContent = "✓ Access key loaded from storage.";
      keyStatusMsg.style.display = "block";
      keyStatusMsg.style.color = "var(--primary-green)";
    }

    saveKeyBtn.addEventListener('click', () => {
      const keyVal = devAccessKeyInput.value.trim();
      if (keyVal) {
        localStorage.setItem('web3forms_test_key', keyVal);
        keyStatusMsg.textContent = "✓ Access key saved! Submit the form above to test.";
        keyStatusMsg.style.display = "block";
        keyStatusMsg.style.color = "var(--primary-green)";
      } else {
        localStorage.removeItem('web3forms_test_key');
        keyStatusMsg.textContent = "Key removed from local storage.";
        keyStatusMsg.style.display = "block";
        keyStatusMsg.style.color = "#dc2626";
      }
    });
  }

  // Appointment Form Submission (Web3Forms Email Integration)
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Update button state (loading state)
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
          <svg width="20" height="20" viewBox="0 0 38 38" stroke="currentColor" style="animation: rotate 1s linear infinite;">
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)" stroke-width="2">
                <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                <path d="M36 18c0-9.94-8.06-18-18-18"/>
              </g>
            </g>
          </svg>
          Sending Request...
        </span>
      `;
      
      // Add standard keyframe style to DOM if not already present
      if (!document.getElementById('loading-spinner-style')) {
        const style = document.createElement('style');
        style.id = 'loading-spinner-style';
        style.textContent = `
          @keyframes rotate {
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Get values
      const name = document.getElementById('appt-name').value.trim();
      const phone = document.getElementById('appt-phone').value.trim();
      const dateVal = document.getElementById('appt-date').value;
      const treatment = document.getElementById('appt-treatment').value;
      const messageVal = document.getElementById('appt-message').value.trim();
      
      // Format the date to a more human-readable style
      let formattedDate = dateVal;
      if (dateVal) {
        const d = new Date(dateVal);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      }
      
      // Web3Forms Access Key
      // USER: Replace this placeholder with the clinic's actual access key when launching live
      let accessKey = "YOUR_ACCESS_KEY_HERE";
      
      // Check if developer has saved a local testing key
      const devSavedKey = localStorage.getItem('web3forms_test_key');
      if (devSavedKey) {
        accessKey = devSavedKey;
      }
      
      if (accessKey === "YOUR_ACCESS_KEY_HERE" || !accessKey) {
        // Warning fallback if key is missing
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          
          alert(`Developer Testing Setup:\n\nTo test sending form submissions to your email:\n1. Click "Email Developer Testing Panel" below the form.\n2. Go to web3forms.com and enter your email (francisdza179@gmail.com) to instantly get a free access key.\n3. Paste that key into the developer panel and hit "Save", then try submitting this form again!`);
          
          // Auto expand the details tab to guide the user
          const devDetails = document.querySelector('#dev-test-panel details');
          if (devDetails) {
            devDetails.open = true;
          }
        }, 500);
        return;
      }
      
      // Prepare Form Data payload for Web3Forms
      const formData = {
        access_key: accessKey,
        subject: `🦷 New Appointment Request from ${name}`,
        from_name: "Sai Nivedhan Website",
        name: name,
        phone: phone,
        preferred_date: formattedDate,
        treatment: treatment,
        message: `A prospective patient has submitted an appointment request:

- Name: ${name}
- Contact Phone: ${phone}
- Preferred Appointment Date: ${formattedDate}
- Treatment of Interest: ${treatment}

Additional Message/Notes:
${messageVal || "None provided"}`
      };
      
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(async (response) => {
        const json = await response.json();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        if (response.status === 200) {
          // Success view animation
          showFormSuccess(name, phone, formattedDate, treatment, messageVal);
        } else {
          // Error handling
          alert(`Submission failed: ${json.message || "Unknown error"}`);
        }
      })
      .catch(error => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        console.error("Form submission error:", error);
        alert("An error occurred while submitting. Please check your internet connection and try again.");
      });
    });
  }
  
  function showFormSuccess(name, phone, date, treatment, messageVal) {
    const formContainer = document.getElementById('appointment-form').parentElement;
    
    // Inject success styles to document head for beautiful micro-animations
    if (!document.getElementById('success-checkmark-styles')) {
      const style = document.createElement('style');
      style.id = 'success-checkmark-styles';
      style.textContent = `
        @keyframes stroke {
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scale {
          0%, 100% { transform: none; }
          50% { transform: scale3d(1.1, 1.1, 1); }
        }
        @keyframes fill {
          100% { box-shadow: inset 0px 0px 0px 30px var(--primary-green); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Animate opacity transition
    formContainer.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    formContainer.style.opacity = 0;
    formContainer.style.transform = "translateY(10px)";
    
    setTimeout(() => {
      formContainer.innerHTML = `
        <div style="text-align: center; padding: 20px 10px;" class="reveal active">
          <div class="success-icon-wrap" style="margin-bottom: 25px;">
            <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style="width: 80px; height: 80px; display: block; margin: 0 auto;">
              <circle class="success-circle" cx="26" cy="26" r="25" fill="none" stroke="var(--primary-green)" stroke-width="2" style="stroke-dasharray: 166; stroke-dashoffset: 166; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;"/>
              <path class="success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke="var(--primary-green)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray: 48; stroke-dashoffset: 48; animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;"/>
            </svg>
          </div>
          <h2 style="font-size: 2.2rem; color: var(--primary-green); margin-bottom: 15px; margin-top: 0;">Request Sent!</h2>
          <p style="color: var(--text-light); line-height: 1.6; margin-bottom: 30px; font-size: 1.1rem;">
            Thank you, <strong>${name}</strong>. Your appointment request has been successfully sent to the clinic's email inbox.
          </p>
          
          <div style="background: rgba(14, 116, 144, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: left; border: 1px solid rgba(14, 116, 144, 0.1);">
            <h4 style="margin: 0 0 10px 0; font-size: 1rem; color: var(--primary-green);">Request Summary:</h4>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.95rem; line-height: 1.8; color: var(--text-dark);">
              <li><strong>📅 Preferred Date:</strong> ${date}</li>
              <li><strong>🦷 Treatment:</strong> ${treatment}</li>
              <li><strong>📞 Contact Phone:</strong> ${phone}</li>
              ${messageVal ? `<li style="margin-top: 8px; border-top: 1px dashed rgba(14, 116, 144, 0.15); padding-top: 8px;"><strong>💬 Message:</strong> "${messageVal}"</li>` : ''}
            </ul>
          </div>
          
          <p style="font-size: 0.9rem; color: #888; margin-bottom: 25px;">We will review your requested time and contact you shortly to confirm.</p>
          
          <button onclick="window.location.reload();" class="btn btn-primary" style="padding: 12px 30px;">Submit Another Request</button>
        </div>
      `;
      formContainer.style.opacity = 1;
      formContainer.style.transform = "translateY(0)";
    }, 300);
  }
});
