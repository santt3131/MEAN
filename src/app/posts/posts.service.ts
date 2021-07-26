import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient
  ) {
  }

  getPosts() {
    //puede devolver un tipo Post[] pero del backend viene con mensaje
    return this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData)=>{
        return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]); //actualizo para ifnormar a las partes de la aplicacion
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

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content
    };

    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });


  }

  deletePost(postId:string){
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(()=>{
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPost(id:string){
    return this.http.get<{_id:string, title:string, content:string}>
    ("http://localhost:3000/api/posts/" + id);
  }

  updatePost(id:string, title: string , content:string){
    const post:Post = {id :id , title:title, content:content};
    this.http.put("http://localhost:3000/api/posts/" + id, post)
    .subscribe(()=>{
      const updatedPosts: Post[]= [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p=> p.id === post.id);
      updatedPosts[oldPostIndex]= post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

}
