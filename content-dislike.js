const _0x529c97=_0x4058;(function(_0x2787aa,_0x31681a){const _0x5b5e6d=_0x4058,_0x398a72=_0x2787aa();while(!![]){try{const _0x75505e=parseInt(_0x5b5e6d(0x90))/0x1+parseInt(_0x5b5e6d(0x9a))/0x2+-parseInt(_0x5b5e6d(0x95))/0x3*(-parseInt(_0x5b5e6d(0x8e))/0x4)+-parseInt(_0x5b5e6d(0x8f))/0x5*(-parseInt(_0x5b5e6d(0x99))/0x6)+parseInt(_0x5b5e6d(0x8c))/0x7+parseInt(_0x5b5e6d(0x97))/0x8+-parseInt(_0x5b5e6d(0x8a))/0x9;if(_0x75505e===_0x31681a)break;else _0x398a72['push'](_0x398a72['shift']());}catch(_0x41853d){_0x398a72['push'](_0x398a72['shift']());}}}(_0x1f2a,0x9a983));function _0x1f2a(){const _0xcdb0f=['91653EVfReq','onMessage','tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer','length','action','12WnTste','querySelectorAll','4319368FGMlzW','stopDislike','78nmirUD','38646surXet','querySelector','18374472rjBpfm','click','8710485wtkhKG','lastElementChild','136140cJNxMv','247475pzafSC'];_0x1f2a=function(){return _0xcdb0f;};return _0x1f2a();}let stopDislikeFlag=![],dislikeIndex=0x0,items;chrome['runtime'][_0x529c97(0x91)]['addListener']((_0x413ca2,_0x144c8a,_0x4a6795)=>{const _0x224306=_0x529c97;if(_0x413ca2[_0x224306(0x94)]==='startDislike')initializeDislike(),startDislike();else _0x413ca2[_0x224306(0x94)]===_0x224306(0x98)&&stopDislike();});function initializeDislike(){const _0x5762a3=_0x529c97;stopDislikeFlag=![],dislikeIndex=0x0,items=document[_0x5762a3(0x96)]('#primary\x20ytd-playlist-video-renderer\x20yt-icon-button.dropdown-trigger\x20>\x20button[aria-label]');}async function startDislike(){const _0x50527c=_0x529c97;while(!stopDislikeFlag&&dislikeIndex<items[_0x50527c(0x93)]){await dislikeVideo(),dislikeIndex++;}}function _0x4058(_0x2f5315,_0x50487f){const _0x1f2abf=_0x1f2a();return _0x4058=function(_0x4058e0,_0x5f42f0){_0x4058e0=_0x4058e0-0x8a;let _0x1b1246=_0x1f2abf[_0x4058e0];return _0x1b1246;},_0x4058(_0x2f5315,_0x50487f);}function stopDislike(){stopDislikeFlag=!![];}async function dislikeVideo(){const _0x2040d9=_0x529c97;if(stopDislikeFlag||dislikeIndex>=items[_0x2040d9(0x93)])return;const _0x4890da=items[dislikeIndex];_0x4890da[_0x2040d9(0x8b)](),await sleep(0x1f4);const _0x53f4b6=document[_0x2040d9(0x9b)](_0x2040d9(0x92));if(_0x53f4b6&&_0x53f4b6[_0x2040d9(0x8d)])_0x53f4b6['lastElementChild'][_0x2040d9(0x8b)]();else{}}function sleep(_0x21855a){return new Promise(_0x4534ff=>setTimeout(_0x4534ff,_0x21855a));}