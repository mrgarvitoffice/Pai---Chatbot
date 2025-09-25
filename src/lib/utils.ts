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
    const isDarkMode = document.documentElement.classList.contains('dark');
    const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';
    const textColor = isDarkMode ? '#f8fafc' : '#020817';

    html2canvas(input, { 
        scale: 2, 
        backgroundColor: backgroundColor,
        useCORS: true,
        onclone: (document) => {
            const clonedEl = document.getElementById(elementId);
            if (clonedEl) {
                // Expand all accordion content before capturing
                const triggers = clonedEl.querySelectorAll('[data-state="closed"][aria-expanded="false"]');
                triggers.forEach(trigger => {
                    if(trigger instanceof HTMLElement) {
                        trigger.click();
                        // In some frameworks, the click is async. We might need to adjust state directly.
                        const content = document.getElementById(trigger.getAttribute('aria-controls')!);
                        if (content) {
                            content.setAttribute('data-state', 'open');
                        }
                    }
                });
                
                // Set the base styles
                clonedEl.style.backgroundColor = backgroundColor;
                clonedEl.style.color = textColor;

                // Selectively apply text color, preserving specific component colors
                clonedEl.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div').forEach((node) => {
                    if (node instanceof HTMLElement) {
                        // Avoid overriding chart and specific text colors
                        const classes = node.className.toString();
                        const isColorSpecific = classes.includes('text-primary') || 
                                              classes.includes('text-secondary') || 
                                              classes.includes('text-destructive') ||
                                              classes.includes('text-green') ||
                                              classes.includes('text-red') ||
                                              classes.includes('text-blue') ||
                                              classes.includes('text-yellow');
                                              
                        if (!isColorSpecific && node.style.color === '') {
                           node.style.color = textColor;
                        }

                        // Fix background colors for nested cards/divs
                         const isBackgroundSpecific = classes.includes('bg-background') || 
                                                     classes.includes('bg-card');
                        if (isBackgroundSpecific) {
                            node.style.backgroundColor = isDarkMode ? '#1e293b' : '#f1f5f9'; // A slightly different shade for contrast
                        }
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
