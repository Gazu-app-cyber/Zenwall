import { useState } from "react";
import Drawer from "@/components/Drawer";
import { toast } from "sonner";

export default function AuthModal({ open, onClose, onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });

  const submit = () => {
    try {
      if (mode === "login") onLogin({ email: form.email, password: form.password });
      else onSignup(form);
      setForm({ full_name: "", email: "", password: "" });
    } catch (error) {
      if (error.message === "INVALID_CREDENTIALS") toast.error("Email ou senha invalidos");
      else if (error.message === "EMAIL_ALREADY_EXISTS") toast.error("Ja existe uma conta com esse email");
      else toast.error("Nao foi possivel entrar agora");
    }
  };

  return (
    <Drawer open={open} onClose={onClose} title={mode === "login" ? "Entrar" : "Criar conta"}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-background/70 p-1">
          <button onClick={() => setMode("login")} className={`rounded-2xl px-4 py-2 text-sm ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            Entrar
          </button>
          <button onClick={() => setMode("signup")} className={`rounded-2xl px-4 py-2 text-sm ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            Criar conta
          </button>
        </div>
        {mode === "signup" && (
          <input
            value={form.full_name}
            onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
            placeholder="Seu nome"
            className="w-full rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm outline-none"
          />
        )}
        <input
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="email@exemplo.com"
          className="w-full rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm outline-none"
        />
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          placeholder="Senha"
          className="w-full rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm outline-none"
        />
        <button onClick={submit} className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
          {mode === "login" ? "Entrar na conta" : "Criar conta"}
        </button>
      </div>
    </Drawer>
  );
}
