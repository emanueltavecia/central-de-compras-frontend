import { Card, Stack, Skeleton } from '@mantine/core'

export default function Loading() {
  return (
    <Stack gap="xl" p="xl">
      <Skeleton height={40} width={300} />

      <div className="grid gap-6 md:grid-cols-3">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="xs">
            <Skeleton height={20} width={150} />
            <Skeleton height={32} width={120} />
          </Stack>
        </Card>

        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="xs">
            <Skeleton height={20} width={150} />
            <Skeleton height={32} width={120} />
          </Stack>
        </Card>

        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="xs">
            <Skeleton height={20} width={150} />
            <Skeleton height={32} width={120} />
          </Stack>
        </Card>
      </div>

      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="md">
          <Skeleton height={28} width={250} />
          <Skeleton height={20} width="100%" />
          <Skeleton height={20} width="100%" />
          <Skeleton height={20} width="100%" />
        </Stack>
      </Card>
    </Stack>
  )
}
