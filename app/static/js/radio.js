// Recurring timers
let playlistPoll;
let statusPoll;

function ajax_with_json(url, func) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
            let response = JSON.parse(httpRequest.responseText);
            func(response);
        }
    };

    httpRequest.open("GET", url);
    httpRequest.send();
}

function check_playlist() {
    function format_track(track) {
        return (track.artist) ? (track.artist + " - " + track.title) : track.title;
    }

    function set_media_session(track) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist
            });
        }
    }

    function add_track_to_tbody(tbody, track, acc) {
        // Create row and cells
        let row   = tbody.insertRow(tbody.rows.length);
        let dcell = row.insertCell(0);
        let tcell = row.insertCell(0);
        dcell.className = "dur";
        tcell.className = "track";

        // The track
        tcell.innerText = format_track(track);

        if(acc == undefined) {
            dcell.classList.add("current_track");
            tcell.classList.add("current_track");

            let arrow = document.createElement("i");
            arrow.classList.add("fa");
            arrow.classList.add("fa-arrow-circle-o-left");
            dcell.appendChild(arrow);
        } else {
            // The duration
            let time = "";
            if(acc < 60) {
                time = "менше хвилини";
            } else {
                time = Math.round(acc / 60);
                if ((time % 100) > 4 && (time % 100) < 20) {
                    time += " хвилин";
                } else {
                    var choices = ["хвилину", "хвилини", "хвилин"];
                    var cases = [2, 0, 1, 1, 1, 2];
                    var i = (time % 10) < 5 ? (time % 10) : 5;
                    time += " " + choices[cases[i]];
                }
                // time += " min" + ((time==1) ? "" : "s");
                // time += ((time==1) ? " хвилину" : " хвилин");
            }
            dcell.innerText = time + " тому";
        }

        // New accumulator
        return acc + parseFloat(track.time);
    }

    function swap_tbody(id, tbody) {
        let old = document.getElementById(id);
        old.parentNode.replaceChild(tbody, old);
        tbody.id = id;
    }

    ajax_with_json(`/playlist.json`, function(response) {
        // Update the "now playing"
        document.getElementById("nowplaying").innerText = format_track(response.current);
        set_media_session(response.current);

        let new_playlist = document.createElement("tbody");
        let until = parseFloat(response.current.time) - parseFloat(response.elapsed);
        let ago   = parseFloat(response.elapsed);
        add_track_to_tbody(new_playlist, response.current, undefined);
        for(let i in response.before) {
            ago = add_track_to_tbody(new_playlist, response.before[i], ago);
        }
        swap_tbody("playlist_body", new_playlist);

        // Update the current/peak listeners counts
        document.getElementById("listeners").innerText = `${response.listeners.current}`;
        if ('peak' in response.listeners) {
            document.getElementById("listeners").innerText += ` (пік ${response.listeners.peak})`;
        }
    });
}

window.onload = () => {
    // Show and hide things
    let show = document.getElementsByClassName("withscript");
    let hide = document.getElementsByClassName("noscript");
    for(let i = 0; i < show.length; i++) {
        if (show[i].classList.contains("inline")) {
            show[i].style.display = "inline-block";
        } else if(show[i].tagName == "DIV" || show[i].tagName == "HEADER" || show[i].tagName == "TABLE") {
            show[i].style.display = "block";
        } else if(show[i].tagName == "TD") {
            show[i].style.display = "table-cell";
        } else {
            show[i].style.display = "inline";
        }
    }
    for(let i = 0; i < hide.length; i++) { hide[i].style.display = "none"; }

    // Get the initial playlist and set a timer to regularly update it.
    check_playlist();
    playlistPoll = setInterval(check_playlist, 10000);

    document.addEventListener('keyup', (e) => {
        if(e.keyCode == 32){
            RadioPlayer.togglePlay()
        }
    });
};
