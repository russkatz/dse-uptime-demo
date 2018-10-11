#!/bin/bash

lcm=127.0.0.1
lcmport=8888
clustername=Demo
keyfile=./priv.key
username=opsc

if [ -z "$1" ]; then
 echo "Script will decommission DSE from the cluster"
 echo "usage: $0 [DC Name]"
 exit 0
fi

for i in `curl -s http://${lcm}:${lcmport}/${clustername}/nodes | jq  -rc '.[].node_ip + "^" + .[].dc' | grep -i "$1$" | awk -F^ '{print $1}'`; do
 echo "Running decommission and data reset on $i"
 echo ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo nodetool decommission -f"
 echo ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo pkill -9 -f dse.jar"
 echo ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/commitlog"
 echo ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/data"
 echo ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/hints"
 echo ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/saved_caches"
done
