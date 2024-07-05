import { Avatar, Button, Text, TextInput, Picker } from "react-native-paper";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
} from "react-native";
import styles from "./styles";
import * as React from "react";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Hearder from "../share/Header";
import Footer from "../share/footer";
import RNPickerSelect from "react-native-picker-select";

const IdeaPrivate = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUri, setImageUri] = useState(null);

    const handleChoosePhoto = () => {
        launchImageLibrary({ mediaType: "photo" }, (response) => {
            if (!response.didCancel && !response.error) {
                setImageUri(response.uri);
            }
        });
    };

    const handleSubmit = () => {
        // Logic để gửi thông tin phản ánh
        // Có thể sử dụng title, content, imageUri ở đây để gửi đi
    };
    return (
        <ImageBackground
            style={[styles.container]}
            source={require("../../assets/backgrondLogin.png")}
        >
            <StatusBar barStyle={"light-content"} />
            <ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <Hearder info={"Phản ánh"} />
                    <View style={[styles.utilities]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Tiêu đề"
                            placeholderTextColor="#aaa"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={[styles.input, styles.multilineInput]}
                            placeholder="Nội dung"
                            placeholderTextColor="#aaa"
                            multiline
                            value={content}
                            onChangeText={setContent}
                        />
                        <Button
                            title="Chọn hình ảnh"
                            onPress={handleChoosePhoto}
                        />
                        {imageUri && (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                            />
                        )}
                        <Button title="Gửi" onPress={handleSubmit} />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <Footer />
        </ImageBackground>
    );
};

export default IdeaPrivate;
