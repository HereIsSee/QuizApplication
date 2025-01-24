import '../../Content/bootstrap.css'

function NavigationBar() {
    return (
        <nav className="navbar navbar-expand navbar-light bg-light">
            <a className="navbar-brand" href="#">QuizGame</a>
            <ul className="navbar-nav">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Leaderboard</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Quiz</a>
                </li>
            </ul>
        </nav>

    )
}

export default NavigationBar