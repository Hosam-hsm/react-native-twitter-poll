import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
} from "react-native";
import { observer } from "mobx-react";
import { WheelPicker } from "react-native-wheel-picker-android";
import { useStore } from "../store";

const Days = [...Array(8).keys()].map(String)
const Hours = [...Array(24).keys()].map(String)
const Minutes = [...Array(60).keys()].map(String)

const ScrollPicker = ({ closeBottomSheet }) => {
    const store = useStore()
    const [selectedDay, setSelectedDay] = useState(store.pollLength.Days);
    const [selectedHour, setSelectedHour] = useState(store.pollLength.Hours);
    const [selectedMinute, setSelectedMinute] = useState(store.pollLength.Minutes);

    const onDaySelected = selectedItem => {
        setSelectedDay(selectedItem);
    }

    const onHourSelected = selectedItem => {
        setSelectedHour(selectedItem);
    }

    const onMinuteSelected = selectedItem => {
        setSelectedMinute(selectedItem);
    }

    useEffect(() => {
        if (selectedDay == 7) {
            setSelectedHour(0);
            setSelectedMinute(0);
        }
        if (selectedDay == 0 && selectedHour == 0 && selectedMinute <= 4) {
            setSelectedMinute(5)
        }
    }, [selectedDay, selectedHour, selectedMinute])

    return (
        <>
            <Text style={[styles.heading, { fontSize: 16 }]}>Poll length</Text>
            <View style={styles.wheelPickersContainer}>
                <View style={styles.wheelPickerContainer}>
                    <Text style={styles.heading}>Days</Text>
                    <WheelPicker
                        style={{ width: 100, height: 100 }}
                        selectedItem={selectedDay}
                        data={Days}
                        onItemSelected={onDaySelected}
                    />
                </View>
                <View style={styles.wheelPickerContainer}>
                    <Text style={styles.heading}>Hours</Text>
                    <WheelPicker
                        style={{ width: 100, height: 100 }}
                        selectedItem={selectedHour}
                        data={Hours}
                        onItemSelected={onHourSelected}
                    />
                </View>
                <View style={styles.wheelPickerContainer}>
                    <Text style={styles.heading}>Minutes</Text>
                    <WheelPicker
                        style={{ width: 100, height: 100 }}
                        selectedItem={selectedMinute}
                        data={Minutes}
                        onItemSelected={onMinuteSelected}
                    />
                </View>
            </View>

            <Button
                title={'Confirm'}
                onPress={() => {
                    store.setPollLength({
                        "Days": selectedDay,
                        "Hours": selectedHour,
                        "Minutes": selectedMinute
                    })
                    closeBottomSheet();
                }}
            />
        </>
    )
};
export default observer(ScrollPicker);

const styles = StyleSheet.create({
    wheelPickersContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    wheelPickerContainer: {
        marginHorizontal: 8,
        alignItems: 'center'
    },
    heading: {
        fontWeight: 'bold',
        marginBottom: 8
    },
    buttonContainer: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})