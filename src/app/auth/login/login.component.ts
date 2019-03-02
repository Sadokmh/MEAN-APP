import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {


  isLoading = false;
  authStatusSub: Subscription;

  constructor(
    public authService: AuthService
  ) { }


  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListenner().subscribe(authStatus => {
      this.isLoading = false;
    });
  }


  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }


  onLogin(form: NgForm) {
    if (form.invalid) {
      return ;
    }
    this.isLoading = true;
    this.authService.login(form.value.email,form.value.password);
  }

}
