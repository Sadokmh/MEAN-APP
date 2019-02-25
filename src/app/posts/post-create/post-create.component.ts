import { Component, OnInit , EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { PostService } from '../../Services/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {


  enteredTitle= '';
  enteredContent = '';
  @Output() postCreated = new EventEmitter<Post>();

  constructor(
    public postService: PostService
  ) { }

  ngOnInit() {
  }



  onAddPost(form: NgForm){
    const post:Post = {
      id: null,
      title: form.value.title,
      content: form.value.content
    };
    //this.postCreated.emit(post)
    this.postService.addPost(post.title,post.content);
    form.reset();
  }

}
