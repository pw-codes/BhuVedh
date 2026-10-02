"use client";
import { useState } from "react";
export default function Login() {
  const [name, setName] = useState(""); const [key, setKey] = useState(""); const [err, setErr] = useState("");
  const go = async () => {
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, key }) });
    if (r.ok) location.href = "/review"; else setErr("Name or key not recognised. Ask the project lead to add you as a reviewer.");
  };
  return (
    <main className="page">
      <header><h1>Reviewer sign-in</h1></header>
      <div className="form">
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="username" /></label>
        <label>Reviewer key<input type="password" value={key} onChange={(e) => setKey(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} /></label>
        <button className="primary" onClick={go}>Sign in</button>
        <p role="alert">{err}</p>
      </div>
    </main>
  );
}
