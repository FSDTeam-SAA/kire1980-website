import { Copy, Trash2, ChevronDown } from "lucide-react";

export default function AddStaffMember() {
  const services = [
    { id: "haircut", label: "Haircut & Styling", checked: true },
    { id: "beard", label: "Beard Trim", checked: true },
    { id: "coloring", label: "Hair Coloring", checked: false },
    { id: "conditioning", label: "Deep Conditioning", checked: false },
    { id: "massage", label: "Scalp Massage", checked: false },
    { id: "shave", label: "Hot Towel Shave", checked: true },
  ];

  const days = [
    {
      name: "Monday",
      status: "Available",
      from: "09:00 AM",
      to: "05:00 PM",
      break: "+ Add break",
    },
    {
      name: "Tuesday",
      status: "Available",
      from: "09:00 AM",
      to: "05:00 PM",
      break: "Lunch Break: 12:00 - 13:00",
    },
    { name: "Wednesday", status: "Unavailable", from: "", to: "", break: "" },
    {
      name: "Thursday",
      status: "Available",
      from: "09:00 AM",
      to: "05:00 PM",
      break: "+ Add break",
    },
    {
      name: "Friday",
      status: "Available",
      from: "09:00 AM",
      to: "08:00 PM",
      break: "Evening shift included",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F7F7] p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2D2D]">
            Add New Staff Member
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Complete the details below to onboard a new team member and set
            their working hours.
          </p>
        </div>
        <button className="bg-[#00A3A3] hover:bg-[#008B8B] text-white px-8 py-2.5 rounded-lg font-medium transition-colors">
          Save Member
        </button>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <section className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "First Name", placeholder: "e.g. Michael" },
              { label: "First Name", placeholder: "e.g. Scott" }, // Design shows First Name twice
              {
                label: "Email Address",
                placeholder: "michael.scott@company.com",
              },
              { label: "Phone Number", placeholder: "+1 (555) 000-0000" },
            ].map((input, i) => (
              <div key={i}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {input.label}
                </label>
                <input
                  type="text"
                  placeholder={input.placeholder}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A3A3]/20 focus:border-[#00A3A3] transition-all text-sm placeholder:text-gray-300"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Assigned Services */}
        <section className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Assigned Services
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Select the services this staff member is qualified to provide.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((service) => (
              <label
                key={service.id}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  defaultChecked={service.checked}
                  className="w-5 h-5 rounded border-gray-300 text-[#00A3A3] focus:ring-[#00A3A3]"
                />
                <span className="text-sm font-medium text-gray-700">
                  {service.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Weekly Availability */}
        <section className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-semibold text-gray-800">
              Weekly Availability
            </h2>
            <button className="text-[#00A3A3] text-sm font-bold flex items-center gap-2 hover:underline">
              <Copy size={16} /> Apply to all
            </button>
          </div>

          <div className="space-y-4">
            {days.map((day, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0"
              >
                <span className="w-24 text-sm font-bold text-gray-700">
                  {day.name}
                </span>

                {/* Status Dropdown */}
                <div className="relative w-36">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600 cursor-pointer">
                    {day.status} <ChevronDown size={14} />
                  </div>
                </div>

                {/* Time Pickers */}
                {day.status === "Available" ? (
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                      {day.from}
                    </div>
                    <span className="text-gray-300 text-xs">to</span>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                      {day.to}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 text-center text-sm text-gray-400">
                    Out of office
                  </div>
                )}

                {/* Break Info */}
                <div className="flex-1 flex justify-center">
                  <span
                    className={`text-xs font-medium cursor-pointer ${day.break.includes("+") ? "text-gray-400 hover:text-[#00A3A3]" : "text-gray-400 bg-gray-50 px-3 py-1 rounded"}`}
                  >
                    {day.break}
                  </span>
                </div>

                <button className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
