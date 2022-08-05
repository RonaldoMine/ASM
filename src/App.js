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
import Suggestion from './pages/admin/feature/suggestion/Suggestion';
import Missing from './components/missing/Missing';
const qc = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={qc}>
      <Routes>

        <Route path='/login' element={<Login />} />

        <Route path="/admin" element={<Admin />}>
          <Route index element={<WaitList />} />
          <Route path="/admin/archives" element={<ArchiveAdmin />} />
          <Route path="ticket/:ticketId" element={<TicketDetail />} />
          <Route path="info">
            <Route path='knowledge_base' >
              <Route index element={<KnowledgeBaseList />} />
              <Route path="create" element={<KnowledgeBaseAdd />} />
              <Route path="detail/:articleId" element={<KnowledgeBaseDetail />} />
              <Route path="edit/:articleId" element={<KnowledgeBaseEdit />} />
            </Route>
            <Route path="suggestions" element={<Suggestion />} />
          </Route>

        </Route>
        <Route path="/agent" element={<Agent />}>
          <Route index element={<AgentTickets />} />
        </Route>
        <Route path="*" element={<Missing />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
