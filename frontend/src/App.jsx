import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ChatWidget from './components/ChatWidget'
import ScrollToTop from './components/ScrollToTop'
import MaintenanceGuard from './components/MaintenanceGuard'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MaintenanceGuard />
      <AppRoutes />
      <ChatWidget />
    </BrowserRouter>
  )
}

export default App
