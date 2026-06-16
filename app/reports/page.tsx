export default function ReportsPage() {
  return (
    <main className="max-w-lg mx-auto min-h-screen p-4">

      <h1 className="text-2xl font-bold mb-6">
        📊 Reports
      </h1>

      <div className="space-y-4">

        <a
          href="/reports/patients"
          className="block bg-white border rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-bold text-lg">
            👨 Patients Report
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            View all registered patients
          </p>
        </a>

        <a
          href="/reports/followups"
          className="block bg-white border rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-bold text-lg">
            📅 Followup Report
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            View followup status and reminders
          </p>
        </a>

      </div>

    </main>
  );
}