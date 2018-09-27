#!/bin/bash

username=ubuntu
keyfile=./priv.key

dc1node1=172.31.2.63
dc1node2=172.31.8.42
dc1node3=172.31.9.65
dc2node1=172.31.15.14
dc2node2=172.31.2.218
dc2node3=172.31.13.32


kill_node () {
 ssh -oStrictHostKeyChecking=no -i $keyfile $2@$1 "sudo pkill -9 -f dse.jar" > /dev/null
}

recover_node () {
 ssh -oStrictHostKeyChecking=no -i $keyfile $2@$1 "sudo service dse restart" > /dev/null
}

while [ 1 ]; do

clear
echo "Randomly selecting scenario.."
sleep 1
seed=$((1 + RANDOM % 5))
#echo $seed

if [ $seed = 1 ]; then
 #kill dc1/node1
 echo "Scenario: Crash DC1/Node1!"
 sleep 1
 echo "  Step: Kill -9 on DC1/Node1"
 kill_node $dc1node1 $username
 echo "  Step: Resting.."
 sleep 45
 echo "  Step: Restarting DC1/Node1!"
 recover_node $dc1node1 $username
fi


if [ $seed = 2 ]; then
 echo "Scenario: Crash DC1/Node2!"
 sleep 1
 echo "  Step: Kill -9 on DC1/Node2"
 kill_node $dc1node2 $username
 echo "  Step: Resting.."
 sleep 45
 echo "  Step: Restarting DC1/Node2!"
 recover_node $dc1node2 $username
fi

if [ $seed = 3 ]; then
 echo "Scenario: Crash DC1/Node3!"
 sleep 1
 echo "  Step: Kill -9 on DC1/Node3"
 kill_node $dc1node3 $username
 echo "  Step: Resting.."
 sleep 45
 echo "  Step: Restarting DC1/Node3!"
 recover_node $dc1node1 $username
fi

if [ $seed = 4 ]; then
 #kill dc1
 echo "Scenario: DC1 Total Failure!!"
 sleep 1
 echo "  Step: Kill -9 on DC1 all nodes!"
 kill_node $dc1node1 $username
 kill_node $dc1node2 $username
 kill_node $dc1node3 $username
 echo "  Step: Resting.."
 sleep 60
 echo "  Step: Restarting DC1 all nodes!"
 recover_node $dc1node1 $username
 recover_node $dc1node2 $username
 recover_node $dc1node3 $username
fi

if [ $seed = 5 ]; then
 echo "Scenario: Total DC1 failure!"
 echo "Bonus: During DC2 maintenance" 
 sleep 1
 echo "  Step: Stopping DC2/Node1 for maintenance"
 kill_node $dc2node1 $username
 echo "  Step: Resting.."
 sleep 20
 echo "  Step: Kill -9 on DC1 all nodes!"
 kill_node $dc1node1 $username
 kill_node $dc1node2 $username
 kill_node $dc1node3 $username
 echo "  Step: Resting.."
 sleep 60
 echo "  Step: Restarting DC2/Node1!"
 recover_node $dc2node1 $username
 sleep 1
 echo "  Step: Restarting DC1 all nodes!"
 recover_node $dc1node1 $username
 recover_node $dc1node2 $username
 recover_node $dc1node3 $username
fi

echo "  Step: Recovering for next scenario"
sleep 60
echo "  =^_^= khaosKatz is pleased."
sleep 1

done
