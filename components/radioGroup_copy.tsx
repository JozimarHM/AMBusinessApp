import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RadioButtonProps {
    selected: boolean;
    onPress: () => void;
    children: React.ReactNode;
}

const RadioButton: React.FC<RadioButtonProps> = ({ selected, onPress, children }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer}>
            <View style={[styles.radioButton, selected && styles.radioButtonSelected]} />
            <Text style={styles.radioButtonText}>{children}  </Text>
        </TouchableOpacity>
    );
};

interface RadioGroupProps {
    title: string;
    initialSelectedOption?: string;
    onChange?: (selectedOption: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ title, initialSelectedOption, onChange }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(initialSelectedOption || null);

    useEffect(() => {
        if (initialSelectedOption) {
            setSelectedOption(initialSelectedOption);
        }
    }, [initialSelectedOption]);

    const options = [
        { key: 'sim', text: 'Sim' },
        { key: 'nao', text: 'Não' },
        { key: 'parcial', text: 'Parcial' },
    ];

    const handlePress = (key: string, text: string) => {
        setSelectedOption(text);
        if (onChange) {
            onChange(text);
        }
    };

    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 70,
                borderWidth: 1,
                borderRadius: 7,
                borderColor: "#999",
                paddingHorizontal: 16,
            }}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.radioButtonContainer}>
                {options.map(option => (
                    <RadioButton
                        key={option.key}
                        selected={selectedOption === option.text}
                        onPress={() => handlePress(option.key, option.text)}
                    >
                        {option.text}
                    </RadioButton>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioButtonSelected: {
        backgroundColor: '#000',
    },
    radioButtonText: {
        fontSize: 16,
    },
});

export default RadioGroup;
