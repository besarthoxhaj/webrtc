/**
 *
 *
 *
 */
'use strict';

var uuid;
var localVideo;
var remoteVideo;
var peerConnection;
var localStream;
var serverConnection;
var isLocal = location.hostname === 'localhost';
var serverUrl = 'wss://' + location.hostname + (isLocal ? ':8080' : '');

/**
 *
 *
 *
 */
async function onPageReady() {

  uuid = uuid();
  localVideo = document.getElementById('localVideo');
  remoteVideo = document.getElementById('remoteVideo');
  serverConnection = new WebSocket(serverUrl);
  serverConnection.onmessage = gotMessageFromServer;

  if (!navigator.mediaDevices.getUserMedia) return;
  var constraints = {video: true, audio: false};
  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  localVideo.srcObject = localStream;
}

/**
 *
 *
 *
 */
async function onStart(isCaller) {

  var config = {'iceServers':[{'urls':'stun:stun.l.google.com:19302'}]};
  peerConnection = new RTCPeerConnection(config);
  peerConnection.addEventListener('icecandidate', gotIceCandidate);
  peerConnection.addEventListener('addstream', gotRemoteStream);
  peerConnection.addStream(localStream);

  if (!isCaller) return;
  await pause(2000, `Wait 2s before 'createOffer'`);
  var currOffer = await peerConnection.createOffer();
  await pause(2000, `Wait 2s before 'setLocalDescription'`);
  await peerConnection.setLocalDescription(currOffer);
  await pause(2000, `Wait 2s before 'setLocalDescription'`);
  var message = {sdp: peerConnection.localDescription, uuid};
  serverConnection.send(JSON.stringify(message));

  /**
   *
   *
   *
   */
  function gotIceCandidate(evt) {
    console.log('gotIceCandidate', evt);
    var message = {ice: evt.candidate, uuid};
    if (evt.candidate) serverConnection.send(JSON.stringify(message));
  }

  /**
   *
   *
   *
   */
  function gotRemoteStream(evt) {
    console.log('gotRemoteStream', evt);
    remoteVideo.srcObject = evt.stream;
  }
}

/**
 *
 *
 *
 */
function createdDescription(description) {
  peerConnection.setLocalDescription(description).then(function() {
    var message = {'sdp': peerConnection.localDescription, 'uuid': uuid};
    serverConnection.send(JSON.stringify(message));
  }).catch(errorHandler);
}

/**
 *
 *
 *
 */
function gotMessageFromServer(message) {

  var signal = JSON.parse(message.data);

  var isFromMe = signal.uuid === uuid;
  if (isFromMe) return;

  debugger;
  if (peerConnection === undefined) onStart(false);
  if (signal.sdp) {
    peerConnection.setRemoteDescription(signal.sdp).then(function() {
      if(signal.sdp.type === 'offer') {
        peerConnection.createAnswer().then(createdDescription).catch(errorHandler);
      }
    }).catch(errorHandler);
  } else if (signal.ice) {
    peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
  }
}

/**
 *
 *
 *
 */
function errorHandler(error) {
  console.log('Error:', error);
}

/**
 *
 *
 *
 */
function uuid() {
  var s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 *
 *
 *
 */
async function pause(time, message) {
  return new Promise(ok => {
    if (message) console.log(message);
    setTimeout(ok, time);
  });
}