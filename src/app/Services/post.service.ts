import { Post } from '../posts/post.model';
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, count } from 'rxjs/operators';
import { Router } from '../../../node_modules/@angular/router';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<{posts: Post[] , postCount: number}>(); 


    constructor(
        private http: HttpClient,
        private router: Router,
        public authService: AuthService,
        private notifyService: NotifyService
    ) {

    }


    getPosts(postsPerPage: number , currentPage: number){
      //  return [...this.posts]; // te5ou les données mtaa l array this.posts w traja3hom in another new array
      const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
      this.http.get< { message:string , posts:any , count:number} >('http://localhost:3000/api/posts' + queryParams)
               .pipe( map((body) => {    // transforming response data ( to make it id not _id)
                     return { 
                        posts: body.posts.map( post => {
                            return {
                                title: post.title,
                                content: post.content,          
                                id: post._id,
                                imagePath: post.imagePath,
                                creator: post.creator
                            };
                        }),
                        count: body.count 
                     };
                }))
               .subscribe( (transformedBody) => {
                    console.log(transformedBody);
                    this.posts = transformedBody.posts;
                    console.log(count);
                    this.postUpdated.next({posts: [...this.posts] , postCount:+transformedBody.count});
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
                    this.notifyService.notify('Post successfully created !', 'success');
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
                imagePath: image,
                creator: null
            }; 
        }

       
        this.http.put(`http://localhost:3000/api/posts/update/${idPost}`,body)
                 .subscribe( ( resp ) => {
                     this.notifyService.notify('Post successfully updated !', 'success');
                     this.router.navigate(['/']);
                 })
    }



    deletePost(postId: string) {
        return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
    }


    getPost(id: string) {
        //return {...this.posts.find( post => post.id === id )};
        return this.http.get<{_id:string , title:string, content:string, imagePath:string , creator:string}>(`http://localhost:3000/api/posts/${id}`);
    }
}