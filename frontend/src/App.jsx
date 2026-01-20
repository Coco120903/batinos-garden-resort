import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ChatWidget from './components/ChatWidget'
import ScrollToTop from './components/ScrollToTop'
import MaintenanceGuard from './components/MaintenanceGuard'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <MaintenanceGuard />
        <AppRoutes />
        <ChatWidget />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
