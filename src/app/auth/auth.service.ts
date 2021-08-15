import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService{
  private isAuthenticated = false; //extra to edit/update botton
  private token:string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router
  ){}
  createUser(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password:password
    }
    this.http.post("http://localhost:3000/api/user/signup", authData)
    .subscribe(response =>{
      console.log(response);
    });
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  //podemos utilizarlo donde sea necesario
  getToken(){
    return this.token;
  }

  login(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password:password
    }
    this.http.post<{ token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
    .subscribe(response =>{
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.tokenTimer = setTimeout(()=>{
          this.logout();
        }, expiresInDuration * 1000);
        this.isAuthenticated= true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    });
  }

  logout(){
    this.token= null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

}
