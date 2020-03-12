import { Pipe, PipeTransform } from '@angular/core';

// Usado para transformar o 0 em ATIVO e 1 em CANCELADO
@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: number): string {
    let result = value === 0 ? "ATIVO" : "CANCELADO";

    return result;
  }

}
