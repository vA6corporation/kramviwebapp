import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintIframeComponent } from './print-iframe/print-iframe.component';

@NgModule({
  declarations: [
    PrintIframeComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    PrintIframeComponent,
  ]
})
export class PrintModule { }
