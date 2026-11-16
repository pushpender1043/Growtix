import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, Github, Linkedin, Code2, Link as LinkIcon, Loader2 } from "lucide-react";

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    github: "",
    linkedin: "",
    leetcode: "",
    other: "",
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setAddress(profile.address || "");
      if (profile.social_links) {
        setSocialLinks(profile.social_links as Record<string, string>);
      }
    }
  }, [profile]);

  const handleLinkChange = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;
      
      setLoading(true);

      const filePath = `${user.id}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrlWithCacheBuster = `${publicUrl}?v=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrlWithCacheBuster })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      toast.success("Avatar updated!");
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Try again.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          address,
          social_links: socialLinks,
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="clay-card p-8">
        <h2 className="text-2xl font-bold font-heading mb-6">User Profile</h2>
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-border/50 pb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full clay-card flex items-center justify-center overflow-hidden border-4 border-white/40 shadow-clay">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl font-bold gradient-text">
                  {(fullName || user?.email || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white shadow-float group-hover:scale-110 transition-transform cursor-pointer">
              <Camera className="w-5 h-5" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                disabled={loading}
              />
            </label>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-2xl font-bold">{fullName || "Your Name"}</h3>
            <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Information Section */}
        <div className="space-y-6 mb-8 border-b border-border/50 pb-8">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-muted-foreground cursor-not-allowed font-medium opacity-70"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
                placeholder="123 Tech Street, Silicon Valley"
              />
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="space-y-6 mb-8">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            Social Links
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Github className="w-4 h-4" /> GitHub
              </label>
              <input
                type="url"
                value={socialLinks.github || ""}
                onChange={(e) => handleLinkChange("github", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
                placeholder="https://github.com/username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </label>
              <input
                type="url"
                value={socialLinks.linkedin || ""}
                onChange={(e) => handleLinkChange("linkedin", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Code2 className="w-4 h-4" /> LeetCode
              </label>
              <input
                type="url"
                value={socialLinks.leetcode || ""}
                onChange={(e) => handleLinkChange("leetcode", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
                placeholder="https://leetcode.com/u/username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Other Link
              </label>
              <input
                type="url"
                value={socialLinks.other || ""}
                onChange={(e) => handleLinkChange("other", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="gradient-primary text-white px-8 py-3 rounded-xl font-medium shadow-clay-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
