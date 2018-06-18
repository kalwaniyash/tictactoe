import * as firebase from 'firebase';
 
    firebase.initializeApp({
        apiKey: "AIzaSyChMWK_08At7Phf7fom-od3ImZZOr-dD20",
        authDomain: "tictactoeå-d4dc5.firebaseapp.com",
        databaseURL: "https://tictactoe-d4dc5.firebaseio.com",
    });

export const database = firebase.database().ref();

export default firebase;