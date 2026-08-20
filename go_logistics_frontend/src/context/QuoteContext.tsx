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
  updateQuoteStatus: (
    id: string,
    status: QuoteStatus
  ) => void;
}

const initialQuotes: Quote[] = [
  {
    id: "QT10001",
    status: "Approved",
    pickupLocation: "Pune, Maharashtra",
    deliveryLocation: "Mumbai, Maharashtra",
    cargoType: "Commercial Goods",
    weight: "850 kg",
    vehicleCategory: "Heavy Truck",
    bodyType: "Container",
    containerSize: "32 ft",
    pickupDate: "25 Aug 2026",
    validUntil: "24 Aug 2026",
    transportationCharge: 15000,
    handlingCharge: 1000,
    tollCharge: 1500,
    otherCharges: 500,
  },

  {
    id: "QT10002",
    status: "Pending",
    pickupLocation: "Pune, Maharashtra",
    deliveryLocation: "Nagpur, Maharashtra",
    cargoType: "Industrial Equipment",
    weight: "1,200 kg",
    vehicleCategory: "Heavy Truck",
    bodyType: "Container",
    containerSize: "32 ft",
    pickupDate: "27 Aug 2026",
    validUntil: "26 Aug 2026",
    transportationCharge: 26000,
    handlingCharge: 1500,
    tollCharge: 3000,
    otherCharges: 1000,
  },
];

const QuoteContext = createContext<
  QuoteContextType | undefined
>(undefined);

export function QuoteProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [quotes, setQuotes] =
    useState<Quote[]>(initialQuotes);

  function updateQuoteStatus(
    id: string,
    status: QuoteStatus
  ) {
    setQuotes((current) =>
      current.map((quote) =>
        quote.id === id
          ? { ...quote, status }
          : quote
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
    throw new Error(
      "useQuotes must be used inside QuoteProvider"
    );
  }

  return context;
}