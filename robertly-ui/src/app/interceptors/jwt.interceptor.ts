import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '@services/auth-api.service';
import { Observable, catchError, from, of, switchMap } from 'rxjs';
import { Paths } from 'src/main';

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const authApiService = inject(AuthApiService);
  const idToken = authApiService.idToken();

  if (idToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${idToken}` },
    });
  }

  return next(req).pipe(
    catchError(e => {
      if (e instanceof HttpErrorResponse) {
        if (e.status === HttpStatusCode.Unauthorized) {
          return from(authApiService.signOut())
            .pipe(switchMap(() => router.navigate(([Paths.SIGN_IN]))))
        }
      }
      return of(e);
    })
  );
}
