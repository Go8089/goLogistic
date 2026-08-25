import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

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
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;
}

const initialQuotes: Quote[] = [];

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);

  function updateQuoteStatus(id: string, status: QuoteStatus) {
    setQuotes((current) =>
      current.map((quote) =>
        quote.id === id ? { ...quote, status } : quote
      )
    );
  }

  return (
    <QuoteContext.Provider
      value={{
        quotes,
        updateQuoteStatus,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuotes() {
  const context = useContext(QuoteContext);

  if (!context) {
    throw new Error("useQuotes must be used inside QuoteProvider");
  }

  return context;
}
