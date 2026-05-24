import Link from 'next/link'
import { RegisterForm } from './RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col justify-center px-5 py-12">
      <div className="max-w-sm w-full mx-auto">
        <div className="text-center mb-8">
          <span className="text-4xl">⚽</span>
          <h1 className="text-2xl font-bold text-foreground mt-2">Únete a StampSwap</h1>
          <p className="text-muted text-sm mt-1">Completa tu álbum FIFA 2026</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <RegisterForm />
        </div>
        <p className="text-center text-muted text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
