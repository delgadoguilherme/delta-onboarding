// Hark Prototype - Script

// Navigation state
let currentScreen = 'schema-management';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  initNavGroups();
  loadSavedDocuments();
});

function initializeApp() {
  // Add animation class to elements
  const animatedElements = document.querySelectorAll('.schema-item, .page-header');
  animatedElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.05}s`;
    el.classList.add('animate-in');
  });
}

// Collapse/Expand Navigation Groups
function initNavGroups() {
  const groupHeaders = document.querySelectorAll('.nav-group-header');
  
  groupHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const group = header.closest('.nav-group');
      group.classList.toggle('collapsed');
    });
  });
}

// Load saved documents from localStorage
function loadSavedDocuments() {
  const documents = JSON.parse(localStorage.getItem('harkDocuments') || '[]');
  
  if (documents.length === 0) return;
  
  const navGroups = document.querySelectorAll('.nav-group');
  if (navGroups.length === 0) return;
  
  const lastGroup = navGroups[navGroups.length - 1];
  
  documents.forEach(doc => {
    // Check if category already exists
    const existingGroup = Array.from(navGroups).find(g => 
      g.querySelector('.nav-group-header span')?.textContent === doc.category
    );
    
    if (!existingGroup) {
      // Create new group
      const newGroup = document.createElement('div');
      newGroup.className = 'nav-group';
      
      const itemsHTML = doc.items.map(item => 
        `<a href="#" class="nav-item nav-item-nested">${item}</a>`
      ).join('');
      
      newGroup.innerHTML = `
        <button class="nav-group-header">
          <span>${doc.category}</span>
          <svg class="nav-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="nav-group-items">
          ${itemsHTML}
        </div>
      `;
      
      lastGroup.parentNode.insertBefore(newGroup, lastGroup.nextSibling);
      
      // Init click handler
      const newHeader = newGroup.querySelector('.nav-group-header');
      newHeader.addEventListener('click', () => {
        newGroup.classList.toggle('collapsed');
      });
    }
  });
}

// Upload functionality
function initUpload() {
  const uploadArea = document.querySelector('.upload-area');
  const fileInput = document.getElementById('fileInput');
  
  if (!uploadArea || !fileInput) return;
  
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });
}

function handleFiles(files) {
  if (files.length === 0) return;
  
  const file = files[0];
  showUploadProgress(file);
  
  // Simulate upload
  setTimeout(() => {
    window.location.href = 'extraction.html';
  }, 2000);
}

function showUploadProgress(file) {
  const uploadArea = document.querySelector('.upload-area');
  const uploadContainer = uploadArea.parentElement;
  
  uploadArea.style.display = 'none';
  
  const fileItem = document.createElement('div');
  fileItem.className = 'file-item';
  fileItem.innerHTML = `
    <div class="file-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="file-info">
      <div class="file-name">${file.name}</div>
      <div class="file-size">${formatFileSize(file.size)}</div>
    </div>
    <div class="file-status">
      <div class="spinner"></div>
      <span>Uploading</span>
    </div>
    <div class="file-actions">
      <button class="file-action-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H21M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;
  
  uploadContainer.insertBefore(fileItem, uploadArea);
  
  // Show upload documents button
  const uploadBtn = document.createElement('button');
  uploadBtn.className = 'btn btn-secondary';
  uploadBtn.style.marginTop = '16px';
  uploadBtn.style.alignSelf = 'flex-end';
  uploadBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    Upload documents
  `;
  uploadContainer.appendChild(uploadBtn);
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + sizes[i];
}

// Accordion functionality
function toggleAccordion(element) {
  const card = element.closest('.card');
  const body = card.querySelector('.card-body');
  const chevron = element.querySelector('.chevron');
  
  if (body.style.display === 'none') {
    body.style.display = 'block';
    chevron.style.transform = 'rotate(180deg)';
  } else {
    body.style.display = 'none';
    chevron.style.transform = 'rotate(0deg)';
  }
}

// Navigation
function goBack() {
  window.history.back();
}

function goToPage(page) {
  window.location.href = page;
}
