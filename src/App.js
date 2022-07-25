import './App.css';
import { Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import Login from './auth/login/Login';
import Admin from './pages/admin';
import Agent from './pages/agent';
import WaitList from './pages/admin/feature/WaitList';
import AgentTickets from './pages/agent/feature/AgentTickets';
import KnowledgeBaseList from "./pages/admin/feature/KnowledgeBase/KnowledgeBaseList";
import KnowledgeBaseDetail from "./pages/admin/feature/KnowledgeBase/KnowledgeBaseDetail";
import KnowledgeBaseEdit from "./pages/admin/feature/KnowledgeBase/KnowledgeBaseEdit";
import KnowledgeBaseAdd from "./pages/admin/feature/KnowledgeBase/KnowledgeBaseAdd";
import TicketDetail from "./pages/admin/feature/Ticket/TicketDetail";
import ArchiveAdmin from './pages/admin/feature/Ticket/ArchiveAdmin';
const qc = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={qc}>
      <Routes>
        <Route>
          <Route path='/login' element={<Login />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route index element={<WaitList />} />
          <Route path="/admin/archives" element={<ArchiveAdmin />} />
          <Route path="ticket/:ticketId" element={<TicketDetail />} />
          <Route path="info/knowledge_base">
            <Route index element={<KnowledgeBaseList />} />
            <Route path="create" element={<KnowledgeBaseAdd />} />
            <Route path="detail/:id" element={<KnowledgeBaseDetail />} />
            <Route path="edit/:id" element={<KnowledgeBaseEdit />} />
          </Route>
        </Route>
        <Route path="/agent" element={<Agent />}>
          <Route index element={<AgentTickets />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
