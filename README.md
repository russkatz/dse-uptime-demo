# dse-uptime-demo
This demo showcases the ability of DataStax Enterprise (DSE) to be continuously available under any circumstance. The demo has  two parts: 
* demo application: a simple application that writes and reads data to and from DSE. If it misses a single write the application will crash
* khaosKatz: creates havok on the underlying Cassandra infrastructure by taking down individual nodes and entire data centers. 

Since DSE is active everywhere (e.g. nodes and data centers can go down) the demo application will still stay up.

# Setup and run via AssetHub
If you installed this demo from AssetHub -> Multi-Cloud Demo, then go to the main OpsCenter IP address and connect to port `8080` in your browser after the OpsCenter installation has finished (e.g. `http://123.222.32.4:8080`).

If you don't know what AssetHub is, then you can go to the next section :-)

# Manual setup and run
The following includes the instructions to configure this demo manually

## Setup the cluster
* 2+ DCs with 3+ nodes each
* OpsCenter

## Setup the Demo app
* `sudo apt-get install python-pip`
* `sudo pip install dse-driver`
* `git clone https://github.com/russkatz/dse-uptime-demo`
  * `cd dse-uptime-demo`

```  
  demo.ini: Configuration file
  makeini.sh: Script to create demo.ini based on Opscenter
  writeDemo.py: Demo application to write data into the cluster
  readDemo.py: Read application to read back data written into the cluster from the writeDemo app
  khaosKatz.sh: Automated Chaos! Simulates different cluster failure scenarios
```

* create demo.ini
  * `./makeini.sh demo.ini opscenter.hostname`
  
* optional: edit demo.ini
  * Setup SSL/Auth if required
  * Update SSH private keys
  * Change the consistency levels for the applications
  * Change local DCs for the read/write applications
  
## Running the Demo
To run the demo in the browser
* Open new terminal and run `./writeDemo.py`
* Open new terminal and run `./readDemo.py`
* Open new terminal and run `./khaosKatz.sh`
  * Select failure scenarios and see how the applications respond!
  

