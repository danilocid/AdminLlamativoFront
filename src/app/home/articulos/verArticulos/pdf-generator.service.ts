import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import JsBarcode from 'jsbarcode';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  generateLabelPdf(
    startColumn: number,
    startRow: number,
    quantity: number,
    productName: string,
    barcodeText: string
  ) {
    const labelWidth = 50 * 2.83465; // 53 mm to points
    const labelHeight = 68.2 * 2.83465; // 70 mm to points

    const labels = Array(16).fill({ text: '', barcode: '' }); // Inicializa todas las etiquetas vacías
    let currentColumn = startColumn - 1;
    let currentRow = startRow - 1;

    for (let i = 0; i < quantity; i++) {
      if (currentColumn >= 4) {
        currentColumn = 0;
        currentRow++;
      }
      if (currentRow >= 4) {
        break; // Salimos si excede el número de etiquetas en la página
      }
      // Generar el código de barras en base64
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, barcodeText, { format: 'CODE128' });
      const barcodeImage = canvas.toDataURL('image/png');

      labels[currentRow * 4 + currentColumn] = {
        text: productName,
        barcode: barcodeImage,
      };

      currentColumn++;
    }

    const body = [];
    for (let r = 0; r < 4; r++) {
      const row = [];
      for (let c = 0; c < 4; c++) {
        const label = labels[r * 4 + c];
        if (label.text !== '' && label.barcode !== '') {
          row.push({
            stack: [
              {
                text: label.text,
                alignment: 'center',
                margin: [0, 10, 0, 5], // Ajustar el margen según sea necesario
              },
              {
                image: label.barcode,
                width: labelWidth - 20,
                height: 80,
                alignment: 'center',
                margin: [0, 10, 0, 0], // Ajustar el margen según sea necesario
              },
            ],
            width: labelWidth,
            height: labelHeight,
          });
        } else {
          row.push({
            text: '',
            width: labelWidth,
            height: labelHeight,
          });
        }
      }
      body.push(row);
    }

    const docDefinition = {
      pageSize: 'LETTER',
      pageMargins: [5.6693, 0, 5.6693, 0], // Ajustar los márgenes según sea necesario
      content: [
        {
          table: {
            widths: Array(4).fill(labelWidth),
            heights: Array(4).fill(labelHeight),
            body: body,
            border: [false, false, false, false],
          },
          layout: {
            hLineWidth: function () {
              return 0;
            },
            vLineWidth: function () {
              return 0;
            },
          },
        },
      ],
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
