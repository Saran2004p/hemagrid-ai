const BASE = 'https://bloodbridge-backend-3d5m.onrender.com'

const get = async (endpoint) => {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    const res = await fetch(`${BASE}${endpoint}`, {
      signal: controller.signal
    })
    clearTimeout(timeout)
    return res.json()
  } catch (error) {
    console.error('API Error:', endpoint, error.message)
    return { success: false, data: null }
  }
}

const patch = async (endpoint, body) => {
  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  } catch (error) {
    return { success: false }
  }
}

export const fetchStats      = () => get('/api/requests/stats')
export const fetchDonors     = () => get('/api/donors')
export const fetchRequests   = () => get('/api/requests')
export const fetchLivePulse  = () => get('/api/requests/live-pulse')
export const updateReqStatus = (id, status) => patch(`/api/requests/${id}/status`, { status })