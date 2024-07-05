import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: '#f5f5f5',
    },
    card: {
        margin:10,
        marginVertical: 10,
        borderRadius: 10,
        elevation: 4, // Adds shadow for Android
        shadowColor: '#000', // Adds shadow for iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        position: 'relative', // Allows positioning of child elements
        opacity: 0.85,
        backgroundColor: "#b9dbe5",
    },
    statusContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    paragraph: {
        marginBottom: 4,
    },
    paymentButton: {
        marginTop: 2,
        backgroundColor: '#6b7b95',
    },
    money: {
        marginBottom: 4,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff5733', // Màu sắc nổi bật cho số tiền
    },

    // methodBoard: { flex: 1, 
    // justifyContent: 'center',
    //  alignItems: 'center', 
    //  backgroundColor: 'rgba(0,0,0,0.5)' 
    // }
    textBoard: { fontSize: 20,
         marginBottom: 30 
    },

    puttonPay: {
        backgroundColor: 'red',
    },
    buttonStyle: {
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: 'blue', // Màu nền của nút
    },
    buttonContentStyle: {
        height: 40, // Chiều cao của nút
    },
    buttonLabelStyle: {
        fontSize: 16, // Kích thước chữ của nút
        fontWeight: 'bold', // Trọng lượng chữ của nút
        color: 'white', // Màu chữ của nút
    },
    textBoard: {
        fontSize: 20,
        marginBottom: 10,
    },
    Backgroud: {
        // backgroundColor: "#ffffff",
        width: "100%",
        height: "100%",
    },

    apartmentImage:{
        width: "100%",
        height: "20%",

    },


    container_bank: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#00b0f0',
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    totalText_bank: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    amountText_bank: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    payButton_bank: {
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    payButtonText_bank: {
        color: '#00b0f0',
        fontSize: 16,
        fontWeight: 'bold',
    },

    headers: {
        backgroundColor: 'transparent',
        elevation: 0, // Remove shadow on Android
    },
});
