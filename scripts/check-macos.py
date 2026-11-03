"""Controlla architettura e deployment target di ogni Mach-O incluso."""
import pathlib, re, subprocess, sys
app = pathlib.Path(sys.argv[1])
count = 0
for file in app.rglob("*"):
    if not file.is_file() or file.is_symlink():
        continue
    kind = subprocess.check_output(["file", "-b", str(file)], text=True)
    if "Mach-O" not in kind:
        continue
    archs = subprocess.check_output(["lipo", "-archs", str(file)], text=True).strip()
    if archs != "x86_64":
        raise SystemExit(f"Architettura inattesa: {file.name}: {archs}")
    commands = subprocess.check_output(["otool", "-l", str(file)], text=True)
    versions = []
    for block in commands.split("Load command"):
        if "LC_BUILD_VERSION" in block:
            match = re.search(r"\bminos\s+(\d+(?:\.\d+)+)", block)
        elif "LC_VERSION_MIN_MACOSX" in block:
            match = re.search(r"\bversion\s+(\d+(?:\.\d+)+)", block)
        else:
            continue
        if match:
            parts = list(map(int, match.group(1).split(".")))
            versions.append(tuple((parts + [0, 0])[:3]))
    if not versions or any(v > (13, 0, 0) for v in versions):
        raise SystemExit(f"Deployment target non compatibile: {file.name}: {versions}")
    count += 1
if not count:
    raise SystemExit("Nessun Mach-O trovato.")
print(f"{count} binari Intel con deployment target compatibile con Ventura.")
