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

  displayedColumns: string[] = ['Description', 'Initials', 'Email', 'URL', 'Status', 'Action'];
  dataSource: MatTableDataSource<System>;
  // Responsavel pelo controle de paginação no Angular Material
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Recebe a página atual do componente pai
  @Input() page;
  // Envia notificação de alteração de página
  @Output() pageChange = new EventEmitter();
  // Armaza o número total de páginas para passar ao componente do Angular Material
  totalResults: number;

  constructor(private systemService: SystemService, private snackBar: MatSnackBar, private router: Router) { }

  // Fica escutando o evento de pesquisa do componente pai e renderiza os resultados quando o serviço de busca de sistemas retorna alguma informação
  ngOnInit(): void {
    this.systemService.searchSystemEvent.subscribe(
      data => {

        this.totalResults = data?.totalResults;
        const systems = data?.result as System[];
        this.dataSource = new MatTableDataSource<System>(systems);

        if (data?.value?.errorMessage) {
          this.snackBar.open(
            data.value.errorMessage, "Ok", { duration: 5000 }
          );
        }
      },
      () => {
        this.snackBar.open(
          "Ops .. estamos passando por problemas. Volte em breve.", "Ok", { duration: 5000 }
        );
      }
    )
  }

  // Responsavel por ficar escutando as alterações da propriedade page que o componente pai passa aqui
  // Foi implementado para que quando a página for igual a 1 e tiver resultado, voltar o componente de paginação para a numeração inicial
  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      if (chng.currentValue === 0 && this.dataSource?.data)
        this.paginator.pageIndex = 0;
    }
  }

  // Quando o usuário clica em paginar, atualiza o index e emite um evento de alteração de paginação com o novo index
  paginar(pageEvent: PageEvent) {
    this.pageChange.emit(pageEvent.pageIndex);
  }

  // Redireciona o usuário para a rota de edição passando o id do sistema que o usuário criou
  edit(id: number) {
    this.router.navigateByUrl("edit/" + id);
  }

}
