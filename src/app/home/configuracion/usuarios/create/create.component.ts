import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/shared/services/ApiService';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  private apiService!: ApiService;
  newUserForm: FormGroup;
  constructor(
    private titleService: Title,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Crear Usuario');
    this.apiService = new ApiService(this.http);
    this.newUserForm = this.fb.group({
      name: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: [
        '',
        [Validators.required, Validators.minLength(6)],
      ],
    });
  }

  onSubmit() {
    if (this.newUserForm.invalid) {
      this.newUserForm.markAllAsTouched();
      return;
    }
    if (!this.validatePassword()) {
      this.newUserForm.controls['password'].invalid;
      this.newUserForm.controls['password_confirmation'].invalid;
      return;
    }
    this.createUser();
    this.spinner.show();
  }

  createUser() {
    const { name, userName, email, password } = this.newUserForm.value;
    this.apiService.postService('users', {
      name,
      userName,
      email,
      password,
    });
  }
  validatePassword() {
    const { password, password_confirmation } = this.newUserForm.value;
    if (password === password_confirmation) {
      return false;
    } else {
      return true;
    }
  }
  isValidField(field: string) {
    return (
      this.newUserForm.controls[field].errors &&
      this.newUserForm.controls[field].touched
    );
  }
}
