import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ui, Field, Toast } from "../ui";

const BLANK = { metric: 0, suffix: "%", label: "", sub_text: "" };

export default function CaseStudiesTab() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("case_studies").select("*").order("sort_order");
    setItems(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    let error;
    const payload = { ...editing, metric: Number(editing.metric) };
    if (editing.id) {
      ({ error } = await supabase.from("case_studies").update(payload).eq("id", editing.id));
    } else {
      delete payload.id;
      ({ error } = await supabase.from("case_studies").insert(payload));
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
    if (!window.confirm("Delete this case study?")) return;
    await supabase.from("case_studies").delete().eq("id", id);
    load();
  };

  if (editing) {
    return (
      <div>
        <div style={ui.card}>
          <div style={ui.sectionTitle}>{editing.id ? "Edit Case Study" : "New Case Study"}</div>
          <Field label="Metric (number)">
            <input style={ui.input} type="number" value={editing.metric} onChange={(e) => setEditing({ ...editing, metric: e.target.value })} />
          </Field>
          <Field label="Suffix (e.g. %, x)">
            <input style={ui.input} value={editing.suffix} onChange={(e) => setEditing({ ...editing, suffix: e.target.value })} />
          </Field>
          <Field label="Label (e.g. ROI Increase)">
            <input style={ui.input} value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} />
          </Field>
          <Field label="Sub-text">
            <input style={ui.input} value={editing.sub_text} onChange={(e) => setEditing({ ...editing, sub_text: e.target.value })} />
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
        <div style={ui.sectionTitle}>Case Studies ({items.length})</div>
        <button style={ui.primaryBtn} onClick={() => setEditing({ ...BLANK, sort_order: items.length + 1 })}>+ Add Case Study</button>
      </div>
      {items.map((c) => (
        <div key={c.id} style={{ ...ui.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{c.metric}{c.suffix}</div>
            <div style={{ fontSize: 13, color: "#9DB6FF", marginTop: 2 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: "#8B93A7", marginTop: 2 }}>{c.sub_text}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={ui.secondaryBtn} onClick={() => setEditing(c)}>Edit</button>
            <button style={ui.dangerBtn} onClick={() => handleDelete(c.id)}>Delete</button>
          </div>
        </div>
      ))}
      <Toast message={toast} ok={toast === "Saved"} />
    </div>
  );
}
