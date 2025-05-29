import TeamCard from 'components/Card';
import './global.css';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
export default function App() {
    const [teamNumber, setTeamNumber] = useState<string>('1');

    const generateRandomTeamNumber = () => {
        const randomNumber = Math.floor(Math.random() * 10200) + 1;
        setTeamNumber(randomNumber.toString());
    }

    return (
        <TouchableOpacity onPress={generateRandomTeamNumber} className='flex-1 items-center justify-center bg-gray-100'>
            <TeamCard teamNumber={teamNumber} />
        </TouchableOpacity>
    );
}
