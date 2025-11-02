'use client'

import { useState, useEffect } from 'react'

// Forzar renderizado dinámico para evitar 404 en Vercel
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { Request } from '@/lib/supabase'
import { FileText, Clock, CheckCircle, Play, LogOut } from 'lucide-react'

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<Request[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [filter])

  const loadRequests = async () => {
    setLoading(true)
    let query = supabase.from('requests').select('*').order('created_at', { ascending: false })
    
    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query
    if (data) setRequests(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('requests').update({ status }).eq('id', id)
    loadRequests()
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    const labels = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      completed: 'Completada',
      cancelled: 'Cancelada'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-ugt-red text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración - EvalúaPro UGT</h1>
              <p className="text-sm opacity-90 mt-1">Bienvenido/a, {user?.email}</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/admin/dashboard" className="hover:underline font-semibold">Dashboard</Link>
              <Link href="/admin/configuracion" className="hover:underline">Configuración</Link>
              <button onClick={handleSignOut} className="hover:underline flex items-center">
                <LogOut size={16} className="mr-1" /> Salir
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Solicitudes Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={40} />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">En Progreso</p>
                <p className="text-3xl font-bold text-blue-600">
                  {requests.filter(r => r.status === 'in_progress').length}
                </p>
              </div>
              <Play className="text-blue-600" size={40} />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completadas</p>
                <p className="text-3xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={40} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-ugt-red text-white' : 'bg-gray-200'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-ugt-red text-white' : 'bg-gray-200'}`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded ${filter === 'in_progress' ? 'bg-ugt-red text-white' : 'bg-gray-200'}`}
            >
              En Progreso
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-ugt-red text-white' : 'bg-gray-200'}`}
            >
              Completadas
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Solicitudes</h3>
          {loading ? (
            <p>Cargando...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-600">No hay solicitudes</p>
          ) : (
            <div className="space-y-4">
              {requests.map(request => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{request.company_name}</h4>
                      <p className="text-gray-600">{request.position_name}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-600">Solicitante:</p>
                      <p className="font-semibold">{request.requester_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email:</p>
                      <p className="font-semibold">{request.requester_email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Convenio:</p>
                      <p className="font-semibold">{request.collective_agreement}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha:</p>
                      <p className="font-semibold">{new Date(request.created_at).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {request.status === 'pending' && (
                      <Link
                        href={`/admin/evaluar/${request.id}`}
                        className="btn-primary text-sm"
                      >
                        Iniciar Valoración
                      </Link>
                    )}
                    {request.status === 'in_progress' && (
                      <Link
                        href={`/admin/evaluar/${request.id}`}
                        className="btn-primary text-sm"
                      >
                        Continuar Valoración
                      </Link>
                    )}
                    {request.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(request.id, 'in_progress')}
                        className="btn-secondary text-sm"
                      >
                        Marcar En Progreso
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
