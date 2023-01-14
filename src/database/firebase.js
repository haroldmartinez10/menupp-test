import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyD0UYVMj9pLVMT9Owphc9R7bQIKA91HDbY',
  authDomain: 'test-menuppteam.firebaseapp.com',
  databaseURL: 'https://test-menuppteam-default-rtdb.firebaseio.com',
  projectId: 'test-menuppteam',
  storageBucket: 'test-menuppteam.appspot.com',
  messagingSenderId: '656242910181',
  appId: '1:656242910181:web:37c101fa2fe75735bd850c'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
export default db
