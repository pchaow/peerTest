<template>
  <div>
    <input type="text" v-model="peerId"/>
    <h1>Client</h1>

    <input type="text" v-model="callId"/>
    <button @click="call2">Call2</button>

    <button @click="call">Call</button>
    <br/>

    <video ref="video" style="max-height: 300px; max-width: 400px;"></video>
  </div>
</template>

<script lang="ts">
import Peer from "peerjs";

export const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, {enabled: false});
};

export const createEmptyVideoTrack = ({width, height}) => {
  const canvas = Object.assign(document.createElement('canvas'), {width, height});
  canvas.getContext('2d').fillRect(0, 0, width, height);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, {enabled: false});
};


export default {
  name: "Client",
  data: () => ({
    peer: {} as Peer,
    peerId: '2',
    callId: '1',
  }),
  mounted() {



  },
  methods: {
    call2: function () {
      this.peer = new Peer(this.peerId, {
        host: "10.240.21.70",
        port: "9000",
        path: "myapp",
        // secure:false
      })

      let conn = this.peer.connect(this.callId)
      console.log(conn)
      conn.on('open', function () {
        conn.send('hi')
      })
    },
    call: async function () {

      let audioTrack = createEmptyAudioTrack();
      let videoTrack = createEmptyVideoTrack({width: 640, height: 480});
      //let stream = await navigator.mediaDevices.getDisplayMedia({video: true})
      let stream = new MediaStream([audioTrack,videoTrack])

      console.log('client stream', stream)

      let call = this.peer.call(this.callId, stream);
      if (!call) {
        alert('call is undefined')
      } else {
        console.log("Client Call", call)
        call.on('stream', (remoteStream) => {
          console.log("Client Remote Stream", remoteStream)
          let video = this.$refs['video'] as HTMLVideoElement
          video.srcObject = remoteStream
          video.play()

        })
      }

    }
  }
}
</script>

<style scoped>

</style>