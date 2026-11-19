import type { ImageMetadata } from 'astro';

export type DeviceKind = 'laptop' | 'phone' | 'tablet';

export type Device = { kind: DeviceKind; image: ImageMetadata; alt: string } | { kind: 'laptop'; screen: 'pos' };

export interface DeviceComposition {
  /** "single" renders one bare device with no positioning wrapper. */
  layout: 'combo' | 'trio' | 'solo' | 'single';
  devices: Device[];
}

/** Screenshot widths rendered per device frame; the largest matches the source files (1600px desktop, 780px mobile). */
export const DEVICE_IMAGE_SIZING: Record<DeviceKind, { widths: number[]; sizes: string }> = {
  laptop: { widths: [480, 800, 1200, 1600], sizes: '(max-width: 767px) 90vw, (max-width: 1279px) 70vw, 900px' },
  tablet: { widths: [320, 640, 960], sizes: '(max-width: 767px) 40vw, 460px' },
  phone: { widths: [200, 400, 780], sizes: '(max-width: 767px) 30vw, 240px' },
};
