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

  // Add Inter font to jsPDF
  const fontUrl = 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2';
  const fontResponse = await fetch(fontUrl);
  const fontBlob = await fontResponse.blob();
  const reader = new FileReader();
  const fontPromise = new Promise<string>((resolve, reject) => {
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject('Failed to read font file');
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(fontBlob);
  });

  const fontBase64 = await fontPromise;

  const isDarkMode = document.documentElement.classList.contains('dark');
  const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';

  html2canvas(input, {
    scale: 2,
    backgroundColor: backgroundColor,
    useCORS: true,
    onclone: (clonedDoc) => {
      const clonedEl = clonedDoc.getElementById(elementId);
      if (clonedEl) {
        // Force-expand all accordions
        const triggers = clonedEl.querySelectorAll<HTMLElement>('[data-state="closed"]');
        triggers.forEach(trigger => {
          trigger.dataset.state = 'open';
          const contentId = trigger.getAttribute('aria-controls');
          if (contentId) {
            const content = clonedEl.querySelector<HTMLElement>(`#${contentId}`);
            if (content) {
              content.dataset.state = 'open';
              // Remove the 'hidden' style if it's applied by the accordion
              content.style.removeProperty('display');
            }
          }
        });

        // Replace gradient text with solid color for better PDF rendering
        clonedEl.querySelectorAll<HTMLElement>('.bg-gradient-to-r, .bg-gradient-to-br').forEach(el => {
            el.classList.remove('bg-gradient-to-r', 'bg-gradient-to-br', 'bg-clip-text', 'text-transparent');
            if (el.className.includes('destructive')) {
                 el.style.color = '#ef4444';
            } else {
                 el.style.color = isDarkMode ? '#f472b6' : '#db2777'; // primary color
            }
        });
      }
    }
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add the font to the PDF
    pdf.addFileToVFS('Inter-Regular.woff2', fontBase64);
    pdf.addFont('Inter-Regular.woff2', 'Inter', 'normal');
    pdf.setFont('Inter');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("pai-financial-report.pdf");
  });
};
