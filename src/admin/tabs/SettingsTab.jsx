import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ui, Field, Toast } from "../ui";

export default function SettingsTab() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data, error }) => {
        if (!error) setForm(data);
      });
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    const ext = file.name.split(".").pop();
    const path = `logo-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (uploadError) {
      setToast("Logo upload failed");
      setUploadingLogo(false);
      setTimeout(() => setToast(null), 2500);
      return;
    }
    const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(path);
    setForm({ ...form, logo_url: urlData.publicUrl });
    setUploadingLogo(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update(form).eq("id", 1);
    setSaving(false);
    setToast(error ? "Save failed" : "Saved");
    setTimeout(() => setToast(null), 2200);
  };

  if (!form) return <div style={{ color: "#8B93A7" }}>Loading...</div>;

  return (
    <div>
      <div style={ui.card}>
        <div style={ui.sectionTitle}>Logo</div>
        <div style={ui.sectionDesc}>Upload to replace the site logo (navbar & footer).</div>
        {form.logo_url && (
          <img src={form.logo_url} alt="Logo preview" style={{ height: 40, marginBottom: 14, background: "#fff", padding: 6, borderRadius: 8 }} />
        )}
        <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ color: "#9AA1B5", fontSize: 13 }} />
        {uploadingLogo && <div style={{ color: "#5B8CFF", fontSize: 12.5, marginTop: 8 }}>Uploading...</div>}
      </div>

      <div style={ui.card}>
        <div style={ui.sectionTitle}>Hero Section</div>
        <div style={ui.sectionDesc}>The main headline visitors see first.</div>
        <Field label="Badge text">
          <input style={ui.input} value={form.hero_badge || ""} onChange={set("hero_badge")} />
        </Field>
        <Field label="Headline">
          <textarea style={ui.textarea} rows={3} value={form.hero_headline || ""} onChange={set("hero_headline")} />
        </Field>
        <Field label="Subheadline">
          <textarea style={ui.textarea} rows={3} value={form.hero_subheadline || ""} onChange={set("hero_subheadline")} />
        </Field>
      </div>

      <div style={ui.card}>
        <div style={ui.sectionTitle}>Contact Information</div>
        <Field label="Phone (with country code, no spaces)">
          <input style={ui.input} value={form.phone || ""} onChange={set("phone")} placeholder="+8801XXXXXXXXX" />
        </Field>
        <Field label="WhatsApp number (digits only, e.g. 8801XXXXXXXXX)">
          <input style={ui.input} value={form.whatsapp || ""} onChange={set("whatsapp")} />
        </Field>
        <Field label="Email">
          <input style={ui.input} value={form.email || ""} onChange={set("email")} />
        </Field>
        <Field label="Office address">
          <textarea style={ui.textarea} rows={2} value={form.address || ""} onChange={set("address")} />
        </Field>
        <Field label="Business hours">
          <input style={ui.input} value={form.business_hours || ""} onChange={set("business_hours")} />
        </Field>
        <Field label="Facebook URL">
          <input style={ui.input} value={form.facebook_url || ""} onChange={set("facebook_url")} />
        </Field>
        <Field label="YouTube URL">
          <input style={ui.input} value={form.youtube_url || ""} onChange={set("youtube_url")} />
        </Field>
      </div>

      <button style={ui.primaryBtn} onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </button>

      <Toast message={toast} ok={toast === "Saved"} />
    </div>
  );
}
