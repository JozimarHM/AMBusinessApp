import React, { Component, useEffect, useState } from 'react'
import { Dimensions, FlatList, PressableProps, Text, Vibration, View } from 'react-native'
import Checkbox from 'expo-checkbox';
import { BallColor } from './ballColor'
import styles from '@/constants/Styles'

type Props = PressableProps & {
    cor: string,
    corT: string,
    onOpen: (cor: string, index: number) => void
    onOpenText: (cor: string, index: number) => void

}
export default function SelectionColor({ cor, corT, onOpen, onOpenText, ...rest }: Props) {

    const { height,width } = Dimensions.get('window');
    
    const [colorBackground, setColorBack] = useState([
        { key: '#00ff006f', checked: false }, { key: '#d3f36a', checked: false }, { key: '#00ff009f', checked: false },
        { key: '#00ff00', checked: false }, { key: '#0fd43d', checked: false }, { key: '#1e7833', checked: false },
        { key: '#0000ffff', checked: false }, { key: '#0f30d4', checked: false }, { key: '#030b99', checked: false },
        { key: '#9e89ff', checked: false }, { key: '#0000ff91', checked: false }, { key: '#670399', checked: false },
        { key: '#a705f7', checked: false }, { key: '#63f6e1', checked: false }, { key: '#7ce0df', checked: false },
        { key: '#fca103', checked: false }, { key: '#ff00006f', checked: false }, { key: '#ff00009f', checked: false },
        { key: '#ff0000bf', checked: false }, { key: '#ff0000', checked: false }
    ])

    const [corTexto, setCorTexto] = useState([
        { key: '#000000', checked: false }, { key: '#ffffff', checked: false },
    ])

    const updateChecked = (cor: string) => {
        const updatedColors = colorBackground.map(color =>
            color.key === cor ? { ...color, checked: true } : color
        );
        setColorBack(updatedColors);
    };

    useEffect(() => {
        if (cor?.length > 0) {
            const updatedColors = colorBackground.map(colorItem =>
                colorItem.key === cor ? { ...colorItem, checked: true } : colorItem
            );
            setColorBack(updatedColors);
        }
    }, [cor]);

    useEffect(() => {
        if (corT?.length > 0) {
            const updatedColors = corTexto.map(colorItem =>
                colorItem.key === corT ? { ...colorItem, checked: true } : colorItem
            );
            setCorTexto(updatedColors);
        }
    }, [corT]);

    const toggleCheck = (index: number) => {

        setColorBack((prevColors) => {
            const dadosArray = prevColors.map(color => ({ ...color, checked: false }));
            dadosArray[index].checked = !dadosArray[index].checked;
            return dadosArray;
        });
    };
    const toggleCheckText = (index: number) => {

        setCorTexto((prevColors) => {
            const dadosArray2 = prevColors.map(color => ({ ...color, checked: false }));
            dadosArray2[index].checked = !dadosArray2[index].checked;
            return dadosArray2;
        });
    };

    return (
        <>
            <Text style={styles.text}> Selecione a cor de Fundo da Anotação: </Text>
            <FlatList
                style={styles.flatlist}
                data={colorBackground}
                horizontal={true}
                keyExtractor={(item, index) => String(index)}
                renderItem={({ item, index }) => (

                    <BallColor
                        data={item}
                        onOpen={() => {
                            Vibration.vibrate(200),
                                onOpen(item.key, index);
                            toggleCheck(index)

                        }} />

                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ columnGap: 15, height: 60, justifyContent: 'center' }}
            />
            <Text style={styles.text}> Selecione a cor do Texto: </Text>
            <FlatList
                style={styles.flatlist}
                data={corTexto}
                horizontal={true}
                keyExtractor={(item, index) => (item.key)}
                renderItem={({ item, index }) => (

                    <BallColor
                        data={item}
                        onOpen={() => {
                            Vibration.vibrate(200),
                                onOpenText(item.key, index);
                            toggleCheckText(index)

                        }} />

                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.list, corTexto.length * 50 < width && styles.listFillScreen, , { gap: 20 }]}
            />
        </>
    )

}


