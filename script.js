// Current screen index
let currentScreen = 0;
const totalScreens = 5;
const totalSteps = 4; // Steps 1-4 (screens 1-4)

// Get elements
const screens = document.querySelectorAll('.screen');
const progressBar = document.getElementById('progressBar');
const progressIndicator = document.getElementById('progressIndicator');
const progressSegments = document.querySelectorAll('.progress-segment');

// Calculate indicator position and size
function updateProgressIndicator(step, animate = true) {
  if (step < 0 || step >= totalSteps) return;
  
  // Get segment dimensions
  const segment = progressSegments[step];
  if (!segment) return;
  
  const segmentWidth = segment.offsetWidth;
  const gap = 8; // Gap between segments in px
  
  // Calculate position
  const translateX = step * (segmentWidth + gap);
  
  // Apply transition only if animating
  if (animate) {
    progressIndicator.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  } else {
    progressIndicator.style.transition = 'none';
  }
  
  progressIndicator.style.width = `${segmentWidth}px`;
  progressIndicator.style.transform = `translateX(${translateX}px)`;
}

// Show/hide progress bar
function showProgressBar(show) {
  if (show) {
    progressBar.classList.add('visible');
  } else {
    progressBar.classList.remove('visible');
  }
}

// Navigate to next screen
function nextScreen() {
  if (currentScreen >= totalScreens - 1) return;
  
  const current = screens[currentScreen];
  const next = screens[currentScreen + 1];
  const currentContent = current.querySelector('.screen-content');
  const nextContent = next.querySelector('.screen-content');
  
  // Reset any existing animations on next screen elements
  resetAnimations(next);
  
  // Animate content out
  if (currentContent) {
    currentContent.classList.add('fade-out');
  }
  
  // Update progress bar before screen change
  const nextStep = currentScreen; // Screen 1 = step 0, Screen 2 = step 1, etc.
  
  // Show progress bar when leaving welcome screen
  if (currentScreen === 0) {
    showProgressBar(true);
    // Initialize indicator at first position without animation
    setTimeout(() => {
      updateProgressIndicator(0, false);
    }, 50);
  } else if (currentScreen >= 1) {
    // Animate indicator to next position
    updateProgressIndicator(nextStep, true);
  }
  
  // Transition screens
  setTimeout(() => {
    current.classList.remove('active');
    if (currentContent) {
      currentContent.classList.remove('fade-out');
    }
    
    next.classList.add('active');
    
    // Animate content in
    if (nextContent && currentScreen > 0) {
      nextContent.classList.add('fade-in');
      setTimeout(() => {
        nextContent.classList.remove('fade-in');
      }, 400);
    }
    
    currentScreen++;
  }, 250);
}

// Navigate to previous screen
function prevScreen() {
  if (currentScreen <= 0) return;
  
  const current = screens[currentScreen];
  const prev = screens[currentScreen - 1];
  
  // Reset animations
  resetAnimations(prev);
  
  // Update progress indicator
  const prevStep = currentScreen - 2; // Going back one step
  
  if (currentScreen === 1) {
    // Going back to welcome screen - hide progress bar
    showProgressBar(false);
  } else {
    updateProgressIndicator(prevStep, true);
  }
  
  current.classList.remove('active');
  prev.classList.add('active');
  
  currentScreen--;
}

// Reset animations by removing and re-adding animated elements
function resetAnimations(screen) {
  const animatedElements = screen.querySelectorAll(
    '.question-section, .picker-container, .bottom-section, ' +
    '.welcome-logo-container, .welcome-text, .total-time, .setting-item, ' +
    '.ring, .logo-icon'
  );
  
  animatedElements.forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // Trigger reflow
    el.style.animation = '';
  });
}

// Reset demo to first screen
function resetDemo() {
  const current = screens[currentScreen];
  const currentContent = current.querySelector('.screen-content');
  
  // Fade out current content
  if (currentContent) {
    currentContent.classList.add('fade-out');
  }
  
  // Hide progress bar with fade
  showProgressBar(false);
  
  setTimeout(() => {
    // Reset all screens
    screens.forEach((screen) => {
      screen.classList.remove('active');
      const content = screen.querySelector('.screen-content');
      if (content) {
        content.classList.remove('fade-out', 'fade-in');
      }
      resetAnimations(screen);
    });
    
    // Reset to first screen
    currentScreen = 0;
    screens[0].classList.add('active');
    
    // Reset progress indicator position
    updateProgressIndicator(0, false);
  }, 300);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    if (currentScreen < totalScreens - 1) {
      nextScreen();
    } else {
      resetDemo();
    }
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevScreen();
  } else if (e.key === 'r' || e.key === 'R') {
    resetDemo();
  }
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next screen
      if (currentScreen < totalScreens - 1) {
        nextScreen();
      }
    } else {
      // Swipe right - previous screen
      prevScreen();
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Ensure first screen is visible
  screens[0].classList.add('active');
  
  // Hide progress bar initially
  showProgressBar(false);
  
  // Set initial indicator size (after a small delay for layout)
  setTimeout(() => {
    updateProgressIndicator(0, false);
  }, 100);
});
