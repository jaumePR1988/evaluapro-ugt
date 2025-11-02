'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Upload, CheckCircle } from 'lucide-react'

export default function SolicitarPage() {
  const [formData, setFormData] = useState({
    requester_name: '',
    requester_email: '',
    is_affiliated: false,
    company_name: '',
    position_name: '',
    collective_agreement: ''
  })
  const [files, setFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Insertar solicitud
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert([formData])
        .select()
        .maybeSingle()

      if (requestError) throw requestError

      // Subir archivos si existen
      if (files.length > 0 && request) {
        for (const file of files) {
          const fileName = `${request.id}/${Date.now()}_${file.name}`
          const { error: uploadError } = await supabase.storage
            .from('solicitud-archivos')
            .upload(fileName, file)

          if (uploadError) throw uploadError

          // Registrar archivo en la BD
          await supabase.from('request_files').insert([{
            request_id: request.id,
            file_name: file.name,
            file_path: fileName,
            file_type: file.type.includes('pdf') ? 'pdf' : 'other'
          }])
        }
      }

      // Enviar notificaciones por email
      try {
        await supabase.functions.invoke('send-notification-email', {
          body: {
            requestId: request.id,
            requesterEmail: request.requester_email,
            requesterName: request.requester_name,
            companyName: request.company_name,
            positionName: request.position_name
          }
        })
      } catch (notifError) {
        console.error('Error al enviar notificaciones:', notifError)
        // No bloqueamos el flujo si falla la notificación
      }

      setSubmitted(true)
    } catch (error) {
      console.error('Error al enviar solicitud:', error)
      alert('Error al enviar la solicitud. Por favor, inténtelo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold mb-4">Solicitud Enviada</h2>
          <p className="text-gray-600 mb-6">
            Su solicitud ha sido enviada correctamente. Nuestro equipo técnico la revisará y se pondrá en contacto con usted pronto.
          </p>
          <Link href="/" className="btn-primary">
            Volver al Inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <Image src="/ugt-logo.jpg" alt="UGT Logo" width={60} height={60} className="object-contain" />
            <h1 className="text-2xl font-bold text-ugt-red">EvalúaPro UGT</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Solicitar Valoración de Puesto de Trabajo</h2>
          
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Nombre Completo *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.requester_name}
                onChange={(e) => setFormData({...formData, requester_name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email *</label>
              <input
                type="email"
                required
                className="input-field"
                value={formData.requester_email}
                onChange={(e) => setFormData({...formData, requester_email: e.target.value})}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="affiliated"
                className="mr-2"
                checked={formData.is_affiliated}
                onChange={(e) => setFormData({...formData, is_affiliated: e.target.checked})}
              />
              <label htmlFor="affiliated">Soy afiliado/a de UGT</label>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Empresa *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Puesto a Valorar *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.position_name}
                onChange={(e) => setFormData({...formData, position_name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Convenio Colectivo *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.collective_agreement}
                onChange={(e) => setFormData({...formData, collective_agreement: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Archivos Adjuntos (PDF/DPT)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <input
                  type="file"
                  multiple
                  accept=".pdf,.dpt"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer text-ugt-red hover:underline">
                  Seleccionar archivos
                </label>
                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">{files.length} archivo(s) seleccionado(s):</p>
                    <ul className="text-sm text-gray-600">
                      {files.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
