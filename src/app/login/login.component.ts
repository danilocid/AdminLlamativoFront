import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { UtilService } from '../shared/services/util.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    readonly spinner: NgxSpinnerService,
    readonly titleService: Title,
    readonly fb: FormBuilder,
    readonly authSV: AuthService,
    readonly uS: UtilService,
    readonly alertSV: AlertService
  ) {
    this.titleService.setTitle('Login');
    this.buildForm();
  }
  private buildForm() {
    this.loginForm = this.fb.group({
      user: [
        '',
        [Validators.required, Validators.minLength(3)],
      ] /* Validators.pattern('^[A-Z]+[.]$')] */,
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  async ngOnInit(): Promise<void> {
    this.authSV.authVerificationCheck();
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.login();
    this.spinner.show();
  }
  login() {
    const { user, password } = this.loginForm.value;
    this.spinner.show();
    this.authSV.login(user, password).subscribe(
      (resp) => {
        this.spinner.hide();
        if (resp.serverResponseCode === 200) {
          this.navigate('/home');
        } else {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', resp.serverResponseMessage, 'error');
          this.navigate('/');
        }
      },
      (error) => {
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      }
    );
  }
  public navigate(path: string) {
    this.uS.navigateToPath(path);
  }
  isValid(field: string) {
    return (
      this.loginForm.controls[field].errors &&
      this.loginForm.controls[field].touched
    );
  }
}
