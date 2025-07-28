interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  total: number;
  pageSize: number; // Added pageSize prop
}

// pagination component
const Pagination = ({
  page,
  totalPages,
  onPageChange,
  total,
  pageSize,
}: PaginationProps) => {
  if (totalPages < 1) return null;
  const isFirst = page === 1;
  const isLast = page === totalPages;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const generatePageButtons = () => {
    const buttons: React.ReactNode[] = [];
    const range = 2;
    const start = Math.max(1, page - range);
    const end = Math.min(totalPages, page + range);

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          aria-current={i === page ? "page" : undefined}
          className={`cursor-pointer px-3 py-1 rounded-md transition text-sm font-medium shadow-sm border border-blue-200 hover:bg-blue-100
            ${i === page ? "bg-blue-600 text-white" : "bg-white text-blue-600"}
          `}
          type="button"
        >
          {i}
        </button>,
      );
    }
    return buttons;
  };

  return (
    <div className="flex flex-col items-end mt-6 gap-2">
      <span className="text-sm text-gray-600 mb-1">
        Showing {total === 0 ? 0 : start}-{end} of {total} items
      </span>
      <div className="flex gap-2 items-center">
        <button
          disabled={isFirst}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>

        {generatePageButtons()}

        <button
          disabled={isLast}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
