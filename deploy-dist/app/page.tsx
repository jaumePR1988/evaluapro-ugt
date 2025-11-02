import Image from 'next/image'
import Link from 'next/link'
import { FileText, Users, Award, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image src="/ugt-logo.jpg" alt="UGT Logo" width={60} height={60} className="object-contain" />
            <h1 className="text-2xl font-bold text-ugt-red">EvalúaPro UGT</h1>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-ugt-red transition-colors">Inicio</Link>
            <Link href="/solicitar" className="text-gray-700 hover:text-ugt-red transition-colors">Solicitar Valoración</Link>
            <Link href="/quienes-somos" className="text-gray-700 hover:text-ugt-red transition-colors">Quiénes Somos</Link>
            <Link href="/admin" className="text-gray-700 hover:text-ugt-red transition-colors">Acceso Técnicos</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-ugt-red to-ugt-red-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Valoración Profesional de Puestos de Trabajo</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Servicio certificado de valoración según el Manual TLC del Tribunal Laboral de Catalunya
          </p>
          <Link href="/solicitar" className="inline-flex items-center btn-primary bg-white text-ugt-red hover:bg-gray-100 text-lg px-8 py-4">
            Solicitar Valoración <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h3>
          <div className="grid md:grid-3 gap-8">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FileText className="text-ugt-red" size={48} />
              </div>
              <h4 className="text-xl font-bold mb-3">Valoración Conforme Manual TLC</h4>
              <p className="text-gray-600">
                Evaluaciones precisas siguiendo el Manual de Valoración del Tribunal Laboral de Catalunya
              </p>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Award className="text-ugt-red" size={48} />
              </div>
              <h4 className="text-xl font-bold mb-3">Técnicos Certificados</h4>
              <p className="text-gray-600">
                Nuestros técnicos están certificados por el TLC en valoración de puestos de trabajo
              </p>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Users className="text-ugt-red" size={48} />
              </div>
              <h4 className="text-xl font-bold mb-3">Respaldo Sindical UGT</h4>
              <p className="text-gray-600">
                Servicio oficial de la Unión General de Trabajadores con amplia experiencia laboral
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">¿Necesitas valorar un puesto de trabajo?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Solicita una valoración profesional y objetiva conforme a la normativa vigente
          </p>
          <Link href="/solicitar" className="btn-primary text-lg px-8 py-4">
            Solicitar Ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">&copy; 2025 EvalúaPro UGT - Unión General de Trabajadores</p>
          <p className="text-gray-400 text-sm">
            Valoración profesional de puestos de trabajo según el Manual TLC
          </p>
        </div>
      </footer>
    </div>
  )
}
