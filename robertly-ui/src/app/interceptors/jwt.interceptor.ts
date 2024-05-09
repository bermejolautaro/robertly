import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthApiService, IDTOKEN_KEY } from '@services/auth-api.service';
import { EMPTY, Observable, concatMap, from, of, retry } from 'rxjs';

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authApiService = inject(AuthApiService);
  const idToken: string | null = localStorage.getItem(IDTOKEN_KEY);

  if (idToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${idToken}` },
    });
  }

  return next(req).pipe(
    retry({
      delay: (error, retryCount) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (retryCount < 2) {
            return from(authApiService.tryRefreshToken()).pipe(concatMap(() => of(null)));
          }
        }

        return EMPTY;
      },
    })
  );
}
