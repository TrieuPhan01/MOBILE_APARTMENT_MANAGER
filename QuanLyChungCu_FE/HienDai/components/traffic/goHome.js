import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Alert,
    Linking,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";

const GoHome = () => {
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [location, setLocation] = useState(null);//Vị trí
    const [routeCoordinates, setRouteCoordinates] = useState([]);//Lưu toạ độ tuyến đường
    //Toạ độ điển đến, em lấy 1 vị trí cho nó là vị trí của chung cư
    const [destination, setDestination] = useState({
        latitude: 10.822242,
        longitude: 106.690252,
    });

    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission to access location was denied");
                return;
            }

            // Lấy vị trí hiện tại

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            // Cập nhật tuyến đường từ vị trí hiện tại đến điểm đến
            updateRoute(location.coords.latitude, location.coords.longitude);

            // Theo dõi vị trí thay đổi theo thời gian thực
            const locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000, // Cập nhật mỗi 5 giây
                    distanceInterval: 10, // Cập nhật khi di chuyển 10 mét
                },
                (newLocation) => {
                    setLocation(newLocation);
                    updateRoute(
                        newLocation.coords.latitude,
                        newLocation.coords.longitude
                    );
                }
            );

            // Hủy theo dõi vị trí khi component unmount
            return () => locationSubscription && locationSubscription.remove();
        })();
    }, []);

    // Hàm cập nhật tuyến đường dựa trên vị trí hiện tại
    const updateRoute = async (latitude, longitude) => {
        const origin = `${latitude},${longitude}`;
        const dest = `${destination.latitude},${destination.longitude}`;
        const response = await axios.get(
            `https://rsapi.goong.io/Direction?origin=${origin}&destination=${dest}&vehicle=car&api_key=${apiKey}`
        );

        if (response.data.routes.length) {
            const points = decodePolyline(
                response.data.routes[0].overview_polyline.points
            );
            setRouteCoordinates(points);
        }
    };

    // Hàm giải mã polyline thành tọa độ tuyến đường, t là chuỗi polyline mã hóa
    const decodePolyline = (t) => {
        let points = [];
        let index = 0;
        let lat = 0;
        let lng = 0;

        while (index < t.length) {
            let b,
                shift = 0,
                result = 0;
            do {
                b = t.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            let dlat = result & 1 ? ~(result >> 1) : result >> 1;
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = t.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            let dlng = result & 1 ? ~(result >> 1) : result >> 1;
            lng += dlng;

            points.push({
                latitude: lat / 1e5,
                longitude: lng / 1e5,
            });

        }
        return points;
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
            >
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Vị trí hiện tại"
                        pinColor="blue"
                    />
                )}
                <Marker coordinate={destination} title="Điểm đến" />
                <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#000"
                    strokeWidth={3}
                />
            </MapView>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
                    Linking.openURL(url);
                }}
            >
                <Text style={styles.buttonText}>Xem trên google map</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    button: {
        backgroundColor: "blue",
        padding: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: "white",
    },
});

export default GoHome;
