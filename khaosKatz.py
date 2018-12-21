#!/usr/bin/python

import json
import urllib2


lcm = "127.0.0.1"
lcmport = 8888
clustername = "Demo"
username = "ubuntu"
keyfile = "./priv.key"
localdc = "OnPrem-DC1"
rolling_restart_delay = 1 #seconds between nodes during the rolling restart scenario
random_kill_percent = 33 #Percentage chance each node gets killed in the random scenario


def detectCluster():
   clusterInfo = []
   nodeInfo = []
   url = "http://%s:%s/%s/nodes""" % (lcm, lcmport, clustername)
   response = urllib2.urlopen(url)
   data = response.read()
   values = json.loads(data)
   for i in values:
      clusterInfo.append([i["node_ip"], i["dc"]])
   return clusterInfo

c = detectCluster()
for x in c:
 print """%s is in %s""" % (x[0], x[1])
