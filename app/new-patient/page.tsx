"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function NewPatientPage() {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patient_name: "",
    mobile_number: "",
    diagnosis: "",
    prescription: "",
    fees_amount: "",
    amount_paid: "",
    followup_date: "",
    notes: "",
  });

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);

    // Patient Name Validation
    if (!form.patient_name.trim()) {
      alert("Please enter Patient Name");
      setSaving(false);
      return;
    }

    if (!/^[A-Za-z ]+$/.test(form.patient_name.trim())) {
      alert("Patient name should contain only letters");
      setSaving(false);
      return;
    }

    // Mobile Validation
    if (!/^[6-9]\d{9}$/.test(form.mobile_number)) {
      alert("Please enter a valid 10-digit mobile number");
      setSaving(false);
      return;
    }

    if (
      Number(form.amount_paid || 0) >
      Number(form.fees_amount || 0)
    ) {
      alert(
        "Amount Paid cannot be greater than Consultation Fee"
      );
      setSaving(false);
      return;
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    // Duplicate Patient Check
    const { data: existing } = await supabase
      .from("patient_followups")
      .select("id")
      .eq("mobile_number", form.mobile_number)
      .limit(1);

    if (existing && existing.length > 0) {
      alert(
        "Patient already exists. Please search the patient and use New Visit."
      );
      setSaving(false);
      return;
    }

    // Save Patient
    const { error } = await supabase
      .from("patient_followups")
      .insert([
        {
          patient_name: form.patient_name.trim(),
          mobile_number: form.mobile_number,
          diagnosis: form.diagnosis,
          prescription: form.prescription,

          fees_amount: Number(form.fees_amount || 0),
          amount_paid: Number(form.amount_paid || 0),
          due_amount:
            Number(form.fees_amount || 0) -
            Number(form.amount_paid || 0),

          followup_date: today,
          notes: form.notes,
          visit_date: today,
          status: "Pending",
          followup_done: false,
        },
      ]);

    if (error) {
      console.error(error);
      alert(JSON.stringify(error));
      setSaving(false);
      return;
    }

    alert("Patient saved successfully");

    setForm({
      patient_name: "",
      mobile_number: "",
      diagnosis: "",
      prescription: "",
      fees_amount: "",
      amount_paid: "",
      followup_date: today,
      notes: "",
    });

    setSaving(false);
  };

  return (
    <main className="max-w-lg mx-auto min-h-screen bg-gray-50 p-4">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-600 text-sm font-medium"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h1 className="text-2xl font-bold mb-1">
          Add Patient
        </h1>

        <p className="text-gray-500 mb-6">
          Create a new patient visit
        </p>

        <div className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Patient Name"
            value={form.patient_name}
            onChange={(e) =>
              setForm({
                ...form,
                patient_name: e.target.value,
              })
            }
          />

          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Mobile Number"
            value={form.mobile_number}
            onChange={(e) =>
              setForm({
                ...form,
                mobile_number: e.target.value.replace(/\D/g, ""),
              })
            }
          />

          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={(e) =>
              setForm({
                ...form,
                diagnosis: e.target.value,
              })
            }
          />

          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Prescription"
            value={form.prescription}
            onChange={(e) =>
              setForm({
                ...form,
                prescription: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Consultation Fee"
            value={form.fees_amount}
            onChange={(e) =>
              setForm({
                ...form,
                fees_amount: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Amount Paid"
            value={form.amount_paid}
            onChange={(e) =>
              setForm({
                ...form,
                amount_paid: e.target.value,
              })
            }
          />

          <input
            type="number"
            readOnly
            className="w-full border border-gray-300 rounded-xl p-3 bg-gray-100"
            placeholder="Due Amount"
            value={
              Number(form.fees_amount || 0) -
              Number(form.amount_paid || 0)
            }
          />

          <input
            type="date"
            value={new Date().toISOString().split("T")[0]}
            readOnly
            className="w-full border border-gray-300 rounded-xl p-3 bg-gray-100"
          />

          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-xl p-3"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full text-white py-3 rounded-xl font-medium ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600"
            }`}
          >
            {saving ? "Saving..." : "Save Patient"}
          </button>
        </div>
      </div>
    </main>
  );
}