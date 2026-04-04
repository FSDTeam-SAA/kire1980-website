import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ServiceState {
  serviceId: string | null;
  setServiceId: (id: string | null) => void;
}

export const useServiceId = create<ServiceState>()(
  persist(
    (set) => ({
      serviceId: null,
      setServiceId: (id) => set({ serviceId: id }),
    }),
    {
      name: "service-id-storage",
    },
  ),
);
