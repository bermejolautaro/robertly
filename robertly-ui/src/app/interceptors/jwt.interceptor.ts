import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService, IDTOKEN_KEY } from '@services/auth-api.service';
import { Observable, catchError, of } from 'rxjs';
import { Paths } from 'src/main';

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authApiService = inject(AuthApiService);
  const router = inject(Router);
  const idToken: string | null = localStorage.getItem(IDTOKEN_KEY);
  if (idToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${idToken}` },
    });
  }

  return next(req).pipe(
    catchError(e => {
      if (e instanceof HttpErrorResponse) {
        if (e.status === HttpStatusCode.Unauthorized) {
          router.navigate([Paths.SIGN_IN]);
        }
      }
      return of(e);
    })
  );
}
