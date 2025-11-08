'use client'

import { useEffect, useState } from 'react'

interface DashboardStats {
  queued: number
  in_progress: number
  completed: number
  ready_to_publish: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    queued: 0,
    in_progress: 0,
    completed: 0,
    ready_to_publish: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Articles in Queue',
      value: stats.queued,
      color: 'bg-blue-500',
      icon: '📋',
    },
    {
      title: 'In Progress',
      value: stats.in_progress,
      color: 'bg-yellow-500',
      icon: '⏳',
    },
    {
      title: 'Completed',
      value: stats.completed,
      color: 'bg-green-500',
      icon: '✅',
    },
    {
      title: 'Ready to Publish',
      value: stats.ready_to_publish,
      color: 'bg-purple-500',
      icon: '🚀',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your annotation pipeline</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && stats.queued === 0 && stats.in_progress === 0 && stats.completed === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No articles yet</h2>
          <p className="text-gray-600 mb-6">
            Get started by adding your first article to the system
          </p>
          <a
            href="/articles"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Add Article
          </a>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/articles"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Articles</h3>
              <p className="text-sm text-gray-600">View and add articles</p>
            </div>
          </a>
          <a
            href="/annotators"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <span className="text-2xl">👥</span>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Annotators</h3>
              <p className="text-sm text-gray-600">Add and assign annotators</p>
            </div>
          </a>
          <a
            href="/settings"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <span className="text-2xl">⚙️</span>
            <div>
              <h3 className="font-semibold text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600">Configure system</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
