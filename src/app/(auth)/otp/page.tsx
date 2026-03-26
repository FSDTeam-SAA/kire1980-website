import { Suspense } from "react";
import OtpForm from "./_components/otp-form";

export default function OtpPage() {
  return (
    <div className="bg-[#ffffff7e] p-5 rounded-lg w-[400px] lg:w-[600px]">
      <div className="mt-5">
        <Suspense fallback={<div>loading...</div>}>
          <OtpForm />
        </Suspense>
      </div>
    </div>
  );
}
