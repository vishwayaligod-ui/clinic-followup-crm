"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowups();
  }, []);

  const loadFollowups = async () => {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("patient_followups")
      .select("*")
      .eq("followup_date", today)
      .eq("followup_done", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setFollowups(data || []);
    setLoading(false);
  };

  const markDone = async (id: number) => {
    const confirmDone = confirm(
      "Mark this follow-up as completed?"
    );

    if (!confirmDone) return;

    const { error } = await supabase
      .from("patient_followups")
      .update({
        followup_done: true,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error updating follow-up");
      return;
    }
alert("Follow-up marked as completed");
    loadFollowups();
  };

  if (loading) {
    return (
      <main className="max-w-lg mx-auto min-h-screen p-4">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto min-h-screen bg-gray-50 p-4">

      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-600 text-sm font-medium"
        >
          ← Back
        </Link>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h1 className="text-2xl font-bold">
          Today's Follow-ups
        </h1>

        <p className="text-gray-500 mt-2">
          {followups.length} Pending Follow-up(s)
        </p>
      </div>

      {followups.length === 0 ? (
        <div className="bg-white border rounded-2xl p-6 text-center">
          <h2 className="font-semibold text-green-600">
            🎉 All Follow-ups Completed
          </h2>

          <p className="text-gray-500 mt-2">
            No pending follow-ups for today.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {followups.map((patient) => {
            const message = encodeURIComponent(
              `Dear ${patient.patient_name},

This is a reminder from Yashodeep Clinic.

Your follow-up consultation is due today.

Please contact the clinic if required.

Thank you.`
            );

            return (
              <div
                key={patient.id}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >
                <h2 className="font-bold text-lg">
                  {patient.patient_name}
                </h2>

                <p className="text-gray-500">
                  📞 {patient.mobile_number}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Follow-up Date:
                  {" "}
                  {patient.followup_date}
                </p>

                <div className="grid grid-cols-1 gap-2 mt-4">

                  <a
                    href={`https://wa.me/91${patient.mobile_number}?text=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white text-center py-3 rounded-xl"
                  >
                    💬 Send WhatsApp
                  </a>

                  <Link
                    href={`/patients/${patient.mobile_number}`}
                    className="bg-blue-600 text-white text-center py-3 rounded-xl"
                  >
                    📋 View History
                  </Link>

                  <button
                    onClick={() => markDone(patient.id)}
                    className="bg-gray-800 text-white py-3 rounded-xl"
                  >
                    ✅ Mark Done
                  </button>

                </div>
              </div>
            );
          })}

        </div>
      )}
    </main>
  );
}