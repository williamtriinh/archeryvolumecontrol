// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '0',
        width: '0',
        videoId: 'd4PDohlr0Jw',
        playerVars : {
            autoplay: 1,
            vq: "small",
            fs: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            autohide: 0,
            cc_load_policy: 0,
            iv_load_policy: 3,
        },

        events: {
            onReady: function(ev) {
                ev.target.seekTo(5);
                ev.target.setPlaybackQuality("small");  /// I don't know how to change the video quality.
                                                        /// I'm sorry.
            }
        }
    });
}