import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image, Modal, ScrollView } from 'react-native';
import { ScreenWrapper, Typo, Card, Button } from '../components/ui';
import { theme } from '../theme';
import { getDB } from '../db';
import { Product } from '../db/types';
import { useNavigation } from '@react-navigation/native';
import { FoodService } from '../services/food';
import { Search, Cloud, Database, Plus, X } from 'lucide-react-native';

export default function FoodSearchScreen() {
    const navigation = useNavigation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'local' | 'online'>('local');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            search();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, mode]);

    const search = async () => {
        setLoading(true);
        try {
            if (mode === 'local') {
                const db = await getDB();
                const [res] = await db.executeSql(
                    `SELECT * FROM products WHERE name LIKE ? OR brand LIKE ? LIMIT 50`,
                    [`%${query}%`, `%${query}%`]
                );
                const list: Product[] = [];
                for (let i = 0; i < res.rows.length; i++) list.push(res.rows.item(i));
                setResults(list);
            } else {
                const apiResults = await FoodService.searchRemote(query);
                setResults(apiResults);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const addToLog = async (item: Product) => {
        const today = new Date().toISOString().split('T')[0];
        try {
            const db = await getDB();

            // If remote item, save to local products first (optional but good for history)
            // For now, straight to log

            await db.executeSql(
                `INSERT INTO daily_logs (date, product_id, name, calories, protein, carbs, fat, amount_g, timestamp)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [today, item.id, item.name, item.calories, item.protein, item.carbs, item.fat, 100, Date.now()]
            );
            Alert.alert('Success', `Added ${item.name} to your log.`);
            setSelectedProduct(null); // Close modal
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Failed to save log.');
        }
    };

    return (
        <ScreenWrapper>
            {/* Header / Tabs */}
            <View style={{ marginBottom: 20 }}>
                <Typo.Header style={{ marginBottom: 15 }}>Find Food</Typo.Header>
                <View style={{ flexDirection: 'row', backgroundColor: theme.colors.card, borderRadius: 100, padding: 4 }}>
                    <TouchableOpacity
                        onPress={() => setMode('local')}
                        style={{
                            flex: 1,
                            padding: 10,
                            borderRadius: 100,
                            backgroundColor: mode === 'local' ? theme.colors.primary : 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        <Database size={16} color={mode === 'local' ? 'white' : theme.colors.textSecondary} />
                        <Typo.Title style={{ fontSize: 14, color: mode === 'local' ? 'white' : theme.colors.textSecondary }}>My Foods</Typo.Title>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setMode('online')}
                        style={{
                            flex: 1,
                            padding: 10,
                            borderRadius: 100,
                            backgroundColor: mode === 'online' ? theme.colors.primary : 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        <Cloud size={16} color={mode === 'online' ? 'white' : theme.colors.textSecondary} />
                        <Typo.Title style={{ fontSize: 14, color: mode === 'online' ? 'white' : theme.colors.textSecondary }}>Online Search</Typo.Title>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: theme.colors.card, borderRadius: theme.borderRadius.m, paddingHorizontal: 15 }}>
                <Search color={theme.colors.textSecondary} size={20} />
                <TextInput
                    style={{ flex: 1, color: theme.colors.text, padding: 15, fontSize: 16 }}
                    placeholder={mode === 'local' ? "Search your history..." : "Search global database..."}
                    placeholderTextColor={theme.colors.textSecondary}
                    value={query}
                    onChangeText={setQuery}
                    autoFocus
                />
                {loading && <ActivityIndicator color={theme.colors.primary} />}
            </View>

            {/* Results */}
            <FlatList
                data={results}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                contentContainerStyle={{ paddingBottom: 50 }}
                ListEmptyComponent={
                    !loading && query.length > 2 ? (
                        <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.5 }}>
                            <Typo.Body>No results found.</Typo.Body>
                            {mode === 'local' && (
                                <TouchableOpacity onPress={() => setMode('online')} style={{ marginTop: 10 }}>
                                    <Typo.Title style={{ color: theme.colors.primary }}>Try Online Search</Typo.Title>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : null
                }
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedProduct(item)}>
                        <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, marginBottom: 10 }}>
                            {/* Product Image or Placeholder */}
                            <View style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: theme.colors.background, marginRight: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {item.image_url ? (
                                    <Image source={{ uri: item.image_url }} style={{ width: 50, height: 50 }} resizeMode="cover" />
                                ) : (
                                    <Typo.Title style={{ fontSize: 20 }}>🥗</Typo.Title>
                                )}
                            </View>

                            <View style={{ flex: 1, paddingRight: 10 }}>
                                <Typo.Title style={{ fontSize: 16 }} numberOfLines={1}>{item.name}</Typo.Title>
                                <Typo.Body style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                                    {item.brand ? <Typo.Body style={{ color: theme.colors.primary }}>{item.brand}</Typo.Body> : null}
                                    {item.brand ? ' • ' : ''}{item.serving_size}
                                </Typo.Body>
                            </View>

                            <View style={{ alignItems: 'flex-end' }}>
                                <Typo.Title style={{ color: theme.colors.primary, fontSize: 16 }}>{Math.round(item.calories)}</Typo.Title>
                                <Typo.Body style={{ fontSize: 12 }}>kcal</Typo.Body>
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
            />

            {/* Product Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!selectedProduct}
                onRequestClose={() => setSelectedProduct(null)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: theme.colors.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, height: '80%' }}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                            {/* Close Button */}
                            <TouchableOpacity onPress={() => setSelectedProduct(null)} style={{ alignSelf: 'flex-end', padding: 8 }}>
                                <X color={theme.colors.textSecondary} size={24} />
                            </TouchableOpacity>

                            {/* Image Header */}
                            <View style={{ alignItems: 'center', marginBottom: 24 }}>
                                <View style={{ width: 120, height: 120, borderRadius: 24, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' }}>
                                    {selectedProduct?.image_url ? (
                                        <Image source={{ uri: selectedProduct.image_url }} style={{ width: 120, height: 120 }} resizeMode="cover" />
                                    ) : (
                                        <Typo.Header style={{ fontSize: 48 }}>🥗</Typo.Header>
                                    )}
                                </View>
                                <Typo.Header style={{ textAlign: 'center' }}>{selectedProduct?.name}</Typo.Header>
                                <Typo.Body style={{ fontSize: 16, marginTop: 4, color: theme.colors.primary }}>{selectedProduct?.brand}</Typo.Body>
                            </View>

                            {/* Macro Rings / Stats */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 24 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Typo.Header style={{ color: theme.colors.secondary }}>{selectedProduct ? Math.round(selectedProduct.protein) : 0}g</Typo.Header>
                                    <Typo.Body>Protein</Typo.Body>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Typo.Header style={{ color: theme.colors.accent }}>{selectedProduct ? Math.round(selectedProduct.carbs) : 0}g</Typo.Header>
                                    <Typo.Body>Carbs</Typo.Body>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Typo.Header style={{ color: theme.colors.danger }}>{selectedProduct ? Math.round(selectedProduct.fat) : 0}g</Typo.Header>
                                    <Typo.Body>Fat</Typo.Body>
                                </View>
                            </View>

                            <View style={{ alignItems: 'center', marginBottom: 32 }}>
                                <Typo.Header style={{ fontSize: 48 }}>{selectedProduct ? Math.round(selectedProduct.calories) : 0}</Typo.Header>
                                <Typo.Body style={{ fontSize: 18 }}>Calories per {selectedProduct?.serving_size || '100g'}</Typo.Body>
                            </View>

                            <Button title="Add to Diary" onPress={() => selectedProduct && addToLog(selectedProduct)} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScreenWrapper>
    );
}
