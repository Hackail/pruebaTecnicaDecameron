import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Persona } from 'src/modelos/persona';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ServiciosService } from 'src/app/servicios/servicios.service';
import { TipoId } from 'src/modelos/tipoId';
import { Pais } from 'src/modelos/pais';
import { Ciudad } from 'src/modelos/ciudad';
import { Departamento } from 'src/modelos/departamento';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
@Injectable({ providedIn: 'root' })
export class CrearUsuarioComponent implements OnInit {

  tiposId: TipoId[];
  paises: Pais[];
  estados: Departamento[];
  ciudades: Ciudad[];
  formulario: FormGroup;
  persona: Persona;
  toasts: any[] = [];
  nombreCiudad: string;

  constructor(
    public dialogRef: MatDialogRef<CrearUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Persona,
    private servicios: ServiciosService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.formulario = new FormGroup({
      nombres: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      apellidos: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      tipoid: new FormControl('', Validators.required),
      identificacion: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      pais: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      ciudad: new FormControl('', Validators.required),
      telefono: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      id: new FormControl(null)
    });
    if (this.data) {
      this.cargarFormulario();
    } else {
      this.listaPaises();
      this.listaTiposId();
    }
  }

  onSubmit(persona: any) {

    let body: any = new HttpParams();
    body = body.append('nombres', persona.nombres);
    body = body.append('apellidos', persona.apellidos);
    body = body.append('tipoid', persona.tipoid.id);
    body = body.append('identificacion', persona.identificacion);
    body = body.append('pais_nace', persona.pais.id);
    body = body.append('depto_nace', persona.estado.id);
    body = body.append('ciu_nace', persona.ciudad.id);
    body = body.append('telefono', persona.telefono);
    body = body.append('correo', persona.correo);

    if (persona.id) {
      body = body.append('id', persona.id);
    }

    this.servicios.crearPersona(body).subscribe(result => {
      if (result.response.status === 1) {
        this.toastr.success(result.response.message, result.response.statusText);
        this.dialogRef.close();
      } else {
        this.toastr.error(result.response.message, result.response.statusText);
      }
    }, error => {
      this.toastr.error(error);
    }
    );
  }

  cargarFormulario() {
    this.formulario.get('nombres').setValue(this.data.nombres);
    this.formulario.get('apellidos').setValue(this.data.apellidos);
    this.formulario.get('identificacion').setValue(this.data.identificacion);
    this.formulario.get('telefono').setValue(this.data.telefono);
    this.formulario.get('correo').setValue(this.data.correo);
    this.formulario.get('id').setValue(this.data.id);

    let body: any = new HttpParams();
    body = body.append('busca', this.data.identificacion);
    this.servicios.obtenerClientes(body).subscribe(result => {
      if (result.response.status === 1) {
        let cargado: any;
        cargado = result.response.resultado;
        this.listaTiposId(cargado[0].tipoid);
        this.listaPaises(cargado[0].pais, cargado[0].estadp);
        this.listaDepartamentos(cargado[0].departamento);
        this.nombreCiudad = cargado[0].ciudad;
      } else {
        this.toastr.error('Ocurrió un error cargando la persona, inténtalo de nuevo');
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  listaPaises(paisNombre?: string, deptoNombre?: string) {
    this.servicios.obtenerPaises().subscribe(result => {
      this.paises = result.response.datos;
      if (paisNombre) {
        let paisFilter = this.paises.filter(pais =>
          pais.name === paisNombre
        );
        this.formulario.get('pais').setValue(paisFilter[0]);
        this.paisSeleccionado(paisFilter[0], deptoNombre);
      }
      if (result.response.status !== 1) {
        this.toastr.error('Ha ocurrido algo, intétalo de nuevo más tarde', result.response.statusText);
      }
    }, error => {
      this.toastr.error(error);
    });
  }

  listaTiposId(tipoId?: string) {
    this.servicios.obtenerTiposId().subscribe(result => {
      if (result.response.status === 1) {
        const identificaciones: TipoId[] = [];
        for (const key in result.response.datos) {
          if (result.response.datos.hasOwnProperty(key)) {
            const tipoId: TipoId = new TipoId();
            tipoId.id = key;
            tipoId.nombre = result.response.datos[key];
            identificaciones.push(tipoId);
          }
        }
        this.tiposId = identificaciones;
        if (tipoId) {
          let tipoidFilter = this.tiposId.filter(tipoid =>
            tipoid.nombre === tipoId
          );
          this.formulario.get('tipoid').setValue(tipoidFilter[0]);
        }
      } else {
        this.toastr.error('Ha ocurrido algo, intétalo de nuevo más tarde', result.response.statusText);
      }
    }, error => {
      this.toastr.error(error);
    });
  }

  paisSeleccionado(pais: Pais, deptoNombre?: string) {
    let idPais = pais.id;
    this.listaDepartamentos(idPais, deptoNombre);
  }

  listaDepartamentos(idPais: string, nombreDepto?: string) {
    this.servicios.obtenerDepartamentos(idPais).subscribe(result => {
      if (result.response.status === 1) {
        this.estados = result.response.datos;
        let deptoFilter = this.estados.filter(depto =>
          depto.name === nombreDepto
        );
        this.formulario.get('estado').setValue(deptoFilter[0]);
        this.departamentoSeleccionado(deptoFilter[0]);
      }
    }, error => {
      this.toastr.error(error);
    });
  }

  departamentoSeleccionado(departamento: Departamento) {
    let idDepartamento = departamento.id;
    this.listaCiudades(idDepartamento, this.nombreCiudad);
  }

  listaCiudades(idDepartamento: any, nombreCiudad?: string) {
    this.servicios.obtenerCiudades(idDepartamento).subscribe(result => {
      if (result.response.status === 1) {
        this.ciudades = result.response.datos;
        if (nombreCiudad) {
          let ciudadFilter = this.ciudades.filter(ciudad =>
            ciudad.name === nombreCiudad
          );
          this.formulario.get('ciudad').setValue(ciudadFilter[0]);
        }else{
          this.toastr.error('Este departamento no tiene ciudades');
        }
        if (this.ciudades.length === 0) {
          this.toastr.error('Seleccione otro departamento, este no tiene ciudades');
        }
      } else {
        this.toastr.error('Ha ocurrido algo, intétalo de nuevo más tarde', result.response.statusText);
      }
    }, error => {
      this.toastr.error(error);
    });
  }
}
