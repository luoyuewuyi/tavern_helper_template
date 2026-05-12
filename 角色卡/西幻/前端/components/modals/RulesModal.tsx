import GlassModal from '../ui/GlassModal';
import { WestFantasyState } from '../../types';

interface RulesModalProps {
  state: WestFantasyState;
  onClose: () => void;
  onRuleChange: (groupName: string, itemKey: string, value: string | number | boolean) => void;
}

export default function RulesModal({ state, onClose, onRuleChange }: RulesModalProps) {
  return (
    <GlassModal title="法则开关" subtitle="直接写回最新楼层 MVU 状态。" onClose={onClose}>
      <div className="space-y-5">
        {state.法则.分组.map(group => (
          <section key={group.名称} className="rounded-[1.8rem] border border-amber-100/10 bg-stone-950/45 p-6">
            <div className="mb-5">
              <h3 className="font-display text-2xl text-stone-50">{group.名称}</h3>
              <p className="mt-2 text-sm text-stone-400">{group.描述}</p>
            </div>
            <div className="space-y-4">
              {group.项目.map(item => (
                <div key={item.键} className="rounded-[1.2rem] bg-stone-900/55 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-base text-stone-100">{item.标签}</div>
                      <div className="mt-1 text-sm leading-6 text-stone-400">{item.描述}</div>
                    </div>
                    {item.类型 === 'toggle' && (
                      <button
                        onClick={() => onRuleChange(group.名称, item.键, !item.值)}
                        className={`rounded-full px-4 py-2 text-sm transition-colors ${
                          item.值 ? 'bg-amber-500/20 text-amber-100' : 'bg-stone-100/8 text-stone-300'
                        }`}
                      >
                        {item.值 ? '开启' : '关闭'}
                      </button>
                    )}
                    {item.类型 === 'select' && (
                      <select
                        value={item.值}
                        onChange={event => onRuleChange(group.名称, item.键, event.target.value)}
                        className="rounded-xl border border-amber-100/10 bg-stone-950/80 px-4 py-2 text-sm text-stone-100 outline-none"
                      >
                        {item.选项.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                    {item.类型 === 'range' && (
                      <div className="w-full max-w-xs">
                        <div className="mb-2 flex items-center justify-between text-sm text-stone-300">
                          <span>{item.值}</span>
                          <span>{item.单位}</span>
                        </div>
                        <input
                          type="range"
                          min={item.最小值}
                          max={item.最大值}
                          step={item.步长}
                          value={item.值}
                          onChange={event => onRuleChange(group.名称, item.键, Number(event.target.value))}
                          className="w-full accent-amber-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </GlassModal>
  );
}
