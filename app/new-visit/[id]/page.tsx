"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function NewVisitPage() {
  const params = useParams();
  const router = useRouter();

  const mobile = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [loading, setLoading] = useState(true);

  const [patientName, setPatientName] = useState("");

  const [form, setForm] = useState({
    diagnosis: "",
    prescription: "",
    followup_date: "",
    notes: "",
  });

  useEffect(() => {
    if (mobile) {
      loadPatient();
    }
  }, [mobile]);

  const loadPatient = async () => {
    const { data, error } = await supabase
      .from("patient_followups")
      .select("*")
      .eq("mobile_number", mobile)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      alert(JSON.stringify(error));
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      alert("No patient found");
      setLoading(false);
      return;
    }

    const latestVisit = data[0];

    setPatientName(latestVisit.patient_name);
    setLoading(false);
  };

  const handleSave = async () => {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    if (!form.followup_date) {
      alert("Please select Next Followup Date");
      return;
    }

    if (form.followup_date < today) {
      alert("Follow-up date cannot be in the past");
      return;
    }

    await supabase
      .from("patient_followups")
      .update({
        followup_done: true,
        status: "Completed",
      })
      .eq("mobile_number", mobile)
      .eq("followup_done", false)
      .eq("followup_date", today);

    const { error } = await supabase
      .from("patient_followups")
      .insert([
        {
          patient_name: patientName,
          mobile_number: mobile,
          diagnosis: form.diagnosis,
          prescription: form.prescription,
          followup_date: form.followup_date,
          notes: form.notes,
          visit_date: today,
          followup_done: false,
          status: "Pending",
        },
      ]);

    if (error) {
      console.error(error);
      alert(JSON.stringify(error));
      return;
    }

    alert("New visit added successfully");

    router.push(`/patients/${mobile}`);
  };

  if (loading) {
    return (
      <main className="max-w-lg mx-auto p-4">
        Loading...
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto min-h-screen bg-gray-50 p-4">

      <div className="mb-6">
        <Link
          href={`/patients/${mobile}`}
          className="text-blue-600 text-sm font-medium"
        >
          ← Back
        </Link>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5">

        <h1 className="text-2xl font-bold mb-6">
          New Visit
        </h1>

        <div className="space-y-4">

          <input
            value={patientName}
            disabled
            className="w-full border rounded-xl p-3 bg-gray-100"
          />

          <input
            value={mobile}
            disabled
            className="w-full border rounded-xl p-3 bg-gray-100"
          />

          <textarea
            rows={3}
            placeholder="Diagnosis"
            className="w-full border rounded-xl p-3"
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
            placeholder="Prescription"
            className="w-full border rounded-xl p-3"
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
            rows={4}
            placeholder="Notes"
            className="w-full border rounded-xl p-3"
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
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            Save New Visit
          </button>

        </div>

      </div>
    </main>
  );
}