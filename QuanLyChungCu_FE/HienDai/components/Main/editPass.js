import { Button, Text, TextInput } from "react-native-paper";
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
import styles from "./style";
import * as React from "react";
import { useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";

const EditPass = ({ navigation }) => {
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [code, setCode] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");
    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible); // Đảo ngược trạng thái của mật khẩu (hiển thị hoặc ẩn đi)
    };
    const changeCode = async () => {
        setLoading(true);

        const payload = {
            code,
            password,
        };

        let esc = encodeURIComponent;
        let query = Object.keys(payload)
            .map((k) => esc(k) + "=" + esc(payload[k]))
            .join("&");

        console.log(query);

        try {
            let res = await APIs({
                method: "post",
                url: endpoints.changPass,
                withCredentials: true,
                crossdomain: true,
                data: query,
            });
            if (res.status === 200) {
                navigation.navigate("Login");
            }
        } catch (error) {
            if (error.response) {
                // Kiểm tra status code trả về
                if (error.response.status === 400) {
                    setErrorMessage(true); // Hiển thị thông báo lỗi
                    setTimeout(() => {
                        setErrorMessage(false); // Ẩn thông báo lỗi sau 30 giây
                    }, 30000); // 30 giây
                } else {
                    console.log("Error:", error.response.status);
                }
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
                        <Text style={styles.TextTop}>Nhập mã code</Text>
                    </View>
                    <View>
                        {errorMessage && (
                            <Text style={[styles.TextTop3, { color: "red" }]}>
                                Bạn nhập sai mã code, hãy thử lại!!!!
                            </Text>
                        )}
                        <TextInput
                            style={styles.inputcode}
                            label="Nhập mã code"
                            value={code}
                            onChangeText={(text) => setCode(text)}
                        />
                        <TextInput
                            style={styles.input}
                            label="Nhập mật khẩu mới"
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
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <Button
                style={[styles.btnDone]}
                loading={loading}
                icon={"check"}
                onPress={changeCode}
            >
                Xong
            </Button>
        </ImageBackground>
    );
};

export default EditPass;
