import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService){}
   userIsAuthenticated = false;
   private authListSubs: Subscription;
   ngOnInit(){
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authListSubs = this.authService.getAuthStatusListener()
       .subscribe(isAutheticated =>
          {
            this.userIsAuthenticated = isAutheticated
       });
   }
   onLogout(){
    this.authService.logout();
   }
   ngOnDestroy(){
    this.authListSubs.unsubscribe();
   }
}
