import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[]= [];
  isLoading= false;
  private postsSub: Subscription;// se crea para tener la subcription
  //y cancelar y evitar perdida de memoria OnDestroy

  constructor(//inyectamos el servicio
    public postService: PostsService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    //4.hago una subscripcion del updateListener
   this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((posts:Post[])=>{
      this.isLoading = false;
      this.posts = posts;
    });
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

  onDelete(postId:string){
    this.postService.deletePost(postId);
  }

}
