import { AbstractControl } from '@angular/forms';

export function validarRut(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const rut = control.value;
  if (!rut) {
    return null;
  }

  // Remover el punto del RUT, si existe
  const rutSinPunto = rut.replace(/\./g, '');

  const regex = /^(\d{1,8})-(\d{1,1})$/;
  const match = regex.exec(rutSinPunto);
  if (!match) {
    return { rutInvalido: true }; // El formato del RUT es incorrecto
  }

  const rutNumber = parseInt(match[1], 10);
  const dv = match[2];
  const validDv = validarDigitoVerificador(rutNumber, dv);
  if (!validDv) {
    return { rutInvalido: true }; // El dígito verificador es incorrecto
  }

  return null; // El RUT es válido
}

function validarDigitoVerificador(rutNumber: number, dv: string) {
  let suma = 0;
  let factor = 2;

  let expectedDv;

  for (let i = rutNumber.toString().length - 1; i >= 0; i--) {
    suma += factor * parseInt(rutNumber.toString()[i], 10);
    factor = factor === 7 ? 2 : factor + 1;
  }

  const resto = suma % 11;
  expectedDv = 11 - resto;
  if (expectedDv === 11) {
    expectedDv = 0;
  } else if (expectedDv === 10) {
    expectedDv = 'K';
  }

  return dv.toUpperCase() === expectedDv.toString();
}
