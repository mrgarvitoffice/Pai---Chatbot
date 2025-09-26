
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

  // Create a clone of the element to prepare it for printing off-screen
  const clonedElement = sourceElement.cloneNode(true) as HTMLElement;
  
  // Prepare the clone for PDF generation
  clonedElement.style.position = 'absolute';
  clonedElement.style.left = '-9999px';
  clonedElement.style.top = '0px';
  clonedElement.style.width = `${sourceElement.offsetWidth}px`;
  clonedElement.style.height = 'auto';
  clonedElement.style.margin = '0';
  clonedElement.style.padding = '0';
  
  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#f8fafc' : '#020817'; // foreground color
  const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff'; // background color

  // Force-expand all accordions and set chevron rotation
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

  // Fix text with gradient/clip effects to be visible
  const gradientTextElements = clonedElement.querySelectorAll<HTMLElement>('.text-transparent.bg-clip-text');
  gradientTextElements.forEach(el => {
      el.classList.remove('text-transparent', 'bg-clip-text', 'bg-gradient-to-r');
      // A bit of a hack: try to guess the color from the gradient classes
      if (el.classList.contains('from-primary')) {
          el.style.color = 'hsl(var(--primary))';
      } else if (el.classList.contains('from-destructive')) {
          el.style.color = 'hsl(var(--destructive))';
      } else {
          el.style.color = textColor; // Fallback to default text color
      }
  });

  // Append the clone to the body to allow it to render
  document.body.appendChild(clonedElement);

  try {
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Higher resolution
      backgroundColor: backgroundColor,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

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
    // Clean up by removing the cloned element from the DOM
    document.body.removeChild(clonedElement);
  }
};
