#!/bin/bash

inifile=$1
cluster=`curl -s http://localhost:8888/cluster-configs | jq -r 'keys | .[0]'`
echo $cluster
nodes=`curl -s http://localhost:8888/$cluster/nodes | jq -rc ".[].node_ip" | tr '\n' ',' | sed 's/\,$//g'`

sed -i "s/^contactpoints.*$/contactpoints = $nodes/g" $inifile
sed -i "s/^clustername.*$/clustername = $cluster/g" $inifile
