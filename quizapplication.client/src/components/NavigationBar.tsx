import '../../Content/bootstrap.css';

interface NavigationBarProps {
    setCurrentView: (view: string) => void;
}

function NavigationBar({ setCurrentView }: NavigationBarProps) {
    return (
        <nav className="navbar navbar-expand navbar-light bg-light mb-3 ps-3">
            <a className="navbar-brand" href="" onClick={() => setCurrentView('Quiz')}>QuizGame</a>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={() => setCurrentView('Leaderboard')}>
                        Leaderboard
                    </button>
                </li>
                <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={() => setCurrentView('Quiz')}>
                        Quiz
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default NavigationBar;
