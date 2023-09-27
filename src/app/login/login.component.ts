import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  logedIn: boolean | null | undefined;
  constructor(
    private spinner: NgxSpinnerService,
    private titleService: Title,
    private fb: FormBuilder,
    private authSV: AuthService,
    private uS: UtilService,
    private alertSV: AlertService
  ) {
    this.titleService.setTitle('Login');
    this.buildForm();
  }
  ngAfterViewInit(): void {}
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
    this.spinner.show();
    this.logedIn = await this.authSV.authVerificationCheck();
    this.spinner.hide();
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
        if (resp.ok) {
          this.navigate('/home');
        } else {
          this.spinner.hide();
          this.alertSV.alertBasic(
            'No hemos podido completar la solicitud',
            resp.message,
            'error'
          );
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
