import { cn } from '../../lib/utils';
import { formatPrice } from '../../lib/api';
import type { PaymentScheduleItem } from '@/types';

interface PaymentTableProps {
  payments: PaymentScheduleItem[];
  locale: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-secondary-100 text-secondary-700',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  waived: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<string, { en: string; es: string }> = {
  pending: { en: 'Pending', es: 'Pendiente' },
  paid: { en: 'Paid', es: 'Pagado' },
  overdue: { en: 'Overdue', es: 'Vencido' },
  waived: { en: 'Waived', es: 'Exonerado' },
};

const conceptLabels: Record<string, { en: string; es: string }> = {
  initial: { en: 'Initial', es: 'Inicial' },
  monthly: { en: 'Monthly', es: 'Mensual' },
  milestone: { en: 'Milestone', es: 'Hito' },
  final: { en: 'Final', es: 'Final' },
  other: { en: 'Other', es: 'Otro' },
};

export function PaymentTable({ payments, locale }: PaymentTableProps) {
  const lang = locale === 'es' ? 'es' : 'en';

  if (payments.length === 0) {
    return (
      <p className="text-secondary-500 text-sm text-center py-4">
        {locale === 'es' ? 'No hay pagos programados.' : 'No payments scheduled.'}
      </p>
    );
  }

  const totalAmount = payments.reduce((sum, p) => sum + p.amount_usd, 0);
  const paidAmount = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount_usd, 0);

  return (
    <div>
      {/* Summary */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="bg-secondary-50 rounded-lg px-3 py-2">
          <span className="text-secondary-500">{locale === 'es' ? 'Total' : 'Total'}:</span>{' '}
          <span className="font-semibold">{formatPrice(totalAmount)}</span>
        </div>
        <div className="bg-green-50 rounded-lg px-3 py-2">
          <span className="text-green-600">{locale === 'es' ? 'Pagado' : 'Paid'}:</span>{' '}
          <span className="font-semibold text-green-700">{formatPrice(paidAmount)}</span>
        </div>
        <div className="bg-amber-50 rounded-lg px-3 py-2">
          <span className="text-amber-600">{locale === 'es' ? 'Pendiente' : 'Remaining'}:</span>{' '}
          <span className="font-semibold text-amber-700">{formatPrice(totalAmount - paidAmount)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-secondary-200">
              <th className="text-left py-2 px-3 font-medium text-secondary-500">
                {locale === 'es' ? 'Vencimiento' : 'Due Date'}
              </th>
              <th className="text-left py-2 px-3 font-medium text-secondary-500">
                {locale === 'es' ? 'Concepto' : 'Concept'}
              </th>
              <th className="text-right py-2 px-3 font-medium text-secondary-500">
                {locale === 'es' ? 'Monto' : 'Amount'}
              </th>
              <th className="text-center py-2 px-3 font-medium text-secondary-500">
                {locale === 'es' ? 'Estado' : 'Status'}
              </th>
              <th className="text-left py-2 px-3 font-medium text-secondary-500">
                {locale === 'es' ? 'Fecha Pago' : 'Paid Date'}
              </th>
              <th className="text-left py-2 px-3 font-medium text-secondary-500">
                {locale === 'es' ? 'Referencia' : 'Reference'}
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                <td className="py-2 px-3">
                  {new Date(payment.due_date).toLocaleDateString(locale === 'es' ? 'es-VE' : 'en-US')}
                </td>
                <td className="py-2 px-3">
                  {conceptLabels[payment.concept]?.[lang] || payment.concept}
                </td>
                <td className="py-2 px-3 text-right font-medium">
                  {formatPrice(payment.amount_usd)}
                </td>
                <td className="py-2 px-3 text-center">
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    statusColors[payment.status] || 'bg-secondary-100'
                  )}>
                    {statusLabels[payment.status]?.[lang] || payment.status}
                  </span>
                </td>
                <td className="py-2 px-3 text-secondary-600">
                  {payment.paid_date
                    ? new Date(payment.paid_date).toLocaleDateString(locale === 'es' ? 'es-VE' : 'en-US')
                    : '-'}
                </td>
                <td className="py-2 px-3 text-secondary-600 truncate max-w-[120px]">
                  {payment.payment_reference || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
