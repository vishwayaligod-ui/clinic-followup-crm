"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function FollowupReportPage() {
  const router = useRouter();
  const hasDownloaded = useRef(false);

  useEffect(() => {
    if (hasDownloaded.current) return;

    hasDownloaded.current = true;
    downloadReport();
  }, []);

  const downloadReport = async () => {
    const { data, error } = await supabase
      .from("patient_followups")
      .select("*")
      .order("followup_date", { ascending: false });

    if (error) {
      alert("Error generating report");
      router.push("/");
      return;
    }

    const csv = [
      [
        "Patient Name",
        "Mobile Number",
        "Followup Date",
        "Status",
      ],
      ...(data || []).map((row) => [
        row.patient_name,
        row.mobile_number,
        row.followup_date || "",
        row.followup_done ? "Completed" : "Pending",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "Followup_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-bold">
        Generating Followup Report...
      </h1>
    </main>
  );
}