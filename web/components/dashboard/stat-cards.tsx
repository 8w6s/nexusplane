import { Server, Boxes, DollarSign, Wifi } from 'lucide-react'

const stats = [
  {
    title: 'Tổng Nodes',
    value: '4',
    icon: Server,
    color: 'blue',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    title: 'Instances Active',
    value: '128',
    icon: Boxes,
    color: 'purple',
    shadowColor: 'shadow-purple-500/20',
  },
  {
    title: 'Doanh thu tháng này',
    value: '$4,250',
    icon: DollarSign,
    color: 'pink',
    shadowColor: 'shadow-pink-500/20',
    isHighlight: true,
  },
  {
    title: 'Băng thông tổng',
    value: '12.5 TB',
    icon: Wifi,
    color: 'emerald',
    shadowColor: 'shadow-emerald-500/20',
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        const colorClasses = {
          blue: 'bg-blue-500/10 text-blue-400',
          purple: 'bg-purple-500/10 text-purple-400',
          pink: 'bg-pink-500/10 text-pink-400',
          emerald: 'bg-emerald-500/10 text-emerald-400',
        }
        
        return (
          <div
            key={idx}
            className={`bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 ${stat.shadowColor} shadow-lg hover:shadow-xl transition-all hover:border-slate-700/50 cursor-pointer`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className={`text-4xl font-bold mt-2 ${stat.isHighlight ? 'text-pink-400' : 'text-white'}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
