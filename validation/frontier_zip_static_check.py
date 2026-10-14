#!/usr/bin/env python3
"""Frontier Portable static ZIP regression checks. No dependencies, no network."""
import argparse, hashlib, json, pathlib, sys, zipfile
p=argparse.ArgumentParser();p.add_argument("archive");p.add_argument("--expected-sha256");a=p.parse_args()
path=pathlib.Path(a.archive);data=path.read_bytes();digest=hashlib.sha256(data).hexdigest()
issues=[];names=[]
with zipfile.ZipFile(path) as z:
    bad=z.testzip()
    if bad:issues.append("CRC failed: "+bad)
    for info in z.infolist():
        name=info.filename;names.append(name)
        parts=pathlib.PurePosixPath(name).parts
        if name.startswith("/") or ".." in parts:issues.append("unsafe path: "+name)
        if info.flag_bits & 1:issues.append("encrypted: "+name)
    if len(names)!=len(set(names)):issues.append("duplicate paths")
    js=[n for n in names if n.endswith(".js")]
    sw=[n for n in names if "service-worker" in n.lower() or "sw.js" in n.lower()]
if a.expected_sha256 and digest.lower()!=a.expected_sha256.lower():issues.append("archive SHA256 mismatch")
print(json.dumps({"file":str(path),"sha256":digest,"entries":len(names),"js_count":len(js),"service_worker_candidates":sw,"issues":issues,"status":"PASS" if not issues else "FAIL"},indent=2))
sys.exit(bool(issues))
