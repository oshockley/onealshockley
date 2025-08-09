// Audio Context for generating click sounds
class ClickSoundGenerator {
    constructor() {
        this.audioContext = null;
        this.isEnabled = true;
        this.init();
    }

    init() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Web Audio API not supported');
            this.isEnabled = false;
        }
    }

    // Generate a light pop sound
    playPopSound(frequency = 800, duration = 0.1, volume = 0.3) {
        if (!this.isEnabled || !this.audioContext) return;

        try {
            // Resume audio context if suspended (required for some browsers)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Connect oscillator to gain node to destination
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Set up the pop sound characteristics
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.3, this.audioContext.currentTime + duration);
            
            // Set up volume envelope for pop effect
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            // Use a sine wave for a soft pop sound
            oscillator.type = 'sine';
            
            // Start and stop the sound
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
            
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    }

    // Different sound variations
    playButtonClick() {
        this.playPopSound(800, 0.08, 0.25);
    }

    playNavClick() {
        this.playPopSound(600, 0.06, 0.2);
    }

    playTabClick() {
        this.playPopSound(700, 0.07, 0.22);
    }

    playCardClick() {
        this.playPopSound(500, 0.1, 0.18);
    }

    // Toggle sound on/off
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }
}

// Initialize the sound generator
const clickSound = new ClickSoundGenerator();

// Function to add click sounds to elements
function addClickSounds() {
    // Add sound to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => clickSound.playNavClick());
    });

    // Add sound to buttons
    document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('click', () => clickSound.playButtonClick());
    });

    // Add sound to skill tabs
    document.querySelectorAll('.skill-tab').forEach(tab => {
        tab.addEventListener('click', () => clickSound.playTabClick());
    });

    // Add sound to project filter buttons
    document.querySelectorAll('.filter-btn').forEach(filter => {
        filter.addEventListener('click', () => clickSound.playTabClick());
    });

    // Add sound to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => clickSound.playCardClick());
    });

    // Add sound to social links
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', () => clickSound.playNavClick());
    });

    // Add sound to testimonial controls
    document.querySelectorAll('.testimonial-btn').forEach(btn => {
        btn.addEventListener('click', () => clickSound.playTabClick());
    });

    // Add sound to action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => clickSound.playButtonClick());
    });

    // Setup sound toggle button
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent sound from playing when toggling
            const isEnabled = clickSound.toggle();
            const icon = soundToggle.querySelector('i');
            
            if (isEnabled) {
                icon.className = 'fas fa-volume-up';
                soundToggle.classList.remove('muted');
                soundToggle.title = 'Disable click sounds';
                // Play a confirmation sound
                setTimeout(() => clickSound.playButtonClick(), 100);
            } else {
                icon.className = 'fas fa-volume-mute';
                soundToggle.classList.add('muted');
                soundToggle.title = 'Enable click sounds';
            }
        });
    }
}

// Export for use in other scripts
window.clickSound = clickSound;
window.addClickSounds = addClickSounds;
