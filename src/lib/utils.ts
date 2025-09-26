
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

  // Use a clone to avoid altering the live view
  const clonedElement = sourceElement.cloneNode(true) as HTMLElement;
  clonedElement.style.position = 'absolute';
  clonedElement.style.left = '-9999px';
  clonedElement.style.top = '0px';
  clonedElement.style.width = `${sourceElement.offsetWidth}px`; // Ensure consistent width
  clonedElement.style.height = 'auto'; // Let height be natural
  
  const isDarkMode = document.documentElement.classList.contains('dark');
  const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';

  // Force-expand all accordions in the clone
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
        // Directly override styles to ensure visibility for html2canvas
        content.style.height = 'auto';
        content.style.maxHeight = 'none';
        content.style.opacity = '1';
        content.style.overflow = 'visible';
        content.style.visibility = 'visible';
      }
    }
  });
  
  // Fix text with gradient/clip effects to be visible with a solid color
  const gradientTextElements = clonedElement.querySelectorAll<HTMLElement>('.text-transparent.bg-clip-text');
  gradientTextElements.forEach(el => {
      el.classList.remove('text-transparent', 'bg-clip-text', 'bg-gradient-to-r');
      // A bit of a hack: try to guess the color from the gradient classes
      if (el.classList.contains('from-primary')) {
          el.style.color = 'hsl(336 84% 60%)'; // Use HSL value directly
      } else if (el.classList.contains('from-destructive')) {
          el.style.color = 'hsl(0 84% 60%)';
      } else {
          el.style.color = isDarkMode ? '#f8fafc' : '#020817';
      }
  });

  document.body.appendChild(clonedElement);

  try {
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Higher resolution for better quality
      backgroundColor: backgroundColor,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Check if content is taller than one page
    const pageHeight = pdf.internal.pageSize.getHeight();
    let heightLeft = pdfHeight;
    let position = 0;

    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    // Add new pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save("pai-financial-report.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    // Clean up by removing the cloned element
    document.body.removeChild(clonedElement);
  }
};
