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

echo "THIS WILL REMOVE THE ENTIRE $1 DC! PRESS ENTER TO CONTINE!"
read waitforenter

for i in `curl -s http://${lcm}:${lcmport}/${clustername}/nodes | jq -rc '.[] | {dc, node_ip}' | grep -i $1 | jq '.' | grep node_ip | awk '{print $2}' | sed 's/"//g'`; do
 echo "Running decommission and data reset on $i"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo nodetool decommission -f"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo pkill -9 -f dse.jar"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/commitlog"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/data"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/hints"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/saved_caches"
done
