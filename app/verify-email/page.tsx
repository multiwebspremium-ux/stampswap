import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-5 text-center">
      <div className="max-w-sm w-full">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Revisa tu email</h1>
        <p className="text-muted text-sm leading-relaxed mb-6">
          Te enviamos un link de confirmación. Haz clic en él para activar tu cuenta y empezar a intercambiar.
        </p>
        <div className="bg-card border border-border rounded-2xl p-4 mb-6 text-left">
          <p className="text-xs text-muted">
            ¿No llegó el email? Revisa tu carpeta de spam. El link expira en 24 horas.
          </p>
        </div>
        <Link href="/login" className="text-primary hover:underline text-sm">
          Ya confirmé → Iniciar sesión
        </Link>
      </div>
    </div>
  )
}
