import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ui, Field, Toast } from "../ui";

const BLANK = { name: "", role: "", quote: "", rating: 5 };

export default function TestimonialsTab() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    let error;
    const payload = { ...editing };
    if (editing.id) {
      ({ error } = await supabase.from("testimonials").update(payload).eq("id", editing.id));
    } else {
      delete payload.id;
      ({ error } = await supabase.from("testimonials").insert(payload));
    }
    setSaving(false);
    if (error) setToast("Save failed");
    else {
      setToast("Saved");
      setEditing(null);
      load();
    }
    setTimeout(() => setToast(null), 2200);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  };

  if (editing) {
    return (
      <div>
        <div style={ui.card}>
          <div style={ui.sectionTitle}>{editing.id ? "Edit Testimonial" : "New Testimonial"}</div>
          <Field label="Client name">
            <input style={ui.input} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </Field>
          <Field label="Role / Company">
            <input style={ui.input} value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
          </Field>
          <Field label="Quote">
            <textarea style={ui.textarea} rows={4} value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />
          </Field>
          <Field label="Rating (1-5)">
            <input style={ui.input} type="number" min={1} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
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
        <div style={ui.sectionTitle}>Testimonials ({items.length})</div>
        <button style={ui.primaryBtn} onClick={() => setEditing({ ...BLANK, sort_order: items.length + 1 })}>+ Add Testimonial</button>
      </div>
      {items.map((t) => (
        <div key={t.id} style={ui.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{t.name} <span style={{ color: "#8B93A7", fontWeight: 400 }}>— {t.role}</span></div>
              <div style={{ fontSize: 12.5, color: "#8B93A7", marginTop: 6 }}>{"★".repeat(t.rating)}</div>
              <div style={{ fontSize: 13, color: "#C7CCDA", marginTop: 8 }}>{t.quote}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button style={ui.secondaryBtn} onClick={() => setEditing(t)}>Edit</button>
              <button style={ui.dangerBtn} onClick={() => handleDelete(t.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
      <Toast message={toast} ok={toast === "Saved"} />
    </div>
  );
}
