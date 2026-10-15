"use client";

import { useState } from "react";
import Link from "next/link";
import "./register.css";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    jenengJangkep: "",
    username: "",
    klas: "",
    nomerAbsen: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register data:", formData);
  };

  return (
    <main className="register-root">
      {/* Konten di atas background */}
      <div className="register-content">
        {/* Panel kanan — area dinding batu */}
        <section className="register-panel" aria-label="Formulir Pendaftaran">
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            
            {/* Field 1: JENENG JANGKEP */}
            <div className="register-slab-item">
              {/* Retakan Batu Tebal Khas Desain */}
              <svg className="register-crack-top" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M0 0L12 8L24 4L35 12L48 6" stroke="#382d20" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0 2.5L12 10.5L24 6.5L35 14.5L48 8.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
                <path d="M24 4L28 14" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M29 14.5L33 11" stroke="#382d20" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <svg className="register-crack-bottom" viewBox="0 0 40 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 12L14 5L26 9L38 2" stroke="#382d20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 14L14 7L26 11L38 4" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <path d="M14 5L10 0" stroke="#382d20" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <svg className="register-crack-side" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M23 2L12 14L18 20L5 28" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 3.5L13 15.5L19 21.5L6 29.5" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              </svg>

              <div className="register-slab-left">
                <span className="register-icon-wrap" aria-hidden="true">
                  <img
                    src="/login_assets/kartu.png"
                    alt=""
                    className="register-img-icon"
                  />
                </span>
                <label htmlFor="reg-jeneng" className="register-field-title">
                  JENENG JANGKEP
                </label>
              </div>
              <div className="register-slab-right">
                <input
                  id="reg-jeneng"
                  type="text"
                  name="jenengJangkep"
                  value={formData.jenengJangkep}
                  onChange={handleChange}
                  placeholder="Masukkan Jeneng Jangkep"
                  className="register-input-field"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Field 2: USERNAME */}
            <div className="register-slab-item">
              {/* Retakan Batu Tebal Khas Desain */}
              <svg className="register-crack-top-alt" viewBox="0 0 45 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 1L12 9L22 4L34 11L44 5" stroke="#382d20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 3L12 11L22 6L34 13L44 7" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <path d="M22 4L20 12" stroke="#382d20" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <svg className="register-crack-bottom-alt" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 14L15 6L25 10L38 3L47 8" stroke="#382d20" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 16L15 8L25 12L38 5L47 10" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <path d="M15 6L18 0" stroke="#382d20" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <svg className="register-crack-mid" viewBox="0 0 35 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 12L12 4L22 8L32 1" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 14L12 6L22 10L32 3" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              </svg>

              <div className="register-slab-left">
                <span className="register-icon-wrap" aria-hidden="true">
                  <img
                    src="/login_assets/tas.png"
                    alt=""
                    className="register-img-icon"
                  />
                </span>
                <label htmlFor="reg-username" className="register-field-title">
                  USERNAME
                </label>
              </div>
              <div className="register-slab-right">
                <input
                  id="reg-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan Nama Pengguna"
                  className="register-input-field"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Field 3: KLAS */}
            <div className="register-slab-item">
              {/* Retakan Batu Tebal Khas Desain */}
              <svg className="register-crack-top" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M0 0L12 8L24 4L35 12L48 6" stroke="#382d20" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0 2.5L12 10.5L24 6.5L35 14.5L48 8.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
                <path d="M24 4L28 14" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" />
              </svg>
              <svg className="register-crack-bottom" viewBox="0 0 40 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 12L14 5L26 9L38 2" stroke="#382d20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 14L14 7L26 11L38 4" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              </svg>
              <svg className="register-crack-side" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M23 2L12 14L18 20L5 28" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 3.5L13 15.5L19 21.5L6 29.5" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              </svg>

              <div className="register-slab-left">
                <span className="register-icon-wrap" aria-hidden="true">
                  <img
                    src="/login_assets/buku.png"
                    alt=""
                    className="register-img-icon"
                  />
                </span>
                <label htmlFor="reg-klas" className="register-field-title">
                  KLAS
                </label>
              </div>
              <div className="register-slab-right">
                <input
                  id="reg-klas"
                  type="text"
                  name="klas"
                  value={formData.klas}
                  onChange={handleChange}
                  placeholder="(Tuladha: 7A, 7B)"
                  className="register-input-field"
                  required
                />
              </div>
            </div>

            {/* Field 4: NOMER ABSEN */}
            <div className="register-slab-item">
              {/* Retakan Batu Tebal Khas Desain */}
              <svg className="register-crack-top-alt" viewBox="0 0 45 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 1L12 9L22 4L34 11L44 5" stroke="#382d20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 3L12 11L22 6L34 13L44 7" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <path d="M22 4L20 12" stroke="#382d20" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <svg className="register-crack-bottom-alt" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 14L15 6L25 10L38 3L47 8" stroke="#382d20" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 16L15 8L25 12L38 5L47 10" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <path d="M15 6L18 0" stroke="#382d20" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <svg className="register-crack-mid" viewBox="0 0 35 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 12L12 4L22 8L32 1" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 14L12 6L22 10L32 3" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              </svg>

              <div className="register-slab-left">
                <span className="register-icon-wrap" aria-hidden="true">
                  <img
                    src="/login_assets/absen.png"
                    alt=""
                    className="register-img-icon"
                  />
                </span>
                <label htmlFor="reg-absen" className="register-field-title">
                  NOMER ABSEN
                </label>
              </div>
              <div className="register-slab-right">
                <input
                  id="reg-absen"
                  type="text"
                  inputMode="numeric"
                  name="nomerAbsen"
                  value={formData.nomerAbsen}
                  onChange={handleChange}
                  placeholder="Nomer Absen"
                  className="register-input-field"
                  required
                />
              </div>
            </div>

            {/* Field 5: PASSWORD */}
            <div className="register-slab-item">
              {/* Retakan Batu Tebal Khas Desain */}
              <svg className="register-crack-top" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M0 0L12 8L24 4L35 12L48 6" stroke="#382d20" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0 2.5L12 10.5L24 6.5L35 14.5L48 8.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
                <path d="M24 4L28 14" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" />
              </svg>
              <svg className="register-crack-bottom" viewBox="0 0 40 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 12L14 5L26 9L38 2" stroke="#382d20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 14L14 7L26 11L38 4" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              </svg>
              <svg className="register-crack-side" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M23 2L12 14L18 20L5 28" stroke="#382d20" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 3.5L13 15.5L19 21.5L6 29.5" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              </svg>

              <div className="register-slab-left">
                <span className="register-icon-wrap" aria-hidden="true">
                  <img
                    src="/login_assets/kompas.png"
                    alt=""
                    className="register-img-icon"
                  />
                </span>
                <label htmlFor="reg-pass" className="register-field-title">
                  PASSWORD
                </label>
              </div>
              <div className="register-slab-right register-password-cell">
                <input
                  id="reg-pass"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="register-input-field"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="register-toggle-eye"
                  aria-label={showPassword ? "Singidake Sandi" : "Tuduhake Sandi"}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="register-eye-svg" xmlns="http://www.w3.org/2000/svg">
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
            <div className="register-btn-wrap">
              <button type="submit" className="register-submit-btn" aria-label="Wiwiti">
                <img
                  src="/login_assets/wiwitibutton.webp"
                  alt="Wiwiti"
                  className="register-btn-asset-img"
                />
              </button>
            </div>

            {/* Link Masuk / Sudah Punya Akun */}
            <div className="register-login-link-row">
              <span className="register-footer-label">Sudah Punya Akun? </span>
              <Link href="/login" className="register-footer-action">
                Masuk disini
              </Link>
            </div>

          </form>
        </section>
      </div>
    </main>
  );
}

