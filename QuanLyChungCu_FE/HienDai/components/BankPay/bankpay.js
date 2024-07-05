import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView, Alert  } from 'react-native';
import { Card, Title, Paragraph, Appbar, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { MyUserContext } from '../../configs/Contexts';

const BankPayScreen = () => {
    const user = React.useContext(MyUserContext);
    const route = useRoute();
    const { bill } = route.params;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [imagePay, setImagePay] = useState(null);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permissions denied!');
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) setImagePay(result.assets[0]);
        }
    };

    const uploadImgPay = async () => {
        setLoading(true);
        console.log(bill.id)
        console.log(bill.money)
        let formData = new FormData();
        formData.append("id", bill.id);
        formData.append("total", bill.money);
        if (imagePay) {
            formData.append('image', {
                uri: imagePay.uri,
                name: imagePay.fileName,
                type: 'image/jpeg',
            });
        }
        console.log("form: ", formData._parts);
       

        try {
            let res = await axios.post(
                "https://phanhoangtrieu.pythonanywhere.com/Bill/upload_imgbanking/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (res.status === 201) {
                Alert.alert(
                    "Thông báo",
                    "Đã gửi thông tin thành công. Nhân viên sẽ xác nhận trong giây lát!",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate('PaymentScreen'),
                        },
                    ]
                );
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 404) {
                    Alert.alert(
                        "Lỗi",
                        "Đã có lỗi! Vui lòng thực hiện lại hoặc liên hệ với nhân viên!",
                        [{ text: "OK" }]
                    );
                } else if (status === 500) {
                    Alert.alert(
                        "Lỗi hệ thống",
                        "Lỗi hệ thống! Vui lòng thử lại sau.",
                        [{ text: "OK",
                            onPress: () => navigation.navigate('PaymentScreen'),
                         }]
                    );
                } else {
                    console.error(error);
                }
            } else {
                console.log('Error:', error.message);
            }
        }  finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground style={styles.container} source={require('../../assets/backgrondLogin.png')}>
            <Appbar.Header style={styles.headers}>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title="CHI TIẾT HÓA ĐƠN" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>Thông tin hóa đơn</Title>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Mã hóa đơn:</Text>
                            <Text style={styles.value}>{bill.id}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Tên hóa đơn:</Text>
                            <Text style={styles.value}>{bill.name_bill}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Tổng tiền:</Text>
                            <Text style={styles.value}>{bill.money} VND</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Ngày tạo:</Text>
                            <Paragraph style={styles.value}>
                                {format(new Date(bill.created_date), 'dd/MM/yyyy')}
                            </Paragraph>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Ghi chú:</Text>
                            <Text style={styles.value}>{bill.decription}</Text>
                        </View>

                        {!imagePay && (
                            <TouchableOpacity onPress={picker}>
                                <Text style={styles.chooseImg}>Upload ảnh minh chứng</Text>
                            </TouchableOpacity>
                        )}
                        {imagePay && (
                            <TouchableOpacity onPress={picker}>
                                <Image style={styles.imagePay} source={{ uri: imagePay.uri }} />
                            </TouchableOpacity>
                        )}

                        <Button
                            style={styles.btnDone}
                            loading={loading}
                            icon={'check'}
                            onPress={uploadImgPay}
                        >
                            Hoàn Thành
                        </Button>
                    </Card.Content>
                </Card>
                <View style={styles.additionalInfo}>
                    <Text style={styles.additionalInfo}>
                        <Text style={styles.boldRedItalic}>CHÚ Ý:</Text>
                        {'\n'}
                        *Quý khách hàng vui lòng chuyển khoản qua ngân hàng theo thông tin sau:
                        {'\n'}
                        <Text style={styles.textImage}>  STK: 12345678</Text>
                        {'\n'}
                        <Text style={styles.textImage}>  TÊN TK: CHUNG CU HIEN VY</Text>
                        {'\n'}
                        <Text style={styles.textImage}>  NGÂN HÀNG: MBBank</Text>
                        {'\n'}
                        *Hoặc quý khách có thể vào app ngân hàng, chọn hóa đơn, tìm kiếm{' '}
                        <Text style={styles.textImage}>CHUNG CU HIEN VY</Text> và tiến hành thanh toán hóa đơn
                        {'\n'}
                        *Sau khi thanh toán hóa đơn vui lòng chụp ảnh màn hình và gửi minh chứng!
                    </Text>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    headers: {
        backgroundColor: '#f5f5f5',
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    card: {
        marginTop: 15,
        elevation: 3,
        borderRadius: 15,
        padding: 10,
        color: '#ffffff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontSize: 18,
        color: '#666',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    additionalInfo: {
        fontSize: 16,
        marginTop: 20,
        color: '#dcd3d1',
    },
    boldRedItalic: {
        color: 'red',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textDecorationLine: 'underline',
    },

    textImage: {
        fontSize: 14,
        color: 'red',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    chooseImg: {
        backgroundColor: '#e6e0ec',
        color: '#494350',
        marginTop: 20,
        fontSize: 10,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 10,
        width: 100,
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePay: {
        width: 200,
        height: 250,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 50,
    },
    btnDone: {
        marginTop: 20,
        fontSize: 16, 
        fontWeight: 'bold',
        lineHeight: 40, 
        color: 'white',
    },
});

export default BankPayScreen;
