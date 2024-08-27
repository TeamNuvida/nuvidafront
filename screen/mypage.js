import React, { useState, useEffect, useCallback  } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {Image, StyleSheet, Text, View, ScrollView, TouchableOpacity} from "react-native";
import {createStackNavigator} from '@react-navigation/stack';
import {FontAwesome, Entypo, Ionicons, Feather, AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const Mypage = ({route}) => {
    const navigation = useNavigation();

    // 로그인 정보
    const [userInfo, setUserInfo] = useState(route.params.userInfo);

    useFocusEffect(
        useCallback(() => {
            if (route.params?.userInfo) {
                setUserInfo(route.params.userInfo);
            }

            return () => {
                // Cleanup 함수: 이 페이지를 떠날 때 실행됩니다.
            };
        }, [route.params?.userInfo]) // 의존성으로 route.params.userInfo를 추가하여, 값이 변경될 때마다 렌더링
    );



    // 상단 바 컴포넌트
    const topHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.flexRow}>
                    <View style={{flex: 1}}></View>
                    <Text style={styles.headerText}>NUVIDA</Text>
                    <View style={styles.headerIconContainer}>
                        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('BaseballSchedule')}>
                            <AntDesign name="calendar" size={24} color="black"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon} onPress={()=> console.log("알림")}>
                            <MaterialCommunityIcons name="bell-plus" size={24} color="black"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
// 하단 바 컴포넌트
    const bottomHeader = () => {
        return (
            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabItem}>
                    <Entypo name="home" size={24} color="black"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <FontAwesome name="calendar-check-o" size={24} color="black"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <FontAwesome name="calendar-check-o" size={24} color="black"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="chatbubbles-outline" size={24} color="black"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Feather name="user" size={24} color="black"/>
                </TouchableOpacity>
            </View>
        );
    };

    const logOut = async () => {
        try {
            console.log("로그아웃");
            await AsyncStorage.removeItem('userInfo'); // AsyncStorage에서 사용자 정보 제거
            AsyncStorage.clear();
            setUserInfo(null); // 로컬 상태에서도 userInfo를 제거
            navigation.navigate("Main"); // 로그아웃 후 메인 화면으로 이동
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    }




    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {topHeader()}
                {userInfo?(
                    <TouchableOpacity style={styles.profileContainer} onPress={()=>navigation.navigate("Userprofile", {userInfo:userInfo})}>
                        {userInfo.profile_img?(
                                <Image
                                    style={styles.profileIcon}
                                    resizeMode="cover"
                                    source={{ uri: userInfo.profile_img }}
                                />
                            ):
                            (
                                <Image
                                    style={styles.profileIcon}
                                    resizeMode="cover"
                                    source={require("../assets/profile.png")}
                                />
                            )}


                        <View style={styles.profileTextContainer}>
                            <Text style={styles.profileText}>{userInfo.user_nick} ></Text>
                            <Text style={styles.pointsText}>{userInfo.user_point}P</Text>
                        </View>
                    </TouchableOpacity>
                ):(
                    <Text>login해주세요</Text>
                )}
                
                
                
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Betting", {userInfo:userInfo})}>
                        <Image
                            style={styles.menuIcon}
                            resizeMode="cover"
                            source={require("../assets/ellipse-7.png")}
                        />
                        <Text style={styles.menuText}>배팅 목록</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("MypostList", {userInfo:userInfo})}>
                        <Image
                            style={styles.menuIcon}
                            resizeMode="cover"
                            source={require("../assets/ellipse-7.png")}
                        />
                        <Text style={styles.menuText}>내가 쓴글</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate("FavoriteList", {userInfo:userInfo})}>
                        <Image
                            style={styles.menuIcon}
                            resizeMode="cover"
                            source={require("../assets/ellipse-7.png")}
                        />
                        <Text style={styles.menuText}>관심 페이지</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate("TravelLog", {userInfo:userInfo})}>
                        <Image
                            style={styles.menuIcon}
                            resizeMode="cover"
                            source={require("../assets/ellipse-7.png")}
                        />
                        <Text style={styles.menuText}>여행 기록</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate("FriendList", {userInfo:userInfo})}>
                        <Image
                            style={styles.menuIcon}
                            resizeMode="cover"
                            source={require("../assets/ellipse-7.png")}
                        />
                        <Text style={styles.menuText}>친구관리</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.logoutContainer} onPress={()=>logOut()}>
                <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
            {bottomHeader()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },

    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    profileTextContainer: {
        flex: 1,
    },
    profileText: {
        fontSize: 18,
        fontWeight: '500',
    },
    pointsText: {
        fontSize: 14,
        color: 'grey',
    },
    menuContainer: {
        flexGrow: 1,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    menuIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    menuText: {
        fontSize: 16,
    },
    logoutContainer: {
        marginBottom: 20,
        padding: 16,
    },
    logoutText: {
        fontSize: 16,
        textAlign: 'center',
    },
    /* 하단바 */
    tabBar: {
        height: 50,
        flexDirection: 'row',
        borderTopColor: '#ccc',
        borderTopWidth: 1,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    /* 상단바 */
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 20,
        marginBottom: 10,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
        flex: 2,
    },
    headerIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    headerIcon: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginRight: 5,
    },

});

export default Mypage;
