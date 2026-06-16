"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function PatientsPage() {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      alert("Please enter Patient Name or Mobile Number");
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
      console.error(error);
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

      <div className="bg-white rounded-2xl border shadow-sm p-6">

        <h1 className="text-2xl font-bold mb-2">
          Search Patient
        </h1>

        <p className="text-gray-500 mb-6">
          Search using Patient Name or Mobile Number
        </p>

        <input
          placeholder="Enter Name or Mobile Number"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
        >
          {loading ? "Searching..." : "Search Patient"}
        </button>

      </div>

      {results.length > 0 && (
        <div className="mt-6">

          <h2 className="font-bold text-lg mb-3">
            Search Results ({results.length})
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
                className="bg-white border rounded-2xl p-4 shadow-sm cursor-pointer hover:border-blue-500 transition"
              >

                <div className="flex justify-between items-center">

                  <div>
                    <p className="font-semibold text-lg">
                      {patient.patient_name}
                    </p>

                    <p className="text-gray-500 text-sm">
                      📞 {patient.mobile_number}
                    </p>
                  </div>

                  <div className="text-blue-600 font-medium">
                    View →
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

    </main>
  );
}