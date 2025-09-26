
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generatePdf = async (elementId: string) => {
  const sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    console.error(`Error: Element with the given ID '${elementId}' not found`);
    return;
  }

  // Create a clone to manipulate without affecting the live view
  const clonedElement = sourceElement.cloneNode(true) as HTMLElement;
  
  // Style the clone to be rendered off-screen
  clonedElement.style.position = 'absolute';
  clonedElement.style.left = '-9999px';
  clonedElement.style.top = '0px';
  clonedElement.style.width = `${sourceElement.offsetWidth}px`;
  clonedElement.style.height = 'auto';
  clonedElement.style.backgroundColor = '#ffffff';
  clonedElement.style.color = '#020817';


  // Fix text with gradient/clip effects to be visible with a solid color
  const gradientTextElements = clonedElement.querySelectorAll<HTMLElement>('.text-transparent.bg-clip-text');
  gradientTextElements.forEach(el => {
      el.classList.remove('text-transparent', 'bg-clip-text', 'bg-gradient-to-r');
      if (el.classList.contains('from-primary')) {
          el.style.color = '#E11D48'; // ShadCN Pink
      } else if (el.classList.contains('from-destructive')) {
          el.style.color = '#EF4444'; // ShadCN Red
      } else {
          el.style.color = '#020817'; // Dark text color
      }
  });
  
  // Force expand all accordions in the clone
  const triggers = clonedElement.querySelectorAll<HTMLElement>('[data-state="closed"]');
  triggers.forEach(trigger => {
    trigger.dataset.state = 'open';
    const chevron = trigger.querySelector<HTMLElement>('svg');
    if (chevron) {
      chevron.style.transform = 'rotate(180deg)';
    }
    const contentId = trigger.getAttribute('aria-controls');
    if (contentId) {
      const content = clonedElement.querySelector<HTMLElement>(`#${contentId}`);
      if (content) {
        content.dataset.state = 'open';
        content.style.height = 'auto';
        content.style.maxHeight = 'none';
        content.style.opacity = '1';
        content.style.overflow = 'visible';
        content.style.visibility = 'visible';
        content.style.display = 'block';
        
        // Remove animation classes to prevent race conditions
        content.classList.remove('data-[state=closed]:animate-accordion-up', 'data-[state=open]:animate-accordion-down');
      }
    }
  });

  document.body.appendChild(clonedElement);

  // Wait for the browser to render the cloned element fully
  await new Promise(resolve => requestAnimationFrame(resolve));
  await new Promise(resolve => setTimeout(resolve, 100)); // Extra delay for safety

  try {
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff', // Explicitly set background
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("pai-financial-report.pdf");

  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    // Clean up by removing the cloned element
    document.body.removeChild(clonedElement);
  }
};
