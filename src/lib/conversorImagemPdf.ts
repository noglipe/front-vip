// utils/conversorImagemPdf.ts
import { jsPDF } from "jspdf";

export async function converterImagemParaPdf(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async function (event) {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = function () {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const aspectRatio = img.width / img.height;
        let width = pageWidth;
        let height = pageWidth / aspectRatio;

        if (height > pageHeight) {
          height = pageHeight;
          width = pageHeight * aspectRatio;
        }

        pdf.addImage(img, "JPEG", 10, 10, width - 20, height - 20);

        const blob = pdf.output("blob");
        resolve(blob);
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
