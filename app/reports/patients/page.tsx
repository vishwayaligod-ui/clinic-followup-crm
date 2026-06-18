"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function PatientsReportPage() {
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
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error generating report");
      router.push("/");
      return;
    }

    const patientMap = new Map();

    data?.forEach((item) => {
  if (!patientMap.has(item.mobile_number)) {
    patientMap.set(item.mobile_number, {
  patient_name: item.patient_name,
  mobile_number: item.mobile_number,
  diagnosis: item.diagnosis || "",
  prescription: item.prescription || "",

  fees_amount: item.fees_amount || 0,
  amount_paid: item.amount_paid || 0,
  due_amount: item.due_amount || 0,

  total_visits: 1,
  last_visit_date: item.created_at,
});
  } else {
    const patient = patientMap.get(item.mobile_number);
    patient.total_visits += 1;
  }
});

    const rows = Array.from(patientMap.values());

    const csv = [
     [
  
  "Patient Name",
  "Mobile Number",
  "Diagnosis",
  "Prescription",
  "Fees Amount",
  "Amount Paid",
  "Due Amount",
  "Total Visits",
  "Last Visit Date",
],

      ...rows.map((row: any) => [
  row.patient_name,
  row.mobile_number,
  row.diagnosis,
  row.prescription,

  row.fees_amount,
  row.amount_paid,
  row.due_amount,

  row.total_visits,
  new Date(row.last_visit_date).toLocaleDateString(),
]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "Patients_Report.csv";

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
        Generating Patient Report...
      </h1>
    </main>
  );
}