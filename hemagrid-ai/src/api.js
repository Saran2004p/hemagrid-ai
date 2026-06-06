// BloodBridge AI — API connector
const BASE_URL = 'https://bloodbridge-backend-3d5m.onrender.com'

const api = async (endpoint, options = {}) => {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    })
    clearTimeout(timeout)
    return res.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, message: 'Server is waking up — please wait 30 seconds and try again.' }
    }
    return { success: false, message: 'Network error. Please try again.' }
  }
}

export const registerDonor     = (data) => api('/api/donors/register', { method:'POST', body:JSON.stringify(data) })
export const getDonorStats      = (city, bloodType) => api(`/api/donors/stats?city=${encodeURIComponent(city)}&bloodType=${encodeURIComponent(bloodType)}`)
export const getCitySummary     = () => api('/api/donors/city-summary')
export const submitBloodRequest = (data) => api('/api/requests', { method:'POST', body:JSON.stringify(data) })
export const getLivePulse       = () => api('/api/requests/live-pulse')
export const getDashboardStats  = () => api('/api/requests/stats')