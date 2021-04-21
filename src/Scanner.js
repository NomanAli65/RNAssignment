import axios from 'axios';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, Animated, Easing, Image } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import SheetContent from './SheetContent';

const { width, height } = Dimensions.get("window");

export default class Scanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permission: false,
            detailsModal: false,
            opacity: new Animated.Value(1),
            data: []
        };
    }

    animateCorners = () => {
        Animated.sequence([
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: false,
            }),
            Animated.delay(500),
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false
            })
        ]).start((data) => {
            if (data.finished)
                this.animateCorners();
        });
    }

    stopAnimation = () => {
        this.state.opacity.setValue(1);
        this.state.opacity.stopAnimation();
        this.setState({ detailsModal: true });
    }

    async componentDidMount() {
        const { status } = await Camera.requestPermissionsAsync();
        if (status == "granted") {
            this.setState({ permission: true });
        }
        else {
            this.setState({ permission: false })
        }
        this.animateCorners();
    }

    getDetails = async () => {
        try {
            var result = await axios.get("https://randomuser.me/api/?seed=%7Bbarcode-number");
            if (result.data && result.data.results.length > 0) {
                this.setState({ data: result.data.results[0] })
            }
            else {
                alert("Can't find the product")
            }
        } catch (error) {
            alert("Error occured")
        }

    }




    render() {
        var { opacity } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.head}>
                    <Text style={styles.heading}>
                        Scan QR code
                </Text>
                </View>
                <View>
                    {
                        this.state.permission ?
                            <Camera
                                style={styles.camera}
                                type="back"
                                onBarCodeScanned={(result) => {
                                    this.stopAnimation();
                                }}
                            >
                                <View style={styles.imgContainer}>
                                    <Animated.Image source={require("../assets/corners.png")} style={[styles.img, { opacity, tintColor: this.state.detailsModal ? "green" : "#fff" }]} />
                                </View>
                            </Camera> :
                            <Text>Please enable camera permission to scan qr code</Text>
                    }
                </View>
                <BottomSheet
                    snapPoints={["80%", "50%", 100]}
                    renderContent={()=><SheetContent data={this.state.data}/>}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    head: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    camera: {
        width: width,
        height: height * 0.90,
        backgroundColor: "red",
        borderRadius: 100
    },
    imgContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    img: {
        flex: 1,
        width: "90%",
        resizeMode: "contain",
    },
    details: {
        padding: 5,
    }
})
