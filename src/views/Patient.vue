<template>
<div class="wrap">
    <Chat :sender="sessionUser" :receiver="nurse" />
</div>
</template>

<script>
import Chat from './../components/Chat';
export default {
    data: () => ({
        sessionUser: {
            _id: "njuhdyudt546e247g72381298h",
            names: "Aldo Barba"
        },
        nurse: {
            _id: "dund87292038ijshegd82",
            names: "Luis Estrada"
        }
    }),
    components: {
        Chat
    }
}
</script>
