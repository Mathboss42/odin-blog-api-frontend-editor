<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useEditorStore } from '../stores/editor';

const store = useEditorStore();

let posts = ref();

onMounted(async () => {
    console.log(store.isLoggedIn)
    try {
        const data = await axios.post('http://localhost:8092/api/posts/all', {}, { 
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        })
        // .then(function (response) {
        //     if (!response.ok) {
        //         throw new Error("Not 2xx response", {cause: response});
        //     } else {
        //         return response;
        //     }
        // }).catch(function(err) {
        //     console.log(err);
        // });
        const result = data.data.posts;
        posts.value = result;  
        console.log(posts.value);
    } catch (err) {
        console.log(err);
        posts.value = 'posts couldnt be fetched';
    }
});



</script>

<template>
    <main>
        <h1>Blog Editor - Admin Interface</h1>
        <ul>
            <li v-for="post in posts" :key="post._id">
                <RouterLink :to="{ name: 'post', params: { id: post._id }}"><h2>{{ post.title }}</h2></RouterLink>
                <p>- By {{ post.author.username }}</p>
            </li>
        </ul>
    </main>
</template>
