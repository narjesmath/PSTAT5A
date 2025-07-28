// Solution toggle functionality for Quarto/Reveal.js slides
document.addEventListener("DOMContentLoaded", function() {
  // Add click event listeners to all solution toggle buttons
  document.querySelectorAll('.solution-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Toggle the 'open' class on the parent collapsible-solution element
      this.parentElement.classList.toggle('open');
      
      // Update button text
      if (this.parentElement.classList.contains('open')) {
        this.textContent = 'Hide Solution';
      } else {
        this.textContent = 'Show Solution';
      }
    });
  });
});

// Also handle clicks after Reveal.js loads (for slide transitions)
document.addEventListener('reveal:ready', function() {
  document.querySelectorAll('.solution-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      this.parentElement.classList.toggle('open');
      
      if (this.parentElement.classList.contains('open')) {
        this.textContent = 'Hide Solution';
      } else {
        this.textContent = 'Show Solution';
      }
    });
  });
}); 