const RadioPlayer = ((STREAM_URL) => {
    const playbtn = document.getElementById("play-toggle");
    const volumebtn = document.getElementById("volume-button");

    let stream = new Audio();
    stream.src = `${STREAM_URL}`;
    stream.volume = 1;
    stream.preload = 'none';
    stream.onended = function() {
        console.log("onended");
        stream.pause();
        stream.src = '';
        stream.load();
    };

    stream.onerror = function(e) {
        if (e.target.error.code !== e.target.error.MEDIA_ERR_NETWORK && stream.src !== '')
            return;

        console.log('Network interrupted stream. Automatically reconnecting shortly...');
        setTimeout(() => {
            if (playbtn.classList.contains('fa-play')) {
                return;
            }
            play();
        }, 5000);
    };

    function play() {
        console.log("play");
        stream.src = `${STREAM_URL}?nocache=${Date.now()}`;
        stream.preload = 'none';
        stream.play();
        playbtn.className = 'fa fa-pause';
    }

    function pause() {
      console.log("pause");
      stream.pause();
      playbtn.className = 'fa fa-play';
    }

    function togglePlay() {
        playbtn.classList.contains('fa-play') ? play() : pause();
    }

    function cycleVolume() {
        // if (stream.volume < 0.51) {
        //     stream.volume = 0.51;
        //     volumebtn.className = 'fa fa-volume-down';
        // } else
        if (stream.volume < 1) {
            stream.volume = 1;
            volumebtn.className = 'fa fa-volume-up';
        } else {
            stream.volume = 0;
            volumebtn.className = 'fa fa-volume-off';
        }
    }

    return {
        togglePlay: () => togglePlay(),
        cycleVolume: () => cycleVolume(),
    };
})(ICECAST_STREAM_URL);
