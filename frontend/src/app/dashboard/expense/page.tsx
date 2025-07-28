import ExpenseTableClient from "@/components/ExpenseTableClient";

export default function ExpensePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <ExpenseTableClient />
      </div>
    </div>
  );
}
