import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService){}
  authSubs: Subscription;
  isLoading = false;
  ngOnInit(){
    this.authSubs = this.authService.getAuthStatusListener().subscribe( () =>
    {
      this.isLoading = false;
    });
  }
  onSignup(loginForm: NgForm){
   if(loginForm.invalid){
     return;
   }
   this.isLoading = true;
   this.authService.createUser(loginForm.value.email, loginForm.value.password);
  }
  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }
}
