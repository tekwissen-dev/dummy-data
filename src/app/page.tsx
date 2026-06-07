import AICTAForm from "@/components/AICTA";
import GCCCTAForm from "@/components/GCCCTA";
import StrategyCTAForm from "@/components/StrategryCTA";
import WorkforceCTAForm from "@/components/WorkforceCTA";
import Globalform from "@/components/Globalform";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome Resend Workforce Request Demo</h1>
      <p className="text-lg text-gray-600 mb-12">Fill out the contact form to send a test email using Resend.</p>
      </div>
      <WorkforceCTAForm/>
      <br />
      <AICTAForm/>
      <br />
      <GCCCTAForm/>
      <br />
      <StrategyCTAForm/>
      <br />
      <Globalform/>
      {/* The contact form component will go here */}
    </main>
  );
}