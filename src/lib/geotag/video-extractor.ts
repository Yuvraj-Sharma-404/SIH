import {
  GeotagLocationResult,
  parseIso6709,
  decimalToDms,
  isValidCoordinate,
  parseMediaDate,
} from "./types";

/**
 * Interface representing decoded QuickTime / MP4 container metadata.
 */
interface ParsedBoxMetadata {
  isoLocation?: string;
  locationName?: string;
  creationDate?: string;
  durationSeconds?: number;
  width?: number;
  height?: number;
}

/**
 * Reads a 4-character ASCII tag at the specified offset.
 */
function readTag(buffer: Buffer, offset: number): string {
  if (offset + 4 > buffer.length) return "";
  return buffer.toString("latin1", offset, offset + 4);
}

/**
 * Parses QuickTime and ISO Base Media File Format (ISOBMFF / MP4) container boxes.
 * Walks through boxes recursively up to max depth without allocating extra buffers.
 */
function parseMp4Boxes(buffer: Buffer, startOffset = 0, endOffset = buffer.length, depth = 0): ParsedBoxMetadata {
  const result: ParsedBoxMetadata = {};
  if (depth > 8 || startOffset >= endOffset) return result;

  let offset = startOffset;

  while (offset + 8 <= endOffset) {
    let boxLength = buffer.readUInt32BE(offset);
    const boxType = readTag(buffer, offset + 4);

    let headerSize = 8;

    // Length 1 means 64-bit extended box size
    if (boxLength === 1) {
      if (offset + 16 > endOffset) break;
      const high = buffer.readUInt32BE(offset + 8);
      const low = buffer.readUInt32BE(offset + 12);
      boxLength = high * 4294967296 + low;
      headerSize = 16;
    } else if (boxLength === 0) {
      // Length 0 means box extends to end of file
      boxLength = endOffset - offset;
    }

    if (boxLength < headerSize || offset + boxLength > endOffset) {
      // Malformed box or EOF
      break;
    }

    const payloadOffset = offset + headerSize;
    const payloadLength = boxLength - headerSize;

    // 1. Movie Box (moov) -> Container box
    if (boxType === "moov") {
      const childData = parseMp4Boxes(buffer, payloadOffset, payloadOffset + payloadLength, depth + 1);
      Object.assign(result, childData);
    }

    // 2. User Data Box (udta) -> Container box
    else if (boxType === "udta") {
      const childData = parseMp4Boxes(buffer, payloadOffset, payloadOffset + payloadLength, depth + 1);
      Object.assign(result, childData);
    }

    // 3. User Data GPS Location Box: '©xyz' (0xA9 'xyz') or 'xyz '
    else if (
      boxType === "\xa9xyz" ||
      boxType === "©xyz" ||
      boxType === "xyz "
    ) {
      if (payloadLength >= 4) {
        // QuickTime format: 2-byte text length, 2-byte language code, then ISO 6709 text
        const textLen = buffer.readUInt16BE(payloadOffset);
        // Language code is at payloadOffset + 2
        let locStr = "";
        if (textLen > 0 && textLen <= payloadLength - 4) {
          locStr = buffer.toString("utf8", payloadOffset + 4, payloadOffset + 4 + textLen);
        } else {
          // Fallback: read remaining payload as string
          locStr = buffer.toString("utf8", payloadOffset + 4, payloadOffset + payloadLength);
        }

        if (locStr.trim()) {
          result.isoLocation = locStr.trim();
        }
      }
    }

    // 4. Movie Header (mvhd) -> Extract timescale, duration, and creation date
    else if (boxType === "mvhd") {
      if (payloadLength >= 24) {
        const version = buffer.readUInt8(payloadOffset);
        let creationTime = 0;
        let timescale = 1000;
        let duration = 0;

        if (version === 1 && payloadLength >= 36) {
          // 64-bit creation time and duration
          const creationHigh = buffer.readUInt32BE(payloadOffset + 4);
          const creationLow = buffer.readUInt32BE(payloadOffset + 8);
          creationTime = creationHigh * 4294967296 + creationLow;
          timescale = buffer.readUInt32BE(payloadOffset + 20);
          const durHigh = buffer.readUInt32BE(payloadOffset + 24);
          const durLow = buffer.readUInt32BE(payloadOffset + 28);
          duration = durHigh * 4294967296 + durLow;
        } else {
          // 32-bit version 0
          creationTime = buffer.readUInt32BE(payloadOffset + 4);
          timescale = buffer.readUInt32BE(payloadOffset + 12);
          duration = buffer.readUInt32BE(payloadOffset + 16);
        }

        if (timescale > 0 && duration > 0) {
          result.durationSeconds = Math.round((duration / timescale) * 100) / 100;
        }

        if (creationTime > 0) {
          const dateStr = parseMediaDate(creationTime);
          if (dateStr) {
            result.creationDate = dateStr;
          }
        }
      }
    }

    // 5. Track Header (tkhd) -> Extract video dimensions
    else if (boxType === "tkhd") {
      if (payloadLength >= 80) {
        const version = buffer.readUInt8(payloadOffset);
        const widthOffset = version === 1 ? payloadOffset + 84 : payloadOffset + 76;
        if (widthOffset + 8 <= payloadOffset + payloadLength) {
          // Fixed point 16.16 values
          const w = buffer.readUInt32BE(widthOffset) >>> 16;
          const h = buffer.readUInt32BE(widthOffset + 4) >>> 16;
          if (w > 0 && h > 0 && (!result.width || w > result.width)) {
            result.width = w;
            result.height = h;
          }
        }
      }
    }

    // 6. Metadata Box (meta) -> Parse QuickTime keys and ilst tables
    else if (boxType === "meta") {
      // Meta box may or may not have 4-byte version/flags
      let metaPayloadOffset = payloadOffset;
      let metaPayloadLength = payloadLength;

      // In MP4, meta has 4 bytes version/flags. In QuickTime it might not.
      if (metaPayloadLength >= 4 && buffer.readUInt32BE(metaPayloadOffset) === 0) {
        metaPayloadOffset += 4;
        metaPayloadLength -= 4;
      }

      const metaData = parseQuickTimeMeta(buffer, metaPayloadOffset, metaPayloadOffset + metaPayloadLength);
      if (metaData.isoLocation && !result.isoLocation) {
        result.isoLocation = metaData.isoLocation;
      }
      if (metaData.locationName && !result.locationName) {
        result.locationName = metaData.locationName;
      }
      if (metaData.creationDate && !result.creationDate) {
        result.creationDate = metaData.creationDate;
      }
    }

    // 7. Track Box (trak) -> Container box
    else if (boxType === "trak") {
      const childData = parseMp4Boxes(buffer, payloadOffset, payloadOffset + payloadLength, depth + 1);
      if (childData.width && !result.width) result.width = childData.width;
      if (childData.height && !result.height) result.height = childData.height;
    }

    offset += boxLength;
  }

  return result;
}

/**
 * Parses the QuickTime 'keys' and 'ilst' atom structure inside 'meta'.
 * Apple QuickTime stores metadata key names in 'keys' and values in 'ilst'.
 */
function parseQuickTimeMeta(buffer: Buffer, startOffset: number, endOffset: number): ParsedBoxMetadata {
  const result: ParsedBoxMetadata = {};
  let offset = startOffset;

  let keysTable: string[] = []; // 1-indexed list of keys
  let ilstOffset = 0;
  let ilstLength = 0;

  while (offset + 8 <= endOffset) {
    const boxLength = buffer.readUInt32BE(offset);
    const boxType = readTag(buffer, offset + 4);

    if (boxLength < 8 || offset + boxLength > endOffset) break;

    const payloadOffset = offset + 8;
    const payloadLength = boxLength - 8;

    // Parse 'keys' box
    if (boxType === "keys" && payloadLength >= 8) {
      // 4 bytes version/flags, 4 bytes entry count
      const count = buffer.readUInt32BE(payloadOffset + 4);
      let keyPos = payloadOffset + 8;
      keysTable = [""]; // 1-indexed (index 0 unused)

      for (let i = 0; i < count && keyPos + 8 <= payloadOffset + payloadLength; i++) {
        const keySize = buffer.readUInt32BE(keyPos);
        if (keySize < 8 || keyPos + keySize > payloadOffset + payloadLength) break;
        // Key name starts after 4 bytes size + 4 bytes namespace ('mdta')
        const keyName = buffer.toString("utf8", keyPos + 8, keyPos + keySize);
        keysTable.push(keyName);
        keyPos += keySize;
      }
    }

    // Mark 'ilst' box location
    else if (boxType === "ilst") {
      ilstOffset = payloadOffset;
      ilstLength = payloadLength;
    }

    offset += boxLength;
  }

  // If both keys and ilst are found, match items
  if (keysTable.length > 1 && ilstOffset > 0 && ilstLength > 0) {
    let itemOffset = ilstOffset;
    const ilstEnd = ilstOffset + ilstLength;

    while (itemOffset + 8 <= ilstEnd) {
      const itemLen = buffer.readUInt32BE(itemOffset);
      const itemIndex = buffer.readUInt32BE(itemOffset + 4);

      if (itemLen < 8 || itemOffset + itemLen > ilstEnd) break;

      // itemIndex is the 1-based index into keysTable
      const keyName = keysTable[itemIndex] || "";

      // Look for child 'data' box inside this item
      let dataOffset = itemOffset + 8;
      const itemEnd = itemOffset + itemLen;

      while (dataOffset + 8 <= itemEnd) {
        const dataBoxLen = buffer.readUInt32BE(dataOffset);
        const dataBoxType = readTag(buffer, dataOffset + 4);

        if (dataBoxLen < 8 || dataOffset + dataBoxLen > itemEnd) break;

        if (dataBoxType === "data" && dataBoxLen >= 16) {
          // 4 bytes type, 4 bytes locale, then content
          const content = buffer.toString("utf8", dataOffset + 16, dataOffset + dataBoxLen).trim();

          if (keyName.includes("location.ISO6709")) {
            result.isoLocation = content;
          } else if (keyName.includes("location.name")) {
            result.locationName = content;
          } else if (keyName.includes("creationdate")) {
            const parsedDate = parseMediaDate(content);
            if (parsedDate) result.creationDate = parsedDate;
          }
        }

        dataOffset += dataBoxLen;
      }

      itemOffset += itemLen;
    }
  }

  return result;
}

/**
 * Fallback scanner for ISO 6709 coordinate patterns across the raw video buffer.
 * Used if non-standard or fragmented containers bypass the hierarchical box walker.
 */
function scanBufferForIso6709(buffer: Buffer): string | null {
  try {
    // 1. Check for ©xyz tag by binary search (0xA9 0x78 0x79 0x7A)
    const marker = Buffer.from([0xa9, 0x78, 0x79, 0x7a]);
    let idx = buffer.indexOf(marker);
    if (idx !== -1 && idx + 12 < buffer.length) {
      const len = buffer.readUInt16BE(idx + 4);
      if (len > 4 && len < 64 && idx + 8 + len <= buffer.length) {
        const str = buffer.toString("utf8", idx + 8, idx + 8 + len).trim();
        if (parseIso6709(str)) {
          return str;
        }
      }
    }

    // 2. Scan string segments for standard ISO 6709 pattern
    // Search first 512KB and last 512KB (where moov/metadata is located)
    const scanLimit = Math.min(buffer.length, 512 * 1024);
    const headText = buffer.toString("latin1", 0, scanLimit);
    const isoRegex = /([+-]\d{2}(?:\.\d+)?)([+-]\d{3}(?:\.\d+)?)(?:([+-]\d+(?:\.\d+)?))?\//g;
    const match = isoRegex.exec(headText);
    if (match) {
      return match[0];
    }

    // Scan tail if file is larger than 512KB
    if (buffer.length > 512 * 1024) {
      const tailOffset = Math.max(0, buffer.length - 512 * 1024);
      const tailText = buffer.toString("latin1", tailOffset);
      const tailMatch = isoRegex.exec(tailText);
      if (tailMatch) {
        return tailMatch[0];
      }
    }
  } catch {
    // Fallback scan suppression
  }

  return null;
}

/**
 * Primary Video GPS & Metadata extraction routine.
 * Supports MP4, MOV, M4V, 3GP formats.
 */
export async function extractVideoGps(
  buffer: Buffer,
  fileName?: string,
  fileSize?: number,
  mimeType?: string
): Promise<GeotagLocationResult> {
  const baseResult: GeotagLocationResult = {
    hasGpsData: false,
    mediaType: "video",
    source: "embedded_metadata",
    fileName,
    fileSize: fileSize || buffer.length,
    mimeType: mimeType || "video/mp4",
  };

  try {
    if (!buffer || buffer.length < 32) {
      return {
        ...baseResult,
        message: "The video file is corrupted or too small to be a valid video.",
        details: "Video payload buffer is smaller than minimum required header bytes.",
      };
    }

    // 1. Box Parsing (ISOBMFF & QuickTime hierarchy)
    const boxMetadata = parseMp4Boxes(buffer);

    // 2. Fallback scan if box walk didn't find ISO 6709 tag
    let isoLocation = boxMetadata.isoLocation;
    if (!isoLocation) {
      isoLocation = scanBufferForIso6709(buffer) || undefined;
    }

    // 3. Decode ISO 6709 Coordinates
    if (isoLocation) {
      const decodedGps = parseIso6709(isoLocation);
      if (decodedGps && isValidCoordinate(decodedGps.latitude, decodedGps.longitude)) {
        const lat = Math.round(decodedGps.latitude * 1000000) / 1000000;
        const lng = Math.round(decodedGps.longitude * 1000000) / 1000000;
        const alt = decodedGps.altitude !== undefined ? Math.round(decodedGps.altitude * 100) / 100 : null;

        return {
          ...baseResult,
          hasGpsData: true,
          latitude: lat,
          longitude: lng,
          altitude: alt,
          dmsLatitude: decimalToDms(lat, true),
          dmsLongitude: decimalToDms(lng, false),
          locationName: boxMetadata.locationName || undefined,
          capturedAt: boxMetadata.creationDate || null,
          duration: boxMetadata.durationSeconds || null,
          width: boxMetadata.width || null,
          height: boxMetadata.height || null,
          rawTags: {
            isoLocation,
            locationName: boxMetadata.locationName,
            creationDate: boxMetadata.creationDate,
            durationSeconds: boxMetadata.durationSeconds,
            dimensions: boxMetadata.width && boxMetadata.height ? `${boxMetadata.width}x${boxMetadata.height}` : null,
          },
        };
      }
    }

    // 4. Return clean noGpsData response with basic video metadata (duration, resolution)
    return {
      ...baseResult,
      hasGpsData: false,
      message: "No GPS location data found in this video.",
      details: "The video container does not contain embedded GPS metadata. Location cannot be determined from media metadata.",
      duration: boxMetadata.durationSeconds || null,
      width: boxMetadata.width || null,
      height: boxMetadata.height || null,
      capturedAt: boxMetadata.creationDate || null,
    };
  } catch (error: any) {
    return {
      ...baseResult,
      message: "Failed to parse video metadata.",
      details: error?.message || "Corrupted or unreadable video format.",
    };
  }
}
