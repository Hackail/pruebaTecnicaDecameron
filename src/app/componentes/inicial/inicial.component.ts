import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ServiciosService } from 'src/app/servicios/servicios.service';
import { HttpParams } from '@angular/common/http';
import { Persona } from 'src/modelos/persona';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { CrearUsuarioComponent } from '../crear-usuario/crear-usuario.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.component.html',
  styleUrls: ['./inicial.component.css']
})
export class InicialComponent implements OnInit {

  displayedColumns: string[] = ['nombres', 'apellidos', 'tipoid', 'identificacion', 'opciones'];
  dataSource = new MatTableDataSource();
  personas: Persona[] = [];
  numeroPagina: number = 2;
  deshabilitarBoton: boolean;
  spinner: boolean;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuariosService: ServiciosService,
    private toastr: ToastrService,
    private crearCliente: MatDialog
  ) {
    this.spinner = true;
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }
  // utiliza el servicio para obtener los clientes

  obtenerUsuarios(pagina?: number) {
    this.spinner = true;
    let body: any = new HttpParams();
    pagina > this.numeroPagina ? this.numeroPagina += 1 : this.numeroPagina -= 1;
    body = body.append('pagina', this.numeroPagina);
    this.usuariosService.obtenerClientes(body).subscribe(result => {
      this.personas = result.response.resultado;
      this.dataSource = new MatTableDataSource(this.personas);
      this.dataSource.sort = this.sort;
      this.spinner = false;
      this.personas.length < 10 ? this.deshabilitarBoton = true : this.deshabilitarBoton = false;
    }, error => {
      this.toastr.error(error, 'Ha ocurrido un error en la carga de personas, intentalo más tarde');
    });
  }

  filtrarUsuario(filtro: string) {
    let body: any = new HttpParams();
    body = body.append('busca', filtro);
    this.usuariosService.obtenerClientes(body).subscribe(result => {
      this.personas = result.response.resultado;
      this.dataSource = new MatTableDataSource(this.personas);
      this.dataSource.sort = this.sort;
      this.personas.length < 10 ? this.deshabilitarBoton = true : this.deshabilitarBoton = false;
    }, error => {
      this.toastr.error(error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(persona: Persona): void {
    const dialogRef = this.crearCliente.open(CrearUsuarioComponent, {
      width: '550px',
      height: '600px',
      data: persona
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.numeroPagina = 2;
        this.obtenerUsuarios(this.numeroPagina);
      }
    });
  }
}
