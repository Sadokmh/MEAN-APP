import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {


 /* posts = [
    { title: "first post" , content: "this is the first post content"},
    { title: "second post" , content: "this is the second post content"},
    { title: "third post" , content: "this is the third post content"},
    { title: "fourth post" , content: "this is the fourth post content"}
  ];*/
  
  @Input() posts ;


  constructor() { }

  ngOnInit() {
  }

}
