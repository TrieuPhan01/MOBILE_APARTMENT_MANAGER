import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    KeyboardAvoidingView,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Appbar, Avatar, SegmentedButtons } from "react-native-paper";
import axios from "axios";
import DropdownPicker from "react-native-dropdown-picker";
import { MyUserContext } from "../../configs/Contexts";
import * as ImagePicker from "expo-image-picker";
import APIs, { endpoints } from "../../configs/APIs";
import HomeScreen from "../Main/home";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
const ReflectScreen = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [selectedAdmin, setSelectedAdmin] = useState([]); // State để lưu admin đã chọn
    const [value, setValue] = useState("walk");
    const [submittedFeedbacks, setSubmittedFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState([]);
    const user = useContext(MyUserContext);
    const [open, setOpen] = useState(false);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = useState(true);
    const nav = useNavigation();
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get(
                    "https://phanhoangtrieu.pythonanywhere.com/User/get_admin/",
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                const data = response.data;
                const adminsData = data.map((admin) => ({
                    label: admin.username,
                    value: admin.id,
                }));
                // adminsData = [adminsData];
                setAdmins(adminsData);
            } catch (error) {
                console.error("Error fetching admins:", error);
            }
        };
        fetchAdmins();
    }, [user.token]);
    const fetchSubmittedFeedbacks = async () => {
        if (!hasMore) return;
        try {
            setLoading(true);

            let response = await APIs({
                method: "get",
                url: `${endpoints.getLetter}?page=${page}`,
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = response.data.results;
            console.log("data: ", data);
            if (page == 1) setSubmittedFeedbacks(data);
            else if (page > 1)
                setSubmittedFeedbacks((curennt) => {
                    return [...curennt, ...data];
                });
            setLoading(false);
            if (response.data.next === null) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching submitted feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSubmittedFeedbacks();
    }, [user.token, page]);
    const isCloseToBottom = ({
        layoutMeasurement,
        contentOffset,
        contentSize,
    }) => {
        const paddingToBottom = 20;
        return (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
        );
    };
    const loadMore = ({ nativeEvent }) => {
        if (!loading && isCloseToBottom(nativeEvent) && hasMore)
            setPage(page + 1);
    };
    const handleSubmit = async () => {
        if (image && selectedAdmin && content && title) {
            let formData = new FormData();

            formData.append("title_letter", title);
            formData.append("content", content);
            formData.append("user_admin", [selectedAdmin]);
            if (image) {
                formData.append("img_letter", {
                    uri: image.uri,
                    name: image.fileName,
                    type: "image/jpge",
                });
            }
            console.log("form: ", formData._parts);
            try {
                let res = await axios.post(
                    "https://phanhoangtrieu.pythonanywhere.com/letter/create_letters/",
                    // "https://c150-171-243-49-117.ngrok-free.app/letter/create_letters/",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            // Authorization: `Bearer m58Bce13PHhN32MDOZg0xgFXJ17SCM`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                console.log("res: ", res.status);
                if (res.status === 201) {
                    Alert.alert(
                        "Gửi phản ánh thành công",
                        "Các phản ánh đã gửi",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    fetchSubmittedFeedbacks();
                                    setValue("train");
                                    // nav.navigate(HomeScreen);
                                },
                            },
                        ]
                    );
                }
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
        } else {
            Alert.alert(
                "Bạn nhập chưa đủ thông tin",
                "Kiểm tra lại",
                [
                    {
                        text: "OK",
                    },
                ],
                { cancelable: false }
            );
        }
    };
    const renderFeedbackItem = ({ item }) => (
        <View style={styles.feedbackItem}>
            <Text style={styles.feedbackTitle}>
                Tiêu đề: {item.title_letter}
            </Text>
            <Text>Nội dung: {item.content}</Text>
            <Text>
                Ban quản lý: {item.user_admin ? item.user_admin.join(", ") : ""}
            </Text>
            <Text style={styles.value}>
                Ngày tạo:
                {moment(item.created_date).format("DD/MM/YYYY")}
            </Text>

            {item.img_letter && (
                <Avatar.Image
                    size={220}
                    source={{ uri: item.img_letter }}
                    style={styles.avatar}
                />
            )}
        </View>
    );
    const picker = async () => {
        let { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) setImage(result.assets[0]);
        }
    };
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ImageBackground
                style={styles.background}
                imageStyle={{ opacity: 0.8, borderRadius: 14 }}
                resizeMode="cover"
                source={require("../../assets/bac.jpg")}
            >
                <ScrollView onScroll={loadMore}>
                    {loading && <ActivityIndicator />}
                    <Appbar.Header style={styles.appbar}>
                        <Appbar.BackAction
                            onPress={() => navigation.goBack()}
                            color="#1b1a19"
                            fontWeight="bold"
                        />
                        <Appbar.Content
                            title="PHẢN ÁNH"
                            titleStyle={{
                                color: "#1b1a19",
                                fontWeight: "bold",
                            }}
                        />
                    </Appbar.Header>

                    <SafeAreaView style={styles.safe}>
                        <View style={styles.header}>
                            <SegmentedButtons
                                value={value}
                                onValueChange={setValue}
                                buttons={[
                                    { value: "walk", label: "Viết Phản Ánh" },
                                    {
                                        value: "train",
                                        label: "Phản Ánh Đã Gửi",
                                    },
                                ]}
                                Style={styles.text}
                            />
                        </View>
                        <View style={styles.content}>
                            {value === "walk" ? (
                                <ScrollView>
                                    <View style={styles.formContainer}>
                                        <Text style={styles.label}>Title:</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter title"
                                            value={title}
                                            onChangeText={setTitle}
                                        />

                                        <Text style={styles.label}>
                                            Content:
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter content"
                                            value={content}
                                            onChangeText={setContent}
                                            multiline
                                        />

                                        <Text style={styles.label}>
                                            User Admin:
                                        </Text>
                                        <View>
                                            <DropdownPicker
                                                open={open}
                                                value={selectedAdmin}
                                                items={admins}
                                                setOpen={setOpen}
                                                setValue={setSelectedAdmin}
                                                placeholder="Select admin"
                                                style={styles.dropdown}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={picker}>
                                            <Text style={styles.chooseImg}>
                                                Chọn hình ảnh
                                            </Text>
                                        </TouchableOpacity>
                                        {image && (
                                            <Image
                                                style={styles.avatar}
                                                source={{ uri: image.uri }}
                                            />
                                        )}

                                        <View style={[styles.buttonsContainer]}>
                                            <Button
                                                title="Gửi báo cáo"
                                                onPress={handleSubmit}
                                                style={styles.button}
                                            />
                                        </View>
                                    </View>
                                </ScrollView>
                            ) : (
                                <View style={styles.formContainer}>
                                    <Text style={styles.label}>
                                        Danh sách các phản ánh đã gửi:
                                    </Text>
                                    <FlatList
                                        data={submittedFeedbacks}
                                        renderItem={renderFeedbackItem}
                                        keyExtractor={(item, index) =>
                                            index.toString()
                                        }
                                    />
                                </View>
                            )}
                        </View>
                    </SafeAreaView>
                    {loading && page > 1 && <ActivityIndicator />}
                </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    appbar: {
        backgroundColor: "transparent",
        elevation: 0,
    },
    safe: {
        flex: 1,
    },
    header: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    formContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 8,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 12,
        backgroundColor: "white",
    },
    imageRe: {
        width: 100,
        height: 100,
        marginVertical: 16,
    },
    feedbackItem: {
        padding: 10,
        borderBottomWidth: 3,
        borderBottomColor: "#ccc",
        backgroundColor: "#e6f0ff",
        opacity: 0.9,
        borderRadius: 10,
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: "#83e72d",
    },
    button: {
        marginBottom: 10,
        marginVertical: 90,
    },
    dropdown: {
        backgroundColor: "#fafafa",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    buttonsContainer: {
        justifyContent: "center",

        marginBottom: 10,
        marginTop: 40,
    },
    avatar: {
        width: 220,
        height: 220,
        backgroundColor: "red",
        borderRadius: 110,
        alignSelf: "center",
        marginTop: 50,
    },
    chooseImg: {
        backgroundColor: "#e6e0ec",
        color: "#494350",
        fontSize: 10,
        alignSelf: "center",
        padding: 10,
        borderRadius: 30,
        width: 60,
        height: 60,
        textAlign: "center",
    },
});

export default ReflectScreen;
