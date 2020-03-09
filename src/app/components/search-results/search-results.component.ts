import { Component, OnInit, EventEmitter, Output, Input, ViewChild, SimpleChanges } from '@angular/core';
import { System } from 'src/app/models/system';
import { MatTableDataSource } from '@angular/material/table';
import { SystemService } from 'src/app/services/system.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  displayedColumns: string[] = ['Description', 'Initials', 'Email', 'URL', 'Status', 'Acoes'];
  dataSource: MatTableDataSource<System>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() page;
  @Output() pageChange = new EventEmitter();
  totalResults: number;

  constructor(private systemService: SystemService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.systemService.searchSystemEvent.subscribe(
      data => {

        this.totalResults = data?.totalResults;
        const systems = data?.result as System[];
        this.dataSource = new MatTableDataSource<System>(systems);

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

    this.systemService.clearFormEvent.subscribe(() => {
      this.dataSource = null;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      if (chng.currentValue === 0 && this.dataSource?.data)
        this.paginator.pageIndex = 0;
    }
  }

  paginar(pageEvent: PageEvent) {
    this.paginator.pageIndex = pageEvent.pageIndex;
    this.pageChange.emit(this.paginator.pageIndex);
  }

  edit(id: number) {
    this.router.navigateByUrl("edit/" + id);
  }

}
