<template>
<div class="card">
    <div class="bubbleWrapper" v-for="(msg, i) in messagges" :key="i">
        <div class="inlineContainer" :class="msg.senderId == sender._id ? 'own' : 'other'">
            <div :class="msg.senderId == sender._id ? 'ownBubble own' : 'otherBubble other'">
                {{ msg.msg }}
            </div>
        </div>
        <div class="info" :class="msg.senderId == sender._id ? 'own' : 'other'">
            <p class="date">{{ getFormattedDate(msg.time, 'LT') }}</p>
            <p class="status" v-if="msg.senderId == sender._id">
                <span v-if="msg.sended">√</span>
                <span v-if="msg.readed">√</span>
            </p>
        </div>
    </div>
    <div class="sender">
        <input type="text" placeholder="Write yor message here" v-model="message"/>
        <button type="button" @click="sendMessage">Send!</button>
    </div>
</div>
</template>

<script>
    import { Client } from '@stomp/stompjs';
    import moment from 'moment';
    export default {
        props: ['sender', 'receiver'],
        data: () => ({
            amqp : {
                client : null,
                subscription : null
            },
            watchQueue: "",
            writeQueue: "",

            message: "",
            messagges: [
                { id: "7832e8ghah", msg: "Hello there!", senderId: "njuhdyudt546e247g72381298h", receiverId: "dund87292038ijshegd82", time: "2021-09-22 09:30:00.000Z", sended: true, readed: true },
                { id: "js374gu3032", msg: "Hey man!", senderId: "dund87292038ijshegd82", receiverId: "njuhdyudt546e247g72381298h", time: "2021-09-22 09:31:00.000Z", sended: true, readed: true }
            ]
        }),
        created(){
            this.watchQueue = this.sender._id;
            this.writeQueue = this.receiver._id;
            this.initClientStomp();
        },
        methods: {
            initClientStomp(){
				this.amqp.client = new Client();
				this.amqp.client.brokerURL = 'ws://localhost:15674/ws';
				this.amqp.client.onConnect = this.onConnect;
                this.amqp.client.onError = console.error;
                this.amqp.client.activate();
            },
            onConnect() {
				console.log('subscribing to message queue', this.watchQueue);
				this.amqp.subscription = this.amqp.client.subscribe(this.watchQueue, this.getEvent);
            },
            getEvent(event) {
                const content = JSON.parse(event.body.toString())
                if( content.type == 'msg' ){
                    this.receiveMessage( content.payload );
                    this.sendReadToSender( content.payload.id )
                }
                else if( content.type == 'read' ){
                    this.setReadToMsg( content.payload )
                }
				event.ack();
            },
            receiveMessage( msg ){
                this.messagges.push( msg );
            },
            sendReadToSender( msgId ){
                const payload = { type: 'read', payload: msgId };
                this.amqp.client.publish({ destination: this.writeQueue, body: JSON.stringify(payload) });
            },
            setReadToMsg( msgId ){
                this.messagges = this.messagges.map( msg => {
                    if( msg.id == msgId )
                        msg.readed = true;
                    return msg
                });
            },
            sendMessage(){
                if( this.message == "" ) return;
                const payload = { 
                    type: 'msg', 
                    payload: { 
                        id: this.getRandomString(), 
                        msg: this.message, 
                        senderId: this.sender._id, 
                        receiverId: this.receiver._id, 
                        time: moment().utc().toDate(), 
                        sended: true, 
                        readed: false
                    } 
                };
                this.amqp.client.publish({ destination: this.writeQueue, body: JSON.stringify(payload) });
                this.messagges.push(payload.payload);
                this.message = "";
            },
            getFormattedDate(date, format){
                return moment(date).format(format)
            },
            getRandomString(){
                return Math.random().toString(36).replace('0.', '')
            }

        }
    }
</script>

<style scoped>
    .card{
        width: 500px;
        margin: auto;
        background: white;
        overflow: auto;
        border-radius: 8px;
        box-shadow: 0 0 25px rgb(0 0 0 / 5%);
    }
    .sender{
        padding: 10px;
        position: relative;
        border-top: 1px solid #eee
    }
    .sender input{
        color: #333;
        font-size: 1rem;
        padding: .5rem .5rem;
        border-radius: 0.2rem;
        background-color: rgb(255, 255, 255);
        border: 0.1rem solid #ddd;
        transition: all 0.3s;
        width: 70%;
    }
    .sender button{
        font-size: 1rem;
        padding: .5rem 1rem;
        border: none;
        background-color: #6C8EA4;
        color: white;
        border: 0.1rem solid #6C8EA4;
        width: 20%;
        margin-left: 10px;
    }
    .bubbleWrapper {
        padding: 10px 10px;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        align-self: flex-end;
        color: #fff;
    }
    .info.own{
        display: flex;
        margin-right: 8px;
    }
    .bubbleWrapper .status{
        font-size: 1rem;
        color: #444;
        margin: 0;
        margin-left: 8px;
    }
    p.date{
        color: #444;
        font-size: 1rem;
        margin: 0;
        margin-left: 5px;
    }
    .bubbleWrapper .status.own{
        float: right;
        margin-right: 8px;
    }
    .inlineContainer {
        display: inline-flex;
    }
    .inlineContainer.own {
        flex-direction: row-reverse;
    }
    .inlineIcon {
        width:20px;
        object-fit: contain;
    }
    .ownBubble {
        min-width: 60px;
        max-width: 700px;
        padding: 14px 18px;
        margin: 6px 8px;
        background-color: #5b5377;
        border-radius: 16px 16px 0 16px;
        border: 1px solid #443f56;
    
    }
    .otherBubble {
        min-width: 60px;
        max-width: 700px;
        padding: 14px 18px;
        margin: 6px 8px;
        background-color: #6C8EA4;
        border-radius: 16px 16px 16px 0;
        border: 1px solid #54788e;
    
    }
    .own {
        align-self: flex-end;
    }
    .other {
        align-self: flex-start;
    }
    span.own,
    span.other{
        font-size: 14px;
        color: grey;
    }
</style>