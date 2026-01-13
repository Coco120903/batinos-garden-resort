import { useEffect, useMemo, useState } from 'react'
import { getAllBookings, approveBooking, completeBooking, adminCancelBooking, rescheduleBooking } from '../../api/bookings'
import { getDashboardStats } from '../../api/analytics'
import { adminGetSiteSettings, adminUpdateSiteSettings } from '../../api/site'
import { 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users,
  CheckCircle,
  Clock,
  Filter,
  Search,
  X,
  Printer,
  Download,
  Eye,
  Info,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import './AdminPage.css'

function toLocalDateTimeInputValue(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`
}

function AdminDashboardPage() {
  const [bookings, setBookings] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [dateRange, setDateRange] = useState('all')

  const [manageBooking, setManageBooking] = useState(null)
  const [rescheduleStart, setRescheduleStart] = useState('')
  const [rescheduleEnd, setRescheduleEnd] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  const [system, setSystem] = useState({ isBookingOpen: true, maintenanceMessage: '' })
  const [systemSaving, setSystemSaving] = useState(false)
  const [showMaintenancePreview, setShowMaintenancePreview] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  // Near real-time: auto-refresh every 15s (only when tab is visible)
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') {
        fetchData()
      }
    }
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [bookingsRes, analyticsRes] = await Promise.all([
        getAllBookings(),
        getDashboardStats()
      ])
      
      // Handle paginated response
      const bookingsData = bookingsRes.bookings || bookingsRes || []
      setBookings(bookingsData)
      setAnalytics(analyticsRes)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadSystem = async () => {
      try {
        const s = await adminGetSiteSettings()
        setSystem({
          isBookingOpen: s?.system?.isBookingOpen ?? true,
          maintenanceMessage: s?.system?.maintenanceMessage || '',
        })
      } catch {
        // ignore
      }
    }
    loadSystem()
  }, [])

  const saveSystem = async () => {
    try {
      setSystemSaving(true)
      await adminUpdateSiteSettings({ system })
      alert('System settings saved.')
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save system settings')
    } finally {
      setSystemSaving(false)
    }
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setActionLoading(bookingId)
      const next = String(newStatus || '').toLowerCase()
      if (next === 'approved') await approveBooking(bookingId)
      else if (next === 'completed') await completeBooking(bookingId)
      else if (next === 'cancelled') await adminCancelBooking(bookingId, 'Cancelled by admin')
      else throw new Error(`Unknown status: ${newStatus}`)
      await fetchData() // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status')
    } finally {
      setActionLoading(null)
    }
  }

  const openManage = (booking) => {
    setManageBooking(booking)
    const start = booking?.startAt ? new Date(booking.startAt) : new Date()
    const end = booking?.endAt ? new Date(booking.endAt) : new Date()
    setRescheduleStart(toLocalDateTimeInputValue(start))
    setRescheduleEnd(toLocalDateTimeInputValue(end))
    setCancelReason('')
  }

  const closeManage = () => {
    setManageBooking(null)
    setCancelReason('')
  }

  const handleReschedule = async () => {
    if (!manageBooking?._id) return
    try {
      setActionLoading(manageBooking._id)
      await rescheduleBooking(
        manageBooking._id,
        new Date(rescheduleStart).toISOString(),
        new Date(rescheduleEnd).toISOString(),
        'Rescheduled by admin'
      )
      await fetchData()
      closeManage()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reschedule booking')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelWithReason = async () => {
    if (!manageBooking?._id) return
    try {
      setActionLoading(manageBooking._id)
      await adminCancelBooking(manageBooking._id, cancelReason || 'Cancelled by admin')
      await fetchData()
      closeManage()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setActionLoading(null)
    }
  }

  const getDateRangeFilter = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (dateRange) {
      case 'today':
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
      case '7days':
        return { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
      case '14days':
        return { start: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000), end: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
      case '1month':
        return { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
      default:
        return null
    }
  }

  // Bookings filtered ONLY by date range (used for Overview stats + charts).
  const rangeBookings = useMemo(() => {
    const range = getDateRangeFilter()
    const list = bookings || []
    if (!range) return list
    return list.filter((booking) => {
      if (!booking?.startAt) return false
      const bookingDate = new Date(booking.startAt)
      return bookingDate >= range.start && bookingDate < range.end
    })
  }, [bookings, dateRange])

  // Bookings filtered for table controls (date range + status + search).
  const filteredBookings = useMemo(() => {
    return (rangeBookings || []).filter((booking) => {
      const matchesStatus =
        filterStatus === 'all' || booking.status?.toLowerCase() === filterStatus.toLowerCase()

      const q = searchQuery?.toLowerCase() || ''
      const matchesSearch =
        !q ||
        booking.user?.name?.toLowerCase().includes(q) ||
        booking.user?.email?.toLowerCase().includes(q) ||
        booking.service?.name?.toLowerCase().includes(q) ||
        booking.eventType?.toLowerCase().includes(q)

      return matchesStatus && matchesSearch
    })
  }, [rangeBookings, filterStatus, searchQuery])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount || 0)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case 'pending':
        return 'status-pending'
      case 'approved':
        return 'status-approved'
      case 'completed':
        return 'status-completed'
      case 'cancelled':
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }


  const filteredAnalytics = useMemo(() => {
    if (!analytics || dateRange === 'all') return analytics
    
    const filtered = rangeBookings
    const overview = {
      totalBookings: filtered.length,
      pending: filtered.filter(b => b.status?.toLowerCase() === 'pending').length,
      approved: filtered.filter(b => b.status?.toLowerCase() === 'approved').length,
      completed: filtered.filter(b => b.status?.toLowerCase() === 'completed').length,
      cancelled: filtered.filter(b => b.status?.toLowerCase() === 'cancelled').length,
    }
    
    const revenue = filtered.reduce((acc, b) => {
      if (b.pricing?.total && b.status?.toLowerCase() !== 'cancelled') {
        acc.total += b.pricing.total
        acc.count += 1
      }
      return acc
    }, { total: 0, count: 0 })
    
    return {
      ...analytics,
      overview,
      revenue: {
        totalRevenue: revenue.total,
        averageBooking: revenue.count > 0 ? revenue.total / revenue.count : 0
      }
    }
  }, [analytics, rangeBookings, dateRange])

  const rangeLabel = useMemo(() => {
    return dateRange === 'all'
      ? 'All Time'
      : dateRange === 'today'
        ? 'Today'
        : dateRange === '7days'
          ? 'Last 7 Days'
          : dateRange === '14days'
            ? 'Last 14 Days'
            : dateRange === '1month'
              ? 'Last 30 Days'
              : 'All Time'
  }, [dateRange])

  const insights = useMemo(() => {
    const list = rangeBookings || []

    const safeTotal = (b) => {
      const v = b?.pricing?.total
      return typeof v === 'number' && Number.isFinite(v) ? v : 0
    }

    const toDayKey = (d) => {
      const dd = new Date(d)
      return `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}-${String(dd.getDate()).padStart(2, '0')}`
    }

    const toMonthKey = (d) => {
      const dd = new Date(d)
      return `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}`
    }

    // Build time buckets depending on range.
    const now = new Date()
    const buckets = []
    const byKey = new Map()

    const pushBucket = (key, label) => {
      buckets.push({ key, label })
      if (!byKey.has(key)) byKey.set(key, { count: 0, revenue: 0 })
    }

    if (dateRange === 'today') {
      const base = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      for (let h = 0; h < 24; h++) {
        const key = `${toDayKey(base)}T${String(h).padStart(2, '0')}`
        const label = `${String(h).padStart(2, '0')}:00`
        pushBucket(key, label)
      }
      for (const b of list) {
        if (!b?.startAt) continue
        const d = new Date(b.startAt)
        const key = `${toDayKey(base)}T${String(d.getHours()).padStart(2, '0')}`
        const cur = byKey.get(key)
        if (!cur) continue
        cur.count += 1
        if (String(b.status || '').toLowerCase() !== 'cancelled') cur.revenue += safeTotal(b)
      }
    } else if (dateRange === 'all') {
      // last 12 months (including current), grouped by month for readability
      const first = new Date(now.getFullYear(), now.getMonth(), 1)
      first.setMonth(first.getMonth() - 11)
      for (let i = 0; i < 12; i++) {
        const d = new Date(first)
        d.setMonth(first.getMonth() + i)
        const key = toMonthKey(d)
        const label = d.toLocaleDateString('en-US', { month: 'short' })
        pushBucket(key, label)
      }
      for (const b of list) {
        if (!b?.startAt) continue
        const key = toMonthKey(b.startAt)
        const cur = byKey.get(key)
        if (!cur) continue
        cur.count += 1
        if (String(b.status || '').toLowerCase() !== 'cancelled') cur.revenue += safeTotal(b)
      }
    } else {
      // daily buckets for 7/14/30 days
      const range = getDateRangeFilter()
      const start = range?.start ? new Date(range.start) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
      const days =
        dateRange === '7days' ? 7 : dateRange === '14days' ? 14 : dateRange === '1month' ? 30 : 7
      for (let i = 0; i < days; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        const key = toDayKey(d)
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        pushBucket(key, label)
      }
      for (const b of list) {
        if (!b?.startAt) continue
        const key = toDayKey(b.startAt)
        const cur = byKey.get(key)
        if (!cur) continue
        cur.count += 1
        if (String(b.status || '').toLowerCase() !== 'cancelled') cur.revenue += safeTotal(b)
      }
    }

    const series = buckets.map((b) => {
      const v = byKey.get(b.key) || { count: 0, revenue: 0 }
      return { label: b.label, count: v.count, revenue: v.revenue }
    })

    const maxCount = Math.max(1, ...series.map((s) => s.count))
    const maxRevenue = Math.max(1, ...series.map((s) => s.revenue))

    // Status breakdown
    const statuses = ['pending', 'approved', 'completed', 'cancelled']
    const statusCounts = statuses.reduce((acc, st) => {
      acc[st] = list.filter((b) => String(b.status || '').toLowerCase() === st).length
      return acc
    }, {})
    const statusTotal = Math.max(1, statuses.reduce((sum, st) => sum + (statusCounts[st] || 0), 0))

    // Top packages (by count)
    const byService = new Map()
    for (const b of list) {
      const name = b?.service?.name || 'Unknown Package'
      byService.set(name, (byService.get(name) || 0) + 1)
    }
    const topServices = Array.from(byService.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
    const maxService = Math.max(1, ...topServices.map((s) => s.count))

    return {
      series,
      maxCount,
      maxRevenue,
      statusCounts,
      statusTotal,
      topServices,
      maxService,
    }
  }, [rangeBookings, dateRange])

  const Sparkline = ({ values, max, stroke = '#16a34a' }) => {
    const w = 260
    const h = 80
    const pad = 6
    const n = values.length
    if (n <= 1) return <div className="chart-empty">Not enough data</div>

    const pts = values.map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (n - 1)
      const y = pad + (h - pad * 2) * (1 - Math.min(1, v / max))
      return `${x},${y}`
    })

    return (
      <svg className="sparkline" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Trend chart">
        <polyline className="sparkline__line" points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="3" />
      </svg>
    )
  }

  const Bars = ({ values, max, color = 'var(--primary)' }) => {
    return (
      <div className="bars" role="img" aria-label="Bar chart">
        {values.map((v, i) => (
          <div key={i} className="bars__bar" style={{ height: `${Math.round((Math.min(1, v / max)) * 100)}%`, background: color }} />
        ))}
      </div>
    )
  }

  const upcomingSchedule = useMemo(() => {
    const now = Date.now()
    return (bookings || [])
      .filter((b) => {
        const st = b?.startAt ? new Date(b.startAt).getTime() : 0
        const s = String(b.status || '').toLowerCase()
        return st >= now && (s === 'approved' || s === 'pending')
      })
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
      .slice(0, 8)
  }, [bookings])

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank')
    const range = getDateRangeFilter()
    const rangeLabel = dateRange === 'all' ? 'All Time' : 
      dateRange === 'today' ? 'Today' :
      dateRange === '7days' ? 'Last 7 Days' :
      dateRange === '14days' ? 'Last 14 Days' :
      dateRange === '1month' ? 'Last 30 Days' : 'All Time'
    
    const stats = filteredAnalytics || analytics
    const bookingsToPrint = filteredBookings || bookings
    
    // Sort bookings by date
    const sortedBookings = [...bookingsToPrint].sort((a, b) => {
      const dateA = a.startAt ? new Date(a.startAt).getTime() : 0
      const dateB = b.startAt ? new Date(b.startAt).getTime() : 0
      return dateB - dateA // Most recent first
    })
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Admin Dashboard Report - ${rangeLabel}</title>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { margin: 1cm; size: A4; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #1f2937; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #16a34a; padding-bottom: 20px; }
            .header h1 { color: #16a34a; font-size: 32px; margin-bottom: 8px; font-weight: 700; }
            .header .subtitle { color: #4b5563; font-size: 16px; margin-bottom: 5px; }
            .header .meta { color: #6b7280; font-size: 12px; margin-top: 8px; }
            .section { margin-bottom: 35px; page-break-inside: avoid; }
            .section h2 { color: #16a34a; font-size: 22px; margin-bottom: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; font-weight: 600; }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
            .stat-box { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .stat-box h3 { font-size: 11px; color: #6b7280; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
            .stat-box .value { font-size: 28px; font-weight: 700; color: #16a34a; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
            table th, table td { padding: 10px 12px; text-align: left; border: 1px solid #d1d5db; }
            table th { background: #16a34a; color: white; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            table tr:nth-child(even) { background: #f9fafb; }
            table tr:hover { background: #f3f4f6; }
            .status { padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; display: inline-block; text-transform: uppercase; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-approved { background: #d1fae5; color: #065f46; }
            .status-completed { background: #dbeafe; color: #1e40af; }
            .status-cancelled { background: #fee2e2; color: #991b1b; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 11px; }
            .summary-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin-bottom: 20px; border-radius: 6px; }
            .summary-box p { margin: 5px 0; color: #166534; font-weight: 500; }
            @media print { 
              .no-print { display: none; }
              body { padding: 10px; }
              .section { page-break-inside: avoid; }
              table { font-size: 11px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Batino's Garden Farm Resort</h1>
            <p class="subtitle">Admin Dashboard Report</p>
            <p class="subtitle" style="font-weight: 600;">${rangeLabel}</p>
            <p class="meta">Generated: ${new Date().toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</p>
          </div>
          
          <div class="section">
            <h2>Overview Statistics</h2>
            <div class="summary-box">
              <p><strong>Report Period:</strong> ${rangeLabel}</p>
              <p><strong>Total Bookings Analyzed:</strong> ${stats?.overview?.totalBookings || 0}</p>
              <p><strong>Total Revenue:</strong> ₱${(stats?.revenue?.totalRevenue || 0).toLocaleString()}</p>
              <p><strong>Average Booking Value:</strong> ₱${(stats?.revenue?.averageBooking || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div class="stats-grid">
              <div class="stat-box">
                <h3>Total Bookings</h3>
                <div class="value">${stats?.overview?.totalBookings || 0}</div>
              </div>
              <div class="stat-box">
                <h3>Pending Approval</h3>
                <div class="value">${stats?.overview?.pending || 0}</div>
              </div>
              <div class="stat-box">
                <h3>Approved</h3>
                <div class="value">${stats?.overview?.approved || 0}</div>
              </div>
              <div class="stat-box">
                <h3>Completed</h3>
                <div class="value">${stats?.overview?.completed || 0}</div>
              </div>
              <div class="stat-box">
                <h3>Cancelled</h3>
                <div class="value">${stats?.overview?.cancelled || 0}</div>
              </div>
              <div class="stat-box">
                <h3>Total Revenue</h3>
                <div class="value">₱${(stats?.revenue?.totalRevenue || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Bookings Details (${sortedBookings.length} total)</h2>
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Date & Time</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Service/Package</th>
                  <th>Event Type</th>
                  <th>Pax</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${sortedBookings.length === 0 ? `
                  <tr>
                    <td colspan="9" style="text-align: center; padding: 30px; color: #6b7280;">
                      No bookings found for the selected period.
                    </td>
                  </tr>
                ` : sortedBookings.map(b => `
                  <tr>
                    <td style="font-family: monospace; font-size: 11px;">#${b._id?.slice(-8) || 'N/A'}</td>
                    <td>${b.startAt ? new Date(b.startAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}</td>
                    <td><strong>${b.user?.name || 'N/A'}</strong></td>
                    <td style="font-size: 11px;">${b.user?.email || 'N/A'}<br/>${b.user?.phone || ''}</td>
                    <td>${b.service?.name || 'N/A'}</td>
                    <td>${b.eventType || 'N/A'}</td>
                    <td style="text-align: center;">${b.paxCount || 0}</td>
                    <td style="font-weight: 600; color: #16a34a;">₱${(b.pricing?.total || 0).toLocaleString()}</td>
                    <td><span class="status status-${b.status?.toLowerCase() || 'pending'}">${b.status || 'Pending'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p><strong>Batino's Garden Farm Resort</strong></p>
            <p>Silang, Cavite, Philippines | Phone: 0927 272 6865 | Email: batino50@gmail.com</p>
            <p style="margin-top: 10px;">This report was generated from the Admin Dashboard system.</p>
            <p>© ${new Date().getFullYear()} Batino's Garden Farm Resort. All rights reserved.</p>
          </div>
        </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  if (loading && !analytics) {
    return (
      <div className="page admin-dashboard">
        <div className="container">
          <div className="admin-header">
            <div>
              <div className="skel skel-line" style={{ height: '32px', width: '200px', marginBottom: '0.5rem' }}></div>
              <div className="skel skel-line skel-line--medium" style={{ height: '16px', marginBottom: '0.5rem' }}></div>
              <div className="skel skel-line skel-line--short" style={{ height: '14px', width: '300px' }}></div>
            </div>
            <div className="skeleton-card" style={{ minWidth: '480px', maxWidth: '550px', padding: 'var(--spacing-sm) var(--spacing-md)' }}>
              <div className="skel skel-line" style={{ height: '18px', width: '180px', marginBottom: 'var(--spacing-xs)' }}></div>
              <div className="skel skel-line skel-line--short" style={{ height: '14px', marginBottom: 'var(--spacing-xs)' }}></div>
              <div className="skel skel-line" style={{ height: '32px', width: '100%', marginTop: 'var(--spacing-xs)' }}></div>
            </div>
          </div>

          <div className="analytics-section">
            <div className="analytics-header">
              <div className="skel skel-line" style={{ height: '28px', width: '120px' }}></div>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                <div className="skel skel-line" style={{ height: '36px', width: '120px' }}></div>
                <div className="skel skeleton-button" style={{ width: '100px' }}></div>
              </div>
            </div>
            <div className="stats-grid">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton-stat-card">
                  <div className="skel skeleton-stat-value"></div>
                  <div className="skel skeleton-stat-label"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-section" style={{ marginTop: 'var(--spacing-2xl)' }}>
            <div className="skel skel-line" style={{ height: '28px', width: '200px', marginBottom: 'var(--spacing-lg)' }}></div>
            <div className="skeleton-card" style={{ height: '400px' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !analytics) {
    return (
      <div className="page admin-dashboard">
        <div className="container">
          <div className="error-state">
            <div className="error-state__row">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="page-subtitle">Manage bookings, view analytics, and track performance</p>
            <p className="admin-meta">
              Auto-refresh: every 15 seconds{lastUpdated ? ` • Last updated: ${lastUpdated.toLocaleTimeString()}` : ''}
            </p>
          </div>
          <div className="admin-header-controls">
            <div className="system-control-compact">
              <div className="system-control-compact__title">
                <Info size={16} />
                <span>Booking System Control</span>
              </div>
              <p className="system-control-compact__description">
                Toggle to enable/disable bookings. When OFF, the system is down and not operable.
              </p>
              <div className="system-control-compact__header">
                <div className="system-status-indicator-compact">
                  <span className={`status-dot ${system.isBookingOpen ? 'status-on' : 'status-off'}`}></span>
                  <span className="status-text-compact">{system.isBookingOpen ? 'Online' : 'Offline'}</span>
                </div>
                <label className="switch switch-compact">
                  <input
                    type="checkbox"
                    checked={!!system.isBookingOpen}
                    onChange={(e) => setSystem((p) => ({ ...p, isBookingOpen: e.target.checked }))}
                  />
                  <span className="switch__slider" />
                </label>
              </div>
              <div className="system-control-compact__message-section">
                <label className="system-control-compact__label">
                  <span className="system-control-compact__label-text">Maintenance Message</span>
                  <textarea
                    rows={3}
                    value={system.maintenanceMessage}
                    onChange={(e) => setSystem((p) => ({ ...p, maintenanceMessage: e.target.value }))}
                    placeholder="System is temporarily unavailable. Please try again later."
                    className="system-control-compact__textarea"
                  />
                </label>
              </div>
              <div className="system-control-compact__actions">
                <button 
                  className="btn btn-outline btn-xs" 
                  onClick={() => setShowMaintenancePreview(true)}
                  title="Preview maintenance message"
                >
                  <Eye size={14} />
                  Preview
                </button>
                <button 
                  className="btn btn-primary btn-xs" 
                  onClick={saveSystem} 
                  disabled={systemSaving}
                  title="Save system settings"
                >
                  {systemSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="analytics-section">
            <div className="analytics-header">
              <h2>Overview</h2>
              <div className="analytics-controls">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="date-filter-select"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="14days">Last 14 Days</option>
                  <option value="1month">Last 30 Days</option>
                </select>
                <button onClick={handlePrintPDF} className="btn btn-primary btn-sm">
                  <Printer size={18} />
                  Print / PDF
                </button>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-card stat-card-primary">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-content">
                  <h3>Total Bookings</h3>
                  <p className="stat-number">{(filteredAnalytics || analytics).overview?.totalBookings || 0}</p>
                </div>
              </div>
              <div className="stat-card stat-card-warning">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-content">
                  <h3>Pending</h3>
                  <p className="stat-number">{(filteredAnalytics || analytics).overview?.pending || 0}</p>
                </div>
              </div>
              <div className="stat-card stat-card-success">
                <div className="stat-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-content">
                  <h3>Approved</h3>
                  <p className="stat-number">{(filteredAnalytics || analytics).overview?.approved || 0}</p>
                </div>
              </div>
              <div className="stat-card stat-card-info">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <h3>Completed</h3>
                  <p className="stat-number">{(filteredAnalytics || analytics).overview?.completed || 0}</p>
                </div>
              </div>
              <div className="stat-card stat-card-revenue">
                <div className="stat-icon">
                  <DollarSign size={24} />
                </div>
                <div className="stat-content">
                  <h3>Total Revenue</h3>
                  <p className="stat-number">{formatCurrency((filteredAnalytics || analytics).revenue?.totalRevenue || 0)}</p>
                </div>
              </div>
            </div>

            {/* Insights & Graphs */}
            <div className="insights-section">
              <div className="insights-header">
                <div className="insights-title">
                  <h3>Insights & Graphs</h3>
                  <span className="insights-range">{rangeLabel}</span>
                </div>
                <div className="insights-controls">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="date-filter-select date-filter-select--compact"
                    aria-label="Insights range"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="14days">Last 14 Days</option>
                    <option value="1month">Last 30 Days</option>
                  </select>
                </div>
              </div>

              <div className="insights-grid">
                <div className="chart-card">
                  <div className="chart-card__head">
                    <div className="chart-card__title">
                      <LineChart size={16} />
                      <span>Bookings Trend</span>
                    </div>
                    <div className="chart-card__meta">
                      <span className="chart-pill">{Math.max(0, ...(insights?.series || []).map((s) => s.count))} max</span>
                    </div>
                  </div>
                  <Sparkline values={(insights?.series || []).map((s) => s.count)} max={insights?.maxCount || 1} />
                  <div className="chart-xlabels">
                    <span>{insights?.series?.[0]?.label || ''}</span>
                    <span>{insights?.series?.[(insights?.series?.length || 1) - 1]?.label || ''}</span>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-card__head">
                    <div className="chart-card__title">
                      <BarChart3 size={16} />
                      <span>Revenue Trend</span>
                    </div>
                    <div className="chart-card__meta">
                      <span className="chart-pill">{formatCurrency(insights?.maxRevenue || 0)} max</span>
                    </div>
                  </div>
                  <Bars values={(insights?.series || []).map((s) => s.revenue)} max={insights?.maxRevenue || 1} color="rgba(22, 163, 74, 0.85)" />
                  <div className="chart-xlabels">
                    <span>{insights?.series?.[0]?.label || ''}</span>
                    <span>{insights?.series?.[(insights?.series?.length || 1) - 1]?.label || ''}</span>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-card__head">
                    <div className="chart-card__title">
                      <PieChart size={16} />
                      <span>Status Breakdown</span>
                    </div>
                    <div className="chart-card__meta">
                      <span className="chart-pill">{(filteredAnalytics || analytics).overview?.totalBookings || 0} total</span>
                    </div>
                  </div>

                  <div className="status-stack" aria-label="Status breakdown">
                    {['pending', 'approved', 'completed', 'cancelled'].map((st) => {
                      const v = insights?.statusCounts?.[st] || 0
                      const pct = Math.round((v / (insights?.statusTotal || 1)) * 100)
                      return (
                        <div
                          key={st}
                          className={`status-stack__seg status-stack__seg--${st}`}
                          style={{ width: `${Math.max(0, pct)}%` }}
                          title={`${st}: ${v} (${pct}%)`}
                        />
                      )
                    })}
                  </div>

                  <div className="status-legend">
                    {[
                      { key: 'pending', label: 'Pending' },
                      { key: 'approved', label: 'Approved' },
                      { key: 'completed', label: 'Completed' },
                      { key: 'cancelled', label: 'Cancelled' },
                    ].map((it) => (
                      <div key={it.key} className="status-legend__item">
                        <span className={`status-legend__swatch status-legend__swatch--${it.key}`} />
                        <span className="status-legend__label">{it.label}</span>
                        <span className="status-legend__value">{insights?.statusCounts?.[it.key] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-card__head">
                    <div className="chart-card__title">
                      <BarChart3 size={16} />
                      <span>Top Packages (by bookings)</span>
                    </div>
                    <div className="chart-card__meta">
                      <span className="chart-pill">Top 5</span>
                    </div>
                  </div>

                  <div className="hbars">
                    {(insights?.topServices || []).length === 0 ? (
                      <div className="chart-empty">No data yet</div>
                    ) : (
                      (insights?.topServices || []).map((s) => (
                        <div key={s.name} className="hbars__row">
                          <div className="hbars__label" title={s.name}>{s.name}</div>
                          <div className="hbars__track">
                            <div
                              className="hbars__fill"
                              style={{ width: `${Math.round((s.count / (insights?.maxService || 1)) * 100)}%` }}
                            />
                          </div>
                          <div className="hbars__value">{s.count}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Bookings Management */}
        <div className="bookings-section">
          <div className="section-header-row">
            <h2>Bookings Management</h2>
            <div className="bookings-controls">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="date-filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="14days">Last 14 Days</option>
                <option value="1month">Last 30 Days</option>
              </select>
              <button onClick={handlePrintPDF} className="btn btn-primary btn-sm">
                <Printer size={18} />
                Print / PDF
              </button>
              <button onClick={fetchData} className="btn btn-outline btn-sm">
                Refresh
              </button>
            </div>
          </div>

          <div className="schedule-strip">
            <div className="schedule-strip__header">
              <h3>Upcoming Schedule</h3>
              <p>Pending and approved bookings (quick view)</p>
            </div>
            <div className="schedule-strip__items">
              {upcomingSchedule.length === 0 ? (
                <div className="schedule-strip__empty">No upcoming bookings yet.</div>
              ) : (
                upcomingSchedule.map((b) => (
                  <button key={b._id} type="button" className="schedule-chip" onClick={() => openManage(b)}>
                    <span className="schedule-chip__time">{formatDateTime(b.startAt)}</span>
                    <span className="schedule-chip__main">
                      {b.service?.name || 'Service'} • {b.user?.name || b.user?.email || 'Guest'}
                    </span>
                    <span className={`status-badge ${getStatusColor(b.status)}`}>{b.status}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <div className="filter-group">
              <Filter size={18} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="search-group">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by customer, service, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Bookings Table */}
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <p>No bookings found.</p>
            </div>
          ) : (
            <div className="bookings-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Event Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Pax</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="booking-id">#{booking._id?.slice(-6) || 'N/A'}</td>
                      <td>
                        <div className="customer-info">
                          <strong>{booking.user?.name || 'N/A'}</strong>
                          <span className="customer-email">{booking.user?.email || ''}</span>
                        </div>
                      </td>
                      <td>{booking.service?.name || 'N/A'}</td>
                      <td>{booking.eventType || 'N/A'}</td>
                      <td>{formatDateTime(booking.startAt)}</td>
                      <td>{formatDateTime(booking.endAt)}</td>
                      <td>{booking.paxCount || 0}</td>
                      <td className="amount-cell">{formatCurrency(booking.pricing?.total || 0)}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(booking.status)}`}>
                          {booking.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          {booking.status?.toLowerCase() === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(booking._id, 'Approved')}
                                className="btn btn-success btn-xs"
                                disabled={actionLoading === booking._id}
                              >
                                {actionLoading === booking._id ? '...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleStatusChange(booking._id, 'Cancelled')}
                                className="btn btn-danger btn-xs"
                                disabled={actionLoading === booking._id}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status?.toLowerCase() === 'approved' && (
                            <button
                              onClick={() => handleStatusChange(booking._id, 'Completed')}
                              className="btn btn-primary btn-xs"
                              disabled={actionLoading === booking._id}
                            >
                              {actionLoading === booking._id ? '...' : 'Complete'}
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => openManage(booking)}
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Maintenance Message Preview Modal */}
        {showMaintenancePreview && (
          <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setShowMaintenancePreview(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Maintenance Message Preview</h3>
                <button type="button" className="modal-close" onClick={() => setShowMaintenancePreview(false)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <div className="modal-body">
                <div className="maintenance-preview">
                  <p className="maintenance-preview__label">This is what users will see when the system is offline:</p>
                  <div className="maintenance-preview__message">
                    {system.maintenanceMessage.trim() || 'System is temporarily unavailable. Please try again later.'}
                  </div>
                  <p className="maintenance-preview__note">
                    <Info size={16} />
                    <span>
                      {system.maintenanceMessage.trim() 
                        ? 'This is your custom message. You can edit it in the System Control card above.'
                        : 'This is the default message. Add a custom message in the System Control card above to replace it.'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowMaintenancePreview(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {manageBooking && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
              <div className="modal-header">
                <h3>Manage booking #{manageBooking._id?.slice(-6)}</h3>
                <button type="button" className="modal-close" onClick={closeManage} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-grid">
                  <div>
                    <p className="modal-label">Customer</p>
                    <p className="modal-value">{manageBooking.user?.name || manageBooking.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="modal-label">Service</p>
                    <p className="modal-value">{manageBooking.service?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="modal-label">Status</p>
                    <p className="modal-value">
                      <span className={`status-badge ${getStatusColor(manageBooking.status)}`}>
                        {manageBooking.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="modal-label">Amount</p>
                    <p className="modal-value">{formatCurrency(manageBooking.pricing?.total || 0)}</p>
                  </div>
                </div>

                <div className="modal-section">
                  <h4>Reschedule</h4>
                  <div className="modal-form-row">
                    <label>
                      Start
                      <input
                        type="datetime-local"
                        value={rescheduleStart}
                        onChange={(e) => setRescheduleStart(e.target.value)}
                        disabled={actionLoading === manageBooking._id}
                      />
                    </label>
                    <label>
                      End
                      <input
                        type="datetime-local"
                        value={rescheduleEnd}
                        onChange={(e) => setRescheduleEnd(e.target.value)}
                        disabled={actionLoading === manageBooking._id}
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleReschedule}
                    disabled={actionLoading === manageBooking._id}
                  >
                    {actionLoading === manageBooking._id ? '...' : 'Save reschedule'}
                  </button>
                </div>

                <div className="modal-section">
                  <h4>Cancel booking</h4>
                  <input
                    type="text"
                    placeholder="Reason (optional)"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    disabled={actionLoading === manageBooking._id}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleCancelWithReason}
                    disabled={actionLoading === manageBooking._id}
                  >
                    {actionLoading === manageBooking._id ? '...' : 'Cancel booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboardPage
