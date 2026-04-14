import { useState } from "react";
import { GraduationCap, Globe, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Japan", "South Korea", "Brazil",
  "Singapore", "Netherlands", "Sweden", "Israel", "Nigeria",
  "South Africa", "Mexico", "Indonesia", "Philippines", "Pakistan",
];

export default function CountrySelect() {
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!country) {
      toast.error("Please select your country");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        country,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Profile updated!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-heading font-bold mb-1">Almost there! 🌍</h1>
        <p className="text-muted-foreground text-sm mb-8">Select your country to personalize your experience</p>

        <div className="clay-card p-6 text-left">
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-primary" /> Country
          </label>
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted/30 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select your country...</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !country}
            className="w-full mt-6 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Saving..." : "Continue to Dashboard →"}
          </button>
        </div>
      </div>
    </div>
  );
}
