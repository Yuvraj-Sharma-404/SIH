import { GeotagLocationResult, MediaType } from "./types";
import { extractImageGps } from "./image-extractor";
import { extractVideoGps } from "./video-extractor";

export interface MediaInput {
  buffer: Buffer;
  fileName: string;
  fileSize: number;
  mimeType: string;
  mediaType: MediaType;
}

/**
 * Common abstraction for resolving geographical location from media.
 */
export interface LocationProvider {
  readonly name: string;
  readonly description: string;
  supports(mediaType: MediaType): boolean;
  getLocation(input: MediaInput): Promise<GeotagLocationResult>;
}

/**
 * Implementation 1: EmbeddedMetadataLocationProvider
 *
 * Extracts true GPS metadata directly embedded within the image EXIF or video container.
 * Never guesses or fabricates location.
 */
export class EmbeddedMetadataLocationProvider implements LocationProvider {
  readonly name = "EmbeddedMetadataLocationProvider";
  readonly description = "Extracts embedded EXIF GPS tags and QuickTime/ISO6709 container metadata.";

  supports(mediaType: MediaType): boolean {
    return mediaType === "image" || mediaType === "video";
  }

  async getLocation(input: MediaInput): Promise<GeotagLocationResult> {
    if (input.mediaType === "video") {
      return extractVideoGps(input.buffer, input.fileName, input.fileSize, input.mimeType);
    }
    return extractImageGps(input.buffer, input.fileName, input.fileSize, input.mimeType);
  }
}

/**
 * Implementation 2: UserSelectedLocationProvider
 *
 * Used when a user manually clicks or sets an incident location pin.
 */
export class UserSelectedLocationProvider implements LocationProvider {
  readonly name = "UserSelectedLocationProvider";
  readonly description = "Applies user-selected and verified map coordinates.";

  supports(): boolean {
    return true;
  }

  async getLocation(input: MediaInput): Promise<GeotagLocationResult> {
    return {
      hasGpsData: false,
      mediaType: input.mediaType,
      source: "embedded_metadata",
      message: "No user-specified location provided.",
    };
  }
}

/**
 * Implementation 3: AIGeolocationProvider (Prepared Future Architecture)
 *
 * Architectural hook for future AI-based visual geolocation:
 * Video -> Extract representative frames -> AI Vision Model -> Candidate Coordinates + Confidence -> User confirmation.
 *
 * In current mode, does not fabricate coordinates and cleanly returns noGpsData.
 */
export class AIGeolocationProvider implements LocationProvider {
  readonly name = "AIGeolocationProvider";
  readonly description = "Prepared visual AI geolocation pipeline for representative frame analysis.";

  private isModelConfigured: boolean;

  constructor(isModelConfigured = false) {
    this.isModelConfigured = isModelConfigured;
  }

  supports(mediaType: MediaType): boolean {
    return mediaType === "image" || mediaType === "video";
  }

  async getLocation(input: MediaInput): Promise<GeotagLocationResult> {
    if (!this.isModelConfigured) {
      // Clean fallback: Never guess or fabricate locations without verified AI model & user confirmation
      return {
        hasGpsData: false,
        mediaType: input.mediaType,
        source: "embedded_metadata",
        message: `Visual AI geolocation is not enabled for this ${input.mediaType}.`,
        details: "AI visual geolocation requires explicit configuration and user verification.",
      };
    }

    // Future extension pipeline:
    // 1. Extract frames from input.buffer using ffmpeg or canvas
    // 2. Submit representative frames to Gemini Vision / Landmark Detection model
    // 3. Obtain candidate coordinates and confidence score
    // 4. Return candidate with confidence for human review

    return {
      hasGpsData: false,
      mediaType: input.mediaType,
      source: "embedded_metadata",
      message: "AI geolocation pipeline ready for model integration.",
    };
  }
}

/**
 * Default provider instance: strictly embedded metadata.
 */
export const defaultLocationProvider = new EmbeddedMetadataLocationProvider();
