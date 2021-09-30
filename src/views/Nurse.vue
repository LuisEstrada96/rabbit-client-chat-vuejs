<template>
<div class="wrap">
    <Chat :sender="sessionUser" :receiver="patient" />
</div>
</template>

<script>
import Chat from './../components/Chat';
export default {
    data: () => ({
        sessionUser: {
            _id: "dund87292038ijshegd82",
            names: "Luis Estrada"
        },
        patient: {
            _id: "njuhdyudt546e247g72381298h",
            names: "Aldo Barba"
        }
    }),
    components: {
        Chat
    }
}
</script>

<style>
    *{
        font-family: 'Roboto', sans-serif;
    }
    body{
        margin:0;
    }
    .wrap{
        width: 100vw;
        height: 100vh;
        background: #eee;
        display: flex;
        align-items: center;
    }
</style>