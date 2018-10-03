#!/bin/bash

filename=expansion.ips
keyfile=./priv.key
username=opsc

if [ -z "$1" ]; then
 echo "Script will decommission DSE from the cluster"
 echo "usage: $0 [DC Name]"
 exit 0
fi

for i in `cat $filename | grep -i "$1$" | awk '{print $1}'`; do
 echo "Running decommission and data reset on $i"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo nodetool decommission"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo pkill -9 -f dse.jar"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/commitlog"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/data"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/hints"
 ssh -oStrictHostKeyChecking=no -i $keyfile $username@$i "sudo rm -rf /var/lib/cassandra/saved_caches"
done
