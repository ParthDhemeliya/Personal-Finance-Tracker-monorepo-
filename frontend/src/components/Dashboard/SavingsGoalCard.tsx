import { useState, useEffect } from "react";
import { PieChart } from "lucide-react";
import { useAppDispatch } from "../../hooks/useTypedDispatch";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { setSavingsGoalThunk } from "../../redux/savingsGoal/setSavingsGoalThunk";
import { fetchSavingsGoalThunk } from "../../redux/savingsGoal/savingsGoalThunk";
import useToast from "../../hooks/useToast";

const SavingsGoalCard = () => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const savingsGoalTarget = useAppSelector((state) => state.savingsGoal.target);
  const savingsGoalCurrent = useAppSelector(
    (state) => state.savingsGoal.current,
  );
  const savingsGoalLoading = useAppSelector(
    (state) => state.savingsGoal.loading,
  );
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(
    savingsGoalTarget ? String(savingsGoalTarget) : "",
  );
  const [goalError, setGoalError] = useState("");
  const [goalSuccess, setGoalSuccess] = useState("");
  // Always use today's date for targetDate
  const todayStr = new Date().toISOString().slice(0, 10);
  const [targetDate] = useState(todayStr);

  useEffect(() => {
    if (!isEditingGoal) {
      setGoalInput(savingsGoalTarget ? String(savingsGoalTarget) : "");
      // setTargetDate is removed; targetDate is always today
    }
  }, [savingsGoalTarget, isEditingGoal]);

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow border hover:shadow-lg transition cursor-pointer group">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-500">Savings Goal</h3>
        <span className="bg-yellow-200 p-2 rounded-full">
          <PieChart className="w-5 h-5 text-yellow-600 group-hover:scale-110 transition" />
        </span>
      </div>
      {isEditingGoal ? (
        <form
          className="flex flex-col gap-2 mb-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const numGoal = Number(goalInput);
            if (!numGoal || numGoal <= 0 || isNaN(numGoal)) {
              setGoalError("Goal must be greater than 0");
              setGoalSuccess("");
              return;
            }
            // targetDate is always set to today
            setGoalError("");
            try {
              await dispatch(
                setSavingsGoalThunk({ amount: numGoal, targetDate }),
              );
              showSuccess("Savings goal updated successfully!");
              setGoalSuccess("Goal updated!");
              setTimeout(() => setGoalSuccess(""), 2000);
              setIsEditingGoal(false);
              dispatch(fetchSavingsGoalThunk());
            } catch {
              showError("Failed to update savings goal. Please try again.");
              setGoalError("Failed to update goal. Please try again.");
            }
          }}
        >
          <label htmlFor="goalInput" className="text-xs text-gray-600 mb-1">
            Goal Amount (₹)
          </label>
          <input
            id="goalInput"
            type="number"
            min={1}
            value={goalInput}
            onChange={(e) => {
              let val = e.target.value.replace(/^0+/, "");
              if (val === "") val = "";
              setGoalInput(val);
            }}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter goal amount"
            autoFocus
          />
          {/* Target date input removed, always use today's date internally */}
          {goalError && <p className="text-red-500 text-xs">{goalError}</p>}
          {goalSuccess && (
            <p className="text-green-600 text-xs">{goalSuccess}</p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs cursor-pointer"
              onClick={() => {
                setIsEditingGoal(false);
                setGoalError("");
                setGoalInput(
                  savingsGoalTarget ? String(savingsGoalTarget) : "",
                );
                // setTargetDate is removed; targetDate is always today
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <button
          className="mt-2 mb-4 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs font-semibold cursor-pointer"
          onClick={() => {
            setIsEditingGoal(true);
            setGoalInput(savingsGoalTarget ? String(savingsGoalTarget) : "");
          }}
        >
          {savingsGoalTarget > 0 ? "Edit Goal" : "Set Goal"}
        </button>
      )}
      {savingsGoalLoading ? (
        <div className="text-gray-400 text-center text-2xl">Loading...</div>
      ) : (
        (() => {
          const current = savingsGoalCurrent || 0;
          const target = savingsGoalTarget || 0;
          if (!target || target <= 0) {
            return (
              <div className="text-center text-gray-500 text-sm mt-2">
                No savings goal set yet. Set a goal to start tracking your
                progress!
              </div>
            );
          }
          const percent = Math.min(Math.round((current / target) * 100), 100);
          return (
            <>
              <div className="flex items-center justify-between mt-2">
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {percent}%
                </div>
                <span className="text-xs text-gray-500">
                  ({current.toLocaleString()} / {target.toLocaleString()})
                </span>
              </div>
              <div className="w-full h-3 bg-yellow-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ₹{current.toLocaleString()} of ₹{target.toLocaleString()} goal
              </p>
            </>
          );
        })()
      )}
    </div>
  );
};

export default SavingsGoalCard;
