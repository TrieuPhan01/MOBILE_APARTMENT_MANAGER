import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    ImageBackground,
    RefreshControl,
} from "react-native";
import { Card, Title, Paragraph, Appbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { MyUserContext } from "../../configs/Contexts";
import { format } from "date-fns";
import styles from "./style";
import Footer from "../share/footer";

const BillPaidScreen = () => {
    const user = React.useContext(MyUserContext);
    const navigation = useNavigation();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const token = user.token;

    const getBills = async (token) => {
        try {
            const response = await axios.get(
                "https://phanhoangtrieu.pythonanywhere.com/Bill/get_bill/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setBills(response.data);
            return response.data;
        } catch (error) {
            Alert.alert(
                "Lỗi",
                "Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.",
                [{ text: "OK" }]
            );
        } finally {
            setLoading(false);
            setRefreshing(false); // Dừng hiển thị loading khi yêu cầu hoàn thành
        }
    };

    const fetchBills = async () => {
        setLoading(true);
        const data = await getBills(token);
        if (data) {
            const unpaidBills = data.filter(
                (bill) => bill.status_bill === "paid "
            );

            console.log("unpaidBills: ", unpaidBills);
            setBills(unpaidBills);
        } else {
            setError("Error fetching bills");
        }
        setLoading(false);
        setRefreshing(false); // Dừng hiển thị loading khi yêu cầu hoàn thành
    };

    useEffect(() => {
        fetchBills();
    }, [token]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const SeeDetails = (selectedBill) => {
        // Truyền thông tin bill cụ thể qua navigation
        navigation.navigate("SeeDetail", { bill: selectedBill });
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchBills();
    };

    return (
        <ImageBackground
            style={styles.container}
            source={require("../../assets/backgrondLogin.png")}
        >
            <Appbar.Header style={styles.headers}>
                <Appbar.BackAction
                    onPress={handleGoBack}
                    color="#e8eae1"
                    fontWeight="bold"
                />
                <Appbar.Content
                    title="HÓA ĐƠN ĐÃ THANH TOÁN"
                    titleStyle={{ color: "#e8eae1", fontWeight: "bold" }}
                />
            </Appbar.Header>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {bills.map((bill) => (
                    <Card key={bill.id} style={styles.card}>
                        <Card.Content>
                            <Title style={styles.title}>{bill.name_bill}</Title>
                            <Paragraph style={styles.money}>
                                Tổng phí: {bill.money} VND
                            </Paragraph>
                            <Paragraph style={styles.paragraph}>
                                Loại phí: {bill.type_bill}
                            </Paragraph>
                            <Paragraph style={styles.paragraph}>
                                Ngày thanh toán:{" "}
                                {format(
                                    new Date(bill.updated_date),
                                    "dd/MM/yyyy"
                                )}
                            </Paragraph>
                            <Button
                                mode="contained"
                                onPress={() => SeeDetails(bill)} // Truyền thông tin hóa đơn khi ấn vào nút
                                style={styles.paymentButton}
                                contentStyle={{
                                    height: 40,
                                    backgroundColor: "#6b7b95",
                                }} // Tùy chỉnh chiều cao của nút
                                title="Xem chi tiết"
                            >
                                Xem chi tiết
                            </Button>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
            <Footer />
        </ImageBackground>
    );
};

export default BillPaidScreen;
