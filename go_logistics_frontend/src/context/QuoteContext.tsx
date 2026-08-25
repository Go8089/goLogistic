import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "../services/api";

export type QuoteStatus =
  | "Pending"
  | "Approved"
  | "Rejected";

export interface Quote {
  id: string;
  status: QuoteStatus;
  pickupLocation: string;
  deliveryLocation: string;
  cargoType: string;
  weight: string;
  vehicleCategory: string;
  bodyType: string;
  containerSize: string;
  pickupDate: string;
  validUntil: string;
  transportationCharge: number;
  handlingCharge: number;
  tollCharge: number;
  otherCharges: number;
}

interface QuoteContextType {
  quotes: Quote[];
  loading: boolean;
  error: string;
  updateQuoteStatus: (
    id: string,
    status: QuoteStatus
  ) => Promise<void>;
  refreshQuotes: () => Promise<void>;
}

const QuoteContext = createContext<
  QuoteContextType | undefined
>(undefined);

export function QuoteProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refreshQuotes() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/quotes");

      const data = response.data;

      setQuotes(
        Array.isArray(data)
          ? data
          : data.content ?? []
      );
    } catch (error) {
      console.error(
        "Failed to load quotes:",
        error
      );

      setError("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshQuotes();
  }, []);

  async function updateQuoteStatus(
    id: string,
    status: QuoteStatus
  ) {
    try {
      setError("");

      let response;

      if (status === "Approved") {
        response = await api.patch(
          `/admin/quotes/${id}/approve`
        );
      } else if (status === "Rejected") {
        response = await api.patch(
          `/admin/quotes/${id}/reject`
        );
      } else {
        return;
      }

      const updatedQuote = response.data;

      setQuotes((current) =>
        current.map((quote) =>
          quote.id === id
            ? updatedQuote
            : quote
        )
      );
    } catch (error) {
      console.error(
        "Failed to update quote status:",
        error
      );

      setError(
        "Failed to update quote status"
      );

      throw error;
    }
  }

  return (
    <QuoteContext.Provider
      value={{
        quotes,
        loading,
        error,
        updateQuoteStatus,
        refreshQuotes,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuotes() {
  const context = useContext(QuoteContext);

  if (!context) {
    throw new Error(
      "useQuotes must be used inside QuoteProvider"
    );
  }

  return context;
}