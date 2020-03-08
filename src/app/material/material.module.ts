import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule
  ],
  exports: [
    CommonModule,
    MatTableModule,
    BrowserAnimationsModule,
    ToastrModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule
  ]
})
export class MaterialModule { }
