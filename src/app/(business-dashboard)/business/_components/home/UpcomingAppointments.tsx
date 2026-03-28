import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const appointments = [
  {
    id: 1,
    name: "Jenny Wilson",
    service: "Deep Tissue Massage",
    staff: "David Chen",
    time: "15 May 2020 8:00 am",
    status: "Confirm",
  },
  {
    id: 2,
    name: "Michael Smith",
    service: "Swedish Massage",
    staff: "Emily Johnson",
    time: "16 May 2020 9:30 am",
    status: "Confirm",
  },
  {
    id: 3,
    name: "Emma Brown",
    service: "Hot Stone Massage",
    staff: "Michael Lee",
    time: "17 May 2020 10:00 am",
    status: "Confirm",
  },
  {
    id: 4,
    name: "Olivia Davis",
    service: "Aromatherapy Massage",
    staff: "Sophia Williams",
    time: "18 May 2020 11:30 am",
    status: "Confirm",
  },
  {
    id: 5,
    name: "Liam Taylor",
    service: "Sports Massage",
    staff: "James Martinez",
    time: "19 May 2020 1:00 pm",
    status: "Confirm",
  },
];

export function UpcomingAppointments() {
  return (
    <div className="w-full bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Upcoming Appointments
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Next 48 hours activity
          </p>
        </div>
        <button className="text-xs font-bold text-slate-600 hover:underline">
          See all
        </button>
      </div>

      {/* Table Section */}
      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-slate-900 font-bold text-sm h-12">
              Client Name
            </TableHead>
            <TableHead className="text-slate-900 font-bold text-sm h-12">
              Service Type
            </TableHead>
            <TableHead className="text-slate-900 font-bold text-sm h-12 text-center">
              Staff Name
            </TableHead>
            <TableHead className="text-slate-900 font-bold text-sm h-12 text-center">
              Time & Date
            </TableHead>
            <TableHead className="text-slate-900 font-bold text-sm h-12 text-center">
              Status
            </TableHead>
            <TableHead className="text-slate-900 font-bold text-sm h-12 text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appt) => (
            <TableRow
              key={appt.id}
              className="border-slate-50 hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="py-5 font-semibold text-slate-700">
                {appt.name}
              </TableCell>
              <TableCell className="py-5 font-semibold text-slate-700">
                {appt.service}
              </TableCell>
              <TableCell className="py-5 font-semibold text-slate-700 text-center">
                {appt.staff}
              </TableCell>
              <TableCell className="py-5 font-semibold text-slate-700 text-center">
                {appt.time}
              </TableCell>
              <TableCell className="py-5 text-center">
                <span className="bg-[#E8F7F7] text-[#169C9F] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tight">
                  {appt.status}
                </span>
              </TableCell>
              <TableCell className="py-5 text-right">
                <div className="flex justify-end gap-2">
                  <button className="w-8 h-8 rounded-full bg-[#169C9F] flex items-center justify-center text-white hover:bg-[#138689] transition-all">
                    <Check size={16} strokeWidth={3} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#FF4D4D] flex items-center justify-center text-white hover:bg-red-600 transition-all">
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
