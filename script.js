document.addEventListener('DOMContentLoaded', function() {
    const audioPlayers = document.querySelectorAll('.logicvoid-audio-player-wrapper');

    audioPlayers.forEach(player => {
        const audio = player.querySelector('audio');
        const playButton = player.querySelector('.logicvoid-audio-play-button');
        const muteButton = player.querySelector('.logicvoid-audio-mute-button');
        const progressBarContainer = player.querySelector('.logicvoid-audio-progress-bar-container');
        const progressBar = player.querySelector('.logicvoid-audio-progress-bar');
        const progressHandle = player.querySelector('.logicvoid-audio-progress-handle');
        const currentTimeDisplay = player.querySelector('.logicvoid-audio-current-time');
        const durationDisplay = player.querySelector('.logicvoid-audio-duration');
        const volumeSlider = player.querySelector('.logicvoid-audio-volume-slider');

        let isPlaying = false;
        let isMuted = false;
        let isDragging = false;

        // Play/Pause
        playButton.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                player.classList.remove('playing');
            } else {
                audio.play()
                    .then(() => {
                        player.classList.add('playing');
                    })
                    .catch(error => {
                        console.error('Error playing audio:', error);
                    });
            }
            isPlaying = !isPlaying;
        });

        // Mute/Unmute
        muteButton.addEventListener('click', () => {
            if (isMuted) {
                audio.muted = false;
                player.classList.remove('muted');
                volumeSlider.value = audio.volume || 1;
            } else {
                audio.muted = true;
                player.classList.add('muted');
            }
            isMuted = !isMuted;
        });

        // Update progress bar and time displays
        audio.addEventListener('timeupdate', () => {
            if (isDragging) return;
            
            const currentTime = audio.currentTime;
            const duration = audio.duration;

            if (!isNaN(duration)) {
                const progressPercent = (currentTime / duration) * 100;
                progressBar.style.width = `${progressPercent}%`;
                progressHandle.style.left = `${progressPercent}%`;

                currentTimeDisplay.textContent = formatTime(currentTime);
                durationDisplay.textContent = formatTime(duration);
            }
        });

        // Progress bar interactions
        progressBarContainer.addEventListener('mousedown', startDrag);
        progressBarContainer.addEventListener('touchstart', startDrag, { passive: true });
        
        function startDrag(e) {
            isDragging = true;
            updateProgressFromEvent(e);
            
            document.addEventListener('mousemove', updateProgressFromEvent);
            document.addEventListener('touchmove', updateProgressFromEvent, { passive: true });
            
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }
        
        function updateProgressFromEvent(e) {
            let clientX;
            
            if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }
            
            const rect = progressBarContainer.getBoundingClientRect();
            const containerWidth = rect.width;
            const clickPosition = clientX - rect.left;
            
            let seekPercent = (clickPosition / containerWidth);
            seekPercent = Math.max(0, Math.min(1, seekPercent)); // Clamp between 0 and 1
            
            const seekTime = seekPercent * audio.duration;
            
            progressBar.style.width = `${seekPercent * 100}%`;
            progressHandle.style.left = `${seekPercent * 100}%`;
            
            if (!e.type.includes('move')) {
                audio.currentTime = seekTime;
                currentTimeDisplay.textContent = formatTime(seekTime);
            }
        }
        
        function stopDrag() {
            if (isDragging) {
                isDragging = false;
                
                document.removeEventListener('mousemove', updateProgressFromEvent);
                document.removeEventListener('touchmove', updateProgressFromEvent);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchend', stopDrag);
                
                const progressPercent = parseFloat(progressBar.style.width) / 100;
                audio.currentTime = progressPercent * audio.duration;
            }
        }

        // Volume Control
        volumeSlider.addEventListener('input', () => {
            audio.volume = volumeSlider.value;
            if (audio.volume > 0) {
                audio.muted = false;
                isMuted = false;
                player.classList.remove('muted');
            } else {
                audio.muted = true;
                isMuted = true;
                player.classList.add('muted');
            }
        });

        // Format time as MM:SS
        function formatTime(seconds) {
            if (isNaN(seconds)) return "00:00";
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
            return formattedTime;
        }

        // Initial setup
        function updateDuration() {
            if (!isNaN(audio.duration)) {
                durationDisplay.textContent = formatTime(audio.duration);
            }
        }

        // Handle case where metadata is already loaded
        if (audio.readyState >= 1) {
            updateDuration();
        } else {
            // Handle case where metadata needs to be loaded
            audio.addEventListener('loadedmetadata', updateDuration);
        }

        // Additional fallback for some browsers/scenarios
        setTimeout(() => {
            if (durationDisplay.textContent === "00:00" && !isNaN(audio.duration)) {
                updateDuration();
            }
        }, 500);

        // Handle audio end
        audio.addEventListener('ended', () => {
            isPlaying = false;
            player.classList.remove('playing');
            progressBar.style.width = '0%';
            progressHandle.style.left = '0%';
        });
        
        // Keyboard accessibility
        player.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                playButton.click();
            }
        });
    });
});
