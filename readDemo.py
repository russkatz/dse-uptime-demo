#!/usr/bin/python

import sys
from random import randint
import time

from dse.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT
from dse.auth import PlainTextAuthProvider
from dse.policies import DCAwareRoundRobinPolicy,TokenAwarePolicy, ConstantSpeculativeExecutionPolicy
from dse import ConsistencyLevel

from ConfigParser import ConfigParser


config = ConfigParser()
config.read('demo.ini')
section = 'READ'

#Default CL if not set in config ini
CL = ConsistencyLevel.ONE

#Configuration
contactpoints = config.get('CONFIG','contactpoints').split(',')
localDC = config.get(section,'localDC')
rowcount = config.getint(section,'rowcount')
cross_dc_latency = config.getint('CONFIG','crossdclatency')
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


profile1 = ExecutionProfile( load_balancing_policy=DCAwareRoundRobinPolicy(local_dc=localDC, used_hosts_per_remote_dc=3),
                            speculative_execution_policy=ConstantSpeculativeExecutionPolicy(.05, 20),
                            consistency_level = CL
                            )

print "Connecting to cluster"

cluster = Cluster( contact_points=contactpoints,
                   auth_provider=auth_provider,
                   execution_profiles={EXEC_PROFILE_DEFAULT: profile1},
                   )

session = cluster.connect()

used_dc = localDC
coordinator = localDC
c = 0
x = 0
d = ""

while 1:

   current = time.localtime()
   bucket = str(current.tm_year) + str(current.tm_mon) + str(current.tm_mday) + str(current.tm_hour) + str(current.tm_min)

   ts = int(time.time() * 1000)

   query = """ select * from demo.table1 where bucket = '%s' limit 1 """ % (bucket)
   try:
    results = session.execute (query)
   except: 
    error = 1
   for r in results:
    d = r.d
   while ts + cross_dc_latency > int(time.time() * 1000):
    t1 = 0
   c = c + 1
   x = x + 1
   if(x == rowcount):
    last_c = coordinator
    future = session.execute_async (query, trace=True )
    try:
     result = future.result()
     trace = future.get_query_trace( 1 )
     coordinator =  trace.coordinator
    except:
     coordinator = last_c
    for h in session.hosts:
     if h.address == coordinator:
      used_dc = h.datacenter
      print(""" Rows Read %s (%s) - %s""" ) % (c, used_dc, d)
    x = 0

cluster.shutdown()
sys.exit(0)
