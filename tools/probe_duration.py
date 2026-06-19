"""Liest die Dauer einer MP4/M4A-Datei aus der mvhd-Box (ohne externe Abhaengigkeiten).
Aufruf: python probe_duration.py <pfad-zur-m4a>
"""
import struct
import sys


def duration_seconds(path):
    with open(path, "rb") as f:
        data = f.read()
    i = data.find(b"mvhd")
    if i < 0:
        raise ValueError("keine mvhd-Box gefunden")
    off = i + 4
    version = data[off]
    off += 4
    if version == 1:
        off += 16  # creation (8) + modification (8)
        timescale = struct.unpack(">I", data[off:off + 4])[0]
        off += 4
        dur = struct.unpack(">Q", data[off:off + 8])[0]
    else:
        off += 8  # creation (4) + modification (4)
        timescale = struct.unpack(">I", data[off:off + 4])[0]
        off += 4
        dur = struct.unpack(">I", data[off:off + 4])[0]
    return dur / timescale, len(data)


if __name__ == "__main__":
    path = sys.argv[1]
    secs, size = duration_seconds(path)
    print(f"{secs:.1f} sec = {int(secs // 60)}:{int(secs % 60):02d} min | {size} bytes | {size / 1048576:.1f} MB")
