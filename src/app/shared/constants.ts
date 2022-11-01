import { environment } from 'src/environments/environment';
export const ApiRequest = {
  postLoginRenewToken: environment.urlBackend + '/users/renew',
  postLogin: environment.urlBackend + '/users/login',
};
