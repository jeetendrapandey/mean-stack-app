import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['/post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First post', content: 'This is the first post\'s comment'},
  //   {title: 'Second post', content: 'This is the second post\'s comment'},
  //   {title: 'Third post', content: 'This is the third post\'s comment'}
  // ];

  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  pageLength = 0;
  pageSize = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  userId: string;
  private authSub: Subscription;
  userIsAuthenticated = false;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener().
    subscribe((postData: {posts: Post[], postsCount: number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.pageLength = postData.postsCount;
    });
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authSub = this.authService.getAuthStatusListener().
         subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
