import { useState, useMemo, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Register.css"

function getPasswordStrength(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  return Math.min(score, 4)
}

function Register() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const strength = useMemo(() => getPasswordStrength(password || ""), [password])

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (!agreeTerms) return setError("You must accept terms.")
    if (password !== confirmPassword)
      return setError("Passwords do not match.")

    try {
      setLoading(true)

      await register(fullName, email, password)

      navigate("/dashboard")
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <aside className="register-panel register-panel-left">
        <div className="register-panel-inner">
          <div className="register-brand">
            <div className="register-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="register-brand-text">TaskFlow</span>
          </div>
        </div>
      </aside>

      <main className="register-panel register-panel-right">
        <div className="register-form-wrap">
          <div className="register-card">
            <h1 className="register-card-title">Create your account</h1>

            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}

            <form className="register-form" onSubmit={handleRegister}>
              <div className="register-field">
                <label className="register-label">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="register-input"
                />
              </div>

              <div className="register-field">
                <label className="register-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="register-input"
                />
              </div>

              {/* Password Field with toggle */}
              <div className="register-field">
                <label className="register-label">Password</label>
                <div className="register-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                  />
                  <button
                    type="button"
                    className="register-toggle-password"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {/* Optional: Password strength indicator */}
                <div className={`password-strength strength-${strength}`}>
                  {password && ["Weak", "Fair", "Good", "Strong", "Very Strong"][strength] || "Weak"}

                </div>
              </div>

              {/* Confirm Password Field with toggle */}
              <div className="register-field">
                <label className="register-label">Confirm Password</label>
                <div className="register-input-wrap">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="register-input"
                  />
                  <button
                    type="button"
                    className="register-toggle-password"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="register-agree">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <label>I agree to terms</label>
              </div>

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="register-footer">
              Already have an account?{" "}
              <Link to="/" className="register-link">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Register
