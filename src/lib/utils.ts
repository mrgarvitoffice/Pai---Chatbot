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

  // --- Prepare the clone for PDF generation ---

  // 1. Set styles for off-screen rendering
  clonedElement.style.position = 'absolute';
  clonedElement.style.left = '-9999px';
  clonedElement.style.top = '0px';
  clonedElement.style.width = `${sourceElement.offsetWidth}px`; // Match original width
  clonedElement.style.margin = '0';
  clonedElement.style.padding = '0';

  // 2. Force-expand all accordions
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

  const isDarkMode = document.documentElement.classList.contains('dark');
  const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';

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
