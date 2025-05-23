import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const MUTE_SETTING_KEY = 'workwell_audio_muted';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioMap = new Map<string, any>();
  private isMuted = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      console.log('AudioService initialized in browser environment');
      this.loadMutePreference();
      this.preloadSounds();
    }
  }

  private loadMutePreference(): void {
    if (!this.isBrowser) return;

    try {
      const savedMuteSetting = localStorage.getItem(MUTE_SETTING_KEY);
      if (savedMuteSetting !== null) {
        this.isMuted = savedMuteSetting === 'true';
      }
    } catch (error) {
      console.error('Failed to load audio preferences', error);
    }
  }

  private saveMutePreference(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(MUTE_SETTING_KEY, this.isMuted.toString());
    } catch (error) {
      console.error('Failed to save audio preferences', error);
    }
  }

  private preloadSounds() {
    // Only preload sounds in browser environment
    if (!this.isBrowser) return;

    // Preload common notification sounds
    this.loadSound('notification', 'assets/sounds/notification.mp3');
    this.loadSound('alert', 'assets/sounds/alert.mp3');
    this.loadSound('reminder', 'assets/sounds/reminder.mp3');
  }

  private loadSound(id: string, url: string): void {
    if (!this.isBrowser) return;

    try {
      const audio = new Audio();
      audio.src = url;
      audio.load();
      this.audioMap.set(id, audio);
    } catch (error) {
      console.error(`Failed to load audio ${id}:`, error);
    }
  }

  public play(soundId: string): void {
    if (!this.isBrowser || this.isMuted) return;

    const sound = this.audioMap.get(soundId);
    if (sound) {
      try {
        // Create a new audio instance to allow overlapping sounds
        const playSound = sound.cloneNode() as HTMLAudioElement;
        playSound
          .play()
          .catch((err) => console.error('Error playing sound:', err));
      } catch (error) {
        console.error(`Failed to play audio ${soundId}:`, error);
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.saveMutePreference();
    return this.isMuted;
  }

  public setMute(isMuted: boolean): void {
    this.isMuted = isMuted;
    this.saveMutePreference();
  }

  public getMute(): boolean {
    return this.isMuted;
  }
}
