// GROWTIX ONBOARDING — DO NOT MODIFY OTHER FILES
import { useState } from "react";
import { GraduationCap, Globe, ChevronDown, User, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage, LANGUAGES } from "@/hooks/useLanguage";

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Japan", "South Korea", "Brazil",
  "Singapore", "Netherlands", "Sweden", "Israel", "Nigeria",
  "South Africa", "Mexico", "Indonesia", "Philippines", "Pakistan",
];

const STEPS = ["Name", "Country", "Language"];

export default function CountrySelect() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [selectedLang, setSelectedLang] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  const handleSubmit = async () => {
    if (!country || !selectedLang) {
      toast.error("Please complete all fields");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        country,
        full_name: fullName || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;

      // Language globally set karo
      setLanguage(selectedLang as any);

      toast.success("Welcome to Growtix! 🚀");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const canNext1 = fullName.trim().length >= 2;
  const canNext2 = !!country;
  const canFinish = !!selectedLang;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "hsl(220,20%,97%)", padding: 16,
    }}>
      <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>

        {/* Logo */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "linear-gradient(135deg, hsl(225,60%,62%), hsl(270,40%,72%))",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", fontSize: 24, fontWeight: 800, color: "#fff",
          fontFamily: "'Space Grotesk', sans-serif",
          boxShadow: "0 10px 30px rgba(99,102,241,0.25)",
        }}>G</div>

        <h1 style={{
          fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
          color: "hsl(222,47%,11%)", marginBottom: 4,
        }}>
          {step === 1 ? "Welcome! 👋" : step === 2 ? "Almost there! 🌍" : "Last step! 🗣️"}
        </h1>
        <p style={{
          fontSize: 14, color: "hsl(220,10%,46%)", marginBottom: 24,
          fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.5,
        }}>
          {step === 1 ? "Tell us your name to get started"
            : step === 2 ? "Select your country to personalize experience"
            : "Choose your preferred language"}
        </p>

        {/* Step dots */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 999,
              width: i + 1 === step ? 32 : 16,
              background: i + 1 <= step
                ? "linear-gradient(90deg, hsl(225,60%,62%), hsl(270,40%,72%))"
                : "hsl(220,14%,88%)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: 20,
          boxShadow: "8px 8px 20px rgba(166,180,200,0.25), -8px -8px 20px rgba(255,255,255,0.8)",
          padding: "24px 24px",
        }}>

          {/* STEP 1: Name */}
          {step === 1 && (
            <div style={{ textAlign: "left" }}>
              <label style={{
                fontSize: 13, fontWeight: 600, color: "hsl(220,10%,46%)",
                display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                <User size={14} color="hsl(225,60%,62%)" /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                onKeyDown={e => e.key === "Enter" && canNext1 && setStep(2)}
                style={{
                  width: "100%", padding: "12px 16px",
                  borderRadius: 12, border: "1.5px solid hsl(220,14%,90%)",
                  fontSize: 15, color: "hsl(222,47%,11%)",
                  background: "hsl(220,20%,97%)", outline: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "hsl(225,60%,62%)"}
                onBlur={e => e.target.style.borderColor = "hsl(220,14%,90%)"}
              />
              <button
                onClick={() => setStep(2)}
                disabled={!canNext1}
                style={{
                  width: "100%", marginTop: 16, padding: "12px",
                  borderRadius: 12, border: "none", cursor: canNext1 ? "pointer" : "not-allowed",
                  background: canNext1
                    ? "linear-gradient(135deg, hsl(225,60%,62%), hsl(270,40%,72%))"
                    : "hsl(220,14%,90%)",
                  color: canNext1 ? "#fff" : "hsl(220,10%,60%)",
                  fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
                  transition: "opacity 0.2s",
                }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2: Country */}
          {step === 2 && (
            <div style={{ textAlign: "left" }}>
              <label style={{
                fontSize: 13, fontWeight: 600, color: "hsl(220,10%,46%)",
                display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                <Globe size={14} color="hsl(225,60%,62%)" /> Country
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 40px 12px 16px",
                    borderRadius: 12, border: "1.5px solid hsl(220,14%,90%)",
                    fontSize: 15, color: country ? "hsl(222,47%,11%)" : "hsl(220,10%,60%)",
                    background: "hsl(220,20%,97%)", outline: "none",
                    appearance: "none", WebkitAppearance: "none",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    boxSizing: "border-box", cursor: "pointer",
                  }}
                >
                  <option value="">Select your country...</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={16} style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)", color: "hsl(220,10%,60%)",
                  pointerEvents: "none",
                }} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 12,
                    border: "1.5px solid hsl(220,14%,90%)", background: "transparent",
                    fontSize: 14, color: "hsl(220,10%,46%)", cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >← Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canNext2}
                  style={{
                    flex: 2, padding: "12px", borderRadius: 12, border: "none",
                    cursor: canNext2 ? "pointer" : "not-allowed",
                    background: canNext2
                      ? "linear-gradient(135deg, hsl(225,60%,62%), hsl(270,40%,72%))"
                      : "hsl(220,14%,90%)",
                    color: canNext2 ? "#fff" : "hsl(220,10%,60%)",
                    fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Language */}
          {step === 3 && (
            <div style={{ textAlign: "left" }}>
              <label style={{
                fontSize: 13, fontWeight: 600, color: "hsl(220,10%,46%)",
                display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                <Globe size={14} color="hsl(225,60%,62%)" /> Preferred Language
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={selectedLang}
                  onChange={e => setSelectedLang(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 40px 12px 16px",
                    borderRadius: 12, border: "1.5px solid hsl(220,14%,90%)",
                    fontSize: 15, color: selectedLang ? "hsl(222,47%,11%)" : "hsl(220,10%,60%)",
                    background: "hsl(220,20%,97%)", outline: "none",
                    appearance: "none", WebkitAppearance: "none",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    boxSizing: "border-box", cursor: "pointer",
                  }}
                >
                  <option value="">Select language...</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown size={16} style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)", color: "hsl(220,10%,60%)",
                  pointerEvents: "none",
                }} />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 12,
                    border: "1.5px solid hsl(220,14%,90%)", background: "transparent",
                    fontSize: 14, color: "hsl(220,10%,46%)", cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >← Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={!canFinish || loading}
                  style={{
                    flex: 2, padding: "12px", borderRadius: 12, border: "none",
                    cursor: canFinish && !loading ? "pointer" : "not-allowed",
                    background: canFinish
                      ? "linear-gradient(135deg, hsl(225,60%,62%), hsl(270,40%,72%))"
                      : "hsl(220,14%,90%)",
                    color: canFinish ? "#fff" : "hsl(220,10%,60%)",
                    fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {loading ? "Saving..." : "🚀 Get Started"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step label */}
        <p style={{
          marginTop: 16, fontSize: 12, color: "hsl(220,10%,60%)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Step {step} of {STEPS.length} — {STEPS[step - 1]}
        </p>
      </div>
    </div>
  );
}