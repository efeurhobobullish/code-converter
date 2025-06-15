document.addEventListener('DOMContentLoaded', function() {
  // Animate elements when they come into view
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.classList.add('animate-fade-in-up');
      }
    });
  };

  // Add scroll event listener
  window.addEventListener('scroll', animateOnScroll);
  
  // Initial check in case elements are already in view
  animateOnScroll();
  
  // Add hover effect to buttons
  const buttons = document.querySelectorAll('button, a');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
});
