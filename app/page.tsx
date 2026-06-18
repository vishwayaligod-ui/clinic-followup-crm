"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const [totalPatients, setTotalPatients] = useState(0);
  const [todayFollowups, setTodayFollowups] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const today = new Date().toISOString().split("T")[0];

    const { data: patients } = await supabase
      .from("patient_followups")
      .select("mobile_number");

    const uniquePatients = new Set(
      patients?.map((p) => p.mobile_number)
    );

    setTotalPatients(uniquePatients.size);

    const { data: pending } = await supabase
      .from("patient_followups")
      .select("*")
      .eq("followup_date", today)
      .eq("followup_done", false);

    setTodayFollowups(pending?.length || 0);

    const { data: completed } = await supabase
      .from("patient_followups")
      .select("*")
      .eq("followup_date", today)
      .eq("followup_done", true);

    setCompletedToday(completed?.length || 0);
    const { data: dueData } = await supabase
  .from("patient_followups")
  .select("due_amount");

const totalDue =
  dueData?.reduce(
    (sum, item) => sum + Number(item.due_amount || 0),
    0
  ) || 0;

setTotalDueAmount(totalDue);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      alert("Please enter Name or Mobile Number");
      return;
    }

    setLoading(true);

    let query = supabase
      .from("patient_followups")
      .select("*");

    if (/^\d+$/.test(searchText)) {
      query = query.eq("mobile_number", searchText);
    } else {
      query = query.ilike(
        "patient_name",
        `%${searchText}%`
      );
    }

    const { data, error } = await query;

    setLoading(false);

    if (error) {
      alert("Error searching patient");
      return;
    }

    if (!data || data.length === 0) {
      alert("No patient found");
      return;
    }

    const uniquePatients = Array.from(
      new Map(
        data.map((item) => [
          item.mobile_number,
          item,
        ])
      ).values()
    );

    if (uniquePatients.length === 1) {
      router.push(
        `/patients/${uniquePatients[0].mobile_number}`
      );
      return;
    }

    setResults(uniquePatients);
  };

  const todayDate = new Date().toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="max-w-lg mx-auto min-h-screen bg-gray-50 p-4">

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 p-5">

            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">
                Menu
              </h2>

              <button
                onClick={() => setMenuOpen(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">

              <Link
                href="/"
                className="block p-3 rounded-xl border"
              >
                🏠 Dashboard
              </Link>

              

              <Link
                href="/followups"
                className="block p-3 rounded-xl border"
              >
                📅 Today's Followups
              </Link>
              <Link
  href="/reports"
  className="block p-3 rounded-xl border"
>
  📊 Reports
</Link>
<div className="mt-2 ml-6 space-y-2">
    <Link href="/reports/patients" className="block text-blue-600">
      👨 Patients Report
    </Link>

    <Link href="/reports/followups" className="block text-blue-600">
      📅 Followup Report
    </Link>
  </div>

            </div>

          </div>
        </>
      )}

      <div className="flex justify-between items-start mb-5">

        <div>
          <h1 className="text-3xl font-bold">
            Yashodeep Clinic
          </h1>

          <p className="text-gray-500">
            Follow-up CRM
          </p>

          <p className="text-sm text-gray-400 mt-1">
            {todayDate}
          </p>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-4xl text-blue-600 p-2"
        >
          ☰
        </button>

      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-4 mb-5">

        <input
          placeholder="Search by Name or Mobile Number"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl p-3 mb-3"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          {loading ? "Searching..." : "Search Patient"}
        </button>

      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">

        <div className="bg-white rounded-2xl p-4 text-center border shadow-sm">
          <p className="text-xs text-gray-500">
            Patients
          </p>
          <h2 className="text-2xl font-bold">
            {totalPatients}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 text-center border shadow-sm">
          <p className="text-xs text-gray-500">
            Pending
          </p>
          <h2 className="text-2xl font-bold text-orange-600">
            {todayFollowups}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 text-center border shadow-sm">
          <p className="text-xs text-gray-500">
            Completed
          </p>
          <h2 className="text-2xl font-bold text-green-600">
            {completedToday}
          </h2>
        </div>
<div className="bg-white rounded-2xl p-4 text-center border shadow-sm">
  <p className="text-xs text-gray-500">
    Due Amount
  </p>

  <h2 className="text-xl font-bold text-red-600">
    ₹{totalDueAmount}
  </h2>
</div>
      </div>

      {results.length > 0 && (
        <div className="mb-5">

          <h2 className="font-bold text-lg mb-3">
            Search Results
          </h2>

          <div className="space-y-3">

            {results.map((patient) => (
              <div
                key={patient.mobile_number}
                onClick={() =>
                  router.push(
                    `/patients/${patient.mobile_number}`
                  )
                }
                className="bg-white border rounded-2xl p-4 shadow-sm cursor-pointer"
              >
                <p className="font-semibold">
                  {patient.patient_name}
                </p>

                <p className="text-gray-500 text-sm">
                  📞 {patient.mobile_number}
                </p>
              </div>
            ))}

          </div>

        </div>
      )}

      <div className="bg-white rounded-2xl border shadow-sm p-3 mb-5">
        <img
          src="/clinic-banner.png"
          alt="Clinic Banner"
          className="w-full h-44 object-contain"
        />
      </div>

      <div className="space-y-3">

        <Link
          href="/new-patient"
          className="block bg-blue-600 text-white text-center py-4 rounded-2xl font-medium"
        >
          ➕ Add Patient
        </Link>

        

      </div>

    </main>
  );
}