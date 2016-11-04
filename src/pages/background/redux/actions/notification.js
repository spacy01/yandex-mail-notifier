import openUrl from 'shared/utils/tab';
import i18n from 'shared/utils/i18n';

const CONSTANTS = {
    SHOW_NEW_NOTIFICATION: 'SHOW_NEW_NOTIFICATION',
    SHOW_UNREAD_NOTIFICATION: 'SHOW_UNREAD_NOTIFICATION',
    SHOW_NOT_AUTH_NOTIFICATION: 'SHOW_NOT_AUTH_NOTIFICATION'
};

const notification = chrome.notifications;
const audio = new Audio('../assets/notification.wav');
const notifications = {};

notification.onClicked.addListener(id => {
    notifications[id]();
    delete notifications[id];
});

function showNotification(data) {
    notification.create({
        type: 'basic',
        iconUrl: '../assets/icon.png',
        title: data.title,
        message: data.subTitle,
        contextMessage: data.message
    }, (id) => {
        notifications[id] = data.onClick;
    });
}

function playSound() {
    audio.play();
}

export function showNewNotification(data) {
    return (dispatch, getState) => {
        const {newMessageNotification} = getState().settings;

        if (newMessageNotification) {
            showNotification({
                title: data.from,
                subTitle: data.subject,
                message: data.message,
                onClick() {
                    openUrl(`#message/${data.id}`);
                }
            });

            if (newMessageNotification === 2) {
                playSound();
            }

            dispatch({type: CONSTANTS.SHOW_NEW_NOTIFICATION});
        }
    }
}

export function showUnreadNotification() {
    return (dispatch, getState) => {
        const {messages, settings} = getState();

        showNotification({
            title: i18n.text('notification.unread.title'),
            subTitle: i18n.text('notification.unread.message', messages.unreadCount),
            onClick: openUrl
        });

        if (settings.unreadMessagesSound) {
            playSound();
        }

        dispatch({type: CONSTANTS.SHOW_UNREAD_NOTIFICATION});
    }
}

export function showNotAuthNotification() {
    return (dispatch, getState) => {
        const {notAuthNotification} = getState().settings;

        if (notAuthNotification) {
            showNotification({
                title: i18n.text('notification.notAuth.title'),
                subTitle: i18n.text('notification.notAuth.message'),
                onClick: openUrl
            });

            if (notAuthNotification === 2) {
                playSound();
            }

            dispatch({type: CONSTANTS.SHOW_NOT_AUTH_NOTIFICATION});
        }
    }
}
