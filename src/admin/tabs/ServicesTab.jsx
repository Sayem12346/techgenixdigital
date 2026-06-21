import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ui, Field, Toast } from "../ui";

const BLANK = { number_label: "", title: "", description: "", image_url: "", features: [] };

export default function ServicesTab() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // service object being edited, or null
  const [featuresText, setFeaturesText] = useState("");
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setItems(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (item) => {
    setEditing(item || { ...BLANK, sort_order: items.length + 1 });
    setFeaturesText((item?.features || []).join(", "));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `service-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(path);
      setEditing({ ...editing, image_url: urlData.publicUrl });
    } else {
      setToast("Upload failed");
      setTimeout(() => setToast(null), 2200);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...editing,
      features: featuresText.split(",").map((f) => f.trim()).filter(Boolean),
    };
    let error;
    if (editing.id) {
      ({ error } = await supabase.from("services").update(payload).eq("id", editing.id));
    } else {
      delete payload.id;
      ({ error } = await supabase.from("services").insert(payload));
    }
    setSaving(false);
    if (error) {
      setToast("Save failed");
    } else {
      setToast("Saved");
      setEditing(null);
      load();
    }
    setTimeout(() => setToast(null), 2200);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await supabase.from("services").delete().eq("id", id);
    load();
  };

  if (editing) {
    return (
      <div>
        <div style={ui.card}>
          <div style={ui.sectionTitle}>{editing.id ? "Edit Service" : "New Service"}</div>
          <Field label="Number label (e.g. 01)">
            <input style={ui.input} value={editing.number_label} onChange={(e) => setEditing({ ...editing, number_label: e.target.value })} />
          </Field>
          <Field label="Title">
            <input style={ui.input} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea style={ui.textarea} rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </Field>
          <Field label="Features (comma-separated)">
            <input style={ui.input} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="Facebook Ads, Google Ads, ..." />
          </Field>
          <Field label="Image">
            {editing.image_url && <img src={editing.image_url} alt="" style={{ width: "100%", maxWidth: 240, borderRadius: 10, marginBottom: 10, display: "block" }} />}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: "#9AA1B5", fontSize: 13 }} />
            {uploading && <div style={{ color: "#5B8CFF", fontSize: 12.5, marginTop: 8 }}>Uploading...</div>}
          </Field>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={ui.primaryBtn} onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button style={ui.secondaryBtn} onClick={() => setEditing(null)}>Cancel</button>
        </div>
        <Toast message={toast} ok={toast === "Saved"} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={ui.sectionTitle}>Services ({items.length})</div>
        <button style={ui.primaryBtn} onClick={() => startEdit(null)}>+ Add Service</button>
      </div>
      {items.map((s) => (
        <div key={s.id} style={{ ...ui.card, display: "flex", gap: 14, alignItems: "center" }}>
          {s.image_url ? (
            <img src={s.image_url} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: 10, background: "#11182B", flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{s.title}</div>
            <div style={{ fontSize: 12.5, color: "#8B93A7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.description}</div>
          </div>
          <button style={ui.secondaryBtn} onClick={() => startEdit(s)}>Edit</button>
          <button style={ui.dangerBtn} onClick={() => handleDelete(s.id)}>Delete</button>
        </div>
      ))}
      <Toast message={toast} ok={toast === "Saved"} />
    </div>
  );
}
