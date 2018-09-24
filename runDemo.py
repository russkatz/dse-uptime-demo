#!/usr/bin/python

import sys
from random import randint

from dse.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT
from dse.auth import PlainTextAuthProvider
from dse.policies import DCAwareRoundRobinPolicy,TokenAwarePolicy, ConstantSpeculativeExecutionPolicy
from dse import ConsistencyLevel

#Configuration
contactpoints = ['172.31.2.63', '172.31.9.65']
localDC = "dc1"
CL = ConsistencyLevel.ONE
#CL = ConsistencyLevel.ALL
auth_provider = PlainTextAuthProvider (username='user1', password='password1')
profile1 = ExecutionProfile( load_balancing_policy=DCAwareRoundRobinPolicy(local_dc=localDC, used_hosts_per_remote_dc=3),
                            speculative_execution_policy=ConstantSpeculativeExecutionPolicy(.1, 20),
                            consistency_level = CL
                            )

print "Connecting to cluster"

cluster = Cluster( contact_points=contactpoints,
                   auth_provider=auth_provider,
                   execution_profiles={EXEC_PROFILE_DEFAULT: profile1},
                   )

session = cluster.connect()

session.execute (""" CREATE KEYSPACE IF NOT EXISTS stats WITH replication = {'class': 'NetworkTopologyStrategy', 'dc1': '3', 'dc2': '3'}  AND durable_writes = true """)
session.execute (""" CREATE TABLE IF NOT EXISTS  stats.player_stats ( name text, game text, ts timeuuid, stat1 int, stat2 int, stat3 int, PRIMARY KEY ((name, game), ts)) """)

c = 0
x = 0
while 1:

   name = randint(0,32)
   stat0 = randint(1,100)
   stat1 = randint(1,100)
   stat2 = randint(1,100)
   game = randint(1,100)
   session.execute (""" INSERT INTO stats.player_stats (name, game, ts, stat1, stat2, stat3) VALUES (%s, %s, now(), %s, %s, %s) """, (str(name), str(game), int(stat0), int(stat1), int(stat2)))
   #session.execute_async (""" INSERT INTO stats.player_stats (name, game, ts, stat1, stat2, stat3) VALUES (%s, %s, now(), %s, %s, %s) """, (str(name), str(game), int(stat0), int(stat1), int(stat2)))
   c = c + 1
   x = x + 1
   if(x == 1000):
      print(""" Rows Written %s """ ) % c
      x = 0

cluster.shutdown()
sys.exit(0)
