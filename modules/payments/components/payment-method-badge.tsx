import React from 'react'
import { CreditCard, Smartphone, Banknote, WalletCards } from 'lucide-react'
import { Badge } from '@/shared/components'
import type { PaymentMethod } from '../types'

const METHOD_ICONS: Record<PaymentMethod, React.ComponentType<{ className?: string }>> = {
  UPI: Smartphone,
  'Credit Card': CreditCard,
  'Debit Card': CreditCard,
  'Net Banking': Banknote,
  Wallet: WalletCards,
}

interface PaymentMethodBadgeProps {
  method: PaymentMethod
}

export const PaymentMethodBadge: React.FC<PaymentMethodBadgeProps> = ({ method }) => {
  const Icon = METHOD_ICONS[method]

  return (
    <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-none">
      <Icon className="h-3 w-3" />
      <span>{method}</span>
    </Badge>
  )
}
