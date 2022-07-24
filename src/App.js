import './App.css';
import {Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import Admin from './pages/admin';
import Login from './auth/login/Login';
import KnowledgeBaseList from "./pages/admin/feature/KnowledgeBase/KnowledgeBaseList";
import WaitList from "./pages/admin/feature/WaitList";
import KnowledgeBaseDetail from "./pages/admin/feature/KnowledgeBase/KnowledgeBaseDetail";
import KnowledgeBaseEdit from "./pages/admin/feature/KnowledgeBase/KnowledgeBaseEdit";
import KnowledgeBaseAdd from "./pages/admin/feature/KnowledgeBase/KnowledgeBaseAdd";
import TicketDetail from "./pages/admin/feature/Ticket/TicketDetail";

const qc = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={qc}>
            <Routes>
                <Route>
                    <Route path='/login' element={<Login/>}>

                    </Route>
                </Route>
                <Route path="/admin" element={<Admin/>}>
                    <Route index element={<WaitList/>} />
                    <Route path="ticket/:id" element={<TicketDetail/>}/>
                    <Route path="info/knowledge_base">
                        <Route index element={<KnowledgeBaseList/>}/>
                        <Route path="create" element={<KnowledgeBaseAdd/>}/>
                        <Route path="detail/:id" element={<KnowledgeBaseDetail/>}/>
                        <Route path="edit/:id" element={<KnowledgeBaseEdit/>}/>
                    </Route>
                </Route>
            </Routes>
        </QueryClientProvider>
    );
}

export default App;
