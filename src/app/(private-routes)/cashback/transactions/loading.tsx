import { Card, Stack, Skeleton } from '@mantine/core'

export default function Loading() {
  return (
    <Stack gap="xl" p="xl">
      <Skeleton height={40} width={300} />

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton height={40} width={100} />
              <Skeleton height={40} width={120} />
              <Skeleton height={40} flex={1} />
              <Skeleton height={40} width={150} />
            </div>
          ))}
        </Stack>
      </Card>
    </Stack>
  )
}
