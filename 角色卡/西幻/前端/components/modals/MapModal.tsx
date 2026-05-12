import GlassModal from '../ui/GlassModal';
import { SessionHostCommandPayload, WestFantasyState } from '../../types';

interface MapModalProps {
  state: WestFantasyState;
  onClose: () => void;
  onTravel: (command: SessionHostCommandPayload) => void;
}

export default function MapModal({ state, onClose, onTravel }: MapModalProps) {
  return (
    <GlassModal title="探索地图" subtitle="已发现地区与区域切换入口。" onClose={onClose}>
      <div className="grid gap-5 lg:grid-cols-2">
        {state.地图.已发现地区.map(region => (
          <button
            key={region.目标}
            onClick={() =>
              !region.是否当前 &&
              onTravel({
                type: 'travel-region',
                target: region.目标,
                label: `前往${region.名称}`,
                description: region.摘要,
              })
            }
            disabled={region.是否当前}
            className={`rounded-[1.8rem] border p-6 text-left transition-all ${
              region.是否当前
                ? 'border-amber-200/25 bg-amber-100/8 shadow-[0_16px_40px_rgba(0,0,0,0.26)]'
                : 'border-amber-100/10 bg-stone-950/45 hover:border-amber-200/20 hover:bg-stone-900/70'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-2xl text-stone-50">{region.名称}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs tracking-[0.18em] ${
                  region.是否当前 ? 'bg-amber-100/15 text-amber-100' : 'bg-stone-100/6 text-stone-400'
                }`}
              >
                {region.是否当前 ? '当前区域' : '可前往'}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-stone-300">{region.摘要}</p>
          </button>
        ))}
      </div>
    </GlassModal>
  );
}
