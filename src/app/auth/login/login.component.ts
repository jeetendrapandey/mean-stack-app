import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  authSubs: Subscription;
  constructor(public authService: AuthService) {}
  ngOnInit(){
    this.authSubs = this.authService.getAuthStatusListener().subscribe( () =>
    {
      this.isLoading = false;
    });
  }
  onLogin(loginForm: NgForm){
   if(loginForm.invalid){
     return;
   }
   this.isLoading = true;
   this.authService.login(loginForm.value.email, loginForm.value.password);
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }
}
