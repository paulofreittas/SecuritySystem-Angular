import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SystemService } from 'src/app/services/system.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { System } from 'src/app/models/system';

@Component({
  selector: 'create-system',
  templateUrl: './create-system.component.html',
  styleUrls: ['./create-system.component.css']
})
export class CreateSystemComponent implements OnInit {

  form: FormGroup;

  constructor(
    private systemService: SystemService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initilizeForm();
  }

  initilizeForm() {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(100)]],
      initials: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.pattern("^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$"), Validators.maxLength(100)]],
      url: ['', [Validators.maxLength(50)]],
    });
  }

  back() {
    this.router.navigateByUrl("/");
  }

  save() {
    if (this.validForm()) {
      const system: System = this.form.value;

      system.status = 0;

      this.systemService.save(system).subscribe(
        data => {
          if (data?.successMessage) {
            this.snackBar.open(
              data.successMessage, "Ok", { duration: 5000 }
            );

            this.router.navigateByUrl("/");
          }
          if (data?.errorMessage) {
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

}
