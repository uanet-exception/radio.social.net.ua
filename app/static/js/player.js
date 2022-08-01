const RadioPlayer = ((STREAM_URL) => {
    let stream = new Audio();
    stream.src = `${STREAM_URL}?nocache=${Date.now()}`;
    stream.volume = 0.51;
    stream.preload = 'none';
    let updateInterval;

    function updatePlayButton() {
        const button = document.getElementById("play-toggle");
        if(stream.paused) {
            button.classList.remove('fa-pause');
            button.classList.add('fa-play');
        } else {
            button.classList.remove('fa-play');
            button.classList.add('fa-pause');
        }
    }

    function togglePlay() {
        if(stream.paused) {
            stream.play();
        } else {
            stream.pause();
            stream.src = '';
            stream.load();

            var volume = stream.volume;

            stream = null;
            stream = new Audio();
            stream.src = `${STREAM_URL}?nocache=${Date.now()}`;
            stream.preload = 'none';
            stream.volume = volume;
            stream.pause();
        }
        updatePlayButton();
    }

    function updateVolumeButton() {
        // Updates the volume button icon accoring to the volume
        volumebtn = document.getElementById("volume-button");
        if (stream.volume === 0) {
            volumebtn.classList.remove('fa-volume-up');
            volumebtn.classList.remove('fa-volume-down');
            volumebtn.classList.add('fa-volume-off');
        } else if (stream.volume > 0.51) {
            volumebtn.classList.remove('fa-volume-down');
            volumebtn.classList.remove('fa-volume-off');
            volumebtn.classList.add('fa-volume-up');
        } else {
            volumebtn.classList.remove('fa-volume-up');
            volumebtn.classList.remove('fa-volume-off');
            volumebtn.classList.add('fa-volume-down');
        }
    }

    function cycleVolume() {
        if (stream.volume < 0.51) {
            stream.volume = 0.51;
        } else if (stream.volume < 1) {
            stream.volume = 1;
        } else {
            stream.volume = 0;
        }
        updateVolumeButton();
    }

    return {
        togglePlay: () => togglePlay(),
        cycleVolume: () => cycleVolume(),
    };
})(ICECAST_STREAM_URL);
