import Link from 'next/link'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col justify-center px-5 py-12">
      <div className="max-w-sm w-full mx-auto">
        <div className="text-center mb-8">
          <span className="text-4xl">⚽</span>
          <h1 className="text-2xl font-bold text-foreground mt-2">Bienvenido de vuelta</h1>
          <p className="text-muted text-sm mt-1">StampSwap FIFA 2026</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <LoginForm />
        </div>
        <p className="text-center text-muted text-sm mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}
