import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  color: string;
  constructor(private authService: AuthService){}
  ngOnInit() {
    this.authService.autoAuthUser();
  }

}
