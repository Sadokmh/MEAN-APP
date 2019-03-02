import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public userIsAuthenticated = false;
  private authListennerSubs: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListennerSubs = this.authService.getAuthStatusListenner()
                                             .subscribe( isAuthenticated => {
                                                this.userIsAuthenticated = isAuthenticated;
                                             }); 
  }

  ngOnDestroy(){
    this.authListennerSubs.unsubscribe();
  }


  onLogout(){
    this.authService.logout();
  }

}
