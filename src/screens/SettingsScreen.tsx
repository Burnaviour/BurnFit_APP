import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { ScreenWrapper, Typo, Card, Button } from '../components/ui';
import { theme } from '../theme';
import { getDB } from '../db';

export default function SettingsScreen() {
    const [goal, setGoal] = useState('2000');
    const [weight, setWeight] = useState('75');

    useEffect(() => {
        const fetch = async () => {
            const db = await getDB();
            const [res] = await db.executeSql('SELECT * FROM user_profile WHERE id = 1');
            if (res.rows.length > 0) {
                const user = res.rows.item(0);
                setGoal(user.goal_calories.toString());
                setWeight(user.weight_kg.toString());
            }
        };
        fetch();
    }, []);

    const save = async () => {
        try {
            const db = await getDB();
            await db.executeSql(
                'UPDATE user_profile SET goal_calories = ?, weight_kg = ? WHERE id = 1',
                [parseInt(goal), parseFloat(weight)]
            );
            Alert.alert('Saved', 'Your profile has been updated.');
        } catch (e) {
            Alert.alert('Error', 'Could not save settings');
        }
    };

    return (
        <ScreenWrapper>
            <Typo.Header style={{ marginBottom: 20 }}>Settings</Typo.Header>

            <Card>
                <Typo.Title style={{ marginBottom: 10 }}>Daily Goals</Typo.Title>
                <View style={{ marginBottom: 15 }}>
                    <Typo.Body>Calorie Goal</Typo.Body>
                    <TextInput
                        style={{
                            backgroundColor: theme.colors.background,
                            color: 'white',
                            padding: 10,
                            borderRadius: 8,
                            marginTop: 5
                        }}
                        keyboardType="numeric"
                        value={goal}
                        onChangeText={setGoal}
                    />
                </View>
                <View style={{ marginBottom: 15 }}>
                    <Typo.Body>Weight (kg)</Typo.Body>
                    <TextInput
                        style={{
                            backgroundColor: theme.colors.background,
                            color: 'white',
                            padding: 10,
                            borderRadius: 8,
                            marginTop: 5
                        }}
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={setWeight}
                    />
                </View>

                <Button title="Save Profile" onPress={save} />
            </Card>

            <Card>
                <Typo.Title style={{ marginBottom: 10 }}>About</Typo.Title>
                <Typo.Body>
                    Local Fitness App v1.0{'\n'}
                    Database: SQLite{'\n'}
                    Sync: Health Connect
                </Typo.Body>
            </Card>
        </ScreenWrapper>
    );
}
