import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../../Services/post.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {


 /* posts = [
    { title: "first post" , content: "this is the first post content"},
    { title: "second post" , content: "this is the second post content"},
    { title: "third post" , content: "this is the third post content"},
    { title: "fourth post" , content: "this is the fourth post content"}
  ];*/
  
  @Input() posts:Post[] ;
  private postsSub: Subscription;


  constructor(
    public postService: PostService
  ) { }

  ngOnInit() {
    this.posts = this.postService.getPosts()
    this.postsSub = this.postService.getPostUpdateListener()
                    .subscribe(( posts: Post[] ) => {
                      this.posts=posts;
                    });
  }


  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

}
