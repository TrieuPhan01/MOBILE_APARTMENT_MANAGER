import { TextInput } from "react-native-paper";
import { View } from "react-native";
import styles from "./styles";
import * as React from "react";
import { useState } from "react";

const Input = (props) => {
    const ob = props.info;
    const [valueInput, setValueInput] = useState("");
    const ChangeText = (text) => {
        setValueInput(text);
        props.onChangeText(text); // Gọi hàm callback để truyền giá trị lên component cha
    };
    return (
        <View>
            <TextInput
                style={styles.input}
                label={ob.lable}
                value={valueInput}
                onChangeText={ChangeText}
                right={<TextInput.Icon icon={ob.icon} />}
            />
        </View>
    );
};

export default Input;
