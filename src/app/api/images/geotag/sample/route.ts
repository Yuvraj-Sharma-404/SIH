import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Generates a minimal valid JPEG with an embedded EXIF APP1 block containing GPS metadata.
 * Coordinates: India Gate, Rajpath, New Delhi, India
 * Latitude: 28° 36' 46.4" N (28.612889°)
 * Longitude: 77° 13' 46.2" E (77.229500°)
 */
function createGeotaggedJpegBuffer(): Buffer {
  const sampleBase64 =
    "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

  const tiff = Buffer.alloc(256, 0);
  let pos = 0;

  // TIFF Header
  tiff.write("II", pos); // Little endian
  tiff.writeUInt16LE(42, pos + 2);
  tiff.writeUInt32LE(8, pos + 4); // IFD0 offset
  pos = 8;

  // IFD0: 2 entries
  tiff.writeUInt16LE(2, pos);
  pos += 2;

  // Tag 0x8769 (ExifOffset)
  const exifOffset = 38;
  tiff.writeUInt16LE(0x8769, pos);
  tiff.writeUInt16LE(4, pos + 2); // LONG
  tiff.writeUInt32LE(1, pos + 4); // count
  tiff.writeUInt32LE(exifOffset, pos + 8);
  pos += 12;

  // Tag 0x8825 (GPSInfo)
  const gpsOffset = 52;
  tiff.writeUInt16LE(0x8825, pos);
  tiff.writeUInt16LE(4, pos + 2); // LONG
  tiff.writeUInt32LE(1, pos + 4); // count
  tiff.writeUInt32LE(gpsOffset, pos + 8);
  pos += 12;

  tiff.writeUInt32LE(0, pos);
  pos += 4;

  // Exif IFD at offset 38: 1 entry (DateTimeOriginal)
  pos = exifOffset;
  tiff.writeUInt16LE(1, pos);
  pos += 2;
  const dateOffset = 190;
  tiff.writeUInt16LE(0x9003, pos); // DateTimeOriginal
  tiff.writeUInt16LE(2, pos + 2); // ASCII
  tiff.writeUInt32LE(20, pos + 4); // 20 chars
  tiff.writeUInt32LE(dateOffset, pos + 8);
  pos += 12;
  tiff.writeUInt32LE(0, pos);

  // GPS IFD at offset 52: 6 entries
  pos = gpsOffset;
  tiff.writeUInt16LE(6, pos);
  pos += 2;

  // 1. GPSVersionID (0x0000)
  tiff.writeUInt16LE(0x0000, pos);
  tiff.writeUInt16LE(1, pos + 2);
  tiff.writeUInt32LE(4, pos + 4);
  tiff.set([2, 2, 0, 0], pos + 8);
  pos += 12;

  // 2. GPSLatitudeRef (0x0001)
  tiff.writeUInt16LE(0x0001, pos);
  tiff.writeUInt16LE(2, pos + 2);
  tiff.writeUInt32LE(2, pos + 4);
  tiff.write("N\0", pos + 8);
  pos += 12;

  // 3. GPSLatitude (0x0002)
  const latDataOffset = 126;
  tiff.writeUInt16LE(0x0002, pos);
  tiff.writeUInt16LE(5, pos + 2);
  tiff.writeUInt32LE(3, pos + 4);
  tiff.writeUInt32LE(latDataOffset, pos + 8);
  pos += 12;

  // 4. GPSLongitudeRef (0x0003)
  tiff.writeUInt16LE(0x0003, pos);
  tiff.writeUInt16LE(2, pos + 2);
  tiff.writeUInt32LE(2, pos + 4);
  tiff.write("E\0", pos + 8);
  pos += 12;

  // 5. GPSLongitude (0x0004)
  const lngDataOffset = 150;
  tiff.writeUInt16LE(0x0004, pos);
  tiff.writeUInt16LE(5, pos + 2);
  tiff.writeUInt32LE(3, pos + 4);
  tiff.writeUInt32LE(lngDataOffset, pos + 8);
  pos += 12;

  // 6. GPSAltitude (0x0006)
  const altDataOffset = 174;
  tiff.writeUInt16LE(0x0006, pos);
  tiff.writeUInt16LE(5, pos + 2);
  tiff.writeUInt32LE(1, pos + 4);
  tiff.writeUInt32LE(altDataOffset, pos + 8);
  pos += 12;
  tiff.writeUInt32LE(0, pos);

  // Write Latitude Rationals at offset 126: 28 deg, 36 min, 46.4 sec
  pos = latDataOffset;
  tiff.writeUInt32LE(28, pos);
  tiff.writeUInt32LE(1, pos + 4);
  tiff.writeUInt32LE(36, pos + 8);
  tiff.writeUInt32LE(1, pos + 12);
  tiff.writeUInt32LE(464, pos + 16);
  tiff.writeUInt32LE(10, pos + 20);

  // Write Longitude Rationals at offset 150: 77 deg, 13 min, 46.2 sec
  pos = lngDataOffset;
  tiff.writeUInt32LE(77, pos);
  tiff.writeUInt32LE(1, pos + 4);
  tiff.writeUInt32LE(13, pos + 8);
  tiff.writeUInt32LE(1, pos + 12);
  tiff.writeUInt32LE(462, pos + 16);
  tiff.writeUInt32LE(10, pos + 20);

  // Write Altitude Rational at offset 174: 215 m
  pos = altDataOffset;
  tiff.writeUInt32LE(215, pos);
  tiff.writeUInt32LE(1, pos + 4);

  // Write DateTime string at offset 190: "2024:05:15 10:30:00\0"
  pos = dateOffset;
  tiff.write("2024:05:15 10:30:00\0", pos);

  const app1Length = 2 + 6 + tiff.length;
  const app1Header = Buffer.alloc(10);
  app1Header[0] = 0xff;
  app1Header[1] = 0xe1;
  app1Header.writeUInt16BE(app1Length, 2);
  app1Header.write("Exif\0\0", 4);

  const baseJpeg = Buffer.from(sampleBase64, "base64");
  return Buffer.concat([
    baseJpeg.subarray(0, 2),
    app1Header,
    tiff,
    baseJpeg.subarray(2),
  ]);
}

/**
 * Generates a clean 1x1 JPEG without any EXIF GPS data.
 */
function createPlainJpegBuffer(): Buffer {
  const sampleBase64 =
    "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
  return Buffer.from(sampleBase64, "base64");
}

/**
 * Generates an MP4 video with embedded QuickTime ISO 6709 location atom (©xyz).
 * Coordinates: New Delhi, India (+28.6139+077.2090+215.000/)
 */
function createGeotaggedMp4Buffer(): Buffer {
  // 1. ftyp box (24 bytes)
  const ftyp = Buffer.from([
    0x00, 0x00, 0x00, 0x18,
    0x66, 0x74, 0x79, 0x70, // 'ftyp'
    0x6d, 0x70, 0x34, 0x32, // 'mp42'
    0x00, 0x00, 0x00, 0x00,
    0x69, 0x73, 0x6f, 0x6d, // 'isom'
    0x6d, 0x70, 0x34, 0x32, // 'mp42'
  ]);

  // 2. ©xyz box inside udta
  const locStr = "+28.6139+077.2090+215.000/";
  const locBytes = Buffer.from(locStr, "utf8");
  const xyzBoxLen = 8 + 4 + locBytes.length;
  const xyzBox = Buffer.alloc(xyzBoxLen);
  xyzBox.writeUInt32BE(xyzBoxLen, 0);
  xyzBox.set([0xa9, 0x78, 0x79, 0x7a], 4); // '©xyz'
  xyzBox.writeUInt16BE(locBytes.length, 8); // text size
  xyzBox.writeUInt16BE(0x15c7, 10); // English lang code
  locBytes.copy(xyzBox, 12);

  // 3. udta box
  const udtaLen = 8 + xyzBox.length;
  const udta = Buffer.alloc(udtaLen);
  udta.writeUInt32BE(udtaLen, 0);
  udta.write("udta", 4);
  xyzBox.copy(udta, 8);

  // 4. mvhd box (duration = 5.2 seconds, timescale = 1000)
  const mvhd = Buffer.alloc(108);
  mvhd.writeUInt32BE(108, 0);
  mvhd.write("mvhd", 4);
  mvhd.writeUInt32BE(3798600000, 12); // creation time at 8 + 4
  mvhd.writeUInt32BE(3798600000, 16); // modification time at 8 + 8
  mvhd.writeUInt32BE(1000, 20); // timescale at 8 + 12
  mvhd.writeUInt32BE(5200, 24); // duration at 8 + 16

  // 5. tkhd box (1920x1080 dimensions)
  const tkhd = Buffer.alloc(92);
  tkhd.writeUInt32BE(92, 0);
  tkhd.write("tkhd", 4);
  tkhd.writeUInt32BE(1920 << 16, 84); // width 1920
  tkhd.writeUInt32BE(1080 << 16, 88); // height 1080

  const trakLen = 8 + tkhd.length;
  const trak = Buffer.alloc(trakLen);
  trak.writeUInt32BE(trakLen, 0);
  trak.write("trak", 4);
  tkhd.copy(trak, 8);

  // 6. moov box
  const moovLen = 8 + mvhd.length + trak.length + udta.length;
  const moov = Buffer.alloc(moovLen);
  moov.writeUInt32BE(moovLen, 0);
  moov.write("moov", 4);
  mvhd.copy(moov, 8);
  trak.copy(moov, 8 + mvhd.length);
  udta.copy(moov, 8 + mvhd.length + trak.length);

  return Buffer.concat([ftyp, moov]);
}

/**
 * Generates an MP4 video without GPS metadata.
 */
function createPlainMp4Buffer(): Buffer {
  const ftyp = Buffer.from([
    0x00, 0x00, 0x00, 0x18,
    0x66, 0x74, 0x79, 0x70,
    0x6d, 0x70, 0x34, 0x32,
    0x00, 0x00, 0x00, 0x00,
    0x69, 0x73, 0x6f, 0x6d,
    0x6d, 0x70, 0x34, 0x32,
  ]);

  const mvhd = Buffer.alloc(108);
  mvhd.writeUInt32BE(108, 0);
  mvhd.write("mvhd", 4);
  mvhd.writeUInt32BE(1000, 20);
  mvhd.writeUInt32BE(4000, 24);

  const moovLen = 8 + mvhd.length;
  const moov = Buffer.alloc(moovLen);
  moov.writeUInt32BE(moovLen, 0);
  moov.write("moov", 4);
  mvhd.copy(moov, 8);

  return Buffer.concat([ftyp, moov]);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "gps";

  if (type === "video_gps") {
    const buffer = createGeotaggedMp4Buffer();
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": "inline; filename=\"sample-geotagged-video.mp4\"",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  if (type === "video_nogps") {
    const buffer = createPlainMp4Buffer();
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": "inline; filename=\"sample-plain-video.mp4\"",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  if (type === "nogps") {
    const buffer = createPlainJpegBuffer();
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": "inline; filename=\"sample-without-gps.jpg\"",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Default: sample JPEG with GPS
  const buffer = createGeotaggedJpegBuffer();
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Disposition": "inline; filename=\"india-gate-geotagged.jpg\"",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
