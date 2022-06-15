#!/bin/env python3
import sys, json, gzip
from couchws import *

db = sys.argv[1]
request = "/"+db+"/"+"_all_docs?include_docs=true"
response = couch_webservice_request(request)
result={'docs': []}
docs = result['docs']
design = []
for it in response['rows']:
    doc = it['doc']
    if '_rev' in doc:
        del doc['_rev']
    docs.append(doc)
if sys.argv[2].endswith('.gz'):
    wh = gzip.open(sys.argv[2],'w')
    wh.write(json.dumps(result,indent=2).encode())
else:
    wh = open(sys.argv[2],'w')
    wh.write(json.dumps(result,indent=2))
wh.close()
