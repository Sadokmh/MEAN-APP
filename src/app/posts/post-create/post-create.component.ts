import { Component, OnInit , EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { PostService } from '../../Services/post.service';
import { ActivatedRoute, ParamMap } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {


  enteredTitle= '';
  enteredContent = '';
 // @Output() postCreated = new EventEmitter<Post>();
  private mode = 'create' ;
  private postId: string;
  post: Post ; // post which will be edited
  isLoading = false;

  constructor(
    public postService: PostService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit' ;
        this.postId = paramMap.get('postId');
        this.isLoading = true; // start the progress spinner
        this.postService.getPost(this.postId).subscribe( postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          }
          this.isLoading = false; // end the progress spinner
        } );
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });

  }



  onSavePost(form: NgForm){
    const post:Post = {
      id: null,
      title: form.value.title,
      content: form.value.content
    };
    //this.postCreated.emit(post)
    if ( this.mode === 'create' ) {
      this.postService.addPost(post.title,post.content);
    }
    else {
      this.postService.updatePost(this.postId,form.value.title,form.value.content);
    }
    form.reset();
  }

}
