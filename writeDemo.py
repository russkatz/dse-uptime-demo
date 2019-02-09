#!/usr/bin/python

import sys
from random import randint
import time

from dse.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT
from dse.auth import PlainTextAuthProvider
from dse.policies import DCAwareRoundRobinPolicy,TokenAwarePolicy, ConstantSpeculativeExecutionPolicy
from dse import ConsistencyLevel
from ssl import PROTOCOL_TLSv1, CERT_REQUIRED, CERT_OPTIONAL

from ConfigParser import ConfigParser


config = ConfigParser()
config.read('demo.ini')
section = 'WRITE'

#Default CL if not set in config ini
CL = ConsistencyLevel.ONE

#Configuration
contactpoints = config.get('CONFIG','contactpoints').split(',')
localDC = config.get(section,'localDC')
rowcount = config.getint(section,'rowcount')
cross_dc_latency_ms = config.getint('CONFIG','crossdclatency')
ks_query = config.get('CONFIG','ks_query')
auth_provider = PlainTextAuthProvider (username= config.get('CONFIG','clusteruser'), password= config.get('CONFIG','clusterpass'))

if config.get(section,'cl') == "ONE":
   CL = ConsistencyLevel.ONE
if config.get(section,'cl') == "TWO":
   CL = ConsistencyLevel.TWO
if config.get(section,'cl') == "LOCAL_QUORUM":
   CL = ConsistencyLevel.LOCAL_QUORUM
if config.get(section,'cl') == "QUORUM":
   CL = ConsistencyLevel.QUORUM
if config.get(section,'cl') == "ALL":
   CL = ConsistencyLevel.ALL

#SSL
if config.getint('CONFIG','sslenabled') == 0:
   ssl_opts = None
else:
   ssl_opts = {
       'ca_certs':  config.get('CONFIG','sslca'),
       'ssl_version': PROTOCOL_TLSv1,
       'cert_reqs':  CERT_OPTIONAL
   }



#End configuration section
profile1 = ExecutionProfile( load_balancing_policy=DCAwareRoundRobinPolicy(local_dc=localDC, used_hosts_per_remote_dc=3),
                            speculative_execution_policy=ConstantSpeculativeExecutionPolicy(.05, 20),
                            consistency_level = CL
                            )

print "Connecting to cluster"

cluster = Cluster( contact_points=contactpoints,
                   auth_provider=auth_provider,
                   ssl_options=ssl_opts,
                   execution_profiles={EXEC_PROFILE_DEFAULT: profile1},
                   )

session = cluster.connect()

session.execute (ks_query)
session.execute (""" CREATE TABLE IF NOT EXISTS  demo.table1 (     bucket text,     ts timeuuid,     d text,     data1 int,     data2 int,     data3 int,     PRIMARY KEY (bucket, ts)) WITH CLUSTERING ORDER BY (ts desc) """)

coordinator = localDC
used_dc = localDC
c = 0
x = 0
while 1:

   data1 = randint(1,100)
   data2 = randint(1,100)
   data3 = randint(1,100)
   current = time.localtime()
   bucket = str(current.tm_year) + str(current.tm_mon) + str(current.tm_mday) + str(current.tm_hour) + str(current.tm_min)
   d = time.strftime('%Y-%m-%dT%H:%M:%S', current)
   query = """ INSERT INTO demo.table1 (bucket, ts, d, data1, data2, data3) VALUES ('%s', now(), '%s', %s, %s, %s) """ % (str(bucket), str(d), int(data1), int(data2), int(data3))
   session.execute (query)
   #session.execute_async (query)
   ts = int(time.time() * 1000)
   while ts + cross_dc_latency_ms > int(time.time() * 1000):
    t1 = 0
   c = c + 1
   x = x + 1
   #print ".",
   if(x == rowcount):
    last_c = coordinator
    future = session.execute_async (query, trace=True )
    result = future.result()
    try:
     trace = future.get_query_trace(1)
     coordinator =  trace.coordinator
    except:
     coordinator = last_c
    for h in session.hosts:
     if h.address == coordinator:
      used_dc = h.datacenter
    print(""" Rows Written %s (%s) - %s""" ) % (c, used_dc, d)
    x = 0

cluster.shutdown()
sys.exit(0)
