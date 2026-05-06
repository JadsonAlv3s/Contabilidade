/**
 * Testes de propriedade e unitários para o módulo formValidator.ts
 *
 * Propriedades testadas:
 *   P1 — Round-Trip de Serialização do Formulário (Requisito 14.4)
 *   P2 — Idempotência da Validação (Requisito 6.3)
 *   P3 — Invariante de Campos Obrigatórios (Requisitos 6.2, 6.3)
 *   P4 — Propriedade Metamórfica de Validação de E-mail (Requisito 6.4)
 *   P5 — Invariante de Consentimento LGPD (Requisitos 6.8, 6.9)
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhone,
  validateForm,
  serializeForm,
  deserializeForm,
  type ContactFormData,
} from '../formValidator';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Cria um ContactFormData válido com todos os campos obrigatórios preenchidos. */
function makeValidForm(overrides: Partial<ContactFormData> = {}): ContactFormData {
  return {
    name: 'Danúbia Carvalho',
    email: 'danubia@exemplo.com.br',
    phone: '(11) 99999-9999',
    message: 'Gostaria de saber mais sobre os serviços de consultoria.',
    lgpdConsent: true,
    ...overrides,
  };
}

// ─── Testes unitários: validateEmail ─────────────────────────────────────────

describe('validateEmail', () => {
  it('aceita e-mails válidos comuns', () => {
    const valid = [
      'usuario@exemplo.com',
      'usuario@exemplo.com.br',
      'nome.sobrenome@empresa.org',
      'contato+tag@dominio.io',
      'a@b.co',
      'user123@sub.dominio.com',
    ];
    for (const email of valid) {
      expect(validateEmail(email), `esperado válido: ${email}`).toBe(true);
    }
  });

  it('rejeita e-mails inválidos', () => {
    const invalid = [
      '',
      'semdominio',
      '@semlocal.com',
      'duplo@@dominio.com',
      'espaco no meio@dominio.com',
      'sem-ponto-no-dominio@dominio',
      'usuario@',
      'usuario@ dominio.com',
    ];
    for (const email of invalid) {
      expect(validateEmail(email), `esperado inválido: ${email}`).toBe(false);
    }
  });
});

// ─── Testes unitários: validatePhone ─────────────────────────────────────────

describe('validatePhone', () => {
  it('aceita formatos brasileiros válidos', () => {
    const valid = [
      '(11) 99999-9999',
      '(11) 9999-9999',
      '+55 11 99999-9999',
      '+55 11 9999-9999',
      '11999999999',
      '1199999999',
      '+5511999999999',
    ];
    for (const phone of valid) {
      expect(validatePhone(phone), `esperado válido: ${phone}`).toBe(true);
    }
  });

  it('rejeita telefones inválidos', () => {
    const invalid = [
      '',
      '9999-9999',        // sem DDD
      '999999999',        // 9 dígitos sem DDD
      'abc',
      '(11)',
      '+1 800 555 1234',  // formato norte-americano
    ];
    for (const phone of invalid) {
      expect(validatePhone(phone), `esperado inválido: ${phone}`).toBe(false);
    }
  });
});

// ─── Testes unitários: validateForm ──────────────────────────────────────────

describe('validateForm', () => {
  it('retorna isValid=true para formulário completamente válido', () => {
    const result = validateForm(makeValidForm());
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('retorna erro para nome vazio', () => {
    const result = validateForm(makeValidForm({ name: '' }));
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('retorna erro para nome apenas com espaços', () => {
    const result = validateForm(makeValidForm({ name: '   ' }));
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('retorna erro para e-mail inválido', () => {
    const result = validateForm(makeValidForm({ email: 'nao-e-email' }));
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it('retorna erro para telefone inválido', () => {
    const result = validateForm(makeValidForm({ phone: '12345' }));
    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toBeDefined();
  });

  it('retorna erro para mensagem vazia', () => {
    const result = validateForm(makeValidForm({ message: '' }));
    expect(result.isValid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it('retorna erro para lgpdConsent=false', () => {
    const result = validateForm(makeValidForm({ lgpdConsent: false }));
    expect(result.isValid).toBe(false);
    expect(result.errors.lgpdConsent).toBeDefined();
  });

  it('retorna isValid=false silenciosamente quando honeypot está preenchido', () => {
    const result = validateForm(makeValidForm({ honeypot: 'bot-value' }));
    expect(result.isValid).toBe(false);
    // Não deve revelar o motivo ao usuário
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('aceita company como campo opcional (ausente)', () => {
    const data = makeValidForm();
    delete (data as Partial<ContactFormData>).company;
    const result = validateForm(data);
    expect(result.isValid).toBe(true);
  });

  it('aceita company como campo opcional (preenchido)', () => {
    const result = validateForm(makeValidForm({ company: 'Empresa Ltda.' }));
    expect(result.isValid).toBe(true);
  });

  it('acumula múltiplos erros quando vários campos são inválidos', () => {
    const result = validateForm({
      name: '',
      email: 'invalido',
      phone: '',
      message: '',
      lgpdConsent: false,
    });
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(1);
  });
});

// ─── Testes unitários: serializeForm / deserializeForm ───────────────────────

describe('serializeForm / deserializeForm', () => {
  it('serializa e desserializa um formulário válido sem perda de dados', () => {
    const original = makeValidForm({ company: 'Empresa Teste' });
    const json = serializeForm(original);
    const restored = deserializeForm(json);
    expect(restored).toEqual(original);
  });

  it('lança erro ao desserializar JSON malformado', () => {
    expect(() => deserializeForm('{ invalido json')).toThrow();
  });

  it('lança erro ao desserializar JSON sem campos obrigatórios', () => {
    expect(() => deserializeForm('{"name":"Teste"}')).toThrow();
  });

  it('lança erro ao desserializar array JSON', () => {
    expect(() => deserializeForm('[1,2,3]')).toThrow();
  });

  it('lança erro ao desserializar string primitiva', () => {
    expect(() => deserializeForm('"apenas uma string"')).toThrow();
  });
});

// ─── P1 — Round-Trip de Serialização do Formulário ───────────────────────────
// Validates: Requisito 14.4

describe('P1 — Round-Trip de Serialização do Formulário', () => {
  /**
   * Para qualquer FormData válido F,
   * deserializeForm(serializeForm(F)) deve ser estruturalmente equivalente a F.
   *
   * Validates: Requisito 14.4
   */

  const validForms: ContactFormData[] = [
    makeValidForm(),
    makeValidForm({ company: 'Empresa ABC' }),
    makeValidForm({ name: 'João da Silva', email: 'joao@empresa.com.br', phone: '+55 21 98765-4321' }),
    makeValidForm({ message: 'Mensagem com caracteres especiais: ção, ã, é, ü, ñ' }),
    makeValidForm({ company: undefined }),
    makeValidForm({ honeypot: '' }),
    makeValidForm({ name: 'A', email: 'a@b.co', phone: '11999999999', message: 'Ok' }),
    makeValidForm({ company: 'Empresa com "aspas" e \\barras\\' }),
    makeValidForm({ message: 'Linha 1\nLinha 2\nLinha 3' }),
    makeValidForm({ lgpdConsent: true, company: '' }),
  ];

  for (const form of validForms) {
    it(`round-trip preserva dados: name="${form.name}", email="${form.email}"`, () => {
      const serialized = serializeForm(form);
      const deserialized = deserializeForm(serialized);
      expect(deserialized).toEqual(form);
    });
  }

  it('round-trip preserva o tipo boolean de lgpdConsent', () => {
    const form = makeValidForm({ lgpdConsent: true });
    const restored = deserializeForm(serializeForm(form));
    expect(typeof restored.lgpdConsent).toBe('boolean');
    expect(restored.lgpdConsent).toBe(true);
  });

  it('round-trip preserva campos opcionais ausentes como undefined', () => {
    const form: ContactFormData = {
      name: 'Teste',
      email: 'teste@exemplo.com',
      phone: '(11) 99999-9999',
      message: 'Mensagem',
      lgpdConsent: true,
    };
    const restored = deserializeForm(serializeForm(form));
    expect(restored.company).toBeUndefined();
    expect(restored.honeypot).toBeUndefined();
  });
});

// ─── P2 — Idempotência da Validação ──────────────────────────────────────────
// Validates: Requisito 6.3

describe('P2 — Idempotência da Validação', () => {
  /**
   * Para qualquer entrada I, validateForm(I) chamado múltiplas vezes
   * deve produzir o mesmo ValidationResult.
   *
   * Validates: Requisito 6.3
   */

  const inputs: ContactFormData[] = [
    makeValidForm(),
    makeValidForm({ name: '' }),
    makeValidForm({ email: 'invalido' }),
    makeValidForm({ lgpdConsent: false }),
    makeValidForm({ phone: '123' }),
    { name: '', email: '', phone: '', message: '', lgpdConsent: false },
    makeValidForm({ honeypot: 'spam' }),
    makeValidForm({ company: 'Empresa' }),
  ];

  for (const input of inputs) {
    it(`idempotência para: name="${input.name}", lgpdConsent=${input.lgpdConsent}`, () => {
      const result1 = validateForm(input);
      const result2 = validateForm(input);
      const result3 = validateForm(input);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });
  }
});

// ─── P3 — Invariante de Campos Obrigatórios ──────────────────────────────────
// Validates: Requisitos 6.2, 6.3

describe('P3 — Invariante de Campos Obrigatórios', () => {
  /**
   * Qualquer submissão com campo obrigatório vazio/inválido → isValid === false.
   * Todos os campos obrigatórios válidos → isValid === true.
   *
   * Validates: Requisitos 6.2, 6.3
   */

  // Casos que devem resultar em isValid === false
  const invalidCases: Array<{ label: string; data: ContactFormData }> = [
    { label: 'name vazio', data: makeValidForm({ name: '' }) },
    { label: 'name só espaços', data: makeValidForm({ name: '   ' }) },
    { label: 'email vazio', data: makeValidForm({ email: '' }) },
    { label: 'email sem @', data: makeValidForm({ email: 'semdominio' }) },
    { label: 'email sem domínio', data: makeValidForm({ email: 'user@' }) },
    { label: 'email com @ duplo', data: makeValidForm({ email: 'a@@b.com' }) },
    { label: 'phone vazio', data: makeValidForm({ phone: '' }) },
    { label: 'phone sem DDD', data: makeValidForm({ phone: '99999-9999' }) },
    { label: 'message vazia', data: makeValidForm({ message: '' }) },
    { label: 'message só espaços', data: makeValidForm({ message: '   ' }) },
    { label: 'lgpdConsent false', data: makeValidForm({ lgpdConsent: false }) },
    {
      label: 'todos os campos obrigatórios vazios',
      data: { name: '', email: '', phone: '', message: '', lgpdConsent: false },
    },
  ];

  for (const { label, data } of invalidCases) {
    it(`isValid === false quando ${label}`, () => {
      expect(validateForm(data).isValid).toBe(false);
    });
  }

  // Casos que devem resultar em isValid === true
  const validCases: Array<{ label: string; data: ContactFormData }> = [
    { label: 'todos os campos mínimos válidos', data: makeValidForm() },
    { label: 'com company preenchida', data: makeValidForm({ company: 'Empresa' }) },
    { label: 'com honeypot vazio', data: makeValidForm({ honeypot: '' }) },
    { label: 'telefone com +55', data: makeValidForm({ phone: '+55 11 99999-9999' }) },
    { label: 'telefone sem formatação', data: makeValidForm({ phone: '11999999999' }) },
    { label: 'e-mail com subdomínio', data: makeValidForm({ email: 'user@sub.empresa.com.br' }) },
  ];

  for (const { label, data } of validCases) {
    it(`isValid === true quando ${label}`, () => {
      expect(validateForm(data).isValid).toBe(true);
    });
  }
});

// ─── P4 — Propriedade Metamórfica de Validação de E-mail ─────────────────────
// Validates: Requisito 6.4

describe('P4 — Propriedade Metamórfica de Validação de E-mail', () => {
  /**
   * Para qualquer e-mail válido e, inserir caracteres inválidos deve sempre
   * resultar em validateEmail(mutate(e)) === false.
   *
   * Validates: Requisito 6.4
   */

  const validEmails = [
    'usuario@exemplo.com',
    'contato@empresa.com.br',
    'nome.sobrenome@org.io',
    'a@b.co',
    'user+tag@dominio.net',
  ];

  // Mutações que tornam um e-mail inválido.
  // Nota: validateEmail faz trim() internamente, portanto espaços nas extremidades
  // não invalidam o e-mail — essas mutações são intencionalmente excluídas.
  const mutations: Array<{ label: string; mutate: (e: string) => string }> = [
    { label: 'inserir espaço antes do @', mutate: (e) => e.replace('@', ' @') },
    { label: 'inserir espaço depois do @', mutate: (e) => e.replace('@', '@ ') },
    { label: 'duplicar o @', mutate: (e) => e.replace('@', '@@') },
    { label: 'remover o @', mutate: (e) => e.replace('@', '') },
    { label: 'remover o domínio (tudo após @)', mutate: (e) => e.split('@')[0] + '@' },
    // Remove tudo após o primeiro ponto do domínio, deixando sem TLD válido
    { label: 'remover todo o domínio após o primeiro ponto', mutate: (e) => {
        const [local, domain] = e.split('@');
        const firstDot = domain.indexOf('.');
        return `${local}@${domain.substring(0, firstDot)}`;
      }
    },
    { label: 'inserir espaço no meio do domínio', mutate: (e) => e.replace(/\.([a-z])/, '. $1') },
  ];

  for (const email of validEmails) {
    // Confirmar que o e-mail base é válido
    it(`e-mail base é válido: ${email}`, () => {
      expect(validateEmail(email)).toBe(true);
    });

    for (const { label, mutate } of mutations) {
      const mutated = mutate(email);
      it(`"${email}" mutado (${label}) → inválido: "${mutated}"`, () => {
        expect(validateEmail(mutated)).toBe(false);
      });
    }
  }
});

// ─── P5 — Invariante de Consentimento LGPD ───────────────────────────────────
// Validates: Requisitos 6.8, 6.9

describe('P5 — Invariante de Consentimento LGPD', () => {
  /**
   * Para qualquer FormData com lgpdConsent === false,
   * validateForm(I).isValid deve ser false, independentemente dos outros campos.
   *
   * Validates: Requisitos 6.8, 6.9
   */

  const formsWithoutConsent: Array<{ label: string; data: ContactFormData }> = [
    {
      label: 'todos os outros campos válidos',
      data: makeValidForm({ lgpdConsent: false }),
    },
    {
      label: 'com company preenchida',
      data: makeValidForm({ lgpdConsent: false, company: 'Empresa' }),
    },
    {
      label: 'com telefone +55',
      data: makeValidForm({ lgpdConsent: false, phone: '+55 11 99999-9999' }),
    },
    {
      label: 'com e-mail de subdomínio',
      data: makeValidForm({ lgpdConsent: false, email: 'user@sub.empresa.com.br' }),
    },
    {
      label: 'com mensagem longa',
      data: makeValidForm({
        lgpdConsent: false,
        message: 'Mensagem muito longa com muitos detalhes sobre o projeto que preciso de ajuda.',
      }),
    },
    {
      label: 'com nome composto',
      data: makeValidForm({ lgpdConsent: false, name: 'Maria das Graças Oliveira Santos' }),
    },
    {
      label: 'com honeypot vazio',
      data: makeValidForm({ lgpdConsent: false, honeypot: '' }),
    },
    {
      label: 'com todos os campos preenchidos corretamente exceto consentimento',
      data: {
        name: 'Carlos Eduardo',
        email: 'carlos@empresa.com',
        phone: '(21) 98765-4321',
        company: 'Tech Corp',
        message: 'Preciso de consultoria contábil urgente.',
        lgpdConsent: false,
        honeypot: '',
      },
    },
  ];

  for (const { label, data } of formsWithoutConsent) {
    it(`isValid === false quando lgpdConsent=false (${label})`, () => {
      const result = validateForm(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.lgpdConsent).toBeDefined();
    });
  }

  it('isValid === true quando lgpdConsent=true e demais campos válidos', () => {
    const result = validateForm(makeValidForm({ lgpdConsent: true }));
    expect(result.isValid).toBe(true);
    expect(result.errors.lgpdConsent).toBeUndefined();
  });
});
