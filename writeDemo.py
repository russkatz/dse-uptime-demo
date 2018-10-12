#!/usr/bin/python

import sys
from random import randint
import time

from dse.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT
from dse.auth import PlainTextAuthProvider
from dse.policies import DCAwareRoundRobinPolicy,TokenAwarePolicy, ConstantSpeculativeExecutionPolicy
from dse import ConsistencyLevel
from ssl import PROTOCOL_TLSv1, CERT_REQUIRED, CERT_OPTIONAL


#Configuration
contactpoints = ['52.53.193.214', '40.83.216.171', '35.199.175.52','52.53.249.100']
localDC = "OnPrem-DC1"
cross_dc_latency_ms = 3
rowcount = 10
CL = ConsistencyLevel.ONE
#CL = ConsistencyLevel.ALL
ks_query = """ CREATE KEYSPACE IF NOT EXISTS demo WITH replication = {'class': 'NetworkTopologyStrategy', 'AWS': 3} """
auth_provider = PlainTextAuthProvider (username='user1', password='password1')
ssl_opts = None
#ssl_opts = {
#    'ca_certs': '/path/to/ca.crt',
#    'ssl_version': PROTOCOL_TLSv1,
#    'cert_reqs':  CERT_OPTIONAL
#}


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
