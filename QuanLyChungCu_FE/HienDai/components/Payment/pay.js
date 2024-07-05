import React, { useState, useEffect, useContext } from 'react';
import { Linking, View, RefreshControl, ActivityIndicator, FlatList, Modal, Text, Button, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Paragraph, Badge, Appbar, Menu, Provider } from 'react-native-paper';
import axios from 'axios';
import styles from "./style";
import { format } from 'date-fns'; 
import { useNavigation } from "@react-navigation/native";
import APIs from '../../configs/APIs'; // endpoints không được sử dụng ở đây
import { MyUserContext } from '../../configs/Contexts';

const getBills = async (token) => {
    try {
        const response = await axios.get('https://phanhoangtrieu.pythonanywhere.com/Bill/get_bill/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

const PaymentScreen = () => {
    const user = useContext(MyUserContext);
    const token = user.token;
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null); // Lưu thông tin hóa đơn được chọn
    const [visible, setVisible] = useState(false);

    const nav = useNavigation();
    const fetchBills = async () => {
        setLoading(true);
        const data = await getBills(token);
        if (data) {
            const unpaidBills = data.filter(bill => bill.status_bill == 'Unpaid');
            setBills(unpaidBills);
        } else {
            setError('Error fetching bills');
        }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchBills();
    }, [token]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBills();
    };

    const handlePaymentPress = (bill) => {
        setSelectedBill(bill); // Lưu thông tin hóa đơn được chọn
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleMomoPayment = async () => {
        // Xử lý thanh toán qua Momo
        const payload = {
            id: selectedBill.id,
            total: selectedBill.money,
        };

        let esc = encodeURIComponent;
        let query = Object.keys(payload)
            .map((k) => esc(k) + "=" + esc(payload[k]))
            .join("&");

        try {
            const inforPay = await APIs({
                method: "post",
                url: "https://phanhoangtrieu.pythonanywhere.com/momo/create/",
                withCredentials: true,
                crossdomain: true,
                data: query,
            });
            const url = inforPay.data.payUrl;
            if (url) {
                // Mở URL trong trình duyệt
                Linking.openURL(url);
            }
        } catch (error) {
            console.error('Error fetching URL:', error);
        }

        closeModal();
    };

    const handleZaloPayPayment = async () => {
        // Xử lý thanh toán qua Zalo Pay
        const payload = {
            id: selectedBill.id,
            amount: selectedBill.money,
        };
        let esc = encodeURIComponent;
        let query = Object.keys(payload)
            .map((k) => esc(k) + "=" + esc(payload[k]))
            .join("&");

        try {
            const inforPay = await APIs({
                method: "post",
                url: "https://phanhoangtrieu.pythonanywhere.com/zalo/create/",
                withCredentials: true,
                crossdomain: true,
                data: query,
            });
            const url = inforPay.data.order_url;
            if (url) {
                // Mở URL trong trình duyệt
                Linking.openURL(url);
            }
        } catch (error) {
            console.error('Error fetching URL:', error);
        }

        // navigation.navigate('Momopay'); // Điều hướng đến màn hình thanh toán
        closeModal();
    };

    const handleBankPayment = async () => {
        // Xử lý thanh toán qua Ngân hàng
        nav.navigate("BankPayScreen", { bill: selectedBill });
        closeModal();
    }

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const _handleSearch = () => console.log('Searching');
    const _handleMore = () => {
        // Mở menu
        openMenu();
    };
    
     // Thực hiện hành động khi chọn "Hóa đơn đã thanh toán"
    const handlePaidBills = () => {
        nav.navigate("BillPaidScreen")
        closeMenu();
       
        console.log('Hóa đơn đã thanh toán');
    };

    // Quay trở lại màn hình home
    const handleGoBack = () => {
        nav.goBack();
    };

    const getStatusStyle = (status_bill) => {
        return {
            backgroundColor: status_bill === 'Unpaid' ? 'red' : 'green',
            color: '#ffffff',
            paddingHorizontal: 20,
            height: 30,
            lineHeight: 30,
            borderRadius: 15,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
        };
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.statusContainer}>
                    <Badge style={getStatusStyle(item.status_bill)}>{item.status_bill}</Badge>
                </View>
                <Title style={styles.title}>{item.name_bill}</Title>
                {/* <Paragraph style={styles.paragraph}>ID: {item.id}</Paragraph> */}
                <Paragraph style={styles.money}>Tổng phí: {item.money} VND</Paragraph>
                <Paragraph style={styles.paragraph}>Ghi chú: {item.decription}</Paragraph>
                <Paragraph style={styles.paragraph}>Loại phí: {item.type_bill}</Paragraph>
                <Paragraph style={styles.paragraph}>
                    Ngày tạo: {format(new Date(item.created_date), 'dd/MM/yyyy')}
                </Paragraph>
                <Button
                    mode="contained"
                    onPress={() => handlePaymentPress(item)}
                    style={styles.paymentButton}
                    contentStyle={{ height: 50 }} // Tùy chỉnh chiều cao của nút
                    title="Thanh toán"
                >
                    Thanh toán
                </Button>
            </Card.Content>
        </Card>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color="gold" size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <Provider>
            <View style={styles.container}>
                <Image source={require('../../assets/payChungCu.jpg')} 
                    style={{ width: 400, height:150, borderRadius:4}} 
                />
                <Appbar.Header>
                    <Appbar.BackAction onPress={handleGoBack} />
                    <Appbar.Content title="HÓA ĐƠN" />
                    <Appbar.Action icon="magnify" onPress={_handleSearch} />
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <Appbar.Action icon="dots-vertical" onPress={_handleMore} /> 
                        }
                    >
                        <Menu.Item onPress={handlePaidBills} title="Hóa đơn đã thanh toán" />
                    </Menu>
                </Appbar.Header> 
                <FlatList
                    data={bills}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                        />
                    }
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 , width: '80%', }}>
                            <TouchableOpacity onPress={closeModal} style={{ alignItems: 'center', marginBottom:13 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold',textAlign: 'center', }}>HÌNH THỨC THANH TOÁN</Text>
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', justifyContent: 'flex-start', marginBottom: 1 }}>
                                {/* Nút thanh toán qua Momo */}
                                <TouchableOpacity onPress={handleMomoPayment} style={{ margin: 15, flexDirection: 'row', }}>
                                    <Image source={require('../../assets/iconmomo.jpg')} style={{ width: 50, height: 50, marginRight: 16, flexShrink: 0, }} />
                                    <Text style={{ fontSize: 16, lineHeight: 50, }}>Momo</Text>
                                </TouchableOpacity>

                                {/* Nút thanh toán qua ZaloPay */}
                                <TouchableOpacity onPress={handleZaloPayPayment} style={{ margin: 15, alignItems: 'center', flexDirection: 'row', }}>
                                    <Image source={require('../../assets/iconzalopay.jpg')} style={{ width: 50, height: 50, marginRight: 16, flexShrink: 0, }} />
                                    <Text style={{ fontSize: 16, lineHeight: 50, }}>Zalo Pay</Text>
                                </TouchableOpacity>

                                {/* Nút thanh toán qua ngân hàng */}
                                <TouchableOpacity onPress={handleBankPayment} style={{ margin: 15, alignItems: 'center', flexDirection: 'row', }}>
                                    <Image source={require('../../assets/NganHang.jpg')} style={{ width: 50, height: 50, marginRight: 16, flexShrink: 0, }} />
                                    <Text style={{ fontSize: 16, lineHeight: 50, }}>Ngân Hàng</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={closeModal} style={{ alignItems: 'center', backgroundColor: '#337ab7', height: 45, margin: 15 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 40, color: 'white' }}>Thoát</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </Provider>
    );
};

export default PaymentScreen;
