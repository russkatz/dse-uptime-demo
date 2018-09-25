# dse-uptime-demo

## Setup the cluster
* 2 DC, 3 nodes each
* Opscenter

## Setup the load app on OpsCenter VM
* sudo apt-get install python-pip
* sudo pip install dse-driver
* git clone https://github.com/russkatz/dse-uptime-demo && cd dse-uptime-demo
* edit runLoad.py and update the contact points
* ./runLoad.py

## Setup khaosKatz
* Update priv.key with ssh key to access all of the DSE nodes
* Edit khaosKatz.sh and update the dcXnodeX IP addresses
* ./KhaosKatz
