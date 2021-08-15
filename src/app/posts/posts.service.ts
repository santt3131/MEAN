import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount:number}>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  getPosts(postPerPage: number, currentPage: number ) {
    const queryParams= `?pagesize=${postPerPage}&page=${currentPage}`;
    //puede devolver un tipo Post[] pero del backend viene con mensaje
    return this.http.get<{ message: string, posts: any ,  maxPosts: number }>('http://localhost:3000/api/posts'+ queryParams)
    .pipe(
      map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
      })
    )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        }); //actualizo para ifnormar a las partes de la aplicacion
      });
    // return [...this.posts]; //operador de propagacion
    // //crea una referencia del objeto posts como una copia
    // // es decir si edito este array desde otro componente este no se
    // // modificara la matriz original es decir private posts...
  }

  //3. luego crearé un listener como observable

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title),
      postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete("http://localhost:3000/api/posts/" + postId);
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>
      ("http://localhost:3000/api/posts/" + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    //si subes un nuevo archivo
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else { // o si es el mismo
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }

    this.http.put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe((response) => {
        this.router.navigate(["/"]);
      });
  }

}
