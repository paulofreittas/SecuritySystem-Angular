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
    this.resetPage = false;
    this.page = 0;
    this.initilizeForm();
  }

  initilizeForm() {
    this.form = this.fb.group({
      description: ['', [Validators.maxLength(100)]],
      initials: ['', [Validators.maxLength(10)]],
      email: ['', [Validators.pattern("^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$"), Validators.maxLength(100)]]
    });
  }

  search(page) {
    this.resetPage = true;
    this.page = page;
    if (this.form.invalid) {
      this.snackBar.open(
        "E-mail inválido.", "Ok", { duration: 5000 }
      );
      this.systemService.eventEmit(null);
    } else {
      if (this.form.value.description != "" || this.form.value.initials || this.form.value.email)
        this.systemService.getSystemsWithFilter(this.form.value.description, this.form.value.initials, this.form.value.email, page).subscribe(
          data => {
            this.systemService.eventEmit(data);
          }, err => {
            this.systemService.eventEmit(err);
          });
      else
        this.systemService.getSystems(page).subscribe(
          data => {
            this.systemService.eventEmit(data);
          }, err => {
            this.systemService.eventEmit(err);
          });
    }
  }

  pageChange(page) {
    this.page = page;
    this.search(page);
  }

  create() {
    this.router.navigateByUrl("/create");
  }

  clearForm() {
    this.form.reset();
    this.systemService.eventEmit(null);
  }
}
