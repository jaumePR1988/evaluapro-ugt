'use client'

import { useState } from 'react'

// Forzar renderizado dinámico para evitar 404 en Vercel
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { LogIn, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (!fullName) {
          throw new Error('El nombre completo es requerido')
        }
        await signUp(email, password, fullName)
        alert('Cuenta creada exitosamente. Revise su email para confirmar.')
        setIsSignUp(false)
      } else {
        await signIn(email, password)
        router.push('/admin/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-4">
            <Image src="/ugt-logo.jpg" alt="UGT Logo" width={60} height={60} className="object-contain" />
            <h1 className="text-2xl font-bold text-ugt-red">EvalúaPro UGT</h1>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <div className="text-center mb-8">
            {isSignUp ? (
              <>
                <UserPlus className="mx-auto mb-4 text-ugt-red" size={48} />
                <h2 className="text-2xl font-bold">Crear Cuenta Técnico</h2>
                <p className="text-gray-600 mt-2">Solo para personal certificado UGT</p>
              </>
            ) : (
              <>
                <LogIn className="mx-auto mb-4 text-ugt-red" size={48} />
                <h2 className="text-2xl font-bold">Acceso Técnicos</h2>
                <p className="text-gray-600 mt-2">Inicie sesión para acceder al panel</p>
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold mb-2">Nombre Completo</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan García López"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Email Corporativo UGT</label>
              <input
                type="email"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tecnico@ugt.es"
              />
              {isSignUp && (
                <p className="text-xs text-gray-500 mt-1">Solo emails con dominio @ugt.es</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Contraseña</label>
              <input
                type="password"
                required
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              {isSignUp && (
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Procesando...' : isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-ugt-red hover:underline text-sm"
            >
              {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿Necesitas una cuenta? Regístrate'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-600 hover:text-ugt-red text-sm">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
