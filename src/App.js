import './App.css';
import {Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import Login from './auth/login/Login';
import Admin from './pages/admin';
import KnowledgeBaseList from "./pages/admin/feature/knowledgeBase/KnowledgeBaseList";
import KnowledgeBaseDetail from "./pages/admin/feature/knowledgeBase/KnowledgeBaseDetail";
import KnowledgeBaseEdit from "./pages/admin/feature/knowledgeBase/KnowledgeBaseEdit";
import KnowledgeBaseAdd from "./pages/admin/feature/knowledgeBase/KnowledgeBaseAdd";
import TicketDetail from "./pages/admin/feature/ticket/TicketDetail";
import ArchiveAdmin from './pages/admin/feature/ticket/ArchiveAdmin';
import WaitList from "./pages/admin/feature/WaitList";
import CustomStatistic from "./pages/admin/feature/dashboard/CustomStatistic";
import RequireAuth from "./auth/component/RequireAuth";
import {ROLE_ADMIN, ROLE_AGENT, ROLE_SUPER_ADMIN} from "./global/roles";
import Unauthorized from "./auth/unauthorized/Unauthorized";
import Account from "./pages/admin/feature/account/Account";
import ManageRoute from "./auth/component/ManageRoute";

const qc = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={qc}>
            <Routes>
                <Route>
                    <Route path='/login' element={<Login/>}/>
                </Route>
                <Route element={<RequireAuth allowedRoles={[ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_AGENT]}/>}>
                    <Route path="/:route" element={<Admin/>}>
                        <Route path="general">
                            <Route path="tickets">
                                <Route index element={<WaitList/>}/>
                                <Route path=":ticketId" element={<TicketDetail/>}/>
                            </Route>
                            <Route path="archives" element={<ArchiveAdmin/>}/>
                        </Route>
                        <Route path="info">
                            <Route path='knowledge_base'>
                                <Route index element={<KnowledgeBaseList/>}/>
                                <Route element={<RequireAuth allowedRoles={[ROLE_SUPER_ADMIN, ROLE_ADMIN]}/>}>
                                    <Route path="create/:knowledgeBaseId" element={<KnowledgeBaseAdd/>}/>
                                    <Route path="edit/:articleId" element={<KnowledgeBaseEdit/>}/>
                                </Route>
                                <Route path="detail/:articleId" element={<KnowledgeBaseDetail/>}/>
                            </Route>
                        </Route>
                        <Route path="dashboard" element={<RequireAuth allowedRoles={[ROLE_SUPER_ADMIN, ROLE_ADMIN]}/>}>
                            <Route path="stats" element={<CustomStatistic/>}></Route>
                        </Route>
                        <Route path="settings">
                            <Route path="account" element={<Account/>}></Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="*" element={<ManageRoute/>}/>
                <Route path="/unauthorized" element={<Unauthorized/>}/>
            </Routes>
        </QueryClientProvider>
    );
}

export default App;
