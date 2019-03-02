import { Component, OnInit } from '@angular/core';

import { Post } from './posts/post.model';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mean-app';
  storedPost: Post[] = [];

  constructor(private authService: AuthService) {

  }

  ngOnInit(){
    this.authService.autoAuthUser();
  }

  onPostAdded(post){
    this.storedPost.push(post);
  }
}
