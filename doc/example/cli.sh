podcast_url="http://open.live.bbc.co.uk/mediaselector/5/redir/version/2.0/mediaset/audio-nondrm-download-low/proto/http/vpid/p068rfy7.mp3"

curl -Ls "$podcast_url" | fluffer | mplayer -
