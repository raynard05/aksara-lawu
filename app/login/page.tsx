"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FallenLeaves from "../components/fallenleaves/FallenLeaves";
import { supabase } from "@/lib/supabaseClient";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.username.trim() || !formData.password) {
      setStatusMessage({ type: "error", text: "Username lan Sandi kudu diisi ya!" });
      return;
    }

    try {
      setLoading(true);

      // Cari user berdasarkan username
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("id, nama_lengkap, username, kelas, nomor_absen, kata_sandi")
        .eq("username", formData.username.trim().toLowerCase())
        .maybeSingle();

      if (fetchError) {
        console.error("Error query user:", fetchError);
        setStatusMessage({ type: "error", text: "Gagal nyambung menyang server!" });
        setLoading(false);
        return;
      }

      if (!user) {
        setStatusMessage({ type: "error", text: "Username ora ditemokake. Priksa maneh ya!" });
        setLoading(false);
        return;
      }

      // Cek kecocokan password
      if (user.kata_sandi !== formData.password) {
        setStatusMessage({ type: "error", text: "Sandi sing kok lebokake salah!" });
        setLoading(false);
        return;
      }

      // Simpan session pengguna di localStorage untuk state game
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "aksara_lawu_user",
          JSON.stringify({
            id: user.id,
            nama_lengkap: user.nama_lengkap,
            username: user.username,
            kelas: user.kelas,
            nomor_absen: user.nomor_absen,
          })
        );
      }

      setStatusMessage({ type: "success", text: `Sugeng Rawuh, ${user.nama_lengkap}! Mlebu game...` });
      setTimeout(() => {
        // Arahkan ke menu utama permainan
        router.push("/menu");
      }, 1200);
    } catch (err: unknown) {
      console.error("Login error:", err);
      setStatusMessage({ type: "error", text: "Ana kaluputan ing sistem. Cobi malih!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-root">
      {/* Daun berjatuhan perlahan di panel kiri (area tugu & langit) */}
      <FallenLeaves className="login-leaves-panel" />

      {/* Konten di atas background */}
      <div className="login-content">
        {/* Panel kanan — area dinding batu */}
        <section className="login-panel" aria-label="Formulir Masuk">
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Notifikasi Status Pesan */}
            {statusMessage && (
              <div className={`login-status-msg ${statusMessage.type}`}>
                {statusMessage.text}
              </div>
            )}

            {/* Field 1: USERNAME */}
            <div className="login-slab-item">
              {/* Retakan Batu Tebal Khas Desain */}
              <svg className="login-crack-top" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M0 0L12 8L24 4L35 12L48 6" stroke="#382d20" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0 2.5L12 10.5L24 6.5L35 14.5L48 8.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
                <path d="M24 4L28 14" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M29 14.5L33 11" stroke="#382d20" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <svg className="login-crack-bottom" viewBox="0 0 40 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 12L14 5L26 9L38 2" stroke="#382d20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 14L14 7L26 11L38 4" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <path d="M14 5L10 0" stroke="#382d20" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <svg className="login-crack-side" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M23 2L12 14L18 20L5 28" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 3.5L13 15.5L19 21.5L6 29.5" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              </svg>

              <div className="login-slab-left">
                <span className="login-icon-wrap" aria-hidden="true">
                  <img
                    src="/login_assets/tas.png"
                    alt=""
                    className="login-img-icon"
                  />
                </span>
                <label htmlFor="login-username" className="login-field-title">
                  USERNAME
                </label>
              </div>
              <div className="login-slab-right">
                <input
                  id="login-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan Nama Pengguna"
                  className="login-input-field"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Field 2: PASSWORD */}
            <div className="login-slab-item">
              {/* Retakan Batu Tebal Khas Desain */}
              <svg className="login-crack-top-alt" viewBox="0 0 45 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 1L12 9L22 4L34 11L44 5" stroke="#382d20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 3L12 11L22 6L34 13L44 7" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <path d="M22 4L20 12" stroke="#382d20" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <svg className="login-crack-bottom-alt" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 14L15 6L25 10L38 3L47 8" stroke="#382d20" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 16L15 8L25 12L38 5L47 10" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <path d="M15 6L18 0" stroke="#382d20" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <svg className="login-crack-mid" viewBox="0 0 35 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 12L12 4L22 8L32 1" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 14L12 6L22 10L32 3" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              </svg>

              <div className="login-slab-left">
                <span className="login-icon-wrap" aria-hidden="true">
                  <img
                    src="/login_assets/kompas.png"
                    alt=""
                    className="login-img-icon"
                  />
                </span>
                <label htmlFor="login-pass" className="login-field-title">
                  PASSWORD
                </label>
              </div>
              <div className="login-slab-right login-password-cell">
                <input
                  id="login-pass"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="login-input-field"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-toggle-eye"
                  aria-label={showPassword ? "Singidake Sandi" : "Tuduhake Sandi"}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="login-eye-svg" xmlns="http://www.w3.org/2000/svg">
                    {showPassword ? (
                      <>
                        <path d="M3 3L21 21M10.584 10.587C9.609 11.562 9.609 13.14 10.584 14.115C11.559 15.09 13.137 15.09 14.112 14.115M9.363 5.365C10.222 5.125 11.103 5 12 5C17 5 21.27 8.11 22.5 12.5C21.905 14.61 20.61 16.42 18.88 17.65M6.53 6.53C4.24 8.04 2.65 10.29 1.5 12.5C2.73 16.89 7 20 12 20C13.88 20 15.65 19.47 17.18 18.55" stroke="#3D2E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12C2.5 7 7 4 12 4C17 4 21.5 7 23 12C21.5 17 17 20 12 20C7 20 2.5 17 1 12Z" fill="#3D2E1E" fillOpacity="0.1" stroke="#3D2E1E" strokeWidth="2" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3.5" fill="#3D2E1E" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Tombol Wiwiti */}
            <div className="login-btn-wrap">
              <button type="submit" className="login-submit-btn" aria-label="Wiwiti" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                <img
                  src="/login_assets/wiwitbutton.webp"
                  alt="Wiwiti"
                  className="login-btn-asset-img"
                />
              </button>
            </div>

            {/* Link Daftar / Belum Punya Akun */}
            <div className="login-register-link-row">
              <span className="login-footer-label">Belum Punya Akun? </span>
              <Link href="/register" className="login-footer-action">
                Daftar disini
              </Link>
            </div>

          </form>
        </section>
      </div>
    </main>
  );
}

