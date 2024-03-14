import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { IDTOKEN_KEY } from '@services/auth-api.service';
import { Observable } from 'rxjs';

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const idToken: string | null = localStorage.getItem(IDTOKEN_KEY);

  if (idToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${idToken}` },
    });
  }

  return next(req);
}
