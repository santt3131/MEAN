import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService){}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    //clono, y lo que hace el set, no es setear es agregar el token
    const authRequest = req.clone({
      headers: req.headers.set("Authorization","Bearer " + authToken)
    });
    return next.handle(authRequest);
  }

}
