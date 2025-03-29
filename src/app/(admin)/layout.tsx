import { DashboardSidebar } from "@/components/app/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/providers/theme-provider";


export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <ThemeProvider defaultTheme="dark" forcedTheme="dark" attribute={"class"}>
      <SidebarProvider>
        <DashboardSidebar/>
        <main className="w-full">
          <div className="flex items-center p-4 border-b border-slate-800">
            <SidebarTrigger className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md mr-4" />
            <h2 className="text-lg font-medium text-white">Dashboard</h2>
          </div>
          <div className="w-full max-w-[80%] mx-auto py-4">{children}</div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
    );
  }
  