import { NgModule } from "@angular/core";
import { 
    MatInputModule, MatCardModule,MatButtonModule,MatToolbarModule,MatExpansionModule, MatProgressSpinnerModule, MatPaginatorModule
  } from '@angular/material';


@NgModule({
   
    exports: [
        MatInputModule,
        MatCardModule,
        MatPaginatorModule,
        MatButtonModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
    ]
})
export class AngularMaterialModule {

}