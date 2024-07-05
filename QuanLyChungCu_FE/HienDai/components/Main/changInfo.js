import { Button, Avatar, Text, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import {
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
} from "react-native";
import myStyles from "../../Styles/myStyles";
import styles from "./style";
import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import APIs, { endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/Contexts";
import { set } from "date-fns";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../configs/firebase";

const ChangInfo = () => {
    const user = React.useContext(MyUserContext);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible); // Đảo ngược trạng thái của mật khẩu (hiển thị hoặc ẩn đi)
    };
    const [isPressed, setIsPressed] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const picker = async () => {
        let { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) setAvatar(result.assets[0]);
        }
    };

    const changInf = async () => {
        setLoading(true);
        let formData = new FormData();

        formData.append("password", password);
        if (avatar) {
            console.log("avatar: ", avatar);
            formData.append("avatar", {
                uri: avatar.uri,
                name: avatar.fileName,
                type: "image/jpge",
            });
        }

        console.log("form: ", formData._parts);
        try {
            let res = await axios.post(
                "https://phanhoangtrieu.pythonanywhere.com/User/upload_avatar/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (res.status === 201) {
                // đăng ký tài khoảng chat realtime
                const emailchat = user.email
                const passwordchat = user.id + "123456"
                if (emailchat !== "" && passwordchat !== "") {
                    createUserWithEmailAndPassword(auth, emailchat, passwordchat)
                      .then(() => console.log("Login success"))
                      .catch((err) => Alert.alert("singup error", err.message));
                  }

                nav.navigate("HomeScreen");
               
            }
        } catch (error) {
            console.log("lỗi");
            if (error.response) {
                console.error(error);
            } else {
                // Xử lý các lỗi không có response, ví dụ như lỗi mạng
                console.log("Error:", error.message);
            }
        } finally {
            setLoading(false);
        }
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
                    <Text style={[styles.nameHome]}>Hiền Vy</Text>
                    <View style={styles.top}>
                        <Text style={styles.TextTop}>
                            Cập nhập thông tin trước khi sử dụng dịch vụ
                        </Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        label="Password"
                        secureTextEntry={!isPasswordVisible} // Đảo ngược secureTextEntry dựa trên trạng thái của mật khẩu
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        right={
                            <TextInput.Icon
                                icon={isPasswordVisible ? "eye-off" : "eye"}
                                onPress={handleTogglePasswordVisibility}
                            />
                        }
                    />
                    <TouchableOpacity onPress={picker}>
                        <Text style={styles.chooseImg}>
                            Chọn hình đại diện...
                        </Text>
                    </TouchableOpacity>
                    {avatar && (
                        <Image
                            style={styles.avatar}
                            source={{ uri: avatar.uri }}
                        />
                    )}
                </KeyboardAvoidingView>
            </ScrollView>
            <Button
                style={[
                    styles.btnDone,
                    isPressed && styles.btnLoginfatherPressed,
                ]}
                loading={loading}
                icon={"check"}
                onPress={changInf}
            >
                Xong
            </Button>
        </ImageBackground>
    );
};

export default ChangInfo;