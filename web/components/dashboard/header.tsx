'use client'

import { useState } from 'react'
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('🇻🇳 Vietnam (VN-01)')
  const [showNotifications, setShowNotifications] = useState(false)

  const regions = [
    '🇻🇳 Vietnam (VN-01)',
    '🇩🇪 Germany (EU-01)',
    '🇺🇸 USA West (US-01)',
    '🇸🇬 Singapore (SG-01)',
  ]

  const notifications = [
    { id: 1, message: 'Node VN-01 CPU usage at 92%', time: '2 mins ago', type: 'warning' },
    { id: 2, message: 'New backup completed successfully', time: '5 mins ago', type: 'success' },
    { id: 3, message: 'Storage capacity at 87%', time: '15 mins ago', type: 'info' },
  ]

  return (
    <div className="h-16 bg-slate-950/80 backdrop-blur-md border-b flex items-center px-8 gap-6 sticky top-0 z-20" style={{ borderColor: 'rgba(71, 85, 105, 0.12)' }}>
      {/* Left - Region Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowRegionDropdown(!showRegionDropdown)}
          className="flex items-center gap-2 cursor-pointer hover:text-slate-300 transition-colors text-slate-400 text-sm font-medium flex-shrink-0"
        >
          <span>{selectedRegion}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {showRegionDropdown && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-30">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region)
                  setShowRegionDropdown(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  selectedRegion === region ? 'bg-blue-500/20 text-blue-300' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center - Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Search by Instance ID, IP address, or Tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800/50 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)' }}
          />
        </div>
      </div>

      {/* Right - Icons */}
      <div className="flex items-center gap-4 text-slate-400 flex-shrink-0">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="hover:text-slate-300 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-30">
              <div className="p-3 border-b border-slate-700">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <p className="text-sm text-slate-300">{notif.message}</p>
                    <p className="text-xs text-slate-600 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="hover:text-slate-300 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        
        <button className="w-8 h-8 rounded-lg border border-slate-700/50 bg-slate-900/30 hover:border-slate-600 transition-colors flex items-center justify-center">
          <span className="text-xs font-semibold text-slate-400">A</span>
        </button>
      </div>
    </div>
  )
}
