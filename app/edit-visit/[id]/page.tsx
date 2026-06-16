"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function EditVisitPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    diagnosis: "",
    prescription: "",
    followup_date: "",
    notes: "",
  });

  useEffect(() => {
    loadVisit();
  }, []);

  const loadVisit = async () => {
    const { data, error } = await supabase
      .from("patient_followups")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      alert("Visit not found");
      return;
    }

    setForm({
      diagnosis: data.diagnosis || "",
      prescription: data.prescription || "",
      followup_date: data.followup_date || "",
      notes: data.notes || "",
    });

    setLoading(false);
  };

  const handleUpdate = async () => {
  if (!form.followup_date) {
    alert("Please select Follow-up Date");
    return;
  }

  const today = new Date()
    .toISOString()
    .split("T")[0];

  if (form.followup_date < today) {
    alert("Follow-up date cannot be in the past");
    return;
  }

  const { error } = await supabase
    .from("patient_followups")
    .update({
      diagnosis: form.diagnosis,
      prescription: form.prescription,
      followup_date: form.followup_date,
      notes: form.notes,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Error updating visit");
    return;
  }

  alert("Visit updated successfully");

  router.back();
};

  return (
    <main className="max-w-lg mx-auto min-h-screen bg-gray-50 p-4">

      <div className="mb-6">
        <Link
          href="/patients"
          className="text-blue-600 text-sm font-medium"
        >
          ← Back
        </Link>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5">

        <h1 className="text-2xl font-bold mb-6">
          Edit Visit
        </h1>

        <div className="space-y-4">

          <textarea
            className="w-full border rounded-xl p-3"
            rows={3}
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
            className="w-full border rounded-xl p-3"
            rows={3}
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
            className="w-full border rounded-xl p-3"
            value={form.followup_date}
            onChange={(e) =>
              setForm({
                ...form,
                followup_date: e.target.value,
              })
            }
          />

          <textarea
            className="w-full border rounded-xl p-3"
            rows={4}
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
            onClick={handleUpdate}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            Save Changes
          </button>

        </div>
      </div>
    </main>
  );
}