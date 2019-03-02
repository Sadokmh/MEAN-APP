import { Component, OnInit , EventEmitter, Output, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { PostService } from '../../Services/post.service';
import { ActivatedRoute, ParamMap } from '../../../../node_modules/@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from '../../../../node_modules/rxjs';
import { AuthService } from '../../Services/auth.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit,OnDestroy {


  enteredTitle= '';
  enteredContent = '';
 // @Output() postCreated = new EventEmitter<Post>();
  private mode = 'create' ;
  private postId: string;
  post: Post ; // post which will be edited
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;

  constructor(
    public postService: PostService,
    private authService: AuthService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    
    this.authStatusSub = this.authService.getAuthStatusListenner().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]}),
      image: new FormControl(null, {validators: [Validators.required] , asyncValidators:[mimeType]})
    });

    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit' ;
        this.postId = paramMap.get('postId');
        this.isLoading = true; // start the progress spinner
        this.postService.getPost(this.postId).subscribe( postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          }
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
          this.isLoading = false; // end the progress spinner
        } );
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });

  }



  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]; 
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
       this.imagePreview = reader.result  ; //asynchrone , testana readAsDataUrl(file)
    };
    reader.readAsDataURL(file);

  }


  onSavePost(){
    if (this.form.invalid) {
      return ;
    }
    //this.postCreated.emit(post)
    if ( this.mode === 'create' ) {
      this.postService.addPost(this.form.value.title,this.form.value.content, this.form.value.image);
    }
    else {
      this.postService.updatePost(this.postId,this.form.value.title,this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }


  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
