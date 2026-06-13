import { Injectable } from '@angular/core';

export interface SendPasswordRecoveryResult {
  ok: boolean;
  code: 'email_sent' | 'email_not_found' | 'generic_error';
}

interface AuthGateway {
  sendPasswordRecovery(email: string): Promise<SendPasswordRecoveryResult>;
}

class MockAuthGateway implements AuthGateway {
  private readonly knownEmails = new Set([
    'vitortozeti@gmail.com',
    'cliente@teste.com',
    'demo@bomrango.com',
  ]);

  async sendPasswordRecovery(email: string): Promise<SendPasswordRecoveryResult> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { ok: false, code: 'generic_error' };
    }

    if (this.knownEmails.has(normalizedEmail)) {
      return { ok: true, code: 'email_sent' };
    }

    return { ok: false, code: 'email_not_found' };
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Troca futura para FirebaseAuthGateway sem alterar UI/componentes.
  private readonly gateway: AuthGateway = new MockAuthGateway();

  sendPasswordRecovery(email: string): Promise<SendPasswordRecoveryResult> {
    return this.gateway.sendPasswordRecovery(email);
  }
}
