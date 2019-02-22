# dse-uptime-demo
This demo is to showcase DSE's ability to be continuously available under any circumstance and it has two parts: The Demo application and khaosKatz. The Demo is a simple application that writes data into DSE, but if it misses a single write the application will crash. KhaosKatz will continously load random scenarios taking down different nodes and/or entire datacenters. The goal is to run the Demo application successfully even while khaosKatz starts taking things down ungracefully.

## Setup the cluster
* 2+ DCs, 3+ nodes each
* Opscenter

## Setup the Demo app
(Note: If you installed the AssetHub Multi-Cloud Cluster everything is already setup in /tmp/dse-uptime-demo on the opscenter node. If you don't know what AssetHub is you can safely ignore this note :) )

* sudo apt-get install python-pip
* sudo pip install dse-driver
* git clone https://github.com/russkatz/dse-uptime-demo
  * cd dse-uptime-demo

```  
  demo.ini: Configuration file
  makeini.sh: Script to create demo.ini based on Opscenter
  writeDemo.py: Demo application to write data into the cluster
  readDemo.py: Read application to read back data written into the cluster from the writeDemo app
  khaosKatz.sh: Automated Chaos! Simulates different cluster failure scenarios
```

* create demo.ini
  * ./makeini.sh demo.ini opscenter.hostname
  
* optional: edit demo.ini
  * Setup SSL/Auth if required
  * Update SSH private keys
  * Change the consistency levels for the applications
  * Change local DCs for the read/write applications
  
## Running the Demo
* open new terminal and run ./writeDemo.py
* open new terminal and run ./readDemo.py
* Open new terminal and run ./khaosKatz.sh
  * Select failure scenarios and see how the applications respond!
  

