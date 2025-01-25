import { useEffect, useState } from 'react';

interface Player {
    id: number,
    email: string,
    score: number,
    time: Date
}

function Leaderboard() {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        getTopPlayers();
    }, []);

    return (
        <>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Email</th>
                        <th scope="col">Score</th>
                        <th scope="col">Date time</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {players.map((player, index) =>
                        <tr>
                            <th scope="row">{index}</th>
                            <td>{player.email}</td>
                            <td>{player.score}</td>
                            <td>{player.time.toLocaleString()}</td>
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