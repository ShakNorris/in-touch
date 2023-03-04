// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";
import "firebase/compat/storage";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4A3BVfWaWFhr6zRFZpi-DARcgq6or69c",
  authDomain: "intouch-449fc.firebaseapp.com",
  projectId: "intouch-449fc",
  storageBucket: "intouch-449fc.appspot.com",
  messagingSenderId: "19310731325",
  appId: "1:19310731325:web:4e63ddf773c37a36974a54"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig): getApp();
// const firestore = firebase.firestore();
// const functions = firebase.functions();
// const analytics = firebase.analytics();
// const auth = firebase.auth();
// const storage = firebase.storage();
const db = getFirestore();
const storage = getStorage();


export {app, db, storage};