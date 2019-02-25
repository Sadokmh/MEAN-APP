import { Post } from '../posts/post.model';
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<Post[]>();



    getPosts(){
        return [...this.posts]; // te5ou les données mtaa l array this.posts w traja3hom in another new array
    }


    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }


    addPost(title: string, content: string) {
        const post: Post = {
            title: title,
            content: content
        };
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
    }
}