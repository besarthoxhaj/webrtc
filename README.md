WebRTC Example
==============

## General

[Signaling protocol vs Transport protocol](https://www.quora.com/What-is-the-difference-between-XMPP-and-BOSH)

[Tsahi Levent-Levi](https://www.quora.com/profile/Tsahi-Levent-Levi)
[webrtchacks](https://webrtchacks.com/)

[About ICE candidates](http://stackoverflow.com/questions/21069983/what-are-ice-candidates-and-how-do-the-peer-connection-choose-between-them)

> the answer from @Ichigo is correct, but it is a little bit bigger. Every ICE contains 'a node' of your network, until it has reached the outside. By this you send these ICE's to the other peer, so they know through what connection points they can reach you. See it as a large building: one is in the building, and needs to tell the other (who is not familiar) how to walk through it. Same here, if I have a lot of network devices, the incoming connection somehow needs to find the right way to my computer. By providing all nodes, the RTC connection finds the shortest route itself. So when you would connect to the computer next to you, which is connected to the same router/switch/whatever, it uses all ICE's and determine the shortest, and that is directly through that point. That your collegue got less ICE candidates has to do with the amount of devices it has to go through. Please note that every network adapter inside your computer which has an IP address (I have a vEthernet switch from hyper-v) it also creates an ICE for it.

## Resources

http://www.slideshare.net/Audiocod/nat-traversal-in-webrtc-context
About SDP and SIP:
- [Understanding session description protocol](https://andrewjprokop.wordpress.com/2013/09/30/understanding-session-description-protocol-sdp/)
> It’s impossible to truly understand SIP without understanding its cousin, Session Description Protocol (SDP).  While SIP deals with establishing, modifying, and tearing down sessions, SDP is solely concerned with the media within those sessions.

- [SIP introduction](http://www.siptutorial.net/SIP/)
> But it should be noted that the job of SIP is limited to only the setup and control of sessions. The details of the data exchange within a session e.g. the encoding or codec related to an audio/video media is not controlled by SIP and is taken care of by other protocols.


## ICE

http://www.slideshare.net/saghul/ice-4414037
https://www.vocal.com/networking/ice-interactive-connectivity-establishment/

> After obtaining the host candidate from its local IP address UA1 sends a STUN binding request to get a reflexive candidate (messages 1 to 4). The NAT creates a binding for the request that becomes the server reflexive candidate for RTP. Using the server reflexive candidate UA1 sends an offer message to UA2 (message 5). UA2 proceeds to obtain a server reflexive candidate (messages 6 and 7), which is identical to its host candidate because it is not behind a NAT. The redundant candidate is discarded leaving only the host candidate. Since UA1 started the communication it is deemed as controlling and UA2 is made controlled. UA2 tries a connectivity check but since it is controlled it does not have the proper attributes to reach UA1 through the NAT so the request is dropped (message 9). UA1 being the controlling party has the attribute to traverse the NAT device with its aggressive nomination STUN connectivity check (messages 10 to 13). After receiving the STUN binding request with aggressive nomination UA2 does a matching check using the attribute from UA1’s STUN binding request to verify the connection (messages 14 to 16). At this point both UAs have verified that the connection is valid and it has been nominated for use for this media stream. Both UAs can now send media through this connection.

![connection](https://www.vocal.com/wp-content/uploads/2012/05/ice_fig8.gif)


ICE can be and often is slow. That's why [Trickle ICE](https://webrtchacks.com/trickle-ice/) appeared.

## TURN

https://www.viagenie.ca/publications/2008-08-cluecon-stun-turn-ice.pdf

## References

- Interactive Connectivity Establishment (ICE)
- Network Address Translation (NAT)
- Real-time Transport Protocol (RTP)
- RTP Control Protocol (RTCP)
- Secure Real-time Transport Protocol (SRTP)
- Real Time Streaming Protocol (RTSP)
- Session Initiation Protocol (SIP)
- Session Description Protocol (SDP)
- Internet Engineering Task Force (IETF)
- World Wide Web Consortium (W3C)
- Datagram Transport Layer Security (DTLS)
- [Rendezvous protocol](https://en.wikipedia.org/wiki/Rendezvous_protocol)
- [Hole punching](https://en.wikipedia.org/wiki/Hole_punching_(networking))
- Internet service provider (ISP)
- Internet Control Message Protocol (ICMP)
- Time to live (TTL)
- Regional Internet Registry (RIR)
- Extensible Messaging and Presence Protocol (XMPP)
- XML (Extensible Markup Language)

## WebRTC in specs

APIs by W3C and protocols by IETF.

Coders:
 - Voice with [Opus and G.711](https://bloggeek.me/single-voice-codec-webrtc/)
 - Video with [VP8](https://en.wikipedia.org/wiki/VP8)

## Example

Both parties exchange an [SDP](https://tools.ietf.org/html/rfc4566), through a signaling protocol server (in our case WebSockets).

```sh
v=0
o=- 428730711918769885 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE audio video
a=msid-semantic: WMS vs7GtwbJ4tee2fW25iGKS95JZnlVnhZoOpbU
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126
c=IN IP4 0.0.0.0
a=rtcp:9 IN IP4 0.0.0.0
a=ice-ufrag:AkCJ
a=ice-pwd:txShLKsZa1NJNLRGX/g7eirG
a=fingerprint:sha-256 29:58:C5:54:E1:3C:00:00:7D:4C:EB:0D:1D:54:F4:4D:63:B2:BC:FB:EE:6A:64:A2:95:75:B0:C5:24:8F:ED:9F
a=setup:actpass
a=mid:audio
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=sendrecv
a=rtcp-mux
a=rtpmap:111 opus/48000/2
# a=rtpmap:<payload type> <encoding name>/<clock rate> [/<encoding parameters>]
a=rtcp-fb:111 transport-cc
a=fmtp:111 minptime=10;useinbandfec=1
a=rtpmap:103 ISAC/16000
a=rtpmap:104 ISAC/32000
a=rtpmap:9 G722/8000
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:106 CN/32000
a=rtpmap:105 CN/16000
a=rtpmap:13 CN/8000
a=rtpmap:126 telephone-event/8000
a=ssrc:2707352746 cname:OY07h4y8urIMeg7q
a=ssrc:2707352746 msid:vs7GtwbJ4tee2fW25iGKS95JZnlVnhZoOpbU af4f2dec-20f6-4b3b-ba50-60e078ad4cd5
a=ssrc:2707352746 mslabel:vs7GtwbJ4tee2fW25iGKS95JZnlVnhZoOpbU
a=ssrc:2707352746 label:af4f2dec-20f6-4b3b-ba50-60e078ad4cd5
m=video 9 UDP/TLS/RTP/SAVPF 100 101 107 116 117 96 97 99 98
c=IN IP4 0.0.0.0
a=rtcp:9 IN IP4 0.0.0.0
a=ice-ufrag:AkCJ
a=ice-pwd:txShLKsZa1NJNLRGX/g7eirG
a=fingerprint:sha-256 29:58:C5:54:E1:3C:00:00:7D:4C:EB:0D:1D:54:F4:4D:63:B2:BC:FB:EE:6A:64:A2:95:75:B0:C5:24:8F:ED:9F
a=setup:actpass
a=mid:video
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:4 urn:3gpp:video-orientation
a=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
a=sendrecv
a=rtcp-mux
a=rtcp-rsize
a=rtpmap:100 VP8/90000
a=rtcp-fb:100 ccm fir
a=rtcp-fb:100 nack
a=rtcp-fb:100 nack pli
a=rtcp-fb:100 goog-remb
a=rtcp-fb:100 transport-cc
a=rtpmap:101 VP9/90000
a=rtcp-fb:101 ccm fir
a=rtcp-fb:101 nack
a=rtcp-fb:101 nack pli
a=rtcp-fb:101 goog-remb
a=rtcp-fb:101 transport-cc
a=rtpmap:107 H264/90000
a=rtcp-fb:107 ccm fir
a=rtcp-fb:107 nack
a=rtcp-fb:107 nack pli
a=rtcp-fb:107 goog-remb
a=rtcp-fb:107 transport-cc
a=fmtp:107 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f
a=rtpmap:116 red/90000
a=rtpmap:117 ulpfec/90000
a=rtpmap:96 rtx/90000
a=fmtp:96 apt=100
a=rtpmap:97 rtx/90000
a=fmtp:97 apt=101
a=rtpmap:99 rtx/90000
a=fmtp:99 apt=107
a=rtpmap:98 rtx/90000
a=fmtp:98 apt=116
a=ssrc-group:FID 2331814644 2766163405
a=ssrc:2331814644 cname:OY07h4y8urIMeg7q
a=ssrc:2331814644 msid:vs7GtwbJ4tee2fW25iGKS95JZnlVnhZoOpbU 58b9a71a-2233-4bf2-a8f6-31c326caa92f
a=ssrc:2331814644 mslabel:vs7GtwbJ4tee2fW25iGKS95JZnlVnhZoOpbU
a=ssrc:2331814644 label:58b9a71a-2233-4bf2-a8f6-31c326caa92f
a=ssrc:2766163405 cname:OY07h4y8urIMeg7q
a=ssrc:2766163405 msid:vs7GtwbJ4tee2fW25iGKS95JZnlVnhZoOpbU 58b9a71a-2233-4bf2-a8f6-31c326caa92f
a=ssrc:2766163405 mslabel:vs7GtwbJ4tee2fW25iGKS95JZnlVnhZoOpbU
a=ssrc:2766163405 label:58b9a71a-2233-4bf2-a8f6-31c326caa92f
```

And next the answer:

```sh
v=0
o=- 6766648292107072146 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE audio video
a=msid-semantic: WMS gGuJ5M7fD6ADXEArSOKtZmVlwAhd6kgyGxk0
m=audio 53302 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126
c=IN IP4 10.40.238.160
a=rtcp:9 IN IP4 0.0.0.0
a=candidate:1392148495 1 udp 2122260223 10.40.238.160 53302 typ host generation 0 network-id 1 network-cost 10
a=ice-ufrag:SsVg
a=ice-pwd:lSJ4H4d5y0Mr7SxD//fqluud
a=fingerprint:sha-256 85:09:85:2B:CE:75:27:DB:44:C6:FE:A8:0A:35:9E:2B:B9:73:D4:34:30:B0:E4:C0:0A:D1:1A:12:50:5E:D4:BA
a=setup:active
a=mid:audio
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=sendrecv
a=rtcp-mux
a=rtpmap:111 opus/48000/2
a=rtcp-fb:111 transport-cc
a=fmtp:111 minptime=10;useinbandfec=1
a=rtpmap:103 ISAC/16000
a=rtpmap:104 ISAC/32000
a=rtpmap:9 G722/8000
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:106 CN/32000
a=rtpmap:105 CN/16000
a=rtpmap:13 CN/8000
a=rtpmap:126 telephone-event/8000
a=ssrc:2787008628 cname:PuKkfCq8H35ewXeK
a=ssrc:2787008628 msid:gGuJ5M7fD6ADXEArSOKtZmVlwAhd6kgyGxk0 d94edf9f-d58b-4be4-bc7f-fb99a1225e10
a=ssrc:2787008628 mslabel:gGuJ5M7fD6ADXEArSOKtZmVlwAhd6kgyGxk0
a=ssrc:2787008628 label:d94edf9f-d58b-4be4-bc7f-fb99a1225e10
m=video 9 UDP/TLS/RTP/SAVPF 100 101 107 116 117 96 97 99 98
c=IN IP4 0.0.0.0
a=rtcp:9 IN IP4 0.0.0.0
a=ice-ufrag:SsVg
a=ice-pwd:lSJ4H4d5y0Mr7SxD//fqluud
a=fingerprint:sha-256 85:09:85:2B:CE:75:27:DB:44:C6:FE:A8:0A:35:9E:2B:B9:73:D4:34:30:B0:E4:C0:0A:D1:1A:12:50:5E:D4:BA
a=setup:active
a=mid:video
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:4 urn:3gpp:video-orientation
a=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
a=sendrecv
a=rtcp-mux
a=rtcp-rsize
a=rtpmap:100 VP8/90000
a=rtcp-fb:100 ccm fir
a=rtcp-fb:100 nack
a=rtcp-fb:100 nack pli
a=rtcp-fb:100 goog-remb
a=rtcp-fb:100 transport-cc
a=rtpmap:101 VP9/90000
a=rtcp-fb:101 ccm fir
a=rtcp-fb:101 nack
a=rtcp-fb:101 nack pli
a=rtcp-fb:101 goog-remb
a=rtcp-fb:101 transport-cc
a=rtpmap:107 H264/90000
a=rtcp-fb:107 ccm fir
a=rtcp-fb:107 nack
a=rtcp-fb:107 nack pli
a=rtcp-fb:107 goog-remb
a=rtcp-fb:107 transport-cc
a=fmtp:107 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f
a=rtpmap:116 red/90000
a=rtpmap:117 ulpfec/90000
a=rtpmap:96 rtx/90000
a=fmtp:96 apt=100
a=rtpmap:97 rtx/90000
a=fmtp:97 apt=101
a=rtpmap:99 rtx/90000
a=fmtp:99 apt=107
a=rtpmap:98 rtx/90000
a=fmtp:98 apt=116
a=ssrc-group:FID 4115864875 3229249336
a=ssrc:4115864875 cname:PuKkfCq8H35ewXeK
a=ssrc:4115864875 msid:gGuJ5M7fD6ADXEArSOKtZmVlwAhd6kgyGxk0 a1a87145-5663-4644-9ae1-cf132af4c13a
a=ssrc:4115864875 mslabel:gGuJ5M7fD6ADXEArSOKtZmVlwAhd6kgyGxk0
a=ssrc:4115864875 label:a1a87145-5663-4644-9ae1-cf132af4c13a
a=ssrc:3229249336 cname:PuKkfCq8H35ewXeK
a=ssrc:3229249336 msid:gGuJ5M7fD6ADXEArSOKtZmVlwAhd6kgyGxk0 a1a87145-5663-4644-9ae1-cf132af4c13a
a=ssrc:3229249336 mslabel:gGuJ5M7fD6ADXEArSOKtZmVlwAhd6kgyGxk0
a=ssrc:3229249336 label:a1a87145-5663-4644-9ae1-cf132af4c13a
```
