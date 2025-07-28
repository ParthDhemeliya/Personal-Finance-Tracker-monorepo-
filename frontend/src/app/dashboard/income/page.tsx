import IncomeTableClient from "@/components/IncomeTableClient";

export default function IncomePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <IncomeTableClient />
      </div>
    </div>
  );
}
