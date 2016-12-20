import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createBackgroundStore} from 'redux-webext';
import initSubscriber from 'redux-subscriber';
import {LOAD_MESSAGES, UPDATE_MESSAGE} from 'shared/redux-consts/messages';
import {UPDATE_SETTINGS} from 'shared/redux-consts/settings';
import reducer from './reducers';
import {updateSettings} from './actions/settings';
import {
    loadMessages,
    updateMessage,
    invalidateMessages
} from './actions/messages';

const middlewares = [thunkMiddleware];
if (__DEV__) {
    const createLogger = require('redux-logger');
    middlewares.push(createLogger({collapsed: true}));
} else {
    const ravenMiddleware = require('./middlewares/raven').default;
    middlewares.push(ravenMiddleware);
}

const store = createStore(
    reducer,
    applyMiddleware(...middlewares)
);

initSubscriber(store);

export default createBackgroundStore({
    store,
    actions: {
        [LOAD_MESSAGES]: loadMessages,
        [UPDATE_MESSAGE]: updateMessage,
        [UPDATE_SETTINGS]: updateSettings
    },
    onDisconnect: invalidateMessages
});
