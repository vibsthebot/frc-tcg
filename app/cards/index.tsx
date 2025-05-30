import TeamCard from 'components/Card';
import './../../global.css';
import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { TBA_API_KEY } from '@env';

export default function App() {
    const [teamNumber, setTeamNumber] = useState<string>('');
    const [validTeams, setValidTeams] = useState<string[]>([]);

    useEffect(() => {
        const fetchValidTeams = async () => {
            try {
                const response = await fetch('https://www.thebluealliance.com/api/v3/teams/2025/1/simple', {
                    headers: {
                        'X-TBA-Auth-Key': TBA_API_KEY || ''
                    }
                });
                const teams = await response.json();
                const teamNumbers = teams.map((team: any) => team.team_number.toString());
                setValidTeams(teamNumbers);
            } catch (error) {
                console.error('Failed to fetch team numbers:', error);
            }
        };
        fetchValidTeams();
    }, []);

    const generateRandomTeamNumber = () => {
        if (validTeams.length > 0) {
            const randomIndex = Math.floor(Math.random() * validTeams.length);
            setTeamNumber(validTeams[randomIndex]);
            //console.log(`Random Team Number: ${validTeams[randomIndex]}`);
        }
    };

    return (
        <TouchableOpacity onPress={generateRandomTeamNumber} className='flex-1 items-center justify-center bg-gray-100'>
            <TeamCard teamNumber={teamNumber} />
        </TouchableOpacity>
    );
}
