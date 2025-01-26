import { useEffect, useState } from 'react';
import { Player } from '../interfaces/Player';


function Leaderboard() {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        getTopPlayers();
    }, []);

    const positionColor = (position : number) => {
        return position === 1 ? "table-warning" : position === 2 ? "table-secondary" : position === 3 ? "table-info" : "";
    }

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Email</th>
                        <th scope="col">Score</th>
                        <th scope="col">Date time</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {players.map((player, index) =>
                        <tr key={player.email} className={positionColor(index+ 1)}>
                            <th className={positionColor(index + 1)} scope="row" >{index+1}</th>
                            <td>{player.email}</td>
                            <td>{player.score}</td>
                            <td>{new Date(player.time).toLocaleString('en-GB')}</td>
                        </tr>
                    )}
                    
                </tbody>
            </table>
        </>
    );

    async function getTopPlayers() {
        try {
            const response = await fetch('leaderboard');

            console.log('Response:', response);

            if (response.ok) {
                const data = await response.json();
                setPlayers(data);
            } else {
                console.error('Error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }
}

export default Leaderboard;