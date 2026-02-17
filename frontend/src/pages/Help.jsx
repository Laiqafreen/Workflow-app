import { useState, useEffect } from "react"
import Layout from "../components/Layout"

function Help() {
  const [expandedId, setExpandedId] = useState(null)
  const [faqs, setFaqs] = useState([])

  // Fetch FAQs from backend on mount
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/faqs", {
          method: "GET",
          credentials: "include"
        })
        if (!res.ok) throw new Error("Failed to fetch FAQs")
        const data = await res.json()
        setFaqs(data.faqs || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchFaqs()
  }, [])

  // Optional: handle contact support click
  const handleContactSupport = async () => {
    try {
      // Example: send a support request or open chat
      const res = await fetch("http://localhost:5001/api/support/contact", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "User wants support" })
      })
      if (!res.ok) throw new Error("Failed to contact support")
      alert("Support team has been notified!")
    } catch (err) {
      console.error(err)
      alert("Error contacting support")
    }
  }

  return (
    <Layout>
      <div className="help-page">
        <div className="help-header">
          <h1 className="help-title">Help & Support</h1>
          <p className="help-subtitle">Find answers to common questions</p>
        </div>

        <div className="help-content">
          <div className="help-section">
            <h2 className="help-section-title">Frequently Asked Questions</h2>
            <div className="help-faqs">
              {faqs.map((faq) => (
                <div key={faq.id} className="help-faq-item">
                  <button
                    className="help-faq-question"
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  >
                    <span>{faq.question}</span>
                    <svg
                      className={`help-faq-icon ${expandedId === faq.id ? "expanded" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {expandedId === faq.id && (
                    <div className="help-faq-answer">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="help-section">
            <h2 className="help-section-title">Still need help?</h2>
            <div className="help-card">
              <div className="help-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h3 className="help-card-title">Contact Support</h3>
              <p className="help-card-text">
                Our support team is available 24/7 to help you with any questions or issues.
              </p>
              <button className="help-card-button" onClick={handleContactSupport}>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Help
