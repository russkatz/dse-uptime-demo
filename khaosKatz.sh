#!/bin/bash

inifile=demo.ini
interactive=1
rolling_restart_delay=1 #seconds between nodes during the rolling restart scenario
random_kill_percent=33 #Percentage chance each node gets killed in the random scenario

clustername=`grep -A 20 "\[CONFIG\]" $inifile | grep "^clustername" | head -1 | awk '{print $NF}'`
lcm=`grep -A 20 "\[KHAOS\]" $inifile | grep "^lcm =" | head -1 | awk '{print $NF}'`
lcmport=`grep -A 20 "\[KHAOS\]" $inifile | grep "^lcmport =" | head -1 | awk '{print $NF}'`
localdc=`grep -A 20 "\[KHAOS\]" $inifile | grep "^localDC" | head -1 | awk '{print $NF}'`
username=`grep -A 20 "\[KHAOS\]" $inifile | grep "^sshusername" | head -1 | awk '{print $NF}'`
keyfile=`grep -A 20 "\[KHAOS\]" $inifile | grep "^sshkeyfile" | head -1 | awk '{print $NF}'`

detect () {
 nodes=(`curl -s http://${lcm}:${lcmport}/${clustername}/nodes | jq -rc ".[].node_ip" | paste -s`)
 dcs=(`curl -s http://${lcm}:${lcmport}/${clustername}/nodes | jq -rc ".[].dc" | paste -s`)
 dccount=`echo ${dcs[@]} | sed 's/ /\n/g' | sort | uniq | wc -l`
 localnodes=()
 localnodecount=0
 remotenodes=()
 remotenodecount=0
 nodecount=0
 
 for i in ${nodes[@]}; do
  echo $i is in ${dcs[$nodecount]}
  if [ "${dcs[$nodecount]}" = "$localdc" ]; then
   localnodes[$localnodecount]=$i
   localnodecount=$(( $localnodecount + 1 ))
  else
   remotenodes[$remotenodecount]=$i
   remotenodecount=$(( $remotenodecount + 1 ))
  fi
  
  nodecount=$(( $nodecount + 1 ))
 done
 echo total nodes: ${nodecount}
 echo local nodes: ${localnodecount}
 echo remote nodes: ${remotenodecount}
 echo dc count: ${dccount}
}

kill_node () {
 ssh -oStrictHostKeyChecking=no -i $keyfile $2@$1 "sudo pkill -9 -f dse.jar" > /dev/null
}

recover_node () {
 ssh -oStrictHostKeyChecking=no -i $keyfile $2@$1 "sudo service dse stop" > /dev/null
 sleep 3
 ssh -oStrictHostKeyChecking=no -i $keyfile $2@$1 "sudo service dse start" > /dev/null
 #curl -X POST http://$lcm:$lcmport/$clustername/ops/start/$1
}

interact () {
 if [ $interactive -eq 1 ]; then
  echo -n "[Interactive] Press enter to continue"
  read tempvar
 fi
}

while [ 1 ]; do
clear
if [ $interactive = 1 ]; then
 echo "Interactive mode!"
 echo "1) Single local node failure"
 echo "2) Dual local node failure"
 echo "3) Dual remote node failure"
 echo "4) Total local DC failure"
 echo "5) Total local DC failure during maintenance"
 echo "6) Rolling Restart"
 echo "7) Random kill!"
 echo -n "Select scenario to run: "
 read seed
 clear
else
 echo "Randomly selecting scenario.."
 seed=$((1 + RANDOM % 7))
fi

detect
sleep 2
clear

if [ $seed = 1 ]; then
 #kill local node
 echo "Scenario: Single local node failure"
 sleep 1
 echo -n "  Step: Selecting node to crash.. "
 r=$((1 + RANDOM % $localnodecount ))
 r=$(( $r - 1 )) 
 crash=${localnodes[$r]}
 sleep 1
 echo $crash
 sleep 1
 echo "  Step: Kill -9 on $crash"
 kill_node $crash $username
 echo "  Step: Resting.."
 sleep 45
 interact
 echo "  Step: Restarting $crash"
 recover_node $crash $username
fi

if [ $seed = 2 ]; then
 #kill two local nodes
 echo "Scenario: Dual local node failure"
 sleep 1
 echo "  Step: Selecting nodes to crash.."
 r=$((1 + RANDOM % $localnodecount ))
 r=$(( $r - 1 )) 
 r2=${r}
 x=0
 while [ $x -eq 0 ]; do
  r2=$((1 + RANDOM % $localnodecount ))
  r2=$(( $r2 - 1 )) 
  if [ $r2 -ne $r ]; then
   x=1
  fi
 done
 crash1=${localnodes[$r]}
 crash2=${localnodes[$r2]}
 sleep 1
 echo "        $crash1"
 sleep 1
 echo "        $crash2"
 sleep 1
 echo "  Step: Sending Kill -9 to nodes"
 sleep 1
 echo "        $crash1"
 kill_node $crash1 $username
 sleep 1
 echo "        $crash2"
 kill_node $crash2 $username
 echo "  Step: Resting.."
 sleep 45
 interact
 echo "  Step: Restarting nodes"
 sleep 1
 echo "        $crash1"
 recover_node $crash1 $username
 sleep 1
 echo "        $crash2"
 recover_node $crash2 $username
fi

if [ $seed = 4 ]; then
 #kill local node
 echo "Scenario: Total local DC failure!"
 sleep 1
 echo "  Step: Sending Kill -9 to local nodes"
 for n in ${localnodes[@]}; do
  echo "        $n"
  kill_node $n $username
 done
 echo "  Step: Resting.."
 sleep 45
 interact
 echo "  Step: Restarting local nodes"
 for n in ${localnodes[@]}; do
  echo "        $n"
  recover_node $n $username
 done
fi

if [ $seed = 3 ]; then
 echo "Scenario: Dual remote node failure"
 sleep 1
 echo "  Step: Selecting nodes to crash.."
 r=$((1 + RANDOM % $remotenodecount ))
 r=$(( $r - 1 )) 
 r2=${r}
 x=0
 while [ $x -eq 0 ]; do
  r2=$((1 + RANDOM % $remotenodecount ))
  r2=$(( $r2 - 1 )) 
  if [ $r2 -ne $r ]; then
   x=1
  fi
 done
 crash1=${remotenodes[$r]}
 crash2=${remotenodes[$r2]}
 sleep 1
 echo "        $crash1"
 sleep 1
 echo "        $crash2"
 sleep 1
 echo "  Step: Sending Kill -9 to nodes"
 sleep 1
 echo "        $crash1"
 kill_node $crash1 $username
 sleep 1
 echo "        $crash2"
 kill_node $crash2 $username
 echo "  Step: Resting.."
 sleep 45
 interact
 echo "  Step: Restarting nodes"
 sleep 1
 echo "        $crash1"
 recover_node $crash1 $username
 sleep 1
 echo "        $crash2"
 recover_node $crash2 $username
fi

if [ $seed = 5 ]; then
 #kill local node
 echo "Scenario: Total local DC failure!"
 echo "Bonus: During remote DC maintenance!"
 sleep 1
 echo -n "  Step: Selecting remote node.. "
 r=$((1 + RANDOM % $remotenodecount ))
 r=$(( $r - 1 ))
 crash=${remotenodes[$r]}
 sleep 1
 echo $crash
 sleep 1
 echo "  Step: Stopping $crash for maintenance"
 kill_node $crash $username
 echo "  Step: Resting.."
 sleep 45
 echo "  Step: Sending Kill -9 to local nodes"
 for n in ${localnodes[@]}; do
  echo "        $n"
  kill_node $n $username
 done
 echo "  Step: Resting.."
 sleep 45
 interact
 echo "  Step: Restart remote node $crash"
 sleep 1
 recover_node $crash $username
 echo "  Step: Restarting local nodes"
 for n in ${localnodes[@]}; do
  echo "        $n"
  recover_node $n $username
 done
fi

if [ $seed = 6 ]; then
 #rolling restart
 echo "Scenario: Rolling Restart"
 for n in ${nodes[@]}; do 
  echo "  Restarting $n"
  kill_node $n $username
  recover_node $n $username
  sleep $rolling_restart_delay
 done
fi
 
if [ $seed = 7 ]; then
 echo "Scenario: Kill random nodes!"
 echo "Percent chance a node will be killed: ${random_kill_percent}%"
 nodeskilled=""
 safeguard=0
 for n in ${nodes[@]}; do 
  killit=0
  echo -n "  ${n}: "
  killrnd=$((1 + RANDOM % 100))
  if [ $killrnd -le $random_kill_percent ]; then
   killit=1
  fi
  if [ $safeguard -eq 0 ]; then
   safeguard=1
   killit=0
  fi
  sleep 1
  if [ $killit -eq 1 ]; then
   echo "Killed!"
   kill_node $n $username
   nodeskilled="$nodeskilled $n"
  else
   echo "Spared."
  fi
 done
 echo "  Step: Resting.."
 sleep 45
 interact
 echo "  Step: Restart killed nodes"
 for n in `echo $nodeskilled`; do
  echo "      $n"
  recover_node $n $username
 done
fi

  



#End of Scenarios
echo "  Step: Recovering for next scenario"
sleep 60
status=`curl -s http://$lcm:$lcmport/$clustername/nodes | jq -r ".[]".mode  | grep null > /dev/null | echo $?`
if [ $status -eq 1 ]; then
 echo "  =^_^= khaosKatz senses nodes still down!"
 echo "  Waiting 60 seconds"
 sleep 60
else 
 echo "  =^_^= khaosKatz is pleased."
fi
sleep 3

done
