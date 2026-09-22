import { inject } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { CanActivateFn, Router } from "@angular/router";
import { Paths } from "src/main";

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  await auth.authStateReady();

  return auth.currentUser ? true : router.createUrlTree([Paths.SIGN_IN]);
}