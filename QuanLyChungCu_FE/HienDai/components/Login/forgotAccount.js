import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
    StatusBar,
} from "react-native";
import myStyles from "../../Styles/myStyles";
import styles from "./styles";
import { Button, Chip, TextInput } from "react-native-paper";
import React, { useContext, useState } from "react";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";

const ForgotAccountScreen = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState(false);

    const [isPressed, setIsPressed] = useState(false);
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [identification, setidentification] = useState("");

    const handleClearUsername = () => {
        setUsername("");
    };
    const handleClearIdentification = () => {
        setidentification("");
    };
    const nav = useNavigation();
    const updateStatName = (value) => {
        setUsername(value);
    };
    const updateStateIdentification = (value) => {
        setidentification(value);
    };
    const [loading, setLoading] = React.useState(false);

    const checkValid = async () => {
        setLoading(true);

        const payload = {
            name_people: username,
            identification_card: identification,
        };

        let esc = encodeURIComponent;
        let query = Object.keys(payload)
            .map((k) => esc(k) + "=" + esc(payload[k]))
            .join("&");

        console.log(query);

        try {
            let res = await APIs({
                method: "post",
                url: endpoints.postInfoUser,
                withCredentials: true,
                crossdomain: true,
                data: query,
            });
            console.info(res.data);

            if (res.status === 200) {
                nav.navigate("EditPass");
            }
        } catch (error) {
            if (error.response) {
                // Kiểm tra status code trả về
                if (error.response.status === 404) {
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
            style={myStyles.container}
            source={require("../../assets/backgrondLogin.png")}
        >
            <StatusBar barStyle={"light-content"} />
            <ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <View style={styles.top}>
                        <Text style={styles.TextTop}>Quên tài khoản</Text>
                    </View>
                    <View style={styles.top2}>
                        <Text style={styles.TextTop2}>
                            Nhập thông tin để lấy lại tài khoản
                        </Text>
                        <TextInput.Icon
                            icon="lock"
                            color="gold"
                            marginTop={16}
                            size={26}
                        />
                    </View>
                    <View style={styles.inputfatherForgot}>
                        {errorMessage && (
                            <Text style={[styles.TextTop3, { color: "red" }]}>
                                Bạn nhập sai thông tin tài khoản, hãy nhập lại
                            </Text>
                        )}
                        <TextInput
                            style={styles.input}
                            label="Họ và tên (tên cccd)"
                            value={username}
                            onChangeText={(t) => updateStatName(t)}
                            right={
                                <TextInput.Icon
                                    icon="alpha-x"
                                    onPress={handleClearUsername}
                                />
                            }
                        />
                        <TextInput
                            style={styles.input}
                            label="Số căn cước công dân"
                            value={identification}
                            onChangeText={(t) => updateStateIdentification(t)}
                            right={
                                <TextInput.Icon
                                    icon="alpha-x"
                                    onPress={handleClearIdentification}
                                />
                            }
                        />
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Login");
                            }}
                        >
                            <Text style={[styles.ForgotPass]}>
                                Đến trang đăng nhập?
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[
                            styles.btnDoneF,
                        ]}
                    ></View>
                </KeyboardAvoidingView>
            </ScrollView>
            <Button
                style={[
                    styles.btnDone,
                    isPressed && styles.btnLoginfatherPressed,
                ]}
                loading={loading}
                icon={"check"}
                onPress={checkValid}
            >
                Xong
            </Button>
        </ImageBackground>
    );
};

export default ForgotAccountScreen;
