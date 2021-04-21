import axios from 'axios';
import { Camera } from 'expo-camera';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import SheetContent from './SheetContent';
import SheetHeader from './SheetHeader';

const { width, height } = Dimensions.get("window");

export default class Scanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permission: false,
            scanned: false,
            opacity: new Animated.Value(1),
            data: [],
            fetching: false,
            sheetClosed: true
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
    }

    getPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        if (status == "granted") {
            this.setState({ permission: true });
        }
        else {
            this.setState({ permission: false })
        }
    }

    componentDidMount() {
        this.getPermission();
        this.animateCorners();
    }

    _BarCodeScanned = (result) => {
        if (this.state.fetching || !this.state.sheetClosed)
           return;
         this.stopAnimation();
         this.getDetails();
    }

    getDetails = async () => {
        this.setState({ fetching: true })
        try {
            var result = await axios.get("https://randomuser.me/api/?seed=%7Bbarcode-number");
            if (result.data && result.data.results.length > 0) {
                this.setState({ data: result.data.results[0] }, () => {
                    this.bottomSheet.snapTo(2)
                })
            }
            else {
                alert("Can't find the product")
            }
        } catch (error) {
            alert("Error occured")
        }
        this.setState({ fetching: false })

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
                {
                    this.state.permission ?
                        <View>
                            <Camera
                                style={styles.camera}
                                type="back"
                                onBarCodeScanned={this._BarCodeScanned}
                            >
                                <View style={styles.imgContainer}>
                                    <Animated.Image source={require("../assets/corners.png")} style={[styles.img, { opacity, tintColor: this.state.fetching ? "green" : "#fff" }]} />
                                </View>
                            </Camera>
                        </View>
                        :
                        <View style={{ flex: 1, alignItems: 'center', }}>
                            <Text style={{ marginBottom: 10 }}>Please enable Camera Permission to scan QR code</Text>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={this.getPermission}
                            >
                                <Text style={{ color: "#fff" }}>Enable</Text>
                            </TouchableOpacity>
                        </View>

                }

                <BottomSheet
                    ref={component => this.bottomSheet = component}
                    snapPoints={["-80%", "50%", "80%"]}
                    initialSnap={0}
                    onCloseEnd={() => {
                        this.setState({ sheetClosed: true })
                        this.animateCorners();
                    }}
                    onOpenEnd={()=>{
                        this.setState({ sheetClosed: false })
                    }}
                    renderHeader={() => <SheetHeader/> }
                    renderContent={() => <SheetContent data={this.state.data} />}
                    enabledInnerScrolling={false}
                    enabledContentGestureInteraction
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
        height: height * 0.80,
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
    },
    btn: {
        backgroundColor: "#000",
        padding: 10,
        borderRadius: 3
    }
})
