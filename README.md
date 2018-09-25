# dse-uptime-demo

## Setup the cluster
* 2 DC, 3 nodes each
* Opscenter

## Setup the load app
* sudo apt-get install python-pip
* sudo pip install dse-driver
* git clone https://github.com/russkatz/dse-uptime-demo && cd dse-uptime-demo
* edit runLoad.py and update the contact points
* ./runLoad.py (ctrl+C to quit)

## Setup khaosKatz
* Update priv.key with ssh key to access all of the DSE nodes
* Edit khaosKatz.sh
  update the dcXnodeX IP addresses
  Update SSH username
* ./khaosKatz (ctrl+C to quit)
