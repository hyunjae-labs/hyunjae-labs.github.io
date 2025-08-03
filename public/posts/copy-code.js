// Minimal JavaScript for code block copy functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add copy functionality to all code blocks
  const copyButtons = document.querySelectorAll('.code-block-copy');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const codeBlock = this.closest('.code-block-container');
      const codeElement = codeBlock.querySelector('code');
      
      if (!codeElement) return;
      
      const code = codeElement.textContent || '';
      
      try {
        await navigator.clipboard.writeText(code);
        
        // Visual feedback
        this.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
          this.classList.remove('copied');
        }, 2000);
        
      } catch (err) {
        console.error('Failed to copy text: ', err);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          document.execCommand('copy');
          this.classList.add('copied');
          setTimeout(() => {
            this.classList.remove('copied');
          }, 2000);
        } catch (fallbackErr) {
          console.error('Fallback copy failed: ', fallbackErr);
        }
        
        document.body.removeChild(textArea);
      }
    });
  });
});