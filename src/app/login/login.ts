import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly mode = signal<'login' | 'signup'>('login');

  protected readonly title = computed(() =>
    this.mode() === 'login' ? 'Entrar' : 'Cadastrar'
  );

  protected readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly signupForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      role: ['client', [Validators.required]],
    },
    { validators: [passwordsMatchValidator] }
  );

  protected setMode(next: 'login' | 'signup') {
    this.mode.set(next);
  }

  protected onSubmit() {
    const form = this.mode() === 'login' ? this.loginForm : this.signupForm;
    form.markAllAsTouched();
    if (form.invalid) return;

    if (this.mode() === 'login') {
      // Como o fluxo implementado hoje e somente do cliente, login vai para o cardapio.
      this.router.navigateByUrl('/cardapio');
      return;
    }

    const role = this.signupForm.getRawValue().role;
    if (role === 'client') {
      this.router.navigateByUrl('/cardapio');
      return;
    }
    if (role === 'delivery') {
      this.router.navigateByUrl('/motoboy');
      return;
    }

    // Perfis ainda nao implementados no frontend atual.
    this.router.navigateByUrl('/');
  }
}

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;

  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordsMismatch: true };
}
