import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthModal({ open, onClose }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        login({ email, password });
      } else {
        signup({ email, password, fullName });
      }
      setEmail("");
      setPassword("");
      setFullName("");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} aria-hidden="true">
      <div className="auth-modal" onClick={(event) => event.stopPropagation()} aria-hidden="true">
        <div className="auth-modal__header">
          <h2>{mode === "login" ? "Entrar" : "Criar conta"}</h2>
          <button type="button" className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className="field">
              <span>Nome</span>
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            </label>
          ) : null}

          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          <label className="field">
            <span>Senha</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="button button--primary button--full">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          className="text-link"
          onClick={() => {
            setError("");
            setMode(mode === "login" ? "signup" : "login");
          }}
        >
          {mode === "login" ? "Nao tem conta? Criar agora" : "Ja tem conta? Fazer login"}
        </button>
      </div>
    </div>
  );
}
