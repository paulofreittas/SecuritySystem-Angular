import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemService } from 'src/app/services/system.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.css']
})
export class SearchFiltersComponent implements OnInit {

  form: FormGroup;
  page: number;
  resetPage: boolean;

  constructor(
    private systemService: SystemService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.page = 0;
    this.initilizeForm();
  }

  // Inicializa os campos do form com suas respectivas validações
  initilizeForm() {
    this.form = this.fb.group({
      description: ['', [Validators.maxLength(100)]],
      initials: ['', [Validators.maxLength(10)]],
      email: ['', [Validators.pattern("^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$"), Validators.maxLength(100)]]
    });
  }

  search(page) {
    this.page = page;
    if (this.form.invalid) {
      this.snackBar.open(
        "E-mail inválido.", "Ok", { duration: 5000 }
      );
      this.systemService.eventEmit(null);
    } else {
      // Verifica se o usuário informou algum dos campos para a pesquisa, caso tenha feito adiciona os query params na requisição ao backend
      // Caso os filtros estejam em branco chama o método de pesquisa sem filtros
      if (this.form.value.description || this.form.value.initials || this.form.value.email)
        this.systemService.getSystemsWithFilter(this.form.value.description, this.form.value.initials, this.form.value.email, page).subscribe(
          data => {
            this.systemService.eventEmit(data);
          }, () => {
            this.snackBar.open(
              "Ops .. estamos passando por problemas. Volte em breve.", "Ok", { duration: 5000 }
            );
          });
      else
        this.systemService.getSystems(page).subscribe(
          data => {
            this.systemService.eventEmit(data);
          }, () => {
            this.snackBar.open(
              "Ops .. estamos passando por problemas. Volte em breve.", "Ok", { duration: 5000 }
            );
          });
    }
  }

  // Quando o usário clica na próxima página, atualiza o valor de page e realiza uma nova busca de dados
  pageChange(page) {
    this.page = page;
    this.search(page);
  }

  // Navega o usuário para a tela de cadastro
  create() {
    this.router.navigateByUrl("/create");
  }

  // Limpa os dados form e emite um evento ao serviço de sistema para limpar os dados no componente search-results
  clearForm() {
    this.form.reset();
    this.page = 0;
    this.systemService.eventEmit(null);
  }
}
