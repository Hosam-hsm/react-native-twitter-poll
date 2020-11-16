import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import _range from 'lodash/range';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStore } from "../store";
import Poll from "./Poll";
import { observer } from "mobx-react";

const Post = ({ post }) => {
    const store = useStore()
    const [postCreatedDisplay, setPostCreatedDisplay] = useState(null);
    const [pollExpiresDisplay, setPollExpiresDisplay] = useState(null);
    const [pollExpired, setPollExpired] = useState(false);
    const postCreated = moment.utc(post.createdAt);
    const pollExpires = postCreated.clone().add(post.duration, 'milliseconds')
    let timer = 0;
    let pollTimer = 0;

    const getVotesData = () => {
        const { votes, choices } = post;
        let userVoted = false;
        let pollVotes = null;
        let totalVotes = 0;
        let votedChoice = null;
        const voteCounts = votes.reduce((stat, vote) => {
            const { choice } = vote;
            stat[choice] ? (stat[choice] += 1) : (stat[choice] = 1);
            return stat;
        }, []);
        const userIndex = votes.findIndex(vote => vote.user === store.user.id);
        if (userIndex >= 0) {
            userVoted = true;
            votedChoice = votes[userIndex].choice;
        }
        pollVotes = _range(0, choices.length).map(choice => ({
            choice: choices[choice],
            count: voteCounts[choice] || 0
        }));
        totalVotes = pollVotes.map(vote => vote.count).reduce((sum, count) => sum + count, 0);
        return { userVoted, pollVotes, totalVotes, votedChoice };
    }
    const getPollLifetimeData = () => {
        const now = moment();
        let data = { pollExpired: false, pollExpiresDisplay: null, expires: null };
        const expiresSec = Math.max(0, pollExpires.diff(now, 's'));
        const diff = Math.max(0, pollExpires.diff(now));
        const dur = moment.duration(diff);
        const pollExpired = pollExpires.isBefore();
        const pollExpiresDisplay = (expiresSec < 60) ? `${expiresSec}s` :
            dur.days() > 0 ? `${dur.days()} d ${dur.hours()} hr` : dur.hours() > 0 ? `${dur.hours()} hr ${dur.minutes()} min` : `${dur.minutes()} min`;

        data = { ...data, pollExpired, pollExpiresDisplay, expires: expiresSec };
        return data;
    }

    const updatePostTimers = () => {
        const now = moment();
        const { expires, pollExpired, pollExpiresDisplay } = getPollLifetimeData();
        pollTimer && (expires === 0) && clearInterval(pollTimer);
        const activatePollTimer = !pollTimer && (expires / 60 <= 2);

        activatePollTimer && setTimeout(() => pollTimer = setInterval(() => {
            const { pollExpired, pollExpiresDisplay } = getPollLifetimeData();
            setPollExpired(pollExpired);
            setPollExpiresDisplay(pollExpiresDisplay);
        }, 1000), Math.max(1, expires - 60) * 1000);

        const showDateInstead = now.diff(postCreated, 'd') >= 2;
        const postCreatedDisplay = showDateInstead
            ? postCreated.format('MMM D')
            : postCreated.fromNow(true)
                .replace('a few seconds', 'just now')
                .replace(/^an?/, '1')
                .replace(/^(\d+) (.).+$/, `$1$2 ago`)
                .replace('1d ago', 'yesterday');

        setPostCreatedDisplay(postCreatedDisplay);
        setPollExpired(pollExpired);
        setPollExpiresDisplay(pollExpiresDisplay);
    }

    const resetTimers = () => {
        timer && clearTimeout(timer);
        pollTimer && clearInterval(pollTimer);
    }

    useEffect(() => {
        updatePostTimers();
        return () => resetTimers();
    }, [])

    useEffect(() => {
        const useHourlyTimer = Math.floor(moment().diff(postCreated) / 1000) > (60 * 60);
        timer = setTimeout(updatePostTimers, (useHourlyTimer ? 60 : 1) * 60 * 1000);
    }, [postCreatedDisplay, pollExpired, pollExpiresDisplay])

    const { userVoted, pollVotes, totalVotes, votedChoice } = getVotesData()
    const EXPIRES_DISPLAY = `${pollExpired ? 'Poll ended' : `${pollExpiresDisplay ? `${pollExpiresDisplay}left` : ''}`}`;

    return (
        <View style={styles.container}>
            <View style={styles.creatorImageContainer}>
                <Image source={{ uri: post.creator.image }} style={styles.creatorImage} />
            </View>

            <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={styles.headerContainer}>
                    <View style={styles.row}>
                        <Text style={styles.creatorName}>{post.creator.name}</Text>
                        <Text style={styles.lightText}> • {postCreatedDisplay}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.horizontalDots}
                        onPress={() => alert('options')}
                    >
                        <MaterialCommunityIcons
                            name="dots-horizontal"
                            size={22}
                            color="grey"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.question}>{post.question}</Text>
                </View>
                <View style={styles.pollOptionsContainer}>
                    <Poll post={post} voted={userVoted} votedChoice={votedChoice} votes={pollVotes} expires={pollExpires} />
                </View>

                <View style={styles.row}>
                    <Text style={styles.lightText}>{totalVotes} votes</Text>
                    <Text style={styles.lightText}> • {EXPIRES_DISPLAY}</Text>
                </View>
            </View>
        </View>
    )
};
export default observer(Post);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 8,
        overflow: 'hidden',
        alignItems: 'flex-start'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    horizontalDots: {
        padding: 3,
    },
    creatorImageContainer: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    creatorImage: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    creatorName: {
        fontWeight: 'bold',
    },
    lightText: {
        color: 'grey',
        fontSize: 12
    },
    contentContainer: {
        marginVertical: 3
    },
    question: {
        lineHeight: 19,
    },
    pollOptionsContainer: {
        paddingVertical: 5,
    }
})