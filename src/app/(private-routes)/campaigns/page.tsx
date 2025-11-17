import { Card, Stack, Text, Title } from '@mantine/core'

import { getCampaigns } from './action'

import { CampaignFormButton, CampaignsTable } from '@/components/campaigns'

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()

  const activeCampaigns = campaigns.filter((campaign) => campaign.active)
  const inactiveCampaigns = campaigns.filter((campaign) => !campaign.active)

  return (
    <Stack gap="xl" p="xl">
      <div className="flex items-center justify-between">
        <Title order={2}>Campanhas</Title>
        <CampaignFormButton />
      </div>

      <div className="space-y-8">
        <div>
          <Title order={3} mb="md">
            Campanhas Ativas
          </Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {activeCampaigns.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Nenhuma campanha ativa encontrada
              </Text>
            ) : (
              <CampaignsTable campaigns={activeCampaigns} />
            )}
          </Card>
        </div>

        <div>
          <Title order={3} mb="md" className="text-gray-600">
            Campanhas Inativas
          </Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {inactiveCampaigns.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Nenhuma campanha inativa encontrada
              </Text>
            ) : (
              <CampaignsTable campaigns={inactiveCampaigns} />
            )}
          </Card>
        </div>
      </div>
    </Stack>
  )
}
