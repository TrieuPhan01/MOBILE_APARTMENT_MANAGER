import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import myStyles from "../../Styles/myStyles";
import styles from "./styles";
import { Button, TextInput } from "react-native-paper";
import React, { useContext, useState } from "react";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatcherContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "../Main/home";

const LoginScreen = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible); // Đảo ngược trạng thái của mật khẩu (hiển thị hoặc ẩn đi)
    };

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleClearUsername = () => {
        setUsername(""); // Xóa toàn bộ giá trị trong TextInput
    };

    const updateState = (value) => {
        setUsername(value);
    };
    const dispatcher = useContext(MyDispatcherContext);

    const nav = useNavigation();
    const [loading, setLoading] = useState(false);

    const login = async () => {
        setLoading(true);
        setErrorMessage(false);

        const payload = {
            username,
            password,
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
            grant_type: "password",
        };
        console.log(
            "process.env.REACT_APP_CLIENT_ID: ",
            process.env.REACT_APP_CLIENT_ID,
            "process.env.REACT_APP_CLIENT_SECRET: ",
            process.env.REACT_APP_CLIENT_SECRET
        );

        let esc = encodeURIComponent;
        let query = Object.keys(payload)
            .map((k) => esc(k) + "=" + esc(payload[k]))
            .join("&");

        try {
            let res = await APIs({
                method: "post",
                url: endpoints.login,
                withCredentials: true,
                crossdomain: true,
                data: query,
            });

            await AsyncStorage.setItem("access_token", res.data.access_token);

            setTimeout(async () => {
                let token = await AsyncStorage.getItem("access_token");
                let user = await authAPI(token).get(endpoints["getUser"]);
                await AsyncStorage.setItem("user", JSON.stringify(user.data));
                dispatcher({
                    type: "login",
                    payload: { ...user.data, token },
                });
                if (user.data.change_password_required === true) {
                    nav.navigate(HomeScreen);
                } else {
                    nav.navigate("ChangInfo", {
                        user: user.data,
                        token: token,
                    });
                }
            }, 100);
        } catch (error) {
            setErrorMessage(true);
            console.error(error);
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
                        <Text style={styles.TextTop}>Đăng nhập</Text>
                    </View>
                    <View style={styles.top2}>
                        <Text style={styles.TextTop2}>
                            Chào bạn đến với chung cư
                        </Text>
                        <Text style={styles.TextTop2}>Hiền Vy</Text>
                        <TextInput.Icon
                            icon="hand-wave"
                            color="gold"
                            marginTop={16}
                            size={26}
                        />
                    </View>
                    <View style={styles.inputfather}>
                        {errorMessage && (
                            <Text style={[styles.TextTop3, { color: "red" }]}>
                                Bạn nhập sai tên đăng nhập hoặc mật khẩu, hãy
                                thử lại!!!!
                            </Text>
                        )}
                        <TextInput
                            style={styles.input}
                            label="Tên đăng nhập"
                            value={username}
                            onChangeText={(t) => updateState(t)}
                            right={
                                <TextInput.Icon
                                    icon="alpha-x"
                                    onPress={handleClearUsername}
                                />
                            }
                        />
                        <TextInput
                            style={styles.input}
                            label="Password"
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            right={
                                <TextInput.Icon
                                    icon={isPasswordVisible ? "eye-off" : "eye"}
                                    onPress={handleTogglePasswordVisibility}
                                />
                            }
                        />
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("ForgotAccount");
                            }}
                        >
                            <Text style={styles.ForgotPass}>
                                Quên mật khẩu?
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[
                            styles.btnLoginfather,
                            isPressed && styles.btnLoginfatherPressed,
                        ]}
                    ></View>
                </KeyboardAvoidingView>
            </ScrollView>
            <View style={styles.btnLoginChildP}>
                <Button
                    style={[
                        styles.btnLoginChild,
                        isPressed && styles.btnLoginfatherPressed,
                    ]}
                    loading={loading}
                    icon={"account"}
                    onPress={login}
                >
                    Đăng nhập
                </Button>
            </View>
        </ImageBackground>
    );
};
export default LoginScreen;
