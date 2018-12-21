#!/usr/bin/python

from random import randint
import time
import paramiko
import json
import urllib2


lcm = "127.0.0.1"
lcmport = 8888
clustername = "Demo"
username = "opsc"
keyfile = "/home/ubuntu/dse-uptime-demo-working/priv.key"

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


def recoverNode(n):
   k = paramiko.RSAKey.from_private_key_file(keyfile)
   c = paramiko.SSHClient()
   c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
   c.connect( hostname = n, username = username, pkey = k )
   stdin , stdout, stderr = c.exec_command("sudo service dse stop")
   time.sleep(3)
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

#rollingRestart(10)
failed = randomKill(30)
json = json.dumps(failed)
print json

#failed = failSingleNode("AWS")

#killNode(c[0][0])
#print "Killed"
#time.sleep(10)
#print "Recovering"
#recoverNode(c[0][0])
#print "Recovered"
