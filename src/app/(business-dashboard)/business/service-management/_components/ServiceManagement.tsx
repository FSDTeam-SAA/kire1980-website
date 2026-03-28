import React from "react";
import { MoreVertical, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const services = [
  {
    id: "SRV-001",
    name: "Deep Tissue Massage",
    category: "Wellness",
    duration: "60 min",
    price: "$85.00",
    staff: "Leslie Alexander",
    image: "/api/placeholder/32/32",
  },
  {
    id: "SRV-002",
    name: "Swedish Massage",
    category: "Relaxation",
    duration: "75 min",
    price: "$70.00",
    staff: "Michael Johnson",
    image: "/api/placeholder/32/32",
  },
  {
    id: "SRV-003",
    name: "Hot Stone Therapy",
    category: "Therapeutic",
    duration: "90 min",
    price: "$100.00",
    staff: "Sarah Lee",
    image: "/api/placeholder/32/32",
  },
  {
    id: "SRV-004",
    name: "Aromatherapy Massage",
    category: "Holistic",
    duration: "60 min",
    price: "$90.00",
    staff: "Emily Carter",
    image: "/api/placeholder/32/32",
  },
  {
    id: "SRV-005",
    name: "Reflexology",
    category: "Alternative",
    duration: "30 min",
    price: "$50.00",
    staff: "James Smith",
    image: "/api/placeholder/32/32",
  },
];

const stats = [
  { label: "Total Services", value: "24" },
  { label: "Active", value: "22" },
  { label: "Top Category", value: "Wellness" },
  { label: "Avg. Booking", value: "$72" },
];

export default function ServiceManagement() {
  return (
    <div className=" min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Service Management
          </h1>
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-1">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-slate-600">Service Management</span>
          </nav>
        </div>
        <button className="bg-[#169C9F] hover:bg-[#138689] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all">
          Add New Service
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm"
          >
            <p className="text-xs font-medium text-slate-400 mb-2">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-50">
              <TableHead className="py-5 px-6 font-bold text-slate-800">
                Service Name
              </TableHead>
              <TableHead className="font-bold text-slate-800">
                Category
              </TableHead>
              <TableHead className="font-bold text-slate-800">
                Duration
              </TableHead>
              <TableHead className="font-bold text-slate-800">Price</TableHead>
              <TableHead className="font-bold text-slate-800">
                Assigned Staff
              </TableHead>
              <TableHead className="font-bold text-slate-800 text-right">
                Status
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow
                key={service.id}
                className="border-slate-50 hover:bg-slate-50/50"
              >
                <TableCell className="py-5 px-6">
                  <div>
                    <p className="font-bold text-[#0F172A] text-sm leading-tight">
                      {service.name}
                    </p>
                    <p className="text-[10px] font-bold text-[#94A3B8] mt-0.5 uppercase tracking-wider">
                      ID: {service.id}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-[#E8F7F7] text-[#169C9F] hover:bg-[#E8F7F7] border-none px-3 py-1 rounded-full text-[10px] font-bold">
                    {service.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-500">
                  {service.duration}
                </TableCell>
                <TableCell className="text-sm font-bold text-slate-700">
                  {service.price}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-slate-100">
                      <AvatarImage src={service.image} />
                      <AvatarFallback>{service.staff[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-slate-600">
                      {service.staff}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-[#169C9F] scale-90"
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <MoreVertical size={18} className="text-slate-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl border-slate-100"
                    >
                      <DropdownMenuItem className="text-xs font-bold py-2">
                        Edit Service
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs font-bold py-2 text-red-500">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
