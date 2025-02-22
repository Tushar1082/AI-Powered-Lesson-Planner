import './App.css'
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import Login from './module components/login/login';
import PreviewsPlan from './module components/Homepage/previewsPlan/previewsPlan';
import Homepage from './module components/Homepage/homepage';

function App() {
  return(
    <div id='appMain'>
      <Router>
          <Routes>
            <Route path='/' element={<Homepage/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/previewsLessonPlans' element={<PreviewsPlan/>} />
          </Routes>
      </Router>
    </div>    
  )
}

export default App
