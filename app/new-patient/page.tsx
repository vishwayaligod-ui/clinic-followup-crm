"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function NewPatientPage() {
  const [form, setForm] = useState({
    patient_name: "",
    mobile_number: "",
    diagnosis: "",
    prescription: "",
   followup_date: "",
    notes: "",
  });

  const handleSave = async () => {
  // Patient Name Validation
  if (!form.patient_name.trim()) {
    alert("Please enter Patient Name");
    return;
  }

  if (!/^[A-Za-z ]+$/.test(form.patient_name.trim())) {
    alert("Patient name should contain only letters");
    return;
  }

  // Mobile Validation
  if (!/^[6-9]\d{9}$/.test(form.mobile_number)) {
    alert("Please enter a valid 10-digit mobile number");
    return;
  }

  

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // Block Today & Past Dates
  

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
    return;
  }

  alert("Patient saved successfully");

  setForm({
    patient_name: "",
    mobile_number: "",
    diagnosis: "",
    prescription: "",
    followup_date: today,
    notes: "",
  });
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
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
          >
            Save Patient
          </button>

        </div>

      </div>
    </main>
  );
}