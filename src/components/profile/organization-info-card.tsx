import { OrgType } from '@/utils/enums'

interface OrganizationInfoCardProps {
  organizationName: string
  taxId: string
  type: OrgType
  active: boolean
}

export function OrganizationInfoCard({
  organizationName,
  taxId,
  type,
  active,
}: OrganizationInfoCardProps) {
  const getTypeLabel = (type: OrgType) => {
    switch (type) {
      case OrgType.STORE:
        return 'Loja'
      case OrgType.SUPPLIER:
        return 'Fornecedor'
      default:
        return ''
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-text-primary mb-6 text-lg font-bold">
        Informações da Organização
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-text-secondary mb-1 block text-sm font-medium">
            Nome da Organização
          </label>
          <input
            type="text"
            value={organizationName}
            readOnly
            className="text-text-primary w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-text-secondary mb-1 block text-sm font-medium">
            CNPJ
          </label>
          <input
            type="text"
            value={taxId}
            readOnly
            className="text-text-primary w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-text-secondary mb-1 block text-sm font-medium">
            Tipo
          </label>
          <input
            type="text"
            value={getTypeLabel(type)}
            readOnly
            className="text-text-primary w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-text-secondary mb-1 block text-sm font-medium">
            Status
          </label>
          <input
            type="text"
            value={active ? 'Ativo' : 'Inativo'}
            readOnly
            className="text-text-primary w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  )
}
