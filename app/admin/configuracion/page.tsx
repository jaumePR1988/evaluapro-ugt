'use client'

import { useState, useEffect } from 'react'

// Forzar renderizado dinámico para evitar 404 en Vercel
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Save, Download, Settings, LogOut, Users } from 'lucide-react'

export default function ConfiguracionPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('contenido')
  
  // Contenido del sitio
  const [siteContent, setSiteContent] = useState({
    quienes_somos_titulo: '',
    quienes_somos_contenido: '',
    tecnico_nombre: '',
    tecnico_titulacion: '',
    tecnico_email: '',
    tecnico_telefono: ''
  })

  // Factores de evaluación
  const [factors, setFactors] = useState<any[]>([])
  
  // Usuarios
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Cargar contenido del sitio
    const { data: contentData } = await supabase.from('site_content').select('*')
    if (contentData) {
      const contentMap: any = {}
      contentData.forEach(item => {
        contentMap[item.content_key] = item.content_value
      })
      setSiteContent(contentMap)
    }

    // Cargar factores
    const { data: factorsData } = await supabase.from('evaluation_factors').select('*').order('subfactor_name')
    if (factorsData) setFactors(factorsData)

    // Cargar usuarios
    const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (usersData) setUsers(usersData)
  }

  const handleSaveContent = async () => {
    setLoading(true)
    try {
      for (const [key, value] of Object.entries(siteContent)) {
        await supabase.from('site_content')
          .upsert({ content_key: key, content_value: value }, { onConflict: 'content_key' })
      }
      alert('Contenido guardado exitosamente')
    } catch (error) {
      alert('Error al guardar contenido')
    } finally {
      setLoading(false)
    }
  }

  const toggleFactorActive = async (factorId: string, isActive: boolean) => {
    await supabase.from('evaluation_factors')
      .update({ is_active: !isActive })
      .eq('factor_id', factorId)
    loadData()
  }

  const toggleUserActive = async (userId: string, isActive: boolean) => {
    await supabase.from('profiles')
      .update({ is_active: !isActive })
      .eq('id', userId)
    loadData()
  }

  const exportEvaluations = async () => {
    const { data } = await supabase.from('evaluations').select('*')
    if (data) {
      // Convertir a CSV
      const headers = ['ID', 'Empresa', 'Puesto', 'Puntuación Total', 'Grupo Final', 'Fecha']
      const rows = data.map(e => [
        e.id,
        e.eval_company_name,
        e.eval_position_name,
        e.total_score,
        e.final_group,
        new Date(e.created_at).toLocaleDateString('es-ES')
      ])
      
      let csv = headers.join(',') + '\n'
      rows.forEach(row => {
        csv += row.join(',') + '\n'
      })

      // Descargar archivo
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `evaluaciones_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }
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
              <h1 className="text-2xl font-bold">Configuración - EvalúaPro UGT</h1>
              <p className="text-sm opacity-90 mt-1">Gestión del sistema</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/admin/configuracion" className="hover:underline font-semibold">Configuración</Link>
              <button onClick={handleSignOut} className="hover:underline flex items-center">
                <LogOut size={16} className="mr-1" /> Salir
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('contenido')}
            className={`px-4 py-2 rounded ${activeTab === 'contenido' ? 'bg-ugt-red text-white' : 'bg-white'}`}
          >
            <Settings className="inline mr-2" size={16} />
            Contenido del Sitio
          </button>
          <button
            onClick={() => setActiveTab('factores')}
            className={`px-4 py-2 rounded ${activeTab === 'factores' ? 'bg-ugt-red text-white' : 'bg-white'}`}
          >
            Factores TLC
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-2 rounded ${activeTab === 'usuarios' ? 'bg-ugt-red text-white' : 'bg-white'}`}
          >
            <Users className="inline mr-2" size={16} />
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('exportar')}
            className={`px-4 py-2 rounded ${activeTab === 'exportar' ? 'bg-ugt-red text-white' : 'bg-white'}`}
          >
            <Download className="inline mr-2" size={16} />
            Exportar Datos
          </button>
        </div>

        {/* Tab: Contenido del Sitio */}
        {activeTab === 'contenido' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Editar Contenido del Sitio</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Título "Quiénes Somos"</label>
                <input
                  type="text"
                  className="input-field"
                  value={siteContent.quienes_somos_titulo}
                  onChange={(e) => setSiteContent({...siteContent, quienes_somos_titulo: e.target.value})}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Contenido "Quiénes Somos"</label>
                <textarea
                  className="input-field"
                  rows={6}
                  value={siteContent.quienes_somos_contenido}
                  onChange={(e) => setSiteContent({...siteContent, quienes_somos_contenido: e.target.value})}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">Información del Técnico</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Nombre</label>
                    <input
                      type="text"
                      className="input-field"
                      value={siteContent.tecnico_nombre}
                      onChange={(e) => setSiteContent({...siteContent, tecnico_nombre: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Titulación</label>
                    <input
                      type="text"
                      className="input-field"
                      value={siteContent.tecnico_titulacion}
                      onChange={(e) => setSiteContent({...siteContent, tecnico_titulacion: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      className="input-field"
                      value={siteContent.tecnico_email}
                      onChange={(e) => setSiteContent({...siteContent, tecnico_email: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Teléfono</label>
                    <input
                      type="tel"
                      className="input-field"
                      value={siteContent.tecnico_telefono}
                      onChange={(e) => setSiteContent({...siteContent, tecnico_telefono: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveContent}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                <Save className="mr-2" size={20} />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        )}

        {/* Tab: Factores TLC */}
        {activeTab === 'factores' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Gestión de Factores TLC</h2>
            <p className="text-gray-600 mb-6">Activar o desactivar factores de evaluación</p>

            <div className="space-y-3">
              {factors.map(factor => (
                <div key={factor.factor_id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-semibold">{factor.subfactor_name}</p>
                    <p className="text-sm text-gray-600">
                      {factor.is_direct_indirect_specific ? 
                        (factor.subfactor_name.includes('.a') ? 'Indirecto' : 'Directo') : 
                        'Común'}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFactorActive(factor.factor_id, factor.is_active)}
                    className={`px-4 py-2 rounded ${factor.is_active ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                  >
                    {factor.is_active ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Usuarios */}
        {activeTab === 'usuarios' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios Técnicos</h2>

            <div className="space-y-3">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-semibold">{u.full_name}</p>
                    <p className="text-sm text-gray-600">{u.email}</p>
                    <p className="text-xs text-gray-500">Rol: {u.role}</p>
                  </div>
                  <button
                    onClick={() => toggleUserActive(u.id, u.is_active)}
                    className={`px-4 py-2 rounded ${u.is_active ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                  >
                    {u.is_active ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Exportar */}
        {activeTab === 'exportar' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Exportar Datos</h2>
            <p className="text-gray-600 mb-6">Descargue los datos del sistema en formato CSV</p>

            <div className="space-y-4">
              <button
                onClick={exportEvaluations}
                className="btn-primary flex items-center"
              >
                <Download className="mr-2" size={20} />
                Exportar Valoraciones a CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
