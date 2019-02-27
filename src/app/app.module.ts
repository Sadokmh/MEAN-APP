import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
          MatInputModule, MatCardModule,MatButtonModule,MatToolbarModule,MatExpansionModule, MatProgressSpinnerModule
        } from '@angular/material';

import { HeaderComponent } from './header/header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostService } from './Services/post.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [ 
    
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
