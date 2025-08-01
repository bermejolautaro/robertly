import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '@services/auth-api.service';
import { OfflineQueueService } from '@services/offline-queue.service';
import { catchError, from, of, switchMap, throwError } from 'rxjs';
import { AUTH_CHECKS_ENABLED, Paths } from 'src/main';

export const httpErrorResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authApiService = inject(AuthApiService);
  const offlineQueueService = inject(OfflineQueueService);
  const authChecksEnabled = inject(AUTH_CHECKS_ENABLED);
  const idToken = authApiService.idToken();

  if (idToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${idToken}` },
    });
  }

  return next(req).pipe(
    catchError(e => {
      if (e instanceof HttpErrorResponse) {
        if (e.status === HttpStatusCode.Unauthorized && authChecksEnabled) {
          return from(authApiService.tryRefreshToken()).pipe(
            switchMap(isRefreshSuccessful => {
              const path = isRefreshSuccessful ? Paths.HOME : Paths.SIGN_IN;
              router.navigate([path], { onSameUrlNavigation: 'reload' });
              return of();
            })
          );
        } else if (e.status === HttpStatusCode.NotFound || e.status === HttpStatusCode.Forbidden) {
          return throwError(() => new Error('The resource does not exist or you do not have access.'));
        }
      }

      if (!offlineQueueService.isOnline() || e.status === HttpStatusCode.GatewayTimeout) {
        return of();
      }

      return throwError(() => e);
    })
  );
};
