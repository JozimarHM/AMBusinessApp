import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PropsI {
    type: 'success' | 'danger' | 'info' | 'warning';
    text: string;
    onPress: () => void;
}

interface ButtonType {
    backgroundColor: string;
}

const BUTTON_TYPE: Record<PropsI['type'], ButtonType> = {
    success: {
        backgroundColor: '#2ecc71',
    },
    danger: {
        backgroundColor: '#e74c3c',
    },
    info: {
        backgroundColor: '#3498db',
    },
    warning: {
        backgroundColor: '#f39c12',
    },
};

const ButtonToast: React.FC<PropsI> = ({ type, text, onPress }) => {
    const backgroundColor = BUTTON_TYPE[type].backgroundColor;

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 250,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '400',
        color: '#FFF',
    },
});

export default ButtonToast;
