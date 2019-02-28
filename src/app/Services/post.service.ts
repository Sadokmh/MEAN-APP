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
               .pipe( map((body) => {    // transforming response data ( to make it id not _id)
                     return body.posts.map( post => {
                         return {
                             title: post.title,
                             content: post.content,          
                             id: post._id,
                             imagePath: post.imagePath
                         }
                     })
                }))
               .subscribe( (transformedbody) => {
                    this.posts = transformedbody;
                    this.postUpdated.next([...this.posts]);
               } );
    }


    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }


    addPost(title: string, content: string, image: File) {
        //const body = {title: title , content:content , image: image};
        const body = new FormData();
        body.append('title',title);
        body.append('content',content);
        body.append('image', image, title);
        //console.log(body.get('image'));
        this.http.post<{message: string , post:Post}>('http://localhost:3000/api/posts', body )
                 .subscribe( (resp) => {
                    const post: Post = {
                        id: resp.post.id,
                        title: resp.post.title,
                        content: resp.post.content,
                        imagePath: resp.post.imagePath
                    };
                    this.posts.push(post);
                    this.postUpdated.next([...this.posts]);
                    this.router.navigate(['/']);
                 })
        
    }




    updatePost(idPost: string, titlePost:string, contentPost:string, image: File |string) {
        let body;
        if (typeof image === 'object') {
             body = new FormData();
            body.append('id',idPost);
            body.append('title', titlePost);
            body.append('content', contentPost);
            body.append('image', image , titlePost);
        }
        else {
             body = {
                id:idPost,
                title:titlePost,
                content:contentPost,
                imagePath: image
            }; 
        }

       
        this.http.put(`http://localhost:3000/api/posts/update/${idPost}`,body)
                 .subscribe( ( resp ) => {
                     console.log(resp);
                     const updatedPosts = [...this.posts];
                     const oldPostIndex = updatedPosts.findIndex( p => p.id === idPost ) ;
                     const post = {
                         id: idPost,
                         title: titlePost,
                         content: contentPost,
                         imagePath: ""

                     }
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
        return this.http.get<{_id:string , title:string, content:string, imagePath:string}>(`http://localhost:3000/api/posts/${id}`);
    }
}