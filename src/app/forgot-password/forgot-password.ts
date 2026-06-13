import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  protected readonly isLoading = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    try {
      const email = this.form.getRawValue().email ?? '';
      const result = await this.authService.sendPasswordRecovery(email);

      if (result.ok) {
        this.successMessage.set(
          'Email enviado com sucesso. Verifique sua caixa de entrada e tambem o spam.'
        );
        return;
      }

      if (result.code === 'email_not_found') {
        this.errorMessage.set('Email nao encontrado.');
        return;
      }

      this.errorMessage.set('Nao foi possivel enviar o email agora. Tente novamente.');
    } catch {
      this.errorMessage.set('Erro inesperado ao enviar o link de recuperacao.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
