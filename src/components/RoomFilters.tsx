import { EQUIPMENT_OPTIONS } from '@/sampleData';

interface RoomFiltersProps {
  attendees: number | null;
  selectedEquipment: string[];
  onAttendeesChange: (value: number | null) => void;
  onToggleEquipment: (item: string) => void;
}

export function RoomFilters({
  attendees,
  selectedEquipment,
  onAttendeesChange,
  onToggleEquipment,
}: RoomFiltersProps) {
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
      <div>
        <label htmlFor="filter-attendees" className="block text-sm font-medium text-slate-700 mb-1.5">
          Attendees
        </label>
        <input
          id="filter-attendees"
          type="number"
          min={1}
          inputMode="numeric"
          placeholder="Any"
          value={attendees ?? ''}
          onChange={(e) =>
            onAttendeesChange(Number.isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber)
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <fieldset>
        <legend className="block text-sm font-medium text-slate-700 mb-1.5">
          Required equipment
        </legend>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((item) => {
            const checked = selectedEquipment.includes(item);
            return (
              <label
                key={item}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm cursor-pointer transition-colors ${
                  checked
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleEquipment(item)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                {item}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
