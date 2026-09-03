import { useState, useCallback } from "react";
import type { FormEvent, ChangeEvent, FocusEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import AuthIllustration from "@/components/AuthIllustration";
import { login } from "@/lib/api";

/**
 * LoginPage
 * ---------
 * Tela de acesso (login) funcional com validação client-side.
 *
 * Como plugar no seu backend / fluxo de auth real:
 *   <LoginPage
 *     onLogin={async (email, password) => {
 *       const res = await api.signIn({ email, password });
 *       if (!res.ok) throw new Error("Credenciais inválidas");
 *     }}
 *     onCreateAccount={() => navigate("/cadastro")}
 *   />
 *
 * - onLogin: se lançar (throw) um Error, a mensagem é exibida como erro geral do formulário.
 * - Validação de campo acontece em tempo real após o primeiro "blur" (toque) de cada campo,
 *   e sempre na tentativa de submit.
 */

type FieldErrors = {
  email?: string;
  password?: string;
};

interface LoginPageProps {
  logoText?: string;
  quote?: string;
  quoteAuthor?: string;
  onLogin?: (email: string, password: string) => Promise<void> | void;
  onCreateAccount?: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Informe seu email.";
  if (!EMAIL_REGEX.test(value.trim())) return "Digite um email válido.";
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return "Informe sua senha.";
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  return undefined;
}

export default function AuthPage({
  logoText = "",
  quote = "O risco vem de você não saber o que está fazendo.",
  quoteAuthor = "Warren Buffet",
  onLogin,
  onCreateAccount,
}: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runValidation = useCallback((nextEmail: string, nextPassword: string): FieldErrors => {
    return {
      email: validateEmail(nextEmail),
      password: validatePassword(nextPassword),
    };
  }, []);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleBlur = (field: "email" | "password") => (_e: FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: field === "email" ? validateEmail(email) : validatePassword(password),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setTouched({ email: true, password: true });

    const nextErrors = runValidation(email, password);
    setErrors(nextErrors);

    const hasErrors = Boolean(nextErrors.email || nextErrors.password);
    if (hasErrors) return;

    try {
      setIsSubmitting(true);
      if (onLogin) {
        await onLogin(email.trim(), password);
      } else {
        await login(email.trim(), password);
      }

      navigate("/dashboard");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Não foi possível entrar. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !validateEmail(email) && !validatePassword(password);

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Painel visual — oculto em telas pequenas */}
      <div className="relative hidden md:flex md:w-[46%] lg:w-[42%] overflow-hidden">
        <AuthIllustration logoText={logoText} quote={quote} quoteAuthor={quoteAuthor} />
      </div>

      {/* Painel do formulário */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold text-center tracking-tight text-slate-900 mb-8">
            Login
          </h1>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            {formError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              >
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleBlur("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-offset-0 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handleBlur("password")}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`w-full rounded-lg border px-3.5 py-2.5 pr-11 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-offset-0 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-r-lg"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Entrar */}
            <button
              type="submit"
              disabled={isSubmitting || (touched.email && touched.password && !isFormValid)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {isSubmitting ? "Entrando…" : "Entrar"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-slate-100" />
              <span className="text-xs text-slate-400">ou</span>
              <span className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Criar conta */}
            <button
              type="button"
              onClick={() => {
                if (onCreateAccount) {
                  onCreateAccount();
                  return;
                }
                navigate("/signup");
              }}
              className="w-full rounded-lg bg-blue-50 px-4 py-2.5 font-medium text-blue-700 transition hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              Crie sua conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
