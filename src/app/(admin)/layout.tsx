import { DashboardSidebar } from "@/components/app/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";


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
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center">
              <SidebarTrigger className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md mr-4" />
              <h2 className="text-lg font-medium text-white">Dashboard</h2>
            </div>
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Site
              </Button>
            </Link>
          </div>
          <div className="w-full px-4 sm:px-6 md:px-8 lg:max-w-[90%] xl:max-w-[80%] mx-auto py-4">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
    );
  }
  