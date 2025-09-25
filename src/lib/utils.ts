import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generatePdf = async (elementId: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Error: Element with the given ID '${elementId}' not found`);
    return;
  }

  const isDarkMode = document.documentElement.classList.contains('dark');
  const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';
  const textColor = isDarkMode ? '#f8fafc' : '#020817'; // foreground color

  html2canvas(input, {
    scale: 2,
    backgroundColor: backgroundColor,
    useCORS: true,
    onclone: (clonedDoc) => {
      const clonedEl = clonedDoc.getElementById(elementId);
      if (clonedEl) {
        // Force-expand all accordions to be visible in the PDF
        const triggers = clonedEl.querySelectorAll<HTMLElement>('[data-state="closed"]');
        triggers.forEach(trigger => {
          // Set state to open
          trigger.dataset.state = 'open';
          
          // Rotate the chevron icon
          const chevron = trigger.querySelector<HTMLElement>('svg');
          if (chevron) {
            chevron.style.transform = 'rotate(180deg)';
          }
          
          const contentId = trigger.getAttribute('aria-controls');
          if (contentId) {
            const content = clonedEl.querySelector<HTMLElement>(`#${contentId}`);
            if (content) {
              content.dataset.state = 'open';
              // CRITICAL: Directly override styles to ensure visibility for html2canvas
              // This bypasses any animations that might hide the content during capture.
              content.style.height = 'auto';
              content.style.overflow = 'visible';
              content.style.opacity = '1';
              content.style.visibility = 'visible';
              
              // Remove animation classes to prevent interference
              content.classList.remove('animate-accordion-up', 'animate-accordion-down');

              const childDiv = content.querySelector<HTMLElement>('div');
              if (childDiv) {
                 childDiv.style.visibility = 'visible';
                 childDiv.style.opacity = '1';
              }
            }
          }
        });

        // Replace gradient text with solid color for better PDF rendering
        clonedEl.querySelectorAll<HTMLElement>('.bg-gradient-to-r, .bg-gradient-to-br, .bg-clip-text, .text-transparent').forEach(el => {
            el.classList.remove('bg-gradient-to-r', 'bg-gradient-to-br', 'bg-clip-text', 'text-transparent');
            el.style.color = isDarkMode ? '#f472b6' : '#db2777'; // primary color
        });

        // Ensure all text has a visible color
        clonedEl.querySelectorAll<HTMLElement>('*').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.color === 'rgba(0, 0, 0, 0)' || style.color === 'transparent') {
                el.style.color = textColor;
            }
        });
      }
    }
  }).then(canvas => {
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
  });
};
