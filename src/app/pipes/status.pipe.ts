import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: number): string {
    let result = value === 0 ? "ATIVO" : "CANCELADO";

    return result;
  }

}
