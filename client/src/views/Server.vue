<template>
  <div>
    <h1>Server</h1>
    <button @click="startServer">Start</button> <br/>
    <video ref="video" style="max-height: 300px; max-width: 400px;"></video>

  </div>

</template>

<script lang="ts">
import Peer from 'peerjs'

export default {
  name: "Server",
  data: () => ({
    peer: {} as Peer,
    peerId: '1'
  }),
  async mounted() {
    this.peer = new Peer(this.peerId, {
      host: "10.240.21.70",
      port: "9000",
      path: "myapp",
      // secure:true,
    })

    this.peer.on('connection',function(conn){
      conn.on('data',function(data){
        console.log(data)
      })
    })
  }, methods: {
    startServer: async function () {


      let stream = await navigator.mediaDevices.getDisplayMedia({video: true})

      this.peer.on('call', (call) => {
        console.log("Server Call",call)
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          console.log('server remote Stream',remoteStream)
          // let video = this.$refs['video'] as HTMLVideoElement
          // video.srcObject = remoteStream
          // video.play()
        });

      })
      console.log('server started',this.peer)

    }
  }
}
</script>

<style scoped>

</style>