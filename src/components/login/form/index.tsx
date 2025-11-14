'use client'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, PasswordInput, Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useForm } from 'react-hook-form'

import { login } from './action'

import { loginSchema, type LoginFormData } from '@/utils/schemas/login'

export function LoginForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    const { isSuccess, error } = await login(data)

    if (isSuccess) {
      notifications.show({
        title: 'Login realizado!',
        message: 'Você será redirecionado para o dashboard',
        color: 'green',
      })
      router.push('/dashboard')
    } else {
      notifications.show({
        title: 'Erro ao fazer login',
        message: error || 'Verifique suas credenciais e tente novamente',
        color: 'red',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextInput
        label="E-mail"
        placeholder="seu@email.com"
        size="md"
        error={errors.email?.message}
        {...register('email')}
      />

      <PasswordInput
        label="Senha"
        placeholder="Digite sua senha"
        size="md"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        fullWidth
        size="md"
        loading={isSubmitting}
        className="bg-primary hover:bg-primary-dark transition-colors"
      >
        Entrar
      </Button>
    </form>
  )
}
