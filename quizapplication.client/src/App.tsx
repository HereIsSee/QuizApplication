import NavigationBar from './components/NavigationBar';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import { useState } from 'react';

function App() {
    const [currentView, setCurrentView] = useState<string>('Leaderboard'); // Default to showing Leaderboard

    return (
        <>

            <NavigationBar setCurrentView={setCurrentView} />
            <div className="container">
                {currentView === 'Quiz' && <Quiz />}
                {currentView === 'Leaderboard' && <Leaderboard />}
            </div>
        </>
    );
}

export default App;
