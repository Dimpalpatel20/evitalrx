import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _router=inject(Router);
    let isloggedIn = localStorage.getItem('islogged');
//  if(isloggedIn!=='true'){
//   alert("logged!!"
//   )
//  }
 if(isloggedIn!=='false'){
  alert("Please Try again!");
 _router.navigate(['login'])
  return false
 }
  return true;
};
