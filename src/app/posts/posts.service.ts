import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  posts: Post[] = [];
  data: any;
  URL = 'http://localhost:3000/api/';
  private postsUpdated = new Subject<{posts: Post[], postsCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  practiceGet(posts: number, pageNo: number){
    const queryString = `?pageSize=${posts}&page=${pageNo}`;
    this.http.get<{posts: any}>(this.URL + 'posts' + queryString)
    .pipe( map( dr => {
      const pArray = dr.posts.map( post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        }
      })
      console.log(pArray);
    }))
    .subscribe(res =>{
      this.data = res;
      //console.log(this.data);
    }, error =>{
      console.log(error);
    })
  }

  getPosts(postsPerpage: number, currentPage: number) {
    this.practiceGet(postsPerpage, currentPage);
    return;

    const queryParams = `?pagesize=${postsPerpage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, totalPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), totalPosts: postData.totalPosts};
    }))
    .subscribe((nodePosts) => {
       this.posts = nodePosts.posts;
       this.postsUpdated.next({posts: [...this.posts], postsCount: nodePosts.totalPosts});
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string }>
    ('http://localhost:3000/api/posts/' + id)
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {
        this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if(typeof(image) === 'object'){
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    }else{
      postData = {id: id, title: title, content: content, imagePath: image, creator: null};
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + id);
  }
}
