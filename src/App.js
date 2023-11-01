import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from './components/LoginPage';
import OtpPage from './components/OtpPage';
import SideBar from './components/SideBar';
import SongSection from './components/SongSection';
import DataState from './context/DataState';

function App() {
  return (
    <DataState>
      <BrowserRouter>
        <div className='h-screen'>

          <Routes>
            <Route path="/"
              element={<><LoginPage /></>} />
            <Route path="/otp"
              element={<><OtpPage /></>} />
            <Route path="/home"
              element={<div className='flex flex-row h-full'>
                <SideBar />
                <SongSection />
              </div>} />

          </Routes>

        </div>
      </BrowserRouter>
    </DataState>
  );
}

export default App;
