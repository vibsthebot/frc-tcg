import {View, Text, TouchableOpacity} from 'react-native';
import './../../global.css';
import { db } from './../../firebaseConfig';
import { doc, setDoc} from 'firebase/firestore';
import { useGlobal } from './../../GlobalContext';

export default function HomeScreen() {
    const { user, setUser } = useGlobal();
    
    const addUserToFirestore = async () => {
        try {
            await setDoc(doc(db, "users", "user_001"), {
                name: "Alice",
                email: "alice@example.com",
                age: 25
            });
            console.log("User added successfully!");
        } catch (error) {
            console.error("Error adding user: ", error);
        }
    };

    return (
        <View className="flex-1 justify-center items-center">
            {user && <Text className="text-2xl font-bold">Welcome, {user.displayName} </Text>}
            <TouchableOpacity
                className="bg-blue-500 rounded-lg py-3 px-6 mt-4"
                onPress={addUserToFirestore}
            >
                <Text className="text-white text-center font-semibold text-base">
                    Add User to Firestore
                </Text>
            </TouchableOpacity>
        </View>
    );
}
