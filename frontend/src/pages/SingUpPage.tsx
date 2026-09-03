import { useState, useCallback } from "react";
import type { FormEvent, ChangeEvent, FocusEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import AuthIllustration from "@/components/AuthIllustration";
import { register } from "@/lib/api";

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
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

interface LoginPageProps {
  logoText?: string;
  quote?: string;
  quoteAuthor?: string;
  onLogin?: (name: string, email: string, password: string, confirmPassword: string) => Promise<void> | void;
  onCreateAccount?: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validateName(value: string): string | undefined {
  if (!value.trim()) return "Informe seu nome.";
  return undefined;
}

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

export default function SignUpPage({
  logoText = "",
  quote = "O risco vem de você não saber o que está fazendo.",
  quoteAuthor = "Warren Buffet",
  onLogin,
  onCreateAccount,
}: LoginPageProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ name: boolean; email: boolean; password: boolean; confirmPassword: boolean }>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runValidation = useCallback((nextName: string, nextEmail: string, nextPassword: string, nextConfirmPassword: string): FieldErrors => {
    return {
      name: validateName(nextName),
      email: validateEmail(nextEmail),
      password: validatePassword(nextPassword),
      confirmPassword: validateConfirmPassword(nextConfirmPassword, nextPassword),
    };
  }, []);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateName(value) }));
    }
  };

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

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(value, password) }));
    }
  };

  function validateConfirmPassword(value: string, passwordValue: string): string | undefined {
    if (!value) return "Confirme sua senha.";
    if (value !== passwordValue) return "As senhas não coincidem.";
    return undefined;
  }

  const handleBlur = (field: "name" | "email" | "password" | "confirmPassword") => (_e: FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: field === "name"
        ? validateName(name)
        : field === "email"
          ? validateEmail(email)
          : field === "password"
            ? validatePassword(password)
            : validateConfirmPassword(confirmPassword, password),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    const nextErrors = runValidation(name, email, password, confirmPassword);
    setErrors(nextErrors);

    const hasErrors = Boolean(nextErrors.name || nextErrors.email || nextErrors.password || nextErrors.confirmPassword);
    if (hasErrors) return;

    try {
      setIsSubmitting(true);
      if (onLogin) {
        await onLogin(name.trim(), email.trim(), password, confirmPassword);
      } else {
        await register(name.trim(), email.trim(), password);
      }

      navigate("/dashboard");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Não foi possível criar a conta. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !validateName(name) && !validateEmail(email) && !validatePassword(password) && !validateConfirmPassword(confirmPassword, password);

  return (
    <div className="min-h-screen w-full flex bg-white">
      <div className="relative hidden md:flex md:w-[46%] lg:w-[42%] overflow-hidden">
        <AuthIllustration logoText={logoText} quote={quote} quoteAuthor={quoteAuthor} />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold text-center tracking-tight text-slate-900 mb-8">
            Criar conta
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

            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                value={name}
                onChange={handleNameChange}
                onBlur={handleBlur("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-offset-0 ${
                  errors.name
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              {errors.name && (
                <p id="name-error" className="mt-1.5 text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={handleBlur("confirmPassword")}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  className={`w-full rounded-lg border px-3.5 py-2.5 pr-11 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-offset-0 ${
                    errors.confirmPassword
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
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1.5 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || (touched.name && touched.email && touched.password && touched.confirmPassword && !isFormValid)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {isSubmitting ? "Criando conta…" : "Criar conta"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-slate-100" />
              <span className="text-xs text-slate-400">ou</span>
              <span className="h-px flex-1 bg-slate-100" />
            </div>

            <button
              type="button"
              onClick={() => {
                if (onCreateAccount) {
                  onCreateAccount();
                  return;
                }
                navigate("/login");
              }}
              className="w-full rounded-lg bg-blue-50 px-4 py-2.5 font-medium text-blue-700 transition hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              Acessar conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}