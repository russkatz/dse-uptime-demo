#!/usr/bin/python

import time, uuid, requests, urllib2, paramiko, json
from random import randint

from flask import Flask, jsonify, abort, request, make_response, url_for, Response
from flask_cors import CORS, cross_origin

from dse.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT
from dse.auth import PlainTextAuthProvider
from dse.policies import DCAwareRoundRobinPolicy,TokenAwarePolicy, ConstantSpeculativeExecutionPolicy
from dse import ConsistencyLevel

from ssl import PROTOCOL_TLSv1, CERT_REQUIRED, CERT_OPTIONAL

from ConfigParser import ConfigParser

app = Flask(__name__)
CORS(app)

config = ConfigParser()
config.read('demo.ini')

#Configuration

contactpoints = config.get('CONFIG','contactpoints').split(',')
localDC = config.get('KHAOS','localDC')
lcm = config.get('KHAOS','lcm')
lcmport = config.get('KHAOS','lcmport')
clustername = config.get('CONFIG','clustername').replace(' ','%20')
username = config.get('KHAOS','sshusername')
keyfile = config.get('KHAOS','sshkeyfile')
rowcount = config.getint('CONFIG','rowcount')
ks_query = config.get('CONFIG','ks_query')
auth_provider = PlainTextAuthProvider (username= config.get('CONFIG','clusteruser'), password= config.get('CONFIG','clusterpass'))

if config.getint('CONFIG','sslenabled') == 0:
   ssl_opts = None
else:
   ssl_opts = {
       'ca_certs':  config.get('CONFIG','sslca'),
       'ssl_version': PROTOCOL_TLSv1,
       'cert_reqs':  CERT_OPTIONAL
   }



#End Configuration
profile1 = ExecutionProfile( load_balancing_policy=DCAwareRoundRobinPolicy(local_dc=localDC, used_hosts_per_remote_dc=3),
                            speculative_execution_policy=ConstantSpeculativeExecutionPolicy(.05, 20),
                            consistency_level = ConsistencyLevel.ONE
                            )

print "Connecting to cluster"

cluster = Cluster( contact_points=contactpoints,
                   auth_provider=auth_provider,
                   ssl_options=ssl_opts,
                   execution_profiles={EXEC_PROFILE_DEFAULT: profile1},
                   )


session = cluster.connect()
print "Connected to cluster"

session.execute (ks_query)
session.execute (""" CREATE TABLE IF NOT EXISTS  demo.table2 (     bucket text,     ts timeuuid,     d text,     data1 text,     data2 text,     data3 text,     PRIMARY KEY (bucket, ts)) WITH CLUSTERING ORDER BY (ts desc) """)
cluster.shutdown()

#KhaosKatz functions
def detectCluster():
   clusterInfo = []
   nodeInfo = []
   url = """http://%s:%s/%s/nodes""" % (lcm, lcmport, clustername)
   print url
   response = urllib2.urlopen(url)
   data = response.read()
   values = json.loads(data)
   for i in values:
      clusterInfo.append([i["node_ip"], i["dc"]])
   return clusterInfo

def recoverNode(n):
   k = paramiko.RSAKey.from_private_key_file(keyfile)
   c = paramiko.SSHClient()
   c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
   c.connect( hostname = n, username = username, pkey = k )
   url = """http://%s:%s/%s/ops""" % (lcm, lcmport, clustername)
   #d = """{"ips":["%s"],"action":"stop"}""" % (n)
   #requests.post(url, data = d)
   stdin , stdout, stderr = c.exec_command("sudo service dse stop")
   time.sleep(3)
   d = """{"ips":["%s"],"action":"start"}""" % (n)
   requests.post(url, data = d)
   stdin , stdout, stderr = c.exec_command("sudo rm -rf /tmp/dse/*")
   stdin , stdout, stderr = c.exec_command("sudo service dse start")
   return "Recovered"

def killNode(n):
   k = paramiko.RSAKey.from_private_key_file(keyfile)
   c = paramiko.SSHClient()
   c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
   c.connect( hostname = n, username = username, pkey = k )
   stdin , stdout, stderr = c.exec_command("sudo pkill -9 -f dse.jar")
   return "Killed"

def failSingleNode(localdc):
   c = detectCluster()
   dc = ""
   while dc != localdc:
      r = randint(1,len(c) - 1)
      node = c[r][0]
      dc = c[r][1]
   killNode(node)
   return node

def failDualNode(localdc):
   n1 = failLocalNode()
   n2 = n1
   while n2 == n1:
      n2 = failLocalNode()
   return [n1, n2]


def failDC(localdc):
   c = detectCluster()
   killList = []
   for n in c:
      if n[1] == localdc:
         killNode(n[0])
         killList.append(n[0])
   return killList

def rollingRestart(delay):
   c = detectCluster()
   for n in c:
      killNode(n[0])
      time.sleep(2)
      recoverNode(n[0])
      time.sleep(delay)
   return "ok"

def randomKill(chance):
   c = detectCluster()
   killList = []
   failsafe = 0
   for n in c:
      roll = randint(1,100)
      if roll <= chance:
         if failsafe == 1:
            killNode(n[0])
            killList.append(n[0])
      failsafe = 1
   return killList

#API Endpoints Below
@app.route('/')
def index():
    return "Ping? Pong!"

@app.route('/demo/write', methods=['POST'])
def writev0():
   if not request.json or not 'count' in request.json or not 'dc' in request.json or not 'cl' in request.json:
      abort(400)
   dc = request.json['dc']
   count = request.json['count']
   cl = request.json['cl']
   if not cl == "ONE" and not cl == "TWO" and not cl == "ALL" and not cl == "LOCAL_QUORUM" and not cl == "QUORUM":
      abort(400)
   if cl == "ONE":
      CL = ConsistencyLevel.ONE
   if cl == "TWO":
      CL = ConsistencyLevel.TWO
   if cl == "LOCAL_QUORUM":
      CL = ConsistencyLevel.LOCAL_QUORUM
   if cl == "QUORUM":
      CL = ConsistencyLevel.QUORUM
   if cl == "ALL":
      CL = ConsistencyLevel.ALL
   
   def writeStream():
      coordinator = dc
      last_c = coordinator
      used_dc = dc
      #current = time.localtime()

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
         r = {} #Results Dictionary
         current = time.localtime()
         bucket = str(current.tm_year) + str(current.tm_mon) + str(current.tm_mday) + str(current.tm_hour) + str(current.tm_min)
         r["d"] = time.strftime('%Y-%m-%dT%H:%M:%S', current)
         data1 = randint(1,100)
         data2 = randint(1,100)
         data3 = randint(1,100)
         query = """ INSERT INTO demo.table2 (bucket, ts, d, data1, data2, data3) VALUES ('%s', now(), '%s', '%s', '%s', '%s') """ % (str(bucket), str(r["d"]), str(data1), str(data2), str(data3))
         writefail = 0
         r["result"] = "Successful"
         try:
            session.execute(query)
         except Exception as e:
            print ("Write failed.")
            writefail = 1
            for i in e:
               errormsg = i
               errormsg = str(errormsg).replace('"', '')
            r["count"] = x
            r["dc"] = used_dc
            r["result"] = errormsg
            yield json.dumps(r) + "\r\n"
         if writefail == 1:
            cluster.shutdown() 
            return
            yield
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
               r["count"] = x
               r["dc"] = used_dc
               yield json.dumps(r) + "\r\n"
            except Exception as e:
               for i in e:
                  errormsg = i
                  errormsg = str(errormsg).replace('"', '')
               print ("Trace failed.")
               r["count"] = x
               r["dc"] = used_dc
               r["result"] = errormsg
               yield json.dumps(r) + "\r\n"
               cluster.shutdown() 

         time.sleep(.03)  # an artificial delay
         x = x + 1
         y = y + 1
      cluster.shutdown()
   return Response(writeStream(), content_type='application/stream+json')


@app.route('/demo/read', methods=['POST'])
def read():
   if not request.json or not 'count' in request.json or not 'dc' in request.json or not 'cl' in request.json:
      abort(400)
   dc = request.json['dc']
   count = request.json['count']
   cl = request.json['cl']
   if not cl == "ONE" and not cl == "TWO" and not cl == "ALL" and not cl == "LOCAL_QUORUM" and not cl == "QUORUM":
      abort(400)
   if cl == "ONE":
      CL = ConsistencyLevel.ONE
   if cl == "TWO":
      CL = ConsistencyLevel.TWO
   if cl == "LOCAL_QUORUM":
      CL = ConsistencyLevel.LOCAL_QUORUM
   if cl == "QUORUM":
      CL = ConsistencyLevel.QUORUM
   if cl == "ALL":
      CL = ConsistencyLevel.ALL
   def readStream():
      coordinator = dc
      last_c = coordinator
      used_dc = dc
      current = time.localtime()
      bucket = str(current.tm_year) + str(current.tm_mon) + str(current.tm_mday) + str(current.tm_hour) + str(current.tm_min)

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
         r = {} #Results Dictionary
         current = time.localtime()
         bucket = str(current.tm_year) + str(current.tm_mon) + str(current.tm_mday) + str(current.tm_hour) + str(current.tm_min)
         #r["d"] = time.strftime('%Y-%m-%dT%H:%M:%S', current)
         query = """ select * from demo.table2 where bucket = '%s' limit 1 """ % (bucket)
         readfail = 0
         r["result"] = "Successful"
         try:
            results = session.execute (query)
         except Exception as e:
            print ("Read failed.")
            readfail = 1
            for i in e:
               errormsg = i
               errormsg = str(errormsg).replace('"', '')
            r["count"] = x
            r["dc"] = used_dc
            r["result"] = errormsg
            r["d"] = "00:00:00"
            yield json.dumps(r) + "\r\n"
         if readfail == 1:
            cluster.shutdown()
            return
            yield

         for row in results:
            r["d"] = row.d

         if(y == rowcount):
            y = 0
            try:
               future = session.execute_async (query, trace=True )
               result = future.result()
               try:
                  trace = future.get_query_trace( 1 )
                  coordinator =  trace.coordinator
               except:
                  coordinator = last_c
               for h in session.hosts:
                  if h.address == coordinator:
                     used_dc = h.datacenter
               r["count"] = x
               r["dc"] = used_dc
               yield json.dumps(r) + "\r\n"
            except Exception as e:
               for i in e:
                  errormsg = i
                  errormsg = str(errormsg).replace('"', '')
               print ("Read trace failed.")
               r["count"] = x
               r["dc"] = used_dc
               r["result"] = errormsg
               yield json.dumps(r) + "\r\n"
               cluster.shutdown()

         time.sleep(.03)  # an artificial delay
         x = x + 1
         y = y + 1
      cluster.shutdown()
   return Response(readStream(), content_type='application/stream+json')


@app.route('/demo/node', methods=['GET'])
def node():
   nodeList = []
   c = detectCluster()
   for n in c:
      addMe = 1
      for d in nodeList:
         if d == n[0]:
            addMe = 0
      if addMe == 1:
         nodeList.append(n[0])
   #dcSet = set(dcList)
   #dcList = dict.fromkeys("dc", dcSet)
   return json.dumps(nodeList)

@app.route('/demo/dc', methods=['GET'])
def dc():
   dcList = []
   c = detectCluster()
   for n in c:
      addMe = 1
      for d in dcList:
         if d == n[1]:
            addMe = 0
      if addMe == 1:
         dcList.append(n[1])
   #dcSet = set(dcList)
   #dcList = dict.fromkeys("dc", dcSet)
   return json.dumps(dcList)


@app.route('/demo/nodefull', methods=['GET'])
def nodefull():
   clusterInfo = []
   nodeInfo = []
   url = "http://%s:%s/%s/nodes""" % (lcm, lcmport, clustername)
   response = urllib2.urlopen(url)
   data = json.loads(response.read())
   return json.dumps(data)


@app.route('/demo/recover', methods=['POST'])
def recover():
   if not request.json:
      abort(400)
   t = request.json
   for n in t:
      recoverNode(n)
   return "ok"

@app.route('/demo/killnode', methods=['POST'])
def killnode():
   if not request.json:
      abort(400)
   for n in request.json:
      killNode(n)
   return json.dumps(request.json)

@app.route('/demo/chaos', methods=['POST'])
def chaos():
   if not request.json or not 'dc' in request.json or not 'scenario' in request.json:
      abort(400)
   dc = request.json['dc']
   scenario = request.json['scenario']

   if scenario == 1: #Single node failure
     nodes = []
     failed = failSingleNode(dc) 
     nodes.append(failed)
     j = json.dumps(nodes)
     return j

   if scenario == 2: #Dual node failure
     failed = failDualNode(dc) 
     j = json.dumps(failed)
     return j

   if scenario == 3: # Total DC Failure
     failed = failDC(dc) 
     j = json.dumps(failed)
     return j

   if scenario == 4: # Rolling Restart
     if not 'rrdelay' in request.json:
        return "501: rrdelay missing from request"
     rrdelay = request.json['rrdelay']
     failed = rollingRestart(rrdelay) 
     return "[]"

   if scenario == 5: # Random Kill!
     if not 'killchance' in request.json:
        return "501: killchance missing from request"
     killchance = request.json['killchance']
     failed = killChange(killchance) 
     j = json.dumps(failed)
     return j

if __name__ == '__main__':
    app.run(debug=True)
