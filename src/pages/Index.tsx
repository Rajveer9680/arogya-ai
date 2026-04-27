import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatCards } from "@/components/dashboard/StatCards";
import { AnatomyView } from "@/components/dashboard/AnatomyView";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { TrendsChart } from "@/components/dashboard/TrendsChart";

const Index = () => {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto">
        <TopBar />
        <div className="mb-2">
          <h1 className="font-display text-3xl font-bold">
            Welcome back, <span className="text-gradient">Aarav</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here's your AI-powered health overview for today.</p>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-5">
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
            <StatCards />
            <AnatomyView />
            <TrendsChart />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
