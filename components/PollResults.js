import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import { observer } from "mobx-react";
import { BLUE } from "../../constants";

const PollResults = props => {
    const { votes = [], votedChoice = null } = props;
    const counts = votes.map(({ count }) => count);
    const totalVotes = counts.reduce((sum, count) => sum + count, 0);

    return <>
        {votes.map(({ choice, count }, index) => {
            const percentage = totalVotes && (count / totalVotes * 100);
            const percentageForDisplay = percentage.toFixed(1).replace(/^(\d+)\.0$/, '$1');

            return (
                <View key={index} style={[styles.container, { backgroundColor: votedChoice == choice.id ? '#ebecf0' : '#fff', }]}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ maxWidth: '80%', fontWeight: 'bold' }}>{choice.choice}</Text>
                        <Text style={{ position: 'absolute', right: 3 }} >{`${percentageForDisplay}%`}</Text>
                    </View>
                    <View style={{
                        width: `${percentageForDisplay}%`,
                        backgroundColor: BLUE,
                        height: percentageForDisplay != 0 ? 5 : 0,
                    }} />
                </View>
            )
        })}
    </>
}

export default observer(PollResults);

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        padding: 5,
        marginVertical: 5,
    }
})