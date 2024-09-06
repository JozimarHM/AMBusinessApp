import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

interface Option {
    key: string;
    text: string;
}

interface RadioButtonProps {
    selected: boolean;
    onPress: () => void;
    children: React.ReactNode;
    theme: any; // Adicione a propriedade de tema
}

const RadioButton: React.FC<RadioButtonProps> = ({ selected, onPress, children, theme }) => {
    const styles = StyleSheet.create({
        radioButtonContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            marginRight: 10,
            overflow: 'scroll'
        },
        radioButton: {
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
            borderColor: theme === 'dark' ? '#fff' : '#000',
            backgroundColor: selected ? (theme === 'dark' ? '#fff' : '#000') : 'transparent',
        },
        radioButtonText: {
            color: theme === 'dark' ? '#fff' : '#000',
        },
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer}>
            <View style={styles.radioButton} />
            <Text style={styles.radioButtonText}>{children} </Text>
        </TouchableOpacity>
    );
};

interface RadioGroupProps {
    title: string;
    initialSelectedOption?: string;
    onChange?: (selectedOption: string) => void;
    options: Option[]; // Adicione a prop options
}

const RadioGroup: React.FC<RadioGroupProps> = ({ title, initialSelectedOption, onChange, options }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(initialSelectedOption || null);
    const theme = useColorScheme(); // Use o hook useColorScheme para acessar o esquema atual

    useEffect(() => {
        if (initialSelectedOption) {
            setSelectedOption(initialSelectedOption);
        }
    }, [initialSelectedOption]);

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
                borderColor: theme === 'dark' ? '#fff' : '#000',
                paddingHorizontal: 16,
            }}>
            <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#000' }]}>{title}</Text>
            <View style={styles.radioButtonContainer}>
                {options.map(option => (
                    <RadioButton
                        key={option.key}
                        selected={selectedOption === option.text}
                        onPress={() => handlePress(option.key, option.text)}
                        theme={theme} // Passe o tema para o componente RadioButton
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
});

export default RadioGroup;
