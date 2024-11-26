import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import JsBarcode from 'jsbarcode';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('Failed to load image'));
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  async generateLabelPdf(
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
    // Obtener la imagen en base64
    const logoBase64 = await this.getBase64ImageFromURL(
      'assets/img/logo_sin_fondo.png'
    );
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
      JsBarcode(canvas, barcodeText, { format: 'CODE128', height: 90 });
      const barcodeImage = canvas.toDataURL('image/png');

      labels[currentRow * 4 + currentColumn] = {
        text: productName,
        barcode: barcodeImage,
      };

      currentColumn++;
    }
    // add a image to the pdf, the image is in .png format, the path is relative to the assets directory /assets/images/logo_sin_fondo.png

    const body = [];
    for (let r = 0; r < 4; r++) {
      const row = [];
      for (let c = 0; c < 4; c++) {
        const label = labels[r * 4 + c];
        if (label.text !== '' && label.barcode !== '') {
          row.push({
            stack: [
              {
                image: logoBase64,
                width: 150,
                alignment: 'center',
                margin: [0, 5, 0, 0], // Ajustar el margen según sea necesario
              },
              {
                text: label.text,
                alignment: 'center',
                margin: [0, 0, 0, 5], // Ajustar el margen según sea necesario
              },
              {
                image: label.barcode,
                width: labelWidth - 20,
                alignment: 'center',
                margin: [0, 0, 0, 0], // Ajustar el margen según sea necesario
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
    pdfMake.setFonts({
      Roboto: {
        normal:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
    });
    pdfMake.createPdf(docDefinition).open();
  }
}
