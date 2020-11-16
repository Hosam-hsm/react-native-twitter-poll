import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { observer } from "mobx-react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BLUE, BORDERCOLOR } from "../../constants";
import { useStore } from "../store";
import BottomSheet from "./BottomSheet";

const PollChoices = ({ setShow }) => {
    const [choices, setChoices] = useState([undefined, undefined])
    const [focused, setFocused] = useState(undefined)
    const bottomSheetRef = useRef()
    const store = useStore()
    const textInputRefs = []

    const onClickAdd = (i) => {
        setChoices(prev => [...prev, undefined])
    }

    const onChangeText = (text, i) => {
        let a = [...choices]
        a[i] = text
        setChoices(a)
    }

    useEffect(() => {
        textInputRefs[0].focus()
    }, [])

    useEffect(() => {
        let c = choices.filter(choice => choice != undefined && choice != "") //to check empty fields
        store.setChoices(c)
    }, [choices])

    return (
        <>
            <View style={styles.mainContainer}>
                <View style={styles.choicesContainer}>
                    {
                        choices.map((choice, i) => {
                            return (
                                <View key={i} style={styles.row}>
                                    <View style={styles.row}>
                                        <TextInput
                                            ref={ref => textInputRefs[i] = ref}
                                            autoFocus={i > 1}
                                            maxLength={25}
                                            onFocus={() => setFocused(i)}
                                            style={[styles.choicePlaceholder, { borderColor: focused == i ? BLUE : BORDERCOLOR }]}
                                            value={choice}
                                            onChangeText={(text) => onChangeText(text, i)}
                                            placeholder={`Choice ${i + 1} ${i > 1 ? '(optional)' : ''}`}
                                        />
                                        <View style={styles.letterCountContainer}>
                                            <Text style={styles.letterCount}>{25 - (choice ? choice.length : 0)}</Text>
                                        </View>
                                    </View>
                                    {
                                        i > 0 && (i == choices.length - 1) && i < 3 && <TouchableOpacity style={styles.plusContainer} onPress={() => onClickAdd(i)}>
                                            <MaterialCommunityIcons name="plus" size={30} color={BLUE} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            )
                        })
                    }
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { bottomSheetRef.current.open() }}
                    style={styles.pollLengthContainer}>
                    <Text style={{ fontWeight: 'bold' }}>Poll length</Text>
                    <Text>{store.getPollLength}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setShow(false)}
                    style={styles.closeButton}>
                    <MaterialCommunityIcons name="close" size={25} color={'#fff'} />
                </TouchableOpacity>
            </View>

            <BottomSheet ref={bottomSheetRef} />
        </>
    )
};
export default observer(PollChoices);

const styles = StyleSheet.create({
    mainContainer: {
        width: '95%',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: BORDERCOLOR
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        padding: 3,
        borderRadius: 50
    },
    choicesContainer: {
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    pollLengthContainer: {
        borderTopWidth: 1,
        borderColor: BORDERCOLOR,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    choicePlaceholder: {
        borderWidth: 1,
        borderColor: BORDERCOLOR,
        width: '90%',
        padding: 10,
        paddingRight: 30,
        borderRadius: 8,
        marginVertical: 8,
    },
    letterCountContainer: {
        position: 'absolute',
        zIndex: 10,
        right: 40
    },
    letterCount: {
        color: 'grey',
        fontSize: 13
    },
    plusContainer: {
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: -5
    },
})