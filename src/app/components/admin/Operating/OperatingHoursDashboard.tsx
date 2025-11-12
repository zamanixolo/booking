'use client'
import React, { useState, useEffect } from 'react'
import OperatingHoursList from './OperatingHoursList'
import OperatingHoursForm from './OperatingHoursForm'
import BulkOperatingHoursEditor from './BulkOperatingHoursEditor'

interface Provider {
  id: string
  firstName: string
  lastName: string
}

export default function OperatingHoursDashboard() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'bulk'>('list')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    // fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/team/getActiveProvider')
      if (res.ok) {
        const data = await res.json() as any
        setProviders(data)
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
    }
  }

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const tabs = [
    { id: 'list' as const, label: 'View Hours' },
    { id: 'create' as const, label: 'Add Hours' },
    // { id: 'bulk' as const, label: 'Bulk Edit' }
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Operating Hours Management</h1>
      
      {/* Tab Navigation */}
      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'list' && (
          <OperatingHoursList 
            providers={providers} 
            key={refreshTrigger}
          />
        )}
        
        {activeTab === 'create' && (
          <OperatingHoursForm 
            providers={providers} 
            onSuccess={handleSuccess}
          />
        )}
        
        {/* {activeTab === 'bulk' && (
          <BulkOperatingHoursEditor providers={providers} />
        )} */}
      </div>
    </div>
  )
}