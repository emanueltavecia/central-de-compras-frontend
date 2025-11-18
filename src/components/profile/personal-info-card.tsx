interface PersonalInfoCardProps {
  fullName: string
  email: string
  phone?: string
}

export function PersonalInfoCard({
  fullName,
  email,
  phone,
}: PersonalInfoCardProps) {
  return (
    <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-text-primary mb-6 text-lg font-bold">
        Informações Pessoais
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-text-secondary mb-1 block text-sm font-medium">
            Nome Completo
          </label>
          <input
            type="text"
            value={fullName}
            readOnly
            className="text-text-primary w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-text-secondary mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="text-text-primary w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-text-secondary mb-1 block text-sm font-medium">
            Telefone Celular
          </label>
          <input
            type="text"
            value={phone || 'N/A'}
            readOnly
            className="text-text-primary w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  )
}
