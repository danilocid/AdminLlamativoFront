/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { PdfGeneratorService } from './pdf-generator.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import JsBarcode from 'jsbarcode';

describe('PdfGeneratorService (etiquetas)', () => {
  let service: PdfGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should draw the barcode on a canvas with JsBarcode', () => {
    const canvas = document.createElement('canvas');
    const emptyCanvas = canvas.toDataURL('image/png');

    // Se dibuja igual que en generateLabelPdf
    JsBarcode(canvas, '7801234567890', { format: 'CODE128', height: 90 });

    const dataUrl = canvas.toDataURL('image/png');
    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);
    // El pixelado del codigo de barras debe cambiar el contenido del canvas
    expect(dataUrl).not.toBe(emptyCanvas);
  });

  it('should build the label doc definition and create the PDF', async () => {
    const logoBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    spyOn(service, 'getBase64ImageFromURL').and.resolveTo(logoBase64);

    const createPdfSpy = spyOn(pdfMake, 'createPdf').and.returnValue({
      download: jasmine.createSpy('download'),
    } as any);

    await service.generateLabelPdf(
      1, // columna inicial
      1, // fila inicial
      4, // 4 etiquetas en la primera fila
      'Producto de prueba',
      '7801234567890',
    );

    expect(service.getBase64ImageFromURL).toHaveBeenCalled();
    expect(createPdfSpy).toHaveBeenCalledTimes(1);

    const doc = createPdfSpy.calls.mostRecent().args[0] as any;
    expect(doc.pageSize).toBe('LETTER');
    expect(doc.content[0].table.body.length).toBe(4);

    // La primera fila debe tener las 4 etiquetas generadas (logo + nombre + barcode)
    const firstRow = doc.content[0].table.body[0];
    expect(firstRow.length).toBe(4);
    for (const cell of firstRow) {
      expect(cell.stack).toBeTruthy();
      expect(cell.stack[0].image).toBe(logoBase64);
      expect(cell.stack[1].text).toBe('Producto de prueba');
      expect(cell.stack[2].image.startsWith('data:image/png;base64,')).toBe(
        true,
      );
    }
  });
});
