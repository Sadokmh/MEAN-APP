import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../../Services/post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../Services/auth.service';
import { NotifyService } from '../../Services/notify.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {


  
  posts:Post[] = [] ;
  private postsSub: Subscription; //subscription to the list of posts
  private authStatusSub: Subscription; //subscription to know if the user is logged in or not 
  userId: string; // the connected user's id

  isLoading = false; //Progession spinner
  userIsAutheticated:boolean = false ; //

  //pagination
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptionByUser = [1, 2 , 5 , 10];


  constructor(
    public postService: PostService,
    private authService: AuthService,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.postService.getPosts(this.postsPerPage, this.currentPage)
    this.userId = this.authService.getUserId();
    this.isLoading = true;
    this.postsSub = this.postService.getPostUpdateListener()
                    .subscribe( ( postData: {posts: Post[] , postCount: number} ) => {
                      this.posts=postData.posts
                      this.totalPosts = postData.postCount;
                      this.isLoading = false;
                    });
    this.userIsAutheticated = this.authService.getIsAuth();
    //zeyed but will fixed later
    this.authStatusSub = this.authService.getAuthStatusListenner()
                                         .subscribe( isAuthenticated => {
                                            this.userIsAutheticated = isAuthenticated;
                                            this.userId = this.authService.getUserId();
                                         });
  }


  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }


  onDelete(id:string) {
      this.isLoading = true;
      this.postService.deletePost(id)
                      .subscribe( () => {
                              this.notifyService.notify('Post successfully deleted !', 'success');
                              this.postService.getPosts(this.postsPerPage,this.currentPage);
                       }, err => {
                         this.isLoading = false;
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
