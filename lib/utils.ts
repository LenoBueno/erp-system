import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Função para combinar classes do Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Função para formatar moeda em formato brasileiro (R$)
 */
export function formatCurrency(value: number, showSymbol: boolean = true): string {
  return new Intl.NumberFormat("pt-BR", {
    style: showSymbol ? "currency" : "decimal",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Função para formatar data em formato brasileiro
 */
export function formatDate(dateString: string | Date, options: Intl.DateTimeFormatOptions = {}): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(date)
}

/**
 * Função para gerar número de pedido
 */
export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")

  return `PED-${year}${month}-${random}`
}

/**
 * Função para validar CPF
 */
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, "")

  if (cpf.length !== 11) return false

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false

  // Validar dígitos verificadores
  let sum = 0
  let remainder: number

  for (let i = 1; i <= 9; i++) {
    sum += Number.parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cpf.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += Number.parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cpf.substring(10, 11))) return false

  return true
}

/**
 * Função para validar CNPJ
 */
export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, "")

  if (cnpj.length !== 14) return false

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false

  // Validar dígitos verificadores
  let size = cnpj.length - 2
  let numbers = cnpj.substring(0, size)
  const digits = cnpj.substring(size)
  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += Number.parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number.parseInt(digits.charAt(0))) return false

  size += 1
  numbers = cnpj.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += Number.parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number.parseInt(digits.charAt(1))) return false

  return true
}

/**
 * Função para formatar número de telefone
 */
export function maskPhone(value: string): string {
  value = value.replace(/\D/g, "")
  
  if (value.length === 0) {
    return ""
  }
  
  // Formato para celular: (99) 99999-9999
  if (value.length <= 11) {
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
    value = value.replace(/(\d)(\d{4})$/, "$1-$2")
  }
  // Formato para telefone fixo: (99) 9999-9999
  else {
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
    value = value.replace(/(\d)(\d{4})$/, "$1-$2")
    // Se tiver mais de 11 dígitos, corta para 11
    value = value.substring(0, 15)
  }
  
  return value
}

/**
 * Função para validar email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
