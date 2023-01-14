<template>
 <q-layout view="hHh lpR fFf">
<q-header elevated class="bg-grey-9 text-white">
  <q-toolbar class="flex items-center justify-between" >
    <span>Hello, {{ nameUser }} </span>
    <q-btn @click="handleLogOut" type="button" class="bg-red-7 text-bold" color="red" text-color="white" size="12px" label="Log Out" />
  </q-toolbar>
  <q-toolbar class="flex items-center justify-center" style="gap:10px" >
    <input type="file" ref="fileInput" style="display: none;" @change="handleFileInput"/>
    <q-btn  @click="openFileInput"  type="button" class="bg-orange-7 text-bold" color="red" text-color="white" size="12px" label="SELECT FILE" />
    <q-btn v-if="image"  @click="uploadImage"  type="button" class="bg-green-7 text-bold" color="red" text-color="white" size="12px" label="UPLOAD IMAGE" />
    {{image.name}}
  </q-toolbar>
</q-header>

<q-page-container class="flex justify-center " style="gap:20px; width: 100;">
  <div v-for="image in images" :key=image.uid>
  <q-card dark bordered class="bg-grey-9 my-card" style="margin-top:20px; width: 300px;">
      <q-card-section>
        <img :src=image.imageUrl alt="Mi imagen" style="width:100%; height:200px; object-fit: cover;">
        <div class="text-subtitle2">Uploaded By: {{ image.nameUser }}</div>
        <q-btn @click="handleDeleteImage(image.id)" type="button" class="bg-red-7 text-bold" color="red" text-color="white" size="10px" label="DELETE" />
      </q-card-section>
    </q-card>

  </div>

</q-page-container>
</q-layout>
</template>
<script>
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import db from './../database/firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const storage = getStorage()

export default {
  data () {
    return {
      nameUser: '',
      images: null,
      image: File,
      imgUrl: null
    }
  },
  methods: {
    handleLogOut () {
      const auth = getAuth()
      signOut(auth).then(() => {
        this.$router.push('/')
        console.log(auth)
      }).catch((error) => {
        console.log(error)
      })
    },
    handleFileInput (event) {
      this.image = event.target.files[0]
      console.log(this.image)
    },
    openFileInput () {
      this.$refs.fileInput.click()
    },
    async handleDeleteImage (id) {
      await deleteDoc(doc(db, 'images', id))
    },
    async uploadImage () {
      const storageRef = ref(storage, this.image.name)
      await uploadBytes(storageRef, this.image).then((snapshot) => {
        console.log('Uploaded a blob or file!')
        console.log(snapshot)
      })
      await getDownloadURL(ref(storage, this.image.name))
        .then((url) => {
          try {
            const docRef = addDoc(collection(db, 'images'), {
              imageUrl: url,
              nameUser: this.nameUser

            })
            console.log('Document written with ID: ', docRef.id)
          } catch (e) {
            console.error('Error adding document: ', e)
          }
        })
    }

  },

  mounted () {
    this.image = ''
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const userEmail = user.email
        console.log(userEmail)
        this.nameUser = userEmail

        // ...
      } else {
        // User is signed out
        // ...
      }
    })
    onSnapshot(collection(db, 'images'), (querySnapshot) => {
      const imagesArray = []
      querySnapshot.forEach((doc) => {
        imagesArray.push({ ...doc.data(), id: doc.id })
      })
      this.images = imagesArray
    })
  },
  components: {
  }
}
</script>
<style>
body{
  background-color: #313131;
}
</style>
