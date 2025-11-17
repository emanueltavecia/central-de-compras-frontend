'use client'

import { useState } from 'react'

import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Table,
  Text,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { CategoryModal } from '../category-modal'
import { deleteCategory } from '../category-modal/action'

import type { Category } from '@/types'

interface CategoriesTableProps {
  categories: Category[]
}

interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[]
}

function formatDate(date?: string): string {
  if (!date) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

function buildCategoryTree(categories: Category[]): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>()
  const rootCategories: CategoryWithChildren[] = []

  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] })
  })

  categories.forEach((category) => {
    const categoryWithChildren = categoryMap.get(category.id)!
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId)
      if (parent) {
        parent.children.push(categoryWithChildren)
      } else {
        rootCategories.push(categoryWithChildren)
      }
    } else {
      rootCategories.push(categoryWithChildren)
    }
  })

  return rootCategories
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<
    Category | undefined
  >()
  const [isDeleting, setIsDeleting] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  )

  const categoryTree = buildCategoryTree(categories)

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleOpenModal = (category?: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(undefined)
  }

  const handleOpenDeleteModal = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setCategoryToDelete(undefined)
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return

    setIsDeleting(true)
    const result = await deleteCategory(categoryToDelete.id)

    if (result.isSuccess) {
      notifications.show({
        title: 'Sucesso!',
        message: 'Categoria excluída com sucesso',
        color: 'green',
      })
      handleCloseDeleteModal()
    } else {
      notifications.show({
        title: 'Erro',
        message: result.error || 'Ocorreu um erro ao excluir a categoria',
        color: 'red',
      })
    }
    setIsDeleting(false)
  }

  const renderCategoryRow = (
    category: CategoryWithChildren,
    level: number = 0,
  ): React.ReactElement[] => {
    const hasChildren = category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const rows: React.ReactElement[] = []

    rows.push(
      <Table.Tr
        key={category.id}
        className="border-b border-gray-100 transition-colors hover:bg-blue-50/30"
      >
        <Table.Td>
          <Group gap="xs" wrap="nowrap">
            {level > 0 && <div style={{ width: level * 24 }} />}
            {hasChildren ? (
              <ActionIcon
                size="sm"
                variant="light"
                color="blue"
                radius="md"
                onClick={() => toggleExpand(category.id)}
                className="transition-all"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </ActionIcon>
            ) : (
              level === 0 && <div style={{ width: 28 }} />
            )}
            <Text
              fw={level === 0 ? 700 : 600}
              size="sm"
              c={level === 0 ? 'blue.7' : 'gray.8'}
            >
              {category.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text
            size="sm"
            c={category.description ? 'gray.6' : 'gray.4'}
            lineClamp={2}
          >
            {category.description || 'Sem descrição'}
          </Text>
        </Table.Td>
        <Table.Td>
          <Group gap={6}>
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <Text size="xs" c="gray.6">
              {formatDate(category.createdAt)}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <div className="flex justify-center">
            <Menu shadow="md" width={180} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="light" color="gray" radius="md">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  }
                  onClick={() => handleOpenModal(category)}
                >
                  Editar
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  }
                  onClick={() => handleOpenDeleteModal(category)}
                >
                  Excluir
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Table.Td>
      </Table.Tr>,
    )

    if (hasChildren && isExpanded) {
      category.children.forEach((child) => {
        rows.push(...renderCategoryRow(child, level + 1))
      })
    }

    return rows
  }

  return (
    <>
      <Stack gap="lg">
        <div className="flex items-center justify-between">
          <div>
            <Group gap="sm" align="center">
              <Text size="xl" fw={700} c="gray.9">
                Categorias
              </Text>
              <Badge size="lg" variant="light" color="blue" radius="md">
                {categories.length}
              </Badge>
            </Group>
            <Text size="sm" c="gray.6" mt={4}>
              Organize seus produtos em categorias e subcategorias
            </Text>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            size="md"
            leftSection={
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
            className="bg-blue-600 shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
          >
            Nova Categoria
          </Button>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 py-16">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <Text size="lg" fw={600} c="gray.7" mb={8}>
              Nenhuma categoria cadastrada
            </Text>
            <Text size="sm" c="gray.5" mb={20}>
              Comece criando sua primeira categoria
            </Text>
            <Button onClick={() => handleOpenModal()} variant="light" size="sm">
              Criar primeira categoria
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <Table.ScrollContainer minWidth={800}>
              <Table
                highlightOnHover
                verticalSpacing="md"
                horizontalSpacing="lg"
              >
                <Table.Thead className="bg-gray-50">
                  <Table.Tr>
                    <Table.Th w="40%">
                      <Text size="sm" fw={600} c="gray.7">
                        Nome
                      </Text>
                    </Table.Th>
                    <Table.Th w="40%">
                      <Text size="sm" fw={600} c="gray.7">
                        Descrição
                      </Text>
                    </Table.Th>
                    <Table.Th w="15%">
                      <Text size="sm" fw={600} c="gray.7">
                        Criada em
                      </Text>
                    </Table.Th>
                    <Table.Th w="5%">
                      <Text size="sm" fw={600} c="gray.7" ta="center">
                        Ações
                      </Text>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {categoryTree.map((category) => renderCategoryRow(category))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </div>
        )}
      </Stack>

      <CategoryModal
        opened={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
        categories={categories}
      />

      <Modal
        opened={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title={
          <Group gap="sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <Text fw={700} size="lg" c="gray.9">
                Confirmar Exclusão
              </Text>
              <Text size="xs" c="gray.6">
                Esta ação não pode ser desfeita
              </Text>
            </div>
          </Group>
        }
        size="md"
        centered
        radius="lg"
      >
        <Stack gap="lg" pt="md">
          <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
            <Text size="md" c="gray.8">
              Tem certeza que deseja excluir a categoria{' '}
              <Text component="span" fw={700} c="red.7">
                "{categoryToDelete?.name}"
              </Text>
              ?
            </Text>
          </div>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              color="gray"
              onClick={handleCloseDeleteModal}
              disabled={isDeleting}
              size="md"
              radius="md"
            >
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              loading={isDeleting}
              size="md"
              radius="md"
            >
              Excluir Categoria
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
