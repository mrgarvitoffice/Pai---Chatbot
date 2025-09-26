
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
  
  // Style the clone for off-screen rendering
  clonedElement.style.position = 'absolute';
  clonedElement.style.left = '-9999px';
  clonedElement.style.top = '0px';
  clonedElement.style.width = `${sourceElement.offsetWidth}px`;
  clonedElement.style.height = 'auto';
  clonedElement.style.backgroundColor = '#ffffff'; // Force white background
  clonedElement.style.color = '#020817'; // Force dark text

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
        content.style.height = 'auto';
        content.style.maxHeight = 'none';
        content.style.opacity = '1';
        content.style.overflow = 'visible';
        content.style.visibility = 'visible';
        content.style.display = 'block';
        content.classList.remove('data-[state=closed]:animate-accordion-up', 'data-[state=open]:animate-accordion-down');
      }
    }
  });

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

  document.body.appendChild(clonedElement);

  // Wait for the browser to render the cloned element fully
  await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 300)));

  try {
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasAspectRatio = canvas.width / canvas.height;
    
    const totalImageHeight = pdfWidth / canvasAspectRatio;
    let yPosition = 0;
    let pageCount = 1;
    const maxPages = 3; // Limit to 3 pages

    while (yPosition < totalImageHeight && pageCount <= maxPages) {
      if (pageCount > 1) {
        pdf.addPage();
      }
      
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      
      // Calculate height of the slice for one PDF page
      const sliceHeightInPdfMm = pdfHeight;
      const sliceHeightInCanvasPixels = (sliceHeightInPdfMm * canvas.width) / pdfWidth;
      pageCanvas.height = sliceHeightInCanvasPixels;

      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        // Draw the slice of the original canvas onto the page canvas
        ctx.drawImage(
          canvas,
          0, // sourceX
          (yPosition * canvas.width) / pdfWidth, // sourceY
          canvas.width, // sourceWidth
          sliceHeightInCanvasPixels, // sourceHeight
          0, // destX
          0, // destY
          canvas.width, // destWidth
          sliceHeightInCanvasPixels // destHeight
        );
        
        const pageImgData = pageCanvas.toDataURL('image/png');
        pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, totalImageHeight - yPosition));
      }
      
      yPosition += pdfHeight;
      pageCount++;
    }

    pdf.save("pai-financial-report.pdf");

  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    // Clean up by removing the cloned element
    document.body.removeChild(clonedElement);
  }
};
