import './App.css';
import { StudyPlanApp } from './StudyPlanApp/StudyPlanApp'
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <StudyPlanApp></StudyPlanApp>
    </Router>
  )
}

export default App;
