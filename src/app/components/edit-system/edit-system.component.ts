import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SystemService } from 'src/app/services/system.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { System } from 'src/app/models/system';

export interface Status {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'edit-system',
  templateUrl: './edit-system.component.html',
  styleUrls: ['./edit-system.component.css']
})
export class EditSystemComponent implements OnInit {

  form: FormGroup;
  id: string;
  system: System;

  status: Status[] = [
    { value: 0, viewValue: 'ATIVO' },
    { value: 1, viewValue: 'CANCELADO' },
  ];

  constructor(
    private systemService: SystemService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.system = null;
    this.id = this.route.snapshot.paramMap.get("id");

    // Recebe o id do sistema cadastrado no banco atráves da url
    if (this.id) {
      this.getData(this.id);
    }
  }

  // Inicializa os campos do form com suas respectivas validações
  initilizeForm() {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(100)]],
      initials: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.pattern("^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$"), Validators.maxLength(100)]],
      url: ['', [Validators.maxLength(50)]],
      status: [''],
      respLastUpdate: { value: '', disabled: true },
      updateAt: { value: '', disabled: true },
      justificationForTheLastUpdate: { value: '', disabled: true },
      newJustification: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  getData(id: string) {
    // Solicita os dados referente ao id informado e preenche os campos do form
    this.systemService.getSystemById(id).subscribe(
      data => {
        if (data?.id) {
          this.system = data as System;
          this.form.get('description').setValue(this.system.description);
          this.form.get('initials').setValue(this.system.initials);
          this.form.get('email').setValue(this.system.email);
          this.form.get('url').setValue(this.system.url);
          this.form.get('status').setValue(this.system.status);
          this.form.get('respLastUpdate').setValue(this.system.userResponsibleForLastUpdate);
          this.form.get('updateAt').setValue(this.system.updateAt);
          this.form.get('justificationForTheLastUpdate').setValue(this.system.justificationForTheLastUpdate);
          this.form.get('newJustification').setValue(this.system.newJustification);
        }
      }
    )
  }

  // Realiza a validação dos dados informados pelo usuário
  validForm(): boolean {
    if (this.form.invalid) {
      if (this.form.get('email').valid) {
        this.snackBar.open(
          "Dados obrigatórios não informados.", "Ok", { duration: 5000 }
        );

        return false;
      } else {
        this.snackBar.open(
          "E-mail inválido.", "Ok", { duration: 5000 }
        );

        return false;
      }
    }

    if (this.form.value.email === "")
      this.form.value.email = null;

    if (this.form.value.url === "")
      this.form.value.url = null;

    return true;
  }

  // Faz o back padrão do navegador
  back() {
    this.location.back();
  }

  // Envia as informações de alterações para o backend e retorna uma mensagem ao usuário no final
  save() {
    if (this.validForm()) {
      const system: System = this.form.value;
      system.userResponsibleForLastUpdate = "Antônio Carlos Sobrinho";
      system.id = Number(this.id);

      this.systemService.update(system).subscribe(
        data => {
          if (data?.successMessage) {
            this.snackBar.open(
              data.successMessage, "Ok", { duration: 5000 }
            );

            // Caso sucesso, redireciona a url raiz da aplicação
            this.router.navigateByUrl("/");
          }
          if (data?.errorMessage) {
            // Caso de erro, exibe mensagem ao usuário
            this.snackBar.open(
              data.errorMessage, "Ok", { duration: 5000 }
            );
          }
        },
        err => {
          this.snackBar.open(
            "Ops .. estamos passando por problemas. Volte em breve.", "Ok", { duration: 5000 }
          );
        }
      )
    }
  }

}
