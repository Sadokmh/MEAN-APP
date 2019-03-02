import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {


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


  onSignup(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      return ;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email,form.value.password);
  }

}
