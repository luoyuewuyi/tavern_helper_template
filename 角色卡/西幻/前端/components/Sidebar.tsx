import { Map as MapIcon, MapPin, Settings, User, Users } from 'lucide-react';
import { ModalType } from '../types';

interface SidebarProps {
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
}

export default function Sidebar({ activeModal, setActiveModal }: SidebarProps) {
  const navItems = [
    { id: 'members', icon: Users, label: '成员' },
    { id: 'map', icon: MapIcon, label: '地图' },
    { id: 'location', icon: MapPin, label: '地点' },
    { id: 'status', icon: User, label: '状态' },
    { id: 'rules', icon: Settings, label: '法则' },
  ] as const;

  return (
    <aside className="west-sidebar z-20 flex w-20 shrink-0 flex-col items-center justify-center border-r border-amber-200/10 backdrop-blur-xl">
      <div className="flex flex-col gap-8">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeModal === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModal(isActive ? null : item.id)}
              className={`group relative flex flex-col items-center justify-center gap-2 rounded-[1.2rem] px-3 py-3 transition-all duration-300 ${
                isActive ? 'text-amber-200' : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <span
                className={`absolute inset-0 rounded-[1.2rem] border border-amber-200/0 bg-amber-200/0 transition-all duration-300 group-hover:border-amber-200/20 group-hover:bg-amber-200/8 ${
                  isActive ? 'border-amber-200/30 bg-amber-200/12' : ''
                }`}
              />
              <Icon
                size={24}
                className={`relative transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]' : ''
                }`}
              />
              <span className="relative text-[10px] font-medium tracking-[0.32em]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
