"use client"
import { Users, UserPlus, UserCheck, ChevronDown, LayoutDashboard, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { SignOutButton } from "@/components/app/sign-out-button";

export function DashboardSidebar() {
  const { data: session, status } = useSession();
  const [adminName, setAdminName] = useState<string | null>(null);
  
  useEffect(() => {
    if (status === "authenticated" && session?.user?.name) {
      setAdminName(session.user.name);
    }
  }, [session, status]);

  return (
    <Sidebar className="border-r border-slate-800 bg-slate-950">
      <SidebarContent className="py-6">
        <div className="px-6 mb-6">
          <h2 className="text-xl font-bold text-white">Guia TNN</h2>
          <p className="text-sm text-slate-400">Painel Administrativo</p>
        </div>
        
        <div className="px-6 mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-300" />
            </div>
            {status === "loading" ? (
              <Skeleton className="h-5 w-32 bg-slate-800" />
            ) : adminName ? (
              <span className="text-sm font-medium text-slate-300">{adminName}</span>
            ) : (
              <span className="text-sm text-slate-400">Administrador</span>
            )}
          </div>
          
          <SignOutButton variant="icon" />
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 font-medium px-6">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem className="my-1">
                <SidebarMenuButton asChild className="hover:bg-slate-800 text-slate-300 py-2.5">
                  <Link href="/dashboard" className="flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2 text-slate-400" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <Collapsible className="group/collapsible">
                <SidebarMenuItem className="my-1">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full bg-transparent hover:bg-slate-800 transition-colors text-slate-300 py-2.5">
                      <Users className="h-4 w-4 mr-2 text-slate-400" />
                      <span>Administradores</span>
                      <ChevronDown className="h-4 w-4 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 text-slate-500" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="bg-slate-900 space-y-1 mt-1 py-1">
                      <SidebarMenuSubItem className="py-1">
                        <Link
                          className="flex items-center pl-6 text-sm text-slate-400 hover:text-slate-200 transition-colors py-2"
                          href="/dashboard/admins"
                        >
                          <UserCheck className="h-4 w-4 mr-2 text-slate-500" />
                          <span>Listar administradores</span>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem className="py-1">
                        <Link
                          className="flex items-center pl-6 text-sm text-slate-400 hover:text-slate-200 transition-colors py-2"
                          href="/dashboard/admins/add"
                        >
                          <UserPlus className="h-4 w-4 mr-2 text-slate-500" />
                          <span>Adicionar administradores</span>
                        </Link>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
