import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login-screen',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.scss',
})
export class LoginScreen implements OnInit {
  isRegisterMode = signal(false);
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  showLoginPassword = signal(false);
  showRegisterPassword = signal(false);
  showConfirmPassword = signal(false);
  isSubmitting = signal(false);
  loginSuccess = signal(false);
  registerSuccess = signal(false);
  isForgotPasswordMode = signal(false);
  forgotPasswordSuccess = signal(false);
  forgotPasswordForm!: FormGroup;
  loginError = signal<string | null>(null);
  registerError = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Detect mode from route
    this.route.url.subscribe(segments => {
      const path = segments.map(s => s.path).join('/');
      this.isRegisterMode.set(path === 'register');
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }


  toggleMode(): void {
    if (this.isRegisterMode()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword.update(v => !v);
  }

  toggleRegisterPasswordVisibility(): void {
    this.showRegisterPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(v => !v);
  }

  toggleForgotPassword(state: boolean): void {
    this.isForgotPasswordMode.set(state);
    if (!state) {
      this.forgotPasswordSuccess.set(false);
      this.forgotPasswordForm.reset();
    }
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.loginError.set(null);

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    this.http.post('https://partakable-nonoperatic-jair.ngrok-free.dev/api/login', this.loginForm.value, { headers }).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        if (res.status === true) {
          localStorage.setItem('token', res.token);
          this.loginSuccess.set(true);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 800);
        } else {
          this.loginError.set("Invalid email and password combination");
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.loginError.set("Invalid email and password combination");
        console.error('Login error:', err);
      }
    });
    console.log(this.loginForm.value);
    this.router.navigate(['/dashboard']);
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.registerError.set(null);

    const email = this.registerForm.value.email;
    const name = email.substring(0, 4);

    const body = {
      name: name,
      email: email,
      phone: this.registerForm.value.phone,
      password: this.registerForm.value.newPassword,
      password_confirmation: this.registerForm.value.confirmPassword
    };

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    this.http.post('https://partakable-nonoperatic-jair.ngrok-free.dev/api/register', body, { headers }).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        if (res.status === true) {
          this.registerSuccess.set(true);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.registerError.set(res.message || 'Registration failed.');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.registerError.set('Registration failed. Please try again.');
        console.error('Registration error:', err);
      }
    });
  }

  onForgotPassword(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.forgotPasswordSuccess.set(true);
      console.log('Forgot Password Email Sent to:', this.forgotPasswordForm.value.email);
    }, 1500);
  }
}
