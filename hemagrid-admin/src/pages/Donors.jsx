import React, { useCallback, useState, useMemo } from 'react'
import { Users, Search, Filter, Phone, Mail, MapPin, Droplets, CheckCircle, XCircle } from 'lucide-react'
import Header from '../components/Header'
import { useData } from '../hooks/useData'
import { fetchDonors } from '../api'

const BLOOD_TYPES = ['All','A+','A-','B+','B-','AB+','AB-','O+','O-']

export default function Donors() {
  const donorsFn = useCallback(fetchDonors, [])
  const { data, loading, lastUpdated, refresh } = useData(donorsFn, 60000)

  const [search,    setSearch]    = useState('')
  const [bloodFilter, setBlood]  = useState('All')
  const [cityFilter,  setCity]   = useState('')
  const [availFilter, setAvail]  = useState('All')

  const donors = data || []

  const filtered = useMemo(() => {
    return donors.filter(d => {
      const matchSearch = !search ||
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.phone?.includes(search) ||
        d.email?.toLowerCase().includes(search.toLowerCase())
      const matchBlood  = bloodFilter === 'All' || d.bloodType === bloodFilter
      const matchCity   = !cityFilter || d.city?.toLowerCase().includes(cityFilter.toLowerCase())
      const matchAvail  = availFilter === 'All' ||
        (availFilter === 'Available' && d.isAvailable) ||
        (availFilter === 'Unavailable' && !d.isAvailable)
      return matchSearch && matchBlood && matchCity && matchAvail
    })
  }, [donors, search, bloodFilter, cityFilter, availFilter])

  const BLOOD_COLORS = {
    'A+':'#ef4444','A-':'#f97316','B+':'#eab308','B-':'#22c55e',
    'AB+':'#06b6d4','AB-':'#8b5cf6','O+':'#ec4899','O-':'#c0392b',
  }

  return (
    <div>
      <Header
        title="Donors"
        subtitle={`${filtered.length} donors found`}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        loading={loading}
      />

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-48">
            <Search size={14} className="text-slate-500 flex-shrink-0" />
            <input
              placeholder="Search name, phone, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-300 placeholder-slate-600"
            />
          </div>
          <select value={bloodFilter} onChange={e => setBlood(e.target.value)} className="text-sm">
            {BLOOD_TYPES.map(b => <option key={b}>{b}</option>)}
          </select>
          <input
            placeholder="Filter by city..."
            value={cityFilter}
            onChange={e => setCity(e.target.value)}
            className="text-sm w-36"
          />
          <select value={availFilter} onChange={e => setAvail(e.target.value)} className="text-sm">
            <option>All</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>
          <button onClick={() => { setSearch(''); setBlood('All'); setCity(''); setAvail('All') }}
            className="btn btn-ghost text-xs">
            Clear
          </button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => {
          const count = donors.filter(d => d.bloodType === bt && d.isAvailable).length
          return count > 0 ? (
            <button key={bt} onClick={() => setBlood(bt)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
              style={{
                borderColor: bloodFilter === bt ? BLOOD_COLORS[bt] : 'rgba(255,255,255,0.08)',
                color: BLOOD_COLORS[bt],
                background: bloodFilter === bt ? `${BLOOD_COLORS[bt]}22` : 'transparent'
              }}>
              <Droplets size={10} /> {bt} <span className="opacity-70">({count})</span>
            </button>
          ) : null
        })}
      </div>

      {/* Donors table */}
      <div className="card overflow-hidden p-0">
        <div className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor:'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blood-600" />
            <span className="text-white font-semibold text-sm">Donor Registry</span>
          </div>
          <span className="text-slate-500 text-xs">{filtered.length} results</span>
        </div>

        {loading && donors.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">Loading donors...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No donors found</div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blood Type</th>
                  <th>Contact</th>
                  <th>City</th>
                  <th>Donations</th>
                  <th>Response Rate</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={d.id || i}>
                    <td>
                      <div className="font-semibold text-white">{d.name}</div>
                      {d.email && (
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={10} /> {d.email}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="font-bold text-base" style={{ color: BLOOD_COLORS[d.bloodType] }}>
                        {d.bloodType}
                      </span>
                    </td>
                    <td>
                      <a href={`tel:${d.phone}`}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs">
                        <Phone size={11} /> {d.phone}
                      </a>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <MapPin size={11} className="text-slate-500" />
                        {d.city}
                      </div>
                    </td>
                    <td>
                      <span className="text-purple-400 font-semibold">{d.totalDonations || 0}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden w-16">
                          <div className="h-full rounded-full"
                            style={{ width:`${d.responseRate||0}%`, background:'#4ade80' }} />
                        </div>
                        <span className="text-xs text-green-400">{d.responseRate || 0}%</span>
                      </div>
                    </td>
                    <td className="text-slate-400 text-xs">{d.preferredLanguage || 'English'}</td>
                    <td>
                      {d.isAvailable ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                          <CheckCircle size={12} /> Available
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                          <XCircle size={12} /> Unavailable
                        </span>
                      )}
                    </td>
                    <td className="text-slate-500 text-xs">
                      {d.createdAt?.seconds
                        ? new Date(d.createdAt.seconds * 1000).toLocaleDateString('en-IN')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
