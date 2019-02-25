import { Post } from '../posts/post.model';
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<Post[]>();


    constructor(
        private http: HttpClient
    ) {

    }


    getPosts(){
      //  return [...this.posts]; // te5ou les données mtaa l array this.posts w traja3hom in another new array
      this.http.get< { message:string , posts:Post[] } >('http://localhost:3000/api/posts')
               .subscribe( (postData) => {
                    this.posts = postData.posts;
                    this.postUpdated.next([...this.posts]);
               } );
    }


    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }


    addPost(title: string, content: string) {
        const post: Post = {
            id: null,
            title: title,
            content: content
        };
        this.http.post<{message: string}>('http://localhost:3000/api/posts', post )
                 .subscribe( (resp) => {
                    console.log(resp.message);
                    this.posts.push(post);
                    this.postUpdated.next([...this.posts]);
                 })
        
    }
}