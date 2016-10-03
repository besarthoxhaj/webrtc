'use strict';

var uuid;
var localVideo;
var remoteVideo;
var peerConnection;
var localStream;
var serverConnection;
var serverUrl = location.hostname === 'localhost' ? 'wss://' + location.hostname + ':8080' : 'wss://' + location.hostname

function pageReady() {
  uuid = uuid();
  localVideo = document.getElementById('localVideo');
  remoteVideo = document.getElementById('remoteVideo');
  serverConnection = new WebSocket(serverUrl);
  serverConnection.onmessage = gotMessageFromServer;
  var constraints = {
    video:true,
    audio:false
  };
  if(navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler);
  } else {
    alert('Your browser does not support getUserMedia API');
  }
}

function getUserMediaSuccess(stream) {
  localStream = stream;
  localVideo.src = window.URL.createObjectURL(stream);
}

function start(isCaller) {
  peerConnection = new RTCPeerConnection({'iceServers':[{'urls':'stun:stun.l.google.com:19302'}]});
  peerConnection.addEventListener('icecandidate',gotIceCandidate);
  peerConnection.addEventListener('addstream',gotRemoteStream);
  peerConnection.addStream(localStream);
  if(isCaller) {
    peerConnection.createOffer().then(createdDescription).catch(errorHandler);
  }
}

function gotIceCandidate(event) {
  if(event.candidate !== null) {
    serverConnection.send(JSON.stringify({'ice':event.candidate,'uuid':uuid}));
  }
}

function gotRemoteStream(event) {
  console.log('gotRemoteStream');
  remoteVideo.src = window.URL.createObjectURL(event.stream);
}

function createdDescription(description) {
  peerConnection.setLocalDescription(description).then(function() {
    serverConnection.send(JSON.stringify({'sdp':peerConnection.localDescription,'uuid':uuid}));
  }).catch(errorHandler);
}

function gotMessageFromServer(message) {
  var signal = JSON.parse(message.data);
  if(signal.uuid === uuid) return;
  if(peerConnection === undefined) start(false);
  if(signal.sdp) {
    peerConnection.setRemoteDescription(signal.sdp).then(function() {
      if(signal.sdp.type === 'offer') {
        peerConnection.createAnswer().then(createdDescription).catch(errorHandler);
      }
    }).catch(errorHandler);
  } else if(signal.ice) {
    peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
  }
}

function errorHandler(error) {
  console.log(error);
}

function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
