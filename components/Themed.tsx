// importações Padrão
import React from "react"
import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput } from 'react-native';
import type { FormatType, MaskOptions, StyleObj, TextDecorationOptions } from 'react-native-mask-text/lib/typescript/src/@types';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { MaskedTextInput as DefaultMaskedTextInput } from "react-native-mask-text"; // ajuste o caminho conforme necessário

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'];

type TIProps = Omit<TextInputProps, 'onChangeText'>;
export interface MaskedTextInputProps extends TIProps {
  mask?: string;
  type?: FormatType;
  options?: MaskOptions;
  defaultValue?: string;
  onChangeText: (text: string, rawText: string) => void;
  inputAccessoryView?: JSX.Element;
  textBold?: boolean;
  textItalic?: boolean;
  textDecoration?: TextDecorationOptions;
  style?: StyleObj;
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function useTheme(
  props: { light?: string; dark?: string },
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const placeholder = useThemeColor({ light: '#000', dark: '#fff' }, 'text');

  return <DefaultTextInput placeholderTextColor={placeholder} style={[{ color }, style]} {...otherProps} />;
}

export function MaskedTextInput(props: MaskedTextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const placeholder = useThemeColor({ light: '#000', dark: '#fff' }, 'text');

  return <DefaultMaskedTextInput
    placeholderTextColor={placeholder}
    style={[{ color }, style]}
    {...otherProps} />;
}

