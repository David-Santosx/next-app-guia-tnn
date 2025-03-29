"use client"

import { useState, useEffect } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowLeft, Calendar, Monitor, Smartphone, Tablet, Trash2, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

interface AdminUser {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: Date
    creationInfo?: {
      ipAddress: string
      browser: string
      operatingSystem: string
      device: string
      origin: string
      createdAt: Date
    } | null
    suspicious?: boolean
  }

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const response = await fetch('/api/admin/list')
        
        if (!response.ok) {
          throw new Error('Failed to fetch administrators')
        }
        
        const data = await response.json()
        setAdmins(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching admins:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmins()
  }, [])

  async function deleteAdmin(adminId: string) {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/delete?id=${adminId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete administrator')
      }
      
      // Remove the deleted admin from the state
      setAdmins(admins.filter(admin => admin.id !== adminId))
    } catch (err) {
      console.error('Error deleting admin:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the admin')
    } finally {
      setIsDeleting(false)
    }
  }

  function getDeviceIcon(device: string) {
    if (!device || device === "unknown") return <Monitor className="h-4 w-4 text-slate-500" />;
    if (device.toLowerCase().includes('mobile') || device.toLowerCase() === 'phone') return <Smartphone className="h-4 w-4" />;
    if (device.toLowerCase().includes('tablet')) return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  }

  function formatDeviceText(device: string) {
    if (!device || device === "unknown") return "Desconhecido";
    return device;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-white">Administradores</h1>
        <p className="text-slate-400">Lista de todos os administradores do sistema e suas informações de criação</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        
        <Link href="/dashboard/admins/add">
          <Button className="bg-slate-700 hover:bg-slate-600 text-white w-full sm:w-auto">
            Adicionar Administrador
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-900 border-slate-800 w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white">Administradores</CardTitle>
          <CardDescription className="text-slate-400">
            Total de {loading ? "..." : admins.length} administradores registrados
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {error && (
            <div className="bg-red-900/20 border border-red-900 text-red-300 p-4 rounded-md mb-4 mx-6 mt-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-2 p-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full bg-slate-800" />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="bg-slate-950">
                  <TableRow className="hover:bg-slate-900/50 border-slate-800">
                    <TableHead className="text-slate-400">Nome</TableHead>
                    <TableHead className="text-slate-400">Email</TableHead>
                    <TableHead className="text-slate-400">Dispositivo</TableHead>
                    <TableHead className="text-slate-400">Sistema</TableHead>
                    <TableHead className="text-slate-400">Navegador</TableHead>
                    <TableHead className="text-slate-400">Criado</TableHead>
                    <TableHead className="text-slate-400">Origem</TableHead>
                    <TableHead className="text-slate-400 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.length === 0 ? (
                    <TableRow className="hover:bg-slate-900/50 border-slate-800">
                      <TableCell colSpan={8} className="text-center text-slate-400 py-6">
                        Nenhum administrador encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    admins.map((admin) => (
                      <TableRow key={admin.id} className={`hover:bg-slate-900/50 border-slate-800 ${admin.suspicious ? 'bg-amber-950/20' : ''}`}>
                        <TableCell className="font-medium text-slate-300 flex items-center gap-2">
                          <User className={`h-4 w-4 ${admin.suspicious ? 'text-amber-400' : 'text-slate-400'}`} />
                          {admin.name || "Sem nome"}
                        </TableCell>
                        <TableCell className="text-slate-400">{admin.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {admin.creationInfo ? (
                              <>
                                {getDeviceIcon(admin.creationInfo.device)}
                                <span className="text-slate-400">
                                  {formatDeviceText(admin.creationInfo.device)}
                                </span>
                              </>
                            ) : (
                              <span className="text-slate-500">Não disponível</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {admin.creationInfo?.operatingSystem && admin.creationInfo.operatingSystem !== "unknown" 
                            ? admin.creationInfo.operatingSystem 
                            : "Desconhecido"}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {admin.creationInfo?.browser && admin.creationInfo.browser !== "unknown" 
                            ? admin.creationInfo.browser 
                            : "Desconhecido"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-400">
                              {formatDistanceToNow(new Date(admin.createdAt), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {admin.suspicious ? (
                            <span className="px-2 py-1 text-xs rounded bg-amber-900/50 text-amber-300 border border-amber-800">
                              API Client
                            </span>
                          ) : admin.creationInfo?.origin && admin.creationInfo.origin !== "unknown" ? (
                            <span className="text-slate-400 text-xs">
                              {admin.creationInfo.origin.replace(/(https?:\/\/)?(www\.)?/i, '')}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">Desconhecido</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {session?.user?.email !== admin.email && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-950/20"
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-slate-900 border-slate-800">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                    Excluir administrador
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-400">
                                    Tem certeza que deseja excluir o administrador <span className="font-medium text-slate-300">{admin.name || admin.email}</span>?
                                    <br />
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => deleteAdmin(admin.id)}
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? "Excluindo..." : "Excluir"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}