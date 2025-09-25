import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generatePdf = (elementId: string) => {
  const input = document.getElementById(elementId);
  if (input) {
    // Use a solid background color during canvas rendering to prevent transparency issues.
    // The theme's card color is a good choice.
    html2canvas(input, { 
        scale: 2, 
        backgroundColor: '#111827', // Use a solid color from the theme
        useCORS: true, // Important for external images if any
        onclone: (document) => {
            // This ensures pseudo-elements (like gradients) are rendered
            // by temporarily making them on a solid background.
            const clonedEl = document.getElementById(elementId);
            if (clonedEl) {
                clonedEl.style.setProperty('background', '#111827', 'important');
                 // Force gradients to render on a solid background
                clonedEl.querySelectorAll('*').forEach((node) => {
                    const style = window.getComputedStyle(node);
                    if (style.backgroundImage.includes('gradient')) {
                        node.setAttribute('style', `background-image: ${style.backgroundImage} !important; background-color: transparent !important;`);
                    }
                });
            }
        }
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("pai-financial-report.pdf");
    });
  } else {
    console.error(`Error: Element with the given ID '${elementId}' not found`);
  }
};
