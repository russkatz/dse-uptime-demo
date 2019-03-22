#!/bin/bash

inifile=$1
template=./ini.template

if [ -z "$1" ]; then
  echo "usage: $0 <ini file name> [opscenter address]"
  exit 1
fi

cp $template $inifile
opscenter=localhost
if [ `echo $2 | wc -c` -gt 2 ]; then
  opscenter=$2
fi

cluster=`curl -s http://${opscenter}:8888/cluster-configs | jq -r 'keys[0]'`
nodes=`curl -s http://${opscenter}:8888/$cluster/nodes | jq -rc ".[].node_ip" | tr '\n' ',' | sed 's/\,$//g'`
dcs=(`curl -s http://${opscenter}:8888/${cluster}/nodes | jq -rc ".[].dc" | sort | uniq`)
for i in ${dcs[@]}; do
  dccount=$(( $dccount + 1 ))
done

sed -i "s/^contactpoints.*$/contactpoints = $nodes/g" $inifile
sed -i "s/^clustername.*$/clustername = $cluster/g" $inifile
rdc=${dcs[$((RANDOM % $dccount))]}
sed -i "s/^khaoslocalDC.*$/localDC = $rdc/g" $inifile
sed -i "s/^writelocalDC.*$/localDC = $rdc/g" $inifile
sed -i "s/^readlocalDC.*$/localDC = ${dcs[$((RANDOM % $dccount))]}/g" $inifile
