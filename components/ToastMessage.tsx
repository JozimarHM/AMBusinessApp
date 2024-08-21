import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';

interface PropsM {
    type: 'success' | 'danger' | 'info' | 'warning',
    text: string,
    description: string,
    timeout?: number,
}

interface ToastType {
    backgroundColor: string;
    icon: keyof typeof FontAwesome5.glyphMap;
}

const TOAST_TYPE: Record<PropsM['type'], ToastType> = {
    success: {
        backgroundColor: '#2ecc71',
        icon: 'check-circle',
    },
    danger: {
        backgroundColor: '#e74c3c',
        icon: 'exclamation-circle',
    },
    info: {
        backgroundColor: '#3498db',
        icon: 'info-circle',
    },
    warning: {
        backgroundColor: '#f39c12',
        icon: 'exclamation-triangle',
    },
};



const ToastMessage = forwardRef(({ type, text, description, timeout = 2000 }: PropsM, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const showToast = () => {
        if(isVisible){
           return setIsVisible(false);
        }
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            clearTimeout(timer);
        }, timeout);
    };

    useImperativeHandle(ref, () => ({
        show: showToast,
    }));

    const { backgroundColor, icon } = TOAST_TYPE[type];

    return (
        <>
            {isVisible && (
                <Animated.View
                    style={[styles.toastContainer, { backgroundColor }]}
                    entering={FadeInUp.delay(200)}
                    exiting={FadeOutUp}
                >
                    <FontAwesome5 name={icon} size={40} color="#FFF" />
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>{text}</Text>
                        <Text style={styles.descriptionText}>{description}</Text>
                    </View>
                </Animated.View>
            )}
        </>
    );
});

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 50,
        width: '90%',
        height: 100,
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textContainer: {
        marginLeft: 12,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
    },
    descriptionText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FFF',
    },
});

export default ToastMessage;
