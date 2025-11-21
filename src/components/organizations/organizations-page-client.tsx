'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Group,
  Modal,
  Table,
  TextInput,
  Menu,
  ActionIcon,
  Stack,
  Title,
  Text,
  PasswordInput,
  Paper,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'

import {
  getAllOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  updateOrganizationStatus,
} from '@/lib/organizations'
import {
  getAllUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} from '@/lib/users'
import {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
  setPrimaryContact,
  unsetPrimaryContact,
} from '@/lib/contacts/actions'
import {
  getOrganizationAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  type Address,
  type CreateAddressInput,
} from '@/lib/addresses/actions'
import { type Organization, OrgType } from '@/sdk/organizations'
import { type User, UserAccountStatus } from '@/sdk/users'
import { type Contact } from '@/sdk/contacts'
import {
  organizationSchema,
  type OrganizationInput,
} from '@/utils/schemas/organization'

type Variant = 'stores' | 'suppliers'

interface OrganizationsPageClientProps {
  variant: Variant
}

export function OrganizationsPageClient({
  variant,
}: OrganizationsPageClientProps) {
  const orgType = variant === 'stores' ? OrgType.STORE : OrgType.SUPPLIER

  const labels = useMemo(() => {
    if (variant === 'stores') {
      return {
        entity: 'Loja',
        activeTitle: 'Lojas ativas',
        inactiveTitle: 'Lojas inativas',
        registerTitle: 'Cadastrar Loja',
      }
    }
    return {
      entity: 'Fornecedor',
      activeTitle: 'Fornecedores ativos',
      inactiveTitle: 'Fornecedores inativos',
      registerTitle: 'Cadastrar Fornecedor',
    }
  }, [variant])

  const [activeItems, setActiveItems] = useState<Organization[]>([])
  const [inactiveItems, setInactiveItems] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<Organization | null>(null)
  const [usersOpen, setUsersOpen] = useState<Organization | null>(null)
  const [contactsOpen, setContactsOpen] = useState<Organization | null>(null)
  const [addressesOpen, setAddressesOpen] = useState<Organization | null>(null)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState<User | null>(null)
  const [addContactOpen, setAddContactOpen] = useState(false)
  const [editContactOpen, setEditContactOpen] = useState<Contact | null>(null)
  const [deleteOpen, setDeleteOpen] = useState<Organization | null>(null)
  const [deleteUserOpen, setDeleteUserOpen] = useState<string | null>(null)
  const [deleteContactOpen, setDeleteContactOpen] = useState<string | null>(
    null,
  )
  const [credentialsOpen, setCredentialsOpen] = useState(false)
  const [credentialsData, setCredentialsData] = useState<{
    fullName: string
    email: string
    password: string
  } | null>(null)

  const generatePassword = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let s = ''
    for (let i = 0; i < 6; i++)
      s += chars.charAt(Math.floor(Math.random() * chars.length))
    return s
  }

  const addForm = useForm<OrganizationInput>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: '', taxId: '', phone: '', email: '', website: '' },
  })

  const editForm = useForm<OrganizationInput>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: '', taxId: '', phone: '', email: '', website: '' },
  })

  const loadOrganizations = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Loading organizations with type:', orgType)
      const all = await getAllOrganizations({ type: orgType })
      console.log('Loaded organizations:', all)
      setActiveItems(all.filter((org: Organization) => org.active !== false))
      setInactiveItems(all.filter((org: Organization) => org.active === false))
    } catch (error) {
      console.error('Error loading organizations:', error)
    } finally {
      setLoading(false)
    }
  }, [orgType])

  useEffect(() => {
    loadOrganizations()
  }, [loadOrganizations])

  const onAddSubmit = async (values: OrganizationInput) => {
    try {
      await createOrganization({
        type: orgType,
        legalName: values.name,
        taxId: values.taxId,
        phone: values.phone,
        email: values.email,
        website: values.website || undefined,
      })

      notifications.show({
        title: 'Sucesso',
        message: `${labels.entity} criado com sucesso`,
        color: 'green',
      })

      setAddOpen(false)
      addForm.reset()
      await loadOrganizations()
    } catch (error: unknown) {
      console.error('Error creating organization:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          `Não foi possível criar o ${labels.entity.toLowerCase()}`,
        color: 'red',
      })
    }
  }

  const onEditSubmit = async (values: OrganizationInput) => {
    if (!editOpen) return
    try {
      await updateOrganization(editOpen.id, {
        type: editOpen.type,
        legalName: values.name,
        taxId: values.taxId,
        phone: values.phone,
        email: values.email,
        website: values.website || undefined,
      })

      notifications.show({
        title: 'Sucesso',
        message: `${labels.entity} atualizado com sucesso`,
        color: 'green',
      })

      setEditOpen(null)
      editForm.reset()
      await loadOrganizations()
    } catch (error: unknown) {
      console.error('Error updating organization:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          `Não foi possível atualizar o ${labels.entity.toLowerCase()}`,
        color: 'red',
      })
    }
  }

  const inactivate = async (item: Organization) => {
    try {
      await updateOrganizationStatus(item.id, { active: false })
      notifications.show({
        title: 'Sucesso',
        message: `${labels.entity} inativado com sucesso`,
        color: 'green',
      })
      await loadOrganizations()
    } catch (error: unknown) {
      console.error('Error inactivating organization:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          `Não foi possível inativar o ${labels.entity.toLowerCase()}`,
        color: 'red',
      })
    }
  }

  const activate = async (item: Organization) => {
    try {
      await updateOrganizationStatus(item.id, { active: true })
      notifications.show({
        title: 'Sucesso',
        message: `${labels.entity} ativado com sucesso`,
        color: 'green',
      })
      await loadOrganizations()
    } catch (error: unknown) {
      console.error('Error activating organization:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          `Não foi possível ativar o ${labels.entity.toLowerCase()}`,
        color: 'red',
      })
    }
  }

  const remove = async (item: Organization) => {
    try {
      const response = await deleteOrganization(item.id)
      notifications.show({
        title: 'Sucesso',
        message: response.message,
        color: 'green',
      })
      setDeleteOpen(null)
      await loadOrganizations()
    } catch (error: unknown) {
      console.error('Error deleting organization:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          `Não foi possível excluir o ${labels.entity.toLowerCase()}`,
        color: 'red',
      })
    }
  }

  const renderRows = (items: Organization[], status: 'active' | 'inactive') =>
    items.map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.legalName}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm">{item.taxId || '-'}</Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm">{item.phone || '-'}</Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm">{item.email || '-'}</Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm">{item.website || '-'}</Text>
        </Table.Td>
        <Table.Td>
          <Group gap={0} justify="flex-end">
            <Menu
              transitionProps={{ transition: 'pop' }}
              withArrow
              position="bottom-end"
              withinPortal
            >
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label="Mais ações"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {status === 'active' ? (
                  <>
                    <Menu.Item
                      className="justify-center"
                      onClick={() => {
                        setUsersOpen(item)
                        loadUsers(item.id)
                      }}
                    >
                      Usuários
                    </Menu.Item>
                    <Menu.Item
                      className="justify-center"
                      onClick={() => {
                        setContactsOpen(item)
                        loadContacts(item.id)
                      }}
                    >
                      Contatos
                    </Menu.Item>
                    <Menu.Item
                      className="justify-center"
                      onClick={() => {
                        setAddressesOpen(item)
                        loadAddresses(item.id)
                      }}
                    >
                      Endereços
                    </Menu.Item>
                    <Menu.Item
                      className="justify-center"
                      onClick={() => {
                        setEditOpen(item)
                        editForm.reset({
                          name: item.legalName,
                          taxId: item.taxId || '',
                          phone: item.phone || '',
                          email: item.email || '',
                          website: item.website || '',
                        })
                      }}
                    >
                      Editar
                    </Menu.Item>
                    <Menu.Item
                      className="justify-center"
                      onClick={() => inactivate(item)}
                    >
                      Inativar
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item
                      className="justify-center"
                      onClick={() => activate(item)}
                    >
                      Ativar
                    </Menu.Item>
                    <Menu.Item
                      className="justify-center"
                      color="red"
                      onClick={() => setDeleteOpen(item)}
                    >
                      Excluir
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    ))

  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [addAddressOpen, setAddAddressOpen] = useState(false)
  const [editAddressOpen, setEditAddressOpen] = useState<Address | null>(null)
  const [deleteAddressOpen, setDeleteAddressOpen] = useState<string | null>(null)

  const addUserForm = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
    },
  })

  const editUserForm = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
    },
  })

  const addContactForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
    },
  })

  const editContactForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
    },
  })

  const addAddressForm = useForm({
    defaultValues: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postalCode: '',
    },
  })

  const editAddressForm = useForm({
    defaultValues: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postalCode: '',
    },
  })

  const loadUsers = useCallback(async (orgId: string) => {
    try {
      setLoadingUsers(true)
      const usersList = await getAllUsers({ organizationId: orgId })
      setUsers(usersList)
    } catch (error) {
      console.error('Error loading users:', error)
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar os usuários',
        color: 'red',
      })
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  const loadContacts = useCallback(async (orgId: string) => {
    try {
      setLoadingContacts(true)
      const contactsList = await getAllContacts({ organizationId: orgId })
      setContacts(contactsList)
    } catch (error) {
      console.error('Error loading contacts:', error)
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar os contatos',
        color: 'red',
      })
    } finally {
      setLoadingContacts(false)
    }
  }, [])

  const loadAddresses = useCallback(async (orgId: string) => {
    try {
      setLoadingAddresses(true)
      const addressesList = await getOrganizationAddresses(orgId)
      console.log('Endereços carregados:', addressesList)
      setAddresses(addressesList)
    } catch (error) {
      console.error('Error loading addresses:', error)
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível carregar os endereços',
        color: 'red',
      })
    } finally {
      setLoadingAddresses(false)
    }
  }, [])

  const toggleUserStatus = async (user: User) => {
    try {
      const newStatus =
        user.status === UserAccountStatus.ACTIVE
          ? UserAccountStatus.INACTIVE
          : UserAccountStatus.ACTIVE

      await updateUserStatus(user.id, { status: newStatus })

      notifications.show({
        title: 'Sucesso',
        message: `Usuário ${newStatus === UserAccountStatus.ACTIVE ? 'ativado' : 'inativado'} com sucesso`,
        color: 'green',
      })

      if (usersOpen) {
        await loadUsers(usersOpen.id)
      }
    } catch (error: unknown) {
      console.error('Error toggling user status:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          'Não foi possível alterar o status do usuário',
        color: 'red',
      })
    }
  }

  const copyCredentials = () => {
    if (!credentialsData) return
    const text = `Nome: ${credentialsData.fullName}\nEmail: ${credentialsData.email}\nSenha: ${credentialsData.password}`
    navigator.clipboard.writeText(text)
    notifications.show({
      title: 'Sucesso',
      message: 'Dados copiados',
      color: 'green',
    })
  }

  const handleDeleteUser = async () => {
    if (!deleteUserOpen) return

    try {
      await deleteUser(deleteUserOpen)

      notifications.show({
        title: 'Sucesso',
        message: 'Usuário excluído com sucesso',
        color: 'green',
      })

      setDeleteUserOpen(null)

      if (usersOpen) {
        await loadUsers(usersOpen.id)
      }
    } catch (error: unknown) {
      console.error('Error deleting user:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          'Não foi possível excluir o usuário',
        color: 'red',
      })
    }
  }

  const onAddUserSubmit = async (values: {
    email: string
    password: string
    fullName: string
    phone: string
  }) => {
    if (!usersOpen) return

    try {
      await createUser({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
        organizationId: usersOpen.id,
      })

      setCredentialsData({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
      setCredentialsOpen(true)

      setAddUserOpen(false)
      addUserForm.reset()
      await loadUsers(usersOpen.id)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Não foi possível criar o usuário'
      console.error('Error creating user:', error)
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  const onEditUserSubmit = async (values: {
    email: string
    password?: string
    fullName: string
    phone: string
  }) => {
    if (!editUserOpen) return

    try {
      const updateData: {
        email: string
        fullName: string
        phone: string
        password?: string
      } = {
        email: values.email,
        fullName: values.fullName,
        phone: values.phone,
      }

      if (values.password && values.password.trim() !== '') {
        updateData.password = values.password
      }

      await updateUser(editUserOpen.id, updateData)

      notifications.show({
        title: 'Sucesso',
        message: 'Usuário atualizado com sucesso',
        color: 'green',
      })

      setEditUserOpen(null)
      editUserForm.reset()

      if (usersOpen) {
        await loadUsers(usersOpen.id)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar o usuário'
      console.error('Error updating user:', error)
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  const onAddContactSubmit = async (values: {
    name: string
    email: string
    phone: string
    role: string
  }) => {
    if (!contactsOpen) return

    try {
      await createContact({
        organizationId: contactsOpen.id,
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        role: values.role || undefined,
      })

      notifications.show({
        title: 'Sucesso',
        message: 'Contato criado com sucesso',
        color: 'green',
      })

      setAddContactOpen(false)
      addContactForm.reset()
      await loadContacts(contactsOpen.id)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Não foi possível criar o contato'
      console.error('Error creating contact:', error)
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  const onEditContactSubmit = async (values: {
    name: string
    email: string
    phone: string
    role: string
  }) => {
    if (!editContactOpen) return

    try {
      await updateContact(editContactOpen.id, {
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        role: values.role || undefined,
      })

      notifications.show({
        title: 'Sucesso',
        message: 'Contato atualizado com sucesso',
        color: 'green',
      })

      setEditContactOpen(null)
      editContactForm.reset()

      if (contactsOpen) {
        await loadContacts(contactsOpen.id)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar o contato'
      console.error('Error updating contact:', error)
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  const handleDeleteContact = async () => {
    if (!deleteContactOpen) return

    try {
      await deleteContact(deleteContactOpen)

      notifications.show({
        title: 'Sucesso',
        message: 'Contato excluído com sucesso',
        color: 'green',
      })

      setDeleteContactOpen(null)

      if (contactsOpen) {
        await loadContacts(contactsOpen.id)
      }
    } catch (error: unknown) {
      console.error('Error deleting contact:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          'Não foi possível excluir o contato',
        color: 'red',
      })
    }
  }

  const handleSetPrimaryContact = async (contact: Contact) => {
    try {
      await setPrimaryContact(contact.id)

      notifications.show({
        title: 'Sucesso',
        message: 'Contato definido como principal',
        color: 'green',
      })

      if (contactsOpen) {
        await loadContacts(contactsOpen.id)
      }
    } catch (error: unknown) {
      console.error('Error setting primary contact:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          'Não foi possível definir o contato como principal',
        color: 'red',
      })
    }
  }

  const handleUnsetPrimaryContact = async (contact: Contact) => {
    try {
      await unsetPrimaryContact(contact.id)
      notifications.show({
        title: 'Sucesso',
        message: 'Contato deixou de ser principal',
        color: 'green',
      })
      if (contactsOpen) {
        await loadContacts(contactsOpen.id)
      }
    } catch (error: unknown) {
      console.error('Error unsetting primary contact:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          'Não foi possível remover o contato principal',
        color: 'red',
      })
    }
  }

  const onAddAddressSubmit = async (values: CreateAddressInput) => {
    if (!addressesOpen) return

    try {
      await createAddress(addressesOpen.id, values)

      notifications.show({
        title: 'Sucesso',
        message: 'Endereço criado com sucesso',
        color: 'green',
      })

      setAddAddressOpen(false)
      addAddressForm.reset()
      await loadAddresses(addressesOpen.id)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Não foi possível criar o endereço'
      console.error('Error creating address:', error)
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  const onEditAddressSubmit = async (values: CreateAddressInput) => {
    if (!editAddressOpen) return

    try {
      await updateAddress(addressesOpen!.id, editAddressOpen.id, values)

      notifications.show({
        title: 'Sucesso',
        message: 'Endereço atualizado com sucesso',
        color: 'green',
      })

      setEditAddressOpen(null)
      editAddressForm.reset()

      if (addressesOpen) {
        await loadAddresses(addressesOpen.id)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar o endereço'
      console.error('Error updating address:', error)
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
      })
    }
  }

  const handleDeleteAddress = async () => {
    if (!deleteAddressOpen) return

    try {
      await deleteAddress(addressesOpen!.id, deleteAddressOpen)

      notifications.show({
        title: 'Sucesso',
        message: 'Endereço excluído com sucesso',
        color: 'green',
      })

      setDeleteAddressOpen(null)

      if (addressesOpen) {
        await loadAddresses(addressesOpen.id)
      }
    } catch (error: unknown) {
      console.error('Error deleting address:', error)
      notifications.show({
        title: 'Erro',
        message:
          (error as AxiosError)?.message ||
          'Não foi possível excluir o endereço',
        color: 'red',
      })
    }
  }

  const UsersTable = () => {
    if (loadingUsers) {
      return (
        <Text size="sm" c="dimmed">
          Carregando usuários...
        </Text>
      )
    }

    if (users.length === 0) {
      return (
        <Text size="sm" c="dimmed">
          Sem usuários
        </Text>
      )
    }

    return (
      <Table.ScrollContainer minWidth={600}>
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Telefone</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Text fz="sm" fw={500}>
                    {user.fullName || user.email}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{user.phone || '-'}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{user.email}</Text>
                </Table.Td>
                <Table.Td>
                  <Text
                    fz="sm"
                    c={
                      user.status === UserAccountStatus.ACTIVE ? 'green' : 'red'
                    }
                  >
                    {user.status === UserAccountStatus.ACTIVE
                      ? 'Ativo'
                      : 'Inativo'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={0} justify="flex-end">
                    <Menu
                      transitionProps={{ transition: 'pop' }}
                      withArrow
                      position="bottom-end"
                      withinPortal
                    >
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          aria-label="Mais ações"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                          </svg>
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          className="justify-center"
                          onClick={() => {
                            setEditUserOpen(user)
                            editUserForm.reset({
                              fullName: user.fullName || '',
                              email: user.email,
                              phone: user.phone || '',
                            })
                          }}
                        >
                          Editar
                        </Menu.Item>
                        <Menu.Item
                          className="justify-center"
                          onClick={() => toggleUserStatus(user)}
                        >
                          {user.status === UserAccountStatus.ACTIVE
                            ? 'Inativar'
                            : 'Ativar'}
                        </Menu.Item>
                        {user.status === UserAccountStatus.INACTIVE && (
                          <Menu.Item
                            className="justify-center"
                            color="red"
                            onClick={() => setDeleteUserOpen(user.id)}
                          >
                            Excluir
                          </Menu.Item>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    )
  }

  const ContactsTable = () => {
    const hasPrimary = contacts.some((c) => c.isPrimary)
    if (loadingContacts) {
      return (
        <Text size="sm" c="dimmed">
          Carregando contatos...
        </Text>
      )
    }

    if (contacts.length === 0) {
      return (
        <Text size="sm" c="dimmed">
          Sem contatos
        </Text>
      )
    }

    return (
      <Table.ScrollContainer minWidth={600}>
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Telefone</Table.Th>
              <Table.Th>Cargo</Table.Th>
              <Table.Th>Principal</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {contacts.map((contact) => (
              <Table.Tr key={contact.id}>
                <Table.Td>
                  <Text fz="sm" fw={500}>
                    {contact.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{contact.email || '-'}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{contact.phone || '-'}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{contact.role || '-'}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm" c={contact.isPrimary ? 'blue' : 'dimmed'}>
                    {contact.isPrimary ? 'Sim' : 'Não'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={0} justify="flex-end">
                    <Menu
                      transitionProps={{ transition: 'pop' }}
                      withArrow
                      position="bottom-end"
                      withinPortal
                    >
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          aria-label="Mais ações"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                          </svg>
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          className="justify-center"
                          onClick={() => {
                            setEditContactOpen(contact)
                            editContactForm.reset({
                              name: contact.name,
                              email: contact.email || '',
                              phone: contact.phone || '',
                              role: contact.role || '',
                            })
                          }}
                        >
                          Editar
                        </Menu.Item>
                        {!hasPrimary && !contact.isPrimary && (
                          <Menu.Item
                            className="justify-center"
                            onClick={() => handleSetPrimaryContact(contact)}
                          >
                            Definir como principal
                          </Menu.Item>
                        )}
                        {contact.isPrimary && (
                          <Menu.Item
                            className="justify-center"
                            onClick={() => handleUnsetPrimaryContact(contact)}
                          >
                            Remover principal
                          </Menu.Item>
                        )}
                        <Menu.Item
                          className="justify-center"
                          color="red"
                          onClick={() => setDeleteContactOpen(contact.id)}
                        >
                          Excluir
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    )
  }

  const AddressesTable = () => {
    if (loadingAddresses) {
      return (
        <Text size="sm" c="dimmed">
          Carregando endereços...
        </Text>
      )
    }

    if (addresses.length === 0) {
      return (
        <Text size="sm" c="dimmed">
          Sem endereços
        </Text>
      )
    }

    return (
      <Table.ScrollContainer minWidth={600}>
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Rua</Table.Th>
              <Table.Th>Número</Table.Th>
              <Table.Th>Bairro</Table.Th>
              <Table.Th>Cidade</Table.Th>
              <Table.Th>UF</Table.Th>
              <Table.Th>CEP</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {addresses.map((address) => (
              <Table.Tr key={address.id}>
                <Table.Td>
                  <Text fz="sm" fw={500}>
                    {address.street}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{address.number || '-'}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{address.neighborhood}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{address.city}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{address.state}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{address.postalCode || '-'}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={0} justify="flex-end">
                    <Menu
                      transitionProps={{ transition: 'pop' }}
                      withArrow
                      position="bottom-end"
                      withinPortal
                    >
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          aria-label="Mais ações"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                          </svg>
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          className="justify-center"
                          onClick={() => {
                            setEditAddressOpen(address)
                            editAddressForm.reset({
                              street: address.street,
                              number: address.number || '',
                              complement: address.complement || '',
                              neighborhood: address.neighborhood,
                              city: address.city,
                              state: address.state,
                              postalCode: address.postalCode || '',
                            })
                          }}
                        >
                          Editar
                        </Menu.Item>
                        <Menu.Item
                          className="justify-center"
                          color="red"
                          onClick={() => setDeleteAddressOpen(address.id)}
                        >
                          Excluir
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    )
  }

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={3}>{labels.activeTitle}</Title>
        <Button
          onClick={() => setAddOpen(true)}
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
        >
          Novo
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={900}>
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>CNPJ</Table.Th>
              <Table.Th>Telefone</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Site</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text size="sm" c="dimmed" ta="center">
                    Carregando...
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : activeItems.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text size="sm" c="dimmed" ta="center">
                    Nenhum registro encontrado
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              renderRows(activeItems, 'active')
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Title order={3}>{labels.inactiveTitle}</Title>
      <Table.ScrollContainer minWidth={900}>
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>CNPJ</Table.Th>
              <Table.Th>Telefone</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Site</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text size="sm" c="dimmed" ta="center">
                    Carregando...
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : inactiveItems.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text size="sm" c="dimmed" ta="center">
                    Nenhum registro encontrado
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              renderRows(inactiveItems, 'inactive')
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Modal
        opened={addOpen}
        onClose={() => setAddOpen(false)}
        title={labels.registerTitle}
        centered
      >
        <form onSubmit={addForm.handleSubmit(onAddSubmit)}>
          <Stack>
            <TextInput
              label="Nome"
              {...addForm.register('name')}
              error={addForm.formState.errors.name?.message}
            />
            <TextInput
              label="CNPJ"
              {...addForm.register('taxId')}
              error={addForm.formState.errors.taxId?.message}
            />
            <TextInput
              label="Telefone"
              {...addForm.register('phone')}
              error={addForm.formState.errors.phone?.message}
            />
            <TextInput
              label="Email"
              {...addForm.register('email')}
              error={addForm.formState.errors.email?.message}
            />
            <TextInput
              label="Site"
              {...addForm.register('website')}
              error={addForm.formState.errors.website?.message}
            />
            <Group justify="flex-end">
              <Button
                variant="default"
                type="button"
                onClick={() => setAddOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={!!editOpen}
        onClose={() => setEditOpen(null)}
        title={`Editar ${labels.entity}`}
        centered
      >
        <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
          <Stack>
            <TextInput
              label="Nome"
              {...editForm.register('name')}
              error={editForm.formState.errors.name?.message}
            />
            <TextInput
              label="CNPJ"
              {...editForm.register('taxId')}
              error={editForm.formState.errors.taxId?.message}
            />
            <TextInput
              label="Telefone"
              {...editForm.register('phone')}
              error={editForm.formState.errors.phone?.message}
            />
            <TextInput
              label="Email"
              {...editForm.register('email')}
              error={editForm.formState.errors.email?.message}
            />
            <TextInput
              label="Site"
              {...editForm.register('website')}
              error={editForm.formState.errors.website?.message}
            />
            <Group justify="flex-end">
              <Button type="submit">Salvar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={!!usersOpen}
        onClose={() => {
          setUsersOpen(null)
          setUsers([])
        }}
        title={
          <Group
            justify="space-between"
            style={{ width: '100%', paddingRight: '40px' }}
          >
            <Text fw={600}>Usuários da {usersOpen?.legalName}</Text>
            <ActionIcon
              variant="filled"
              color="blue"
              size="lg"
              onClick={() => {
                setAddUserOpen(true)
                addUserForm.reset({
                  fullName: '',
                  email: '',
                  phone: '',
                  password: generatePassword(),
                })
              }}
              aria-label="Adicionar usuário"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </ActionIcon>
          </Group>
        }
        centered
        size="xl"
      >
        <UsersTable />
      </Modal>

      <Modal
        opened={addUserOpen}
        onClose={() => {
          setAddUserOpen(false)
          addUserForm.reset()
        }}
        title="Adicionar Usuário"
        centered
      >
        <form onSubmit={addUserForm.handleSubmit(onAddUserSubmit)}>
          <Stack>
            <TextInput
              label="Nome Completo"
              placeholder="João Silva"
              required
              {...addUserForm.register('fullName')}
            />
            <TextInput
              label="Email"
              placeholder="joao@exemplo.com"
              type="email"
              required
              {...addUserForm.register('email')}
            />
            <TextInput
              label="Telefone"
              placeholder="48999999999"
              required
              {...addUserForm.register('phone')}
            />
            <PasswordInput
              label="Senha"
              placeholder="Senha forte"
              required
              readOnly
              {...addUserForm.register('password')}
            />
            <Group justify="flex-end">
              <Button
                variant="default"
                type="button"
                onClick={() => {
                  setAddUserOpen(false)
                  addUserForm.reset()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={!!editUserOpen}
        onClose={() => {
          setEditUserOpen(null)
          editUserForm.reset()
        }}
        title="Editar Usuário"
        centered
      >
        <form onSubmit={editUserForm.handleSubmit(onEditUserSubmit)}>
          <Stack>
            <TextInput
              label="Nome Completo"
              required
              {...editUserForm.register('fullName')}
            />
            <TextInput
              label="Email"
              type="email"
              required
              {...editUserForm.register('email')}
            />
            <TextInput
              label="Telefone"
              required
              {...editUserForm.register('phone')}
            />
            <PasswordInput
              label="Nova Senha (deixe em branco para não alterar)"
              placeholder="Digite uma nova senha"
              {...editUserForm.register('password')}
            />
            <Group justify="flex-end">
              <Button type="submit">Salvar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={!!deleteOpen}
        onClose={() => setDeleteOpen(null)}
        title={`Excluir ${labels.entity.toLowerCase()}?`}
        centered
      >
        <Stack>
          <Text>Esta ação não poderá ser desfeita.</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteOpen(null)}>
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={() => deleteOpen && remove(deleteOpen)}
            >
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={!!deleteUserOpen}
        onClose={() => setDeleteUserOpen(null)}
        title="Excluir usuário?"
        centered
      >
        <Stack>
          <Text>Esta ação não poderá ser desfeita.</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteUserOpen(null)}>
              Cancelar
            </Button>
            <Button color="red" onClick={handleDeleteUser}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={credentialsOpen}
        onClose={() => {
          setCredentialsOpen(false)
          setCredentialsData(null)
        }}
        title="Dados do Usuário"
        centered
      >
        <Paper withBorder p="lg" radius="md">
          <Stack>
            <div>
              <Text size="sm" c="dimmed">
                Nome
              </Text>
              <Text fw={600}>{credentialsData?.fullName}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Email
              </Text>
              <Text fw={600}>{credentialsData?.email}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Senha
              </Text>
              <Text fw={600}>{credentialsData?.password}</Text>
            </div>
            <Group justify="center">
              <Button onClick={copyCredentials}>Copiar dados</Button>
            </Group>
          </Stack>
        </Paper>
      </Modal>

      <Modal
        opened={!!contactsOpen}
        onClose={() => {
          setContactsOpen(null)
          setContacts([])
        }}
        title={
          <Group
            justify="space-between"
            style={{ width: '100%', paddingRight: '40px' }}
          >
            <Text fw={600}>Contatos da {contactsOpen?.legalName}</Text>
            <ActionIcon
              variant="filled"
              color="blue"
              size="lg"
              onClick={() => {
                setAddContactOpen(true)
                addContactForm.reset({
                  name: '',
                  email: '',
                  phone: '',
                  role: '',
                })
              }}
              aria-label="Adicionar contato"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </ActionIcon>
          </Group>
        }
        centered
        size="xl"
      >
        <ContactsTable />
      </Modal>

      <Modal
        opened={addContactOpen}
        onClose={() => {
          setAddContactOpen(false)
          addContactForm.reset()
        }}
        title="Adicionar Contato"
        centered
      >
        <form onSubmit={addContactForm.handleSubmit(onAddContactSubmit)}>
          <Stack>
            <TextInput
              label="Nome"
              placeholder="João Silva"
              required
              {...addContactForm.register('name')}
            />
            <TextInput
              label="Email"
              placeholder="joao@exemplo.com"
              type="email"
              {...addContactForm.register('email')}
            />
            <TextInput
              label="Telefone"
              placeholder="48999999999"
              {...addContactForm.register('phone')}
            />
            <TextInput
              label="Cargo"
              placeholder="Gerente"
              {...addContactForm.register('role')}
            />
            <Group justify="flex-end">
              <Button
                variant="default"
                type="button"
                onClick={() => {
                  setAddContactOpen(false)
                  addContactForm.reset()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={!!editContactOpen}
        onClose={() => {
          setEditContactOpen(null)
          editContactForm.reset()
        }}
        title="Editar Contato"
        centered
      >
        <form onSubmit={editContactForm.handleSubmit(onEditContactSubmit)}>
          <Stack>
            <TextInput
              label="Nome"
              required
              {...editContactForm.register('name')}
            />
            <TextInput
              label="Email"
              type="email"
              {...editContactForm.register('email')}
            />
            <TextInput
              label="Telefone"
              {...editContactForm.register('phone')}
            />
            <TextInput
              label="Cargo"
              {...editContactForm.register('role')}
            />
            <Group justify="flex-end">
              <Button type="submit">Salvar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={!!deleteContactOpen}
        onClose={() => setDeleteContactOpen(null)}
        title="Excluir contato?"
        centered
      >
        <Stack>
          <Text>Esta ação não poderá ser desfeita.</Text>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setDeleteContactOpen(null)}
            >
              Cancelar
            </Button>
            <Button color="red" onClick={handleDeleteContact}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={!!addressesOpen}
        onClose={() => {
          setAddressesOpen(null)
          setAddresses([])
        }}
        title={
          <Group
            justify="space-between"
            style={{ width: '100%', paddingRight: '40px' }}
          >
            <Text fw={600}>Endereços da {addressesOpen?.legalName}</Text>
            <ActionIcon
              variant="filled"
              color="blue"
              size="lg"
              onClick={() => {
                setAddAddressOpen(true)
                addAddressForm.reset({
                  street: '',
                  number: '',
                  complement: '',
                  neighborhood: '',
                  city: '',
                  state: '',
                  postalCode: '',
                })
              }}
              aria-label="Adicionar endereço"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </ActionIcon>
          </Group>
        }
        centered
        size="xl"
      >
        <AddressesTable />
      </Modal>

      <Modal
        opened={addAddressOpen}
        onClose={() => {
          setAddAddressOpen(false)
          addAddressForm.reset()
        }}
        title="Adicionar Endereço"
        centered
      >
        <form onSubmit={addAddressForm.handleSubmit(onAddAddressSubmit)}>
          <Stack>
            <TextInput
              label="Rua"
              placeholder="Rua das Flores"
              required
              {...addAddressForm.register('street')}
            />
            <Group grow>
              <TextInput
                label="Número"
                placeholder="123"
                {...addAddressForm.register('number')}
              />
              <TextInput
                label="Complemento"
                placeholder="Apto 101"
                {...addAddressForm.register('complement')}
              />
            </Group>
            <TextInput
              label="Bairro"
              placeholder="Centro"
              required
              {...addAddressForm.register('neighborhood')}
            />
            <Group grow>
              <TextInput
                label="Cidade"
                placeholder="Florianópolis"
                required
                {...addAddressForm.register('city')}
              />
              <TextInput
                label="UF"
                placeholder="SC"
                required
                maxLength={2}
                {...addAddressForm.register('state')}
              />
            </Group>
            <TextInput
              label="CEP"
              placeholder="88000000"
              required
              {...addAddressForm.register('postalCode')}
            />
            <Group justify="flex-end">
              <Button
                variant="default"
                type="button"
                onClick={() => {
                  setAddAddressOpen(false)
                  addAddressForm.reset()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={!!editAddressOpen}
        onClose={() => {
          setEditAddressOpen(null)
          editAddressForm.reset()
        }}
        title="Editar Endereço"
        centered
      >
        <form onSubmit={editAddressForm.handleSubmit(onEditAddressSubmit)}>
          <Stack>
            <TextInput
              label="Rua"
              required
              {...editAddressForm.register('street')}
            />
            <Group grow>
              <TextInput
                label="Número"
                {...editAddressForm.register('number')}
              />
              <TextInput
                label="Complemento"
                {...editAddressForm.register('complement')}
              />
            </Group>
            <TextInput
              label="Bairro"
              required
              {...editAddressForm.register('neighborhood')}
            />
            <Group grow>
              <TextInput
                label="Cidade"
                required
                {...editAddressForm.register('city')}
              />
              <TextInput
                label="UF"
                required
                maxLength={2}
                {...editAddressForm.register('state')}
              />
            </Group>
            <TextInput
              label="CEP"
              required
              {...editAddressForm.register('postalCode')}
            />
            <Group justify="flex-end">
              <Button type="submit">Salvar</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={!!deleteAddressOpen}
        onClose={() => setDeleteAddressOpen(null)}
        title="Excluir endereço?"
        centered
      >
        <Stack>
          <Text>Esta ação não poderá ser desfeita.</Text>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setDeleteAddressOpen(null)}
            >
              Cancelar
            </Button>
            <Button color="red" onClick={handleDeleteAddress}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
