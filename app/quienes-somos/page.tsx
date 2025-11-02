'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function QuienesSomosPage() {
  const [content, setContent] = useState({
    titulo: 'Sobre EvalúaPro UGT',
    contenido: '',
    tecnico_nombre: '',
    tecnico_titulacion: '',
    tecnico_email: '',
    tecnico_telefono: ''
  })

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    const { data } = await supabase.from('site_content').select('*')
    if (data) {
      const contentMap: any = {}
      data.forEach(item => {
        contentMap[item.content_key] = item.content_value
      })
      setContent({
        titulo: contentMap.quienes_somos_titulo || 'Sobre EvalúaPro UGT',
        contenido: contentMap.quienes_somos_contenido || '',
        tecnico_nombre: contentMap.tecnico_nombre || '',
        tecnico_titulacion: contentMap.tecnico_titulacion || '',
        tecnico_email: contentMap.tecnico_email || '',
        tecnico_telefono: contentMap.tecnico_telefono || ''
      })
    }
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
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-ugt-red">Inicio</Link>
            <Link href="/solicitar" className="text-gray-700 hover:text-ugt-red">Solicitar</Link>
            <Link href="/quienes-somos" className="text-ugt-red font-semibold">Quiénes Somos</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">{content.titulo}</h2>
          
          <div className="card mb-8">
            <div className="prose max-w-none">
              <p className="text-lg whitespace-pre-line">{content.contenido}</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-2xl font-bold mb-6">Técnico Certificado</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-lg">{content.tecnico_nombre}</p>
                <p className="text-gray-600 italic mt-2">{content.tecnico_titulacion}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">Contacto:</p>
                <p className="font-semibold">{content.tecnico_email}</p>
                <p className="font-semibold">{content.tecnico_telefono}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 EvalúaPro UGT - Unión General de Trabajadores</p>
        </div>
      </footer>
    </div>
  )
}
