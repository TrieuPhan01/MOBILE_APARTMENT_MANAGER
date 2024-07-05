import { Button, TextInput } from "react-native-paper";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
    Alert,
    Text,
    FlatList,
    Image,
} from "react-native";
import styles from "./style";
import * as React from "react";
import { useState, useContext, useEffect } from "react";
import Input from "../share/Input";
import Hearder from "../share/Header";
import axios from "axios";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../configs/Contexts";
import Footer from "../share/footer";
import moment from "moment";

const DetailSurveys = ({ route }) => {
    const { id } = route.params;
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const [inputData, setInputData] = useState({});
    const [DataList, setDataList] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationMessages, setValidationMessages] = useState({});

    const handleInputChange = (questionId, text) => {
        setInputData((prevInputData) => ({
            ...prevInputData,
            [questionId]: text,
        }));
    };
    const transformInputData = (data) => {
        return Object.entries(data).map(([key, value]) => ({
            question: parseInt(key, 10),
            score: parseInt(value, 10),
        }));
    };
    const data = transformInputData(inputData);
    console.log(inputData);
    useEffect(() => {
        validateForm();
    }, [inputData, DataList]);
    console.log("data: ", data);
    const validateForm = () => {
        let isValid = true;
        const messages = {};
        for (let question of DataList) {
            const score = inputData[question.id];
            if (!score || isNaN(score) || score < 1 || score > 100) {
                isValid = false;
                messages[question.id] =
                    "Vui lòng nhập số từ 1 đến 100 (Mức độ hài lòng tăng dần theo số)";
            }
        }
        setIsFormValid(isValid);
        setValidationMessages(messages);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchDataBox();
        }, [])
    );

    const fetchDataBox = async () => {
        try {
            let res = await APIs({
                method: "get",
                url: endpoints.getQS(id),
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setDataList(res.data);
        } catch (ex) {
            console.error(ex);
            Alert.alert(
                "Lỗi",
                "Quay lại trang chủ",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            nav.navigate("HomeScreen");
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    };

    const submitSurvey = async () => {
        const payload = {
            survey: id,
            answers: data,
        };

        try {
            let res = await APIs({
                method: "post",
                url: endpoints.postAs,
                data: payload,
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            Alert.alert("Hoàn thành", "Bạn chắc chắn muốn gửi câu trả lời?", [
   {
                    text: "OK",
                    onPress: () => {
                        if (res.status === 201) {
                            nav.navigate("SurveysList");
                        }
                    },
                },
            ]);
        } catch (ex) {
            console.error(ex);
            Alert.alert(
                "Lỗi",
                "Quay lại trang chủ",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            nav.navigate("HomeScreen");
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    };

    const renderItemGoodss = ({ item }) => (
        <View style={[styles.backGroundItem]}>
            <View style={styles.infoContainer}>
                <Text style={styles.qs}>Câu hỏi: {item.text}</Text>
                <Text style={styles.areaText}>
                    Ngày tạo khảo sát:{" "}
                    {moment(item.created_date).format("DD/MM/YYYY")}
                </Text>
                <Input
                    info={{
                        lable: "Điền số từ 1 đến 100",
                        icon: "",
                    }}
                    onChangeText={(text) => handleInputChange(item.id, text)}
                    value={inputData[item.id]}
                />
                {validationMessages[item.id] && (
                    <Text style={styles.errorText}>
                        {validationMessages[item.id]}
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <ImageBackground
            style={[styles.container]}
            source={require("../../assets/backgrondLogin.png")}
        >
            <StatusBar barStyle={"light-content"} />
            <View style={styles.boxtitles}>
                <Text style={styles.titles}>Danh sách câu hỏi</Text>
            </View>
            <ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                ></KeyboardAvoidingView>
            </ScrollView>
            <FlatList
                data={DataList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItemGoodss}
                style={[styles.ListItem]}
            />
            <Button
                mode="contained"
                onPress={submitSurvey}
                disabled={!isFormValid}
                style={styles.mar}
            >
                Gửi câu trả lời
            </Button>
            <Footer />
        </ImageBackground>
    );
};
export default DetailSurveys;
