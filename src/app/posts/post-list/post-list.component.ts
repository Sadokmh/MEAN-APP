import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../../Services/post.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { PageEvent } from '../../../../node_modules/@angular/material';

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
  
  posts:Post[] = [] ;
  private postsSub: Subscription;

  isLoading = false; //Progession spinner

  //pagination
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptionByUser = [1, 2 , 5 , 10];


  constructor(
    public postService: PostService
  ) { }

  ngOnInit() {
    this.postService.getPosts(this.postsPerPage, this.currentPage)
    this.isLoading = true;
    this.postsSub = this.postService.getPostUpdateListener()
                    .subscribe( ( postData: {posts: Post[] , postCount: number} ) => {
                      this.posts=postData.posts
                      this.totalPosts = postData.postCount;
                      this.isLoading = false;
                    });
  }


  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }


  onDelete(id:string) {
      this.isLoading = true;
      this.postService.deletePost(id)
                      .subscribe( () => {
                              this.postService.getPosts(this.postsPerPage,this.currentPage);
                       })
  }



  //pagination
    onChangedPage(pageData: PageEvent) {
      this.isLoading = true;
      this.currentPage = pageData.pageIndex + 1; // +1 because this index starts from 0
      this.postsPerPage = pageData.pageSize
      this.postService.getPosts(this.postsPerPage,this.currentPage);
      
    }


}
