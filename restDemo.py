#!/usr/bin/python

import time, json, uuid, requests
from random import randint

from flask import Flask, jsonify, abort, request, make_response, url_for, Response
from flask_cors import CORS, cross_origin

from dse.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT
from dse.auth import PlainTextAuthProvider
from dse.policies import DCAwareRoundRobinPolicy,TokenAwarePolicy, ConstantSpeculativeExecutionPolicy
from dse import ConsistencyLevel

from ssl import PROTOCOL_TLSv1, CERT_REQUIRED, CERT_OPTIONAL

app = Flask(__name__)
CORS(app)

#Configuration
contactpoints = ['40.78.69.234', '104.42.194.135']
localDC = "OnPrem-DC1"
#localDC = "AWS"
CL = ConsistencyLevel.ONE
#CL = ConsistencyLevel.ALL
cross_dc_latency = 30
rowcount = 10
auth_provider = PlainTextAuthProvider (username='user1', password='password1')
ssl_opts = None
ks_query = """ CREATE KEYSPACE IF NOT EXISTS demo WITH replication = {'class': 'NetworkTopologyStrategy', 'AWS': 3} """
#ssl_opts = {
#    'ca_certs': '/path/to/ca.crt',
#    'ssl_version': PROTOCOL_TLSv1,
#    'cert_reqs':  CERT_OPTIONAL
#}



#End Configuration
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
session.execute (""" CREATE TABLE IF NOT EXISTS  demo.table2 (     bucket text,     ts timeuuid,     d text,     data1 text,     data2 text,     data3 text,     PRIMARY KEY (bucket, ts)) WITH CLUSTERING ORDER BY (ts desc) """)

cluster.shutdown()

@app.route('/')
def index():
    return "Ping? Pong!"


@app.route('/demo/write', methods=['POST'])
def writev0():
   if not request.json or not 'count' in request.json or not 'dc' in request.json:
      abort(400)
   dc = request.json['dc']
   count = request.json['count']
   def writeStream():
      coordinator = dc
      last_c = coordinator
      used_dc = dc
      current = time.localtime()

      profile1 = ExecutionProfile( load_balancing_policy=DCAwareRoundRobinPolicy(local_dc=dc, used_hosts_per_remote_dc=3),
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

      x = 0
      y = 0
      while x <= count:
         current = time.localtime()
         bucket = str(current.tm_year) + str(current.tm_mon) + str(current.tm_mday) + str(current.tm_hour) + str(current.tm_min)
         d = time.strftime('%Y-%m-%dT%H:%M:%S', current)
         data1 = randint(1,100)
         data2 = randint(1,100)
         data3 = randint(1,100)
         query = """ INSERT INTO demo.table2 (bucket, ts, d, data1, data2, data3) VALUES ('%s', now(), '%s', '%s', '%s', '%s') """ % (str(bucket), str(d), str(data1), str(data2), str(data3))
         session.execute(query)
         if(y == rowcount):
            y = 0
            try:
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
               #yield """Rows Written %s (%s) - %s\n""" %(x, used_dc,  str(d))
               yield """{"count": %s, "dc": "%s", "d": "%s"}\n""" %(x, used_dc,  str(d))
            except:
               print("Cluster Shutdown")
               cluster.shutdown() 

         time.sleep(.03)  # an artificial delay
         x = x + 1
         y = y + 1
      cluster.shutdown()
   return Response(writeStream(), content_type='text/event-stream')


@app.route('/demo/read', methods=['POST'])
def read():
   if not request.json or not 'count' in request.json or not 'dc' in request.json:
      abort(400)
   dc = request.json['dc']
   count = request.json['count']
   def readStream():
      coordinator = dc
      last_c = coordinator
      used_dc = dc
      current = time.localtime()

      profile1 = ExecutionProfile( load_balancing_policy=DCAwareRoundRobinPolicy(local_dc=dc, used_hosts_per_remote_dc=3),
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




      x = 0
      y = 0
      while x <= count:
         current = time.localtime()
         bucket = str(current.tm_year) + str(current.tm_mon) + str(current.tm_mday) + str(current.tm_hour) + str(current.tm_min)
         d = time.strftime('%Y-%m-%dT%H:%M:%S', current)
         query = """ select * from demo.table1 where bucket = '%s' limit 1 """ % (bucket)
         try:
            results = session.execute (query)
         except:
            error = 1
         for r in results:
            d = r.d

         if(y == rowcount):
            y = 0
            try:
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
               #yield """Rows Written %s (%s) - %s\n""" %(x, used_dc,  str(d))
               yield """{"count": %s, "dc": "%s", "d": "%s"}\n""" %(x, used_dc,  str(d))
            except:
               print("Cluster Shutdown")
               cluster.shutdown() 
               x = count + 1
                

         time.sleep(.03)  # an artificial delay
         x = x + 1
         y = y + 1
      cluster.shutdown()
   return Response(readStream(), content_type='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)
