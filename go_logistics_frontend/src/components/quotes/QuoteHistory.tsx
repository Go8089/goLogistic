import {
  Check,
  Clock3,
  X,
} from "lucide-react";

export type QuoteHistoryStatus =
  | "Requested"
  | "Reviewed"
  | "Approved"
  | "Rejected";

export interface QuoteHistoryEntry {
  status: QuoteHistoryStatus;
  description: string;
  date: string;
}

interface QuoteHistoryProps {
  history: QuoteHistoryEntry[];
}

export default function QuoteHistory({
  history,
}: QuoteHistoryProps) {
  return (
    <div className="mt-6">
      {history.map((item, index) => {
        const last = index === history.length - 1;

        return (
          <div
            key={`${item.status}-${item.date}`}
            className="flex gap-4"
          >
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  item.status === "Rejected"
                    ? "bg-red-100 text-red-600"
                    : item.status === "Approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600",
                ].join(" ")}
              >
                {item.status === "Rejected" ? (
                  <X size={15} />
                ) : item.status === "Approved" ? (
                  <Check size={15} />
                ) : (
                  <Clock3 size={15} />
                )}
              </div>

              {!last && (
                <div className="mt-1 min-h-10 w-px bg-gray-200" />
              )}
            </div>

            {/* Content */}
            <div className={last ? "pb-0" : "pb-5"}>
              <p className="text-sm font-semibold text-gray-900">
                {item.status}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {item.description}
              </p>

              <p className="mt-1.5 text-xs font-medium text-gray-400">
                {item.date}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}