import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import type { CheckResult } from '@/types';

interface ResultCardProps {
  result: CheckResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all ${
        result.decision === 'available'
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {result.decision === 'available' ? (
          <CheckCircle2 className="w-7 h-7 text-green-600 shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
        )}
        <div className="min-w-0">
          <h3
            className={`text-lg font-bold ${
              result.decision === 'available' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {result.decision === 'available'
              ? 'Available — this time slot is free'
              : 'Unavailable — this request cannot be booked'}
          </h3>
          {result.reasons.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {result.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="mt-1 text-sm text-green-700">
                No conflicts detected. The room is free during the selected
                interval and all rules are satisfied.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                This is a check only; no booking is saved.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
