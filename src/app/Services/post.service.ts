import { Post } from '../posts/post.model';
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '../../../node_modules/@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<Post[]>();


    constructor(
        private http: HttpClient,
        private router: Router
    ) {

    }


    getPosts(){
      //  return [...this.posts]; // te5ou les données mtaa l array this.posts w traja3hom in another new array
      this.http.get< { message:string , posts:any } >('http://localhost:3000/api/posts')
               .pipe( map((postData) => {    // transforming response data ( to make it id not _id)
                     return postData.posts.map( post => {
                         return {
                             title: post.title,
                             content: post.content,          
                             id: post._id
                         }
                     })
                }))
               .subscribe( (transformedPostData) => {
                    this.posts = transformedPostData;
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
        this.http.post<{message: string , postid:string}>('http://localhost:3000/api/posts', post )
                 .subscribe( (resp) => {
                    console.log(resp.message);
                    post.id = resp.postid;
                    this.posts.push(post);
                    this.postUpdated.next([...this.posts]);
                    this.router.navigate(['/']);
                 })
        
    }




    updatePost(idPost: string, titlePost:string, contentPost:string) {
        const body = {
            id:idPost,
            title:titlePost,
            content:contentPost
        };
        this.http.put(`http://localhost:3000/api/posts/update/${idPost}`,body)
                 .subscribe( ( resp ) => {
                     console.log(resp);
                     const updatedPosts = [...this.posts];
                     const oldPostIndex = updatedPosts.findIndex( p => p.id === idPost ) ;
                     updatedPosts[oldPostIndex] = body;
                     this.posts = updatedPosts;
                     this.router.navigate(['/']);
                 })
    }



    deletePost(postId: string) {
        this.http.delete(`http://localhost:3000/api/posts/${postId}`)
                 .subscribe( () => {
                     console.log('Deleted');
                     const updatedPosts = this.posts.filter(post => post.id !== postId); // new array without deleted post 
                     this.posts = updatedPosts;
                     this.postUpdated.next([...this.posts]);

                 } )
    }


    getPost(id: string) {
        //return {...this.posts.find( post => post.id === id )};
        return this.http.get<{_id:string , title:string, content:string}>(`http://localhost:3000/api/posts/${id}`);
    }
}