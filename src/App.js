import './App.css';
import { Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import Admin from './pages/admin';
import WaitList from './pages/admin/feature/WaitList';
import Login from './auth/login/Login';

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
        <Route index element={<WaitList/>}/>
      </Route>
    </Routes>
    </QueryClientProvider>
  );
}

export default App;
