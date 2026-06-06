import React, { useCallback, useState, useMemo } from 'react'
import { Droplets, Search, Phone, MapPin, Mail, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import Header from '../components/Header'
import { useData } from '../hooks/useData'
import { fetchRequests, updateReqStatus } from '../api'

const STATUS_BADGE = {
  pending:   'badge-pending',
  pulse_sent:'badge-pulse',
  matched:   'badge-matched',
  fulfilled: 'badge-fulfilled',
}
const STATUS_LABEL = {
  pending:   'Pending',
  pulse_sent:'Pulse Sent',
  matched:   'Matched',
  fulfilled: 'Fulfilled',
}
const BLOOD_COLORS = {
  'A+':'#ef4444','A-':'#f97316','B+':'#eab308','B-':'#22c55e',
  'AB+':'#06b6d4','AB-':'#8b5cf6','O+':'#ec4899','O-':'#c0392b',
}

export default function Requests() {
  const reqFn = useCallback(fetchRequests, [])
  const { data, loading, lastUpdated, refresh } = useData(reqFn, 30000)

  const [search,       setSearch]      = useState('')
  const [statusFilter, setStatus]      = useState('All')
  const [bloodFilter,  setBlood]       = useState('All')
  const [expanded,     setExpanded]    = useState(null)
  const [updating,     setUpdating]    = useState(null)

  const requests = data || []

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchSearch = !search ||
        r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        r.city?.toLowerCase().includes(search.toLowerCase()) ||
        r.hospital?.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || r.status === statusFilter
      const matchBlood  = bloodFilter  === 'All' || r.bloodType === bloodFilter
      return matchSearch && matchStatus && matchBlood
    })
  }, [requests, search, statusFilter, bloodFilter])

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(id)
    try {
      await updateReqStatus(id, newStatus)
      await refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      <Header
        title="Blood Requests"
        subtitle={`${filtered.length} requests`}
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
              placeholder="Search patient, hospital, city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-300 placeholder-slate-600"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatus(e.target.value)} className="text-sm">
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="pulse_sent">Pulse Sent</option>
            <option value="matched">Matched</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
          <select value={bloodFilter} onChange={e => setBlood(e.target.value)} className="text-sm">
            <option value="All">All Blood Types</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
          </select>
          <button onClick={() => { setSearch(''); setStatus('All'); setBlood('All') }}
            className="btn btn-ghost text-xs">Clear</button>
        </div>
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {loading && requests.length === 0 ? (
          <div className="card py-16 text-center text-slate-500 text-sm">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="card py-16 text-center text-slate-500 text-sm">No requests found</div>
        ) : (
          filtered.map((r, i) => (
            <div key={r.id || i} className="card p-0 overflow-hidden">
              {/* Request header */}
              <div className="px-5 py-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}>

                {/* Blood type */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0"
                  style={{ background:`${BLOOD_COLORS[r.bloodType]}22`, color:BLOOD_COLORS[r.bloodType] }}>
                  {r.bloodType}
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{r.patientName}</span>
                    <span className={`badge ${STATUS_BADGE[r.status] || 'badge-pending'}`}>
                      {STATUS_LABEL[r.status] || r.status}
                    </span>
                    <span className={`badge ${r.urgency === 'critical' ? 'badge-critical' : 'badge-planned'}`}>
                      {r.urgency}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin size={10} /> {r.hospital || r.city}
                    </span>
                    <span className="text-xs text-slate-500">{r.unitsRequired} unit(s)</span>
                    {r.emailsSent > 0 && (
                      <span className="text-xs text-blue-400 flex items-center gap-1">
                        <Mail size={10} /> {r.emailsSent} emails sent
                      </span>
                    )}
                    <span className="text-xs text-slate-600">
                      {r.createdAt?.seconds
                        ? new Date(r.createdAt.seconds * 1000).toLocaleString('en-IN')
                        : '—'}
                    </span>
                  </div>
                </div>

                {/* Donor count + expand */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{r.availableDonorCount || 0}</div>
                    <div className="text-xs text-slate-600">donors</div>
                  </div>
                  {expanded === r.id ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </div>
              </div>

              {/* Expanded details */}
              {expanded === r.id && (
                <div className="border-t px-5 py-4 space-y-4"
                  style={{ borderColor:'rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.2)' }}>

                  {/* Contact info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Contact Person</p>
                      <p className="text-sm text-white font-semibold">{r.contactPerson || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                      <a href={`tel:${r.contactPhone}`}
                        className="text-sm text-blue-400 flex items-center gap-1">
                        <Phone size={12} /> {r.contactPhone}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Hospital</p>
                      <p className="text-sm text-slate-300">{r.hospital || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Est. Match Time</p>
                      <p className="text-sm text-slate-300">{r.estimatedMatchMinutes || '—'} mins</p>
                    </div>
                  </div>

                  {/* Matched donors */}
                  {r.matchedDonors?.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                        Matched Donors (AI Ranked)
                      </p>
                      <div className="space-y-2">
                        {r.matchedDonors.map((d, j) => (
                          <div key={j} className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ background:'rgba(255,255,255,0.03)' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                              style={{ background:`${BLOOD_COLORS[d.bloodType]}22`, color:BLOOD_COLORS[d.bloodType] }}>
                              {d.bloodType}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white">{d.name || 'Donor'}</div>
                              <div className="text-xs text-slate-500">{d.city}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-green-400 font-bold">Score: {d.aiScore}</div>
                              <div className={`text-xs mt-0.5 ${
                                d.status === 'confirmed' ? 'text-green-400' :
                                d.status === 'declined'  ? 'text-red-400'  :
                                'text-slate-500'
                              }`}>{d.status}</div>
                            </div>
                            {d.phone && (
                              <a href={`tel:${d.phone}`}
                                className="btn btn-ghost text-xs py-1 px-2">
                                <Phone size={11} /> Call
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status update actions */}
                  {r.status !== 'fulfilled' && (
                    <div className="flex gap-2 pt-2">
                      {r.status === 'matched' && (
                        <button
                          onClick={() => handleStatusUpdate(r.id, 'fulfilled')}
                          disabled={updating === r.id}
                          className="btn btn-primary text-xs gap-1.5">
                          <CheckCircle size={13} />
                          {updating === r.id ? 'Updating...' : 'Mark as Fulfilled'}
                        </button>
                      )}
                      {r.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(r.id, 'cancelled')}
                          disabled={updating === r.id}
                          className="btn btn-ghost text-xs">
                          Cancel Request
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
