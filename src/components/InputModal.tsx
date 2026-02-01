import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme';
import { Typo } from './ui';
import { X } from 'lucide-react-native';

interface InputModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (value: number) => void;
    title: string;
    unit: string;
    placeholder?: string;
}

export function InputModal({ visible, onClose, onSubmit, title, unit, placeholder }: InputModalProps) {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            onSubmit(numValue);
            setValue('');
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Typo.Title>{title}</Typo.Title>
                        <TouchableOpacity onPress={onClose}>
                            <X color={theme.colors.textSecondary} size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={value}
                            onChangeText={setValue}
                            placeholder={placeholder || "0"}
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="numeric"
                            autoFocus
                        />
                        <Typo.Body style={styles.unit}>{unit}</Typo.Body>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Typo.Title style={{ color: 'white', fontSize: 16 }}>Save</Typo.Title>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20
    },
    container: {
        backgroundColor: theme.colors.card,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        marginBottom: 32
    },
    input: {
        fontSize: 48,
        color: theme.colors.text,
        fontFamily: 'Inter_700Bold',
        textAlign: 'center',
        minWidth: 100
    },
    unit: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        marginLeft: 8
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: 'center'
    }
});
