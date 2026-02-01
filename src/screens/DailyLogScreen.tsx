import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ScreenWrapper, Typo, Card, Button } from '../components/ui';
import { theme } from '../theme';
import { getDB } from '../db';
import { DailyLog } from '../db/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Trash2, Plus } from 'lucide-react-native';

export default function DailyLogScreen() {
    const navigation = useNavigation<any>();
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

    const loadLogs = useCallback(() => {
        let isMounted = true;
        const fetch = async () => {
            const today = new Date().toISOString().split('T')[0];
            const db = await getDB();
            const [res] = await db.executeSql('SELECT * FROM daily_logs WHERE date = ? ORDER BY timestamp DESC', [today]);

            const items: DailyLog[] = [];
            let c = 0, p = 0, cb = 0, f = 0;

            for (let i = 0; i < res.rows.length; i++) {
                const item = res.rows.item(i) as DailyLog;
                items.push(item);
                c += item.calories;
                p += item.protein;
                cb += item.carbs;
                f += item.fat;
            }

            if (isMounted) {
                setLogs(items);
                setTotals({ calories: c, protein: p, carbs: cb, fat: f });
            }
        };
        fetch();
        return () => { isMounted = false; };
    }, []);

    useFocusEffect(loadLogs);

    const deleteLog = (id: number) => {
        Alert.alert('Delete', 'Remove this entry?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const db = await getDB();
                    await db.executeSql('DELETE FROM daily_logs WHERE id = ?', [id]);
                    loadLogs();
                }
            }
        ]);
    };

    return (
        <ScreenWrapper>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Typo.Header>Today's Diary</Typo.Header>
                <TouchableOpacity onPress={() => navigation.navigate('AddFood')}>
                    <View style={{ backgroundColor: theme.colors.primary, padding: 8, borderRadius: 50 }}>
                        <Plus color="white" size={24} />
                    </View>
                </TouchableOpacity>
            </View>

            <Card style={{ paddingVertical: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Typo.Title>{Math.round(totals.calories)}</Typo.Title>
                        <Typo.Body>kcal</Typo.Body>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Typo.Title style={{ color: theme.colors.accent }}>{Math.round(totals.protein)}</Typo.Title>
                        <Typo.Body>Prot</Typo.Body>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Typo.Title style={{ color: theme.colors.primary }}>{Math.round(totals.carbs)}</Typo.Title>
                        <Typo.Body>Carb</Typo.Body>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Typo.Title style={{ color: theme.colors.secondary }}>{Math.round(totals.fat)}</Typo.Title>
                        <Typo.Body>Fat</Typo.Body>
                    </View>
                </View>
            </Card>

            <FlatList
                data={logs}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        <Typo.Body>No food tracked today.</Typo.Body>
                        <Button title="Add Food" onPress={() => navigation.navigate('AddFood')} variant="secondary" />
                    </View>
                }
                renderItem={({ item }) => (
                    <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Typo.Title style={{ fontSize: 16 }}>{item.name}</Typo.Title>
                            <Typo.Body style={{ fontSize: 12 }}>
                                {Math.round(item.calories)} kcal • P: {item.protein} C: {item.carbs} F: {item.fat}
                            </Typo.Body>
                        </View>
                        <TouchableOpacity onPress={() => deleteLog(item.id)}>
                            <Trash2 color={theme.colors.secondary} size={20} />
                        </TouchableOpacity>
                    </Card>
                )}
            />
        </ScreenWrapper>
    );
}
