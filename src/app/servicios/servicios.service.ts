import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from 'src/modelos/persona';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(
    private http: HttpClient,
  ) { }

  protected ConstruirEncabezados(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  }

  obtenerClientes(cuerpo?: any): Observable<any> {
    const httpOptions = { headers: this.ConstruirEncabezados() };
    return this.http.post(`${environment.endpoint}/listarclientes`, cuerpo, httpOptions);
  }

  obtenerPaises(): Observable<any> {
    const httpOptions = { headers: this.ConstruirEncabezados() };
    return this.http.post(`${environment.endpoint}/countries`, httpOptions);
  }

  obtenerDepartamentos(idPais: string): Observable<any> {
    const httpOptions = { headers: this.ConstruirEncabezados() };
    return this.http.post(`${environment.endpoint}/states/${idPais}`, httpOptions);
  }

  obtenerCiudades(idDepartamento: any): Observable<any> {
    const httpOptions = { headers: this.ConstruirEncabezados() };
    return this.http.post(`${environment.endpoint}/cities/${idDepartamento}`, httpOptions);
  }

  obtenerTiposId(): Observable<any> {
    const httpOptions = { headers: this.ConstruirEncabezados() };
    return this.http.post(`${environment.endpoint}/tidentificacion`, httpOptions);
  }

  crearPersona(cuerpo: any): Observable<any> {
    const httpOptions = { headers: this.ConstruirEncabezados() };
    return this.http.post(`${environment.endpoint}/registration`, cuerpo, httpOptions);
  }

}
