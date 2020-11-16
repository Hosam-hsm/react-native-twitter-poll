import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Create from './screens/Create';
import Store, { StoreProvider } from './store';
import { observer } from 'mobx-react';
import Button from './components/HeaderRightButton';

const store = new Store()
const Stack = createStackNavigator();

function TwitterPollNavigator() {
    return (
        <StoreProvider store={store}>
            <Stack.Navigator>
                <Stack.Screen
                    name="TwitterPollHome"
                    options={{
                        title: 'Feed',
                    }}
                    component={Home} />
                <Stack.Screen
                    name="TwitterPollCreate"
                    options={{
                        title: '',
                        headerRight: () => <Button />
                    }}
                    component={Create} />
            </Stack.Navigator>
        </StoreProvider>
    );
}

export default observer(TwitterPollNavigator);