#!/usr/bin/python

import time, json, uuid, requests
from flask import Flask, jsonify, abort, request, make_response, url_for
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

@app.route('/')
def index():
    return "Ping? Pong!"

@app.route('/demo/write', methods=['POST'])
def incoming():
   if not request.json:
      abort(400)

   print json.dumps(request.json)
   coordinator = localDC
   used_dc = localDC
   current = time.localtime()
   bucket = str(current.tm_year) + str(current.tm_mon) + str(current.tm_mday) + str(current.tm_hour) + str(current.tm_min)
   d = time.strftime('%Y-%m-%dT%H:%M:%S', current)
   data1 = request.json['data1']
   data2 = request.json['data2']
   data3 = request.json['data3']
   query = """ INSERT INTO demo.table2 (bucket, ts, d, data1, data2, data3) VALUES ('%s', now(), '%s', '%s', '%s', '%s') """ % (str(bucket), str(d), str(data1), str(data2), str(data3))
   try:
      trace = request.json['trace']
   except:
      trace = "0"
   if trace == "0":
      try:
         session.execute (query)
         return """{"status": "success", "timestamp": "%s"}\n""" % (d)
      except:
         return """{"status": "failed"}"""
   else:
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
      return """{"status": "success", "dc": "%s", "timestamp": "%s"}""" % (used_dc, d)

@app.route("/demo/getcurrent/<string:trace>/", methods=['GET'])
def getcurrent(trace):
   coordinator = localDC
   used_dc = localDC
   current = time.localtime()
   bucket = str(current.tm_year) + str(current.tm_mon) + str(current.tm_mday) + str(current.tm_hour) + str(current.tm_min)
   ts = int(time.time() * 1000)
   query = """ select * from demo.table2 where bucket = '%s' limit 1 """ % (bucket)
   last_c = coordinator
   if trace == "1":
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
      d = "no result"
      for rows in result:
         d = rows['d']
      return """{"status": "success", "d": "%s", "used_dc": "%s"}""" % (d, used_dc)


## {
##    "pname": "<portal name>",
##    "lat": "<latitude",
##    "long": "<longitude>"
## }
@app.route("/lvfrogtech/portals", methods=['POST', 'PUT'])
def portals():
   if request.method == 'POST':
      search = request.json['p'].split()
      query = """ select * from ingress.portals where solr_query = '{"q":"portal:*%s*" """ % (search[0])
      cquery = """ select count(*) from ingress.portals where solr_query = '{"q":"portal:*%s*" """ % (search[0])
      for s in search:
         query = query + """ , "fq":"portal:*%s*" """ % (s)
         cquery = cquery + """ , "fq":"portal:*%s*" """ % (s)
      query = query + """ }' limit 5 """
      cquery = cquery + """ }' """

      print(query)
      print(cquery)
      final = ""
      rows = session.execute(query)
      if not rows:
          return '{"count": [{"total": [0]}]}'
      else:
         myjson = {'portals':[], 'count':[]}
         for row in rows:
            d = {}
            d['name'] = str(row.pname)
            d['intelurl'] = str(row.intelurl)
            myjson.get('portals').append(d)

            result = str(row.pname) + ": " + str(row.intelurl)
            final = final + "\n" + result
         d = {}
         d['total'] = session.execute(cquery)[0]
         myjson.get('count').append(d)
         output = json.dumps(myjson)
         print(output)
      return output
   if request.method == 'PUT':
      try:
         pname = request.json['pname'] #.replace('\'','')
         lat = request.json['lat']
         long = request.json['long']
         #lat = float(request.json['lat'])
         #long = float(request.json['long'])
         latlong = lat + "," + long
         intelurl = """ https://www.ingress.com/intel?ll=%s,%s&pll=%s,%s&z=19 """ %(lat, long, lat, long)
         #query = """ UPDATE ingress.portals SET status = 'S' WHERE pname = '%s' AND latlong = '%s'  """ % (pname, latlong)
         tokafka = pname + ";" + intelurl + ";" + latlong + ";" + lat + ";" + long
      except:
         print("ERROR: INPUT")
         abort(400)
      try:
         if request.json['status']:
            tokafka = tokafka + ";" + request.json['status']
      except:
         print("DEBUG: NO STATUS")

      print(tokafka)
      try:
         kafka.produce('ingressPortals', tokafka.encode('utf-8'))
      except:
         print("ERROR: KAFKA")
         abort(400)

      #print(query)
      #try:
      #   session.execute(query)
      #except:
      #   print("DEBUG: DSE ERROR")
      #   abort(400)
      return "success!"

#{"id":"<attackts>", "owner":"<owner>", "portal":"<portal>","plevel":"<plevel>", "address":"<address>", "health":"<health>", "attacker":"<attacker>", "attacktime":"<attacktime>"}
#{
#	"id": "<attackts>",
#	"owner": "<owner>",
#	"portal": "<portal>",
#	"plevel": "<plevel>",
#	"address": "<address>",
#	"health": "<health>",
#	"attacker": "<attacker>",
#	"attacktime": "<attacktime>"
#}
@app.route("/lvfrogtech/attacks", methods=['POST', 'PUT'])
def attacks():
   if request.method == 'PUT':
      try:
         id = request.json['id']
         owner = request.json['owner']
         portal = request.json['portal'].replace('\'','')
         plevel = request.json['plevel']
         address = request.json['address']
         health = request.json['health']
         attacker = request.json['attacker']
         attacktime = request.json['attacktime']
         tokafka =  id + ";" + owner + ";" +  portal + ";" +  plevel + ";" +  address+ ";" +  health + ";" + attacker + ";" + attacktime
      except:
         print("ERROR: INPUT")
         abort(400)

      print(tokafka)
      try:
         kafka.produce('ingressAttacks', tokafka.encode('utf-8'))
      except:
         print("ERROR: KAFKA")
         abort(400)
      return "success!"

#{"id":"<attackts>", "portal":"<portal", "remote":"<remote portal>", "attacker":"<attacker>"}'
#"$attacktime" "$portal" "$remote" "$attacker"
#{
#	"id": "<attackts>",
#	"portal": "<portal",
#	"remote": "<remote portal>",
#	"attacker": "<attacker>"
#}

@app.route("/lvfrogtech/links", methods=['POST', 'PUT'])
def links():
   if request.method == 'PUT':
      try:
         id = request.json['id']
         portal = request.json['portal'].replace('\'','')
         remote = request.json['remote']
         attacker = request.json['attacker']
         tokafka =  id + ";" +  portal + ";" +  remote + ";" +  attacker
      except:
         print("ERROR: INPUT")
         abort(400)

      print(tokafka)
      try:
         kafka.produce('ingressLinks', tokafka.encode('utf-8'))
      except:
         print("ERROR: KAFKA (ingressLinks)")
         abort(400)
      return "success!"


if __name__ == '__main__':
    app.run(debug=True)
