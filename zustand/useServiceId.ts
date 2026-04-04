import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BusinessIdState {
  businessId: string | null;
  setBusinessId: (id: string | null) => void;
}

export const useBusinessId = create<BusinessIdState>()(
  persist(
    (set) => ({
      businessId: null,
      setBusinessId: (id) => set({ businessId: id }),
    }),
    {
      name: "business-id-storage",
    },
  ),
);
