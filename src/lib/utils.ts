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
    // Determine the current theme to apply the correct background color.
    const isDarkMode = document.documentElement.classList.contains('dark');
    const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff'; // Dark theme slate-900, Light theme white
    const textColor = isDarkMode ? '#f8fafc' : '#020817'; // Dark theme slate-50, Light theme slate-950

    html2canvas(input, { 
        scale: 2, 
        backgroundColor: backgroundColor,
        useCORS: true,
        onclone: (document) => {
            const clonedEl = document.getElementById(elementId);
            if (clonedEl) {
                // Ensure the cloned element has the correct theme's background and text color for rendering.
                clonedEl.style.setProperty('background-color', backgroundColor, 'important');
                clonedEl.style.setProperty('color', textColor, 'important');

                // Apply text color to all child elements to ensure readability
                clonedEl.querySelectorAll('*').forEach((node) => {
                    if (node instanceof HTMLElement) {
                        node.style.setProperty('color', textColor, 'important');
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
