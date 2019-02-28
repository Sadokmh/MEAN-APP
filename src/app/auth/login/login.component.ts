import { Component, OnInit } from '@angular/core';
import { NgForm } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  isLoading = false;

  constructor() { }

  ngOnInit() {
  }


  onLogin(form: NgForm) {
    console.log(form.value);
  }

}
