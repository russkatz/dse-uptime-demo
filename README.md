THESE INSTRUCTIONS ARE OLD! SEE GOOGLE DRIVE FOR LATEST!

# dse-uptime-demo
This demo is to showcase DSE's ability to be continuously available under any circumstance and it has two parts: The Demo application and khaosKatz. The Demo is a simple application that writes data into DSE, but if it misses a single write the application will crash. KhaosKatz will continously load random scenarios taking down different nodes and/or entire datacenters. The goal is to run the Demo application successfully even while khaosKatz starts taking things down ungracefully.

## Setup the cluster
* 2 DC, 3 nodes each
* Opscenter

## Setup the Demo app
* sudo apt-get install python-pip
* sudo pip install dse-driver
* git clone https://github.com/russkatz/dse-uptime-demo
  * cd dse-uptime-demo
* edit runDemo.py
  * Update the contact points
  * Update authentication information (if enabled on cluster)
* ./runDemo.py (ctrl+C to quit)

## Setup khaosKatz
* Update priv.key with ssh key to access all of the DSE nodes
* Edit khaosKatz.sh
  * update the dcXnodeX IP addresses
  * Update SSH username
* ./khaosKatz (ctrl+C to quit)

# Storylines
Different scenarios you can demo

## Prove that the application will really crash if it misses a single write
The application defaults to CL One which provides maximum availability. You may want to showcase how the application crashes on a single failure.
* Ctrl+C to stop the Demo Application if running
* Ctrl+C to stop khasKatz if running (Ensure all nodes are up)
* Edit runDemo.py
  * Comment `CL = ConsistencyLevel.ONE`
  * Uncomment `CL = ConsistencyLevel.ALL`
* ./runDemo.py (Show successful writes)
* ./khaosKatz (Show it fail during the first scenario)
* Edit runDemo.py and set back to CL One
* ./runDemo.py (Show how it now runs with CL One)
