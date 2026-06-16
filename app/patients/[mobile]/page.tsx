"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function PatientDetailsPage() {
  const params = useParams();
  const mobile = Array.isArray(params.mobile)
  ? params.mobile[0]
  : params.mobile;

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mobile) {
      loadPatientHistory();
    }
  }, [mobile]);

  const loadPatientHistory = async () => {
    const { data, error } = await supabase
      .from("patient_followups")
      .select("*")
      .eq("mobile_number", mobile)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setHistory(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="max-w-xl mx-auto min-h-screen p-6">
        <p>Loading...</p>
      </main>
    );
  }

  if (history.length === 0) {
    return (
      <main className="max-w-xl mx-auto min-h-screen p-6">
        <Link
          href="/"
          className="text-blue-600 text-sm font-medium"
        >
          ← Back
        </Link>

        <div className="mt-6 bg-white border rounded-3xl p-6 shadow-sm">
          <h1 className="text-xl font-bold mb-2">
            Patient Not Found
          </h1>

          <p>No records found for:</p>

          <p className="font-semibold mt-2">
            {mobile}
          </p>
        </div>
      </main>
    );
  }

  const patient = history[0];

  const message = encodeURIComponent(
    `Dear ${patient.patient_name},

This is a reminder from Yashodeep Clinic.

Your follow-up consultation is due.

Please contact the clinic if required.

Thank you.`
  );

  return (
    <main className="max-w-xl mx-auto min-h-screen bg-gray-50 p-4">

      {/* Back */}

      <Link
        href="/"
        className="text-blue-600 text-sm font-medium"
      >
        ← Back
      </Link>

      {/* Patient Profile */}

      <div className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-3xl p-7 shadow-lg">
        <div className="flex items-center gap-3">

          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            👤
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              {patient.patient_name}
            </h1>

            <p className="text-blue-100">
              📞 {patient.mobile_number}
            </p>
          </div>

        </div>

        <div className="mt-5 flex gap-3">

          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-xs text-blue-100">
              Total Visits
            </p>

            <p className="font-bold text-lg">
              {history.length}
            </p>
          </div>

          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-xs text-blue-100">
              Last Visit
            </p>

            <p className="font-bold text-sm">
              {new Date(
                patient.created_at
              ).toLocaleDateString()}
            </p>
          </div>

        </div>

      </div>

      {/* Action Buttons */}

      <div className="flex gap-3 mt-5 mb-6">

       <Link
  href={`/new-visit/${patient.mobile_number}`}
  className="flex-1 bg-blue-600 text-white text-center py-4 rounded-2xl font-medium shadow-sm"
>
  ➕ New Visit
</Link>
        <a
          href={`https://wa.me/91${patient.mobile_number}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-600 text-white text-center py-4 rounded-2xl font-medium shadow-sm"
        >
          💬 WhatsApp
        </a>

      </div>

      {/* History Header */}

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-xl font-bold">
          📋 Visit History
        </h2>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {history.length} Record(s)
        </span>

      </div>

      {/* Visit Cards */}

      <div className="space-y-4">

        {history.map((visit, index) => (
          <div
            key={visit.id}
            className="bg-white rounded-3xl border shadow-sm p-5"
          >

            <div className="flex justify-between items-center mb-4">

              <h3 className="font-bold text-lg">
                Visit Record
              </h3>

              <span className="text-sm text-gray-500">
                {new Date(
                  visit.created_at
                ).toLocaleDateString()}
              </span>

            </div>

            <div className="space-y-4">

              <div>
                <p className="text-orange-600 font-semibold text-sm">
                  🩺 Diagnosis
                </p>

                <p className="mt-1">
                  {visit.diagnosis || "-"}
                </p>
              </div>

              <div>
                <p className="text-blue-600 font-semibold text-sm">
                  💊 Prescription
                </p>

                <p className="mt-1">
                  {visit.prescription || "-"}
                </p>
              </div>

              <div>
                <p className="text-green-600 font-semibold text-sm">
                 📅 Visit Date
                </p>

                <p className="mt-1">
                  {visit.visit_date || "-"}
                </p>
              </div>
{index === 0 && (
  <div>
    <p className="text-purple-600 font-semibold text-sm">
      🔔 Next Follow-up Date
    </p>

    <p className="mt-1">
      {visit.followup_date || "-"}
    </p>
  </div>
)}              <div>
                <p className="text-gray-600 font-semibold text-sm">
                  📝 Notes
                </p>

                <p className="mt-1">
                  {visit.notes || "-"}
                </p>
              </div>

              <Link
                href={`/edit-visit/${visit.id}`}
                className="block w-full bg-gray-800 text-white text-center py-3 rounded-2xl font-medium mt-2"
              >
                ✏️ Edit Visit
              </Link>

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}