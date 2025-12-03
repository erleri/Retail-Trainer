import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
try {
    if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
    }
} catch (e) {
    console.warn("Failed to set PDF worker source", e);
}

export const fileProcessor = {
    async extractText(file) {
        if (file.type === 'application/pdf') {
            return this.extractPdfText(file);
        } else if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
            return this.extractPlainText(file);
        } else {
            // For images/videos, we can't easily extract text in browser without OCR.
            // Return null to indicate "use metadata only".
            return null;
        }
    },

    async extractPlainText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    },

    async extractPdfText(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            // Limit to first 10 pages to avoid huge payloads
            const maxPages = Math.min(pdf.numPages, 10);

            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += `--- Page ${i} ---\n${pageText}\n\n`;
            }

            return fullText;
        } catch (error) {
            console.error("PDF Extraction Failed", error);
            throw new Error("Failed to read PDF");
        }
    }
};
