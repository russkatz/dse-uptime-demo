import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CardHeader from 'material-kit-react/components/Card/CardHeader';

import { scaleLinear } from "d3-scale"
import geographyObject from "../data/world-50m.json"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps"

import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import {updateValue} from '../actions/actions'

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 2,
    }
});

const colorScale = scaleLinear()
  .domain([0, 100000000, 1338612970]) // Max is based on China
  //.range(["#FFF176", "#FFC107", "#E65100"])
  .range(["#D3D3D3", "#808080", "#A9A9A9"])

const max = 20;
const min = 10;
const twoPi = Math.PI * 2;

const nodeScale = scaleLinear()
  .domain([0,1])
  .range([min,max])

function circleX(i, dcCount, zoom){
  let input = (i % dcCount) +1;

  let x = Math.round(100*Math.cos(twoPi / (dcCount)* input ) * max) / 100;
  return x * zoom; 
}

function circleY(i, dcCount, zoom){
  let input = (i % dcCount) +1;

  let y = Math.round(100*Math.sin(twoPi / (dcCount) * input )* max)/100;
  return y * zoom; 
}

const nodeColors = ["#A4D233", "#FFC72C", "#ca1313"]

const getNodeStroke = function(node){
  return "#8031A7";
}

const getNodeFill = function(node){
  if (node.last_seen == -1){
   return nodeColors[1]
  }
  if (node.last_seen == 0){
   return nodeColors[0]
  }
  else{
   return nodeColors[2]
  }
}

class DataCenterMap extends React.Component {
    render(){

      
      return (
        <div className={"spanningDiv"}>
            <div className={"spanningDiv"}>
              <CardHeader className={"cardheader"} style={{paddingTop: '20px', position: 'absolute', width: '75%'}}>DataStax Cluster
                        { this.props.fullscreen != "dc-paper" ? 
                <IconButton onClick={() => { this.props.updateValue("fullscreen", "dc-paper")}} color="primary" aria-label="Fullscreen">
                            <FullscreenIcon />
                </IconButton>
                  : 
                <IconButton onClick={() => { this.props.updateValue("fullscreen", "")}} color="primary" aria-label="Fullscreen Exit">
                            <FullscreenExitIcon />
                </IconButton>

                }
        </CardHeader>
              <ComposableMap style={{ width: "100%", height: "100%" }} height={window.innerHeight* .3}>
                <ZoomableGroup  
                  center={ this.props.mapCenter } 
                  zoom={ this.props.mapZoom }
                  onMoveEnd={ (newCenter) => this.props.updateValue("mapCenter", newCenter) }
                >
                  <Geographies geography={geographyObject} disableOptimization> 
                    {(geographies, projection) => {
                      return geographies.map((geography, i) => {
                        
                        return (
                          <Geography
                            key={ `geography-${i}` }
                            cacheId={ `geography-${i}` }
                            geography={ geography }
                            projection={ projection }
                            style={{
                              default: {
                                //fill: colorScale(geography.properties.POP_EST),
                                fill: "#ECEFF1",
                                stroke: "#607D8B",
                                strokeWidth: 0.5,
                                outline: "none",
                              },
                              hover: {
                                fill: "#ECEFF1",
                                stroke: "#607D8B",
                                strokeWidth: 0.5,
                                outline: "none",
                              },
                              pressed: {
                                fill: "#ECEFF1",
                                stroke: "#607D8B",
                                strokeWidth: 0.5,
                                outline: "none",
                              },
                            }}
                          />
                        )
                      }
                      
                      )
                    }
                    }
                  </Geographies>
                    <Markers>
                      {
                        // TODO: get node details
                        //this.state.cities.map((city, i) => (

                        this.props.nodeList
                         .sort(function(a, b){
                           return a.dc.localeCompare(b.dc)
                         }) 
                         .map((node, i) => {
                          let dcCount = this.props.nodeList.length / 3
                          /*
                          console.log(node.ip)
                          console.log(nodeScale(node.load))
                          console.log(circleX(i, dcCount))
                          console.log(circleY(i, dcCount))
                          */
                          return (
                          <Marker 
                            key={i} 
                            marker={node}
                            style={{
                              default: { 
                                //stroke: "#4607D8",
                                //stroke: "#8031A7",
                                stroke: getNodeStroke(node),
                                //fill: "#A4D233",
                                fill: getNodeFill(node),
                                outline: "none",
                              },
                              hover:   { 
                                fill: "#999",
                                outline: "none",
                              },
                              pressed: { 
                                fill: "#000",
                                outline: "none",
                              },
                            }}

                          >
                            <circle
                              cx={circleX(i, dcCount, this.props.mapZoom)}
                              cy={circleY(i, dcCount, this.props.mapZoom) }
                              //r={nodeScale(node.load)}
                              r={this.props.mapZoom * 10}
                              strokeWidth={ this.props.mapZoom *2 }
                            />
                          </Marker>
                          )
                        })
                      }
                    </Markers>

                </ZoomableGroup>
              </ComposableMap>
            </div>
        </div>
      );
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      updateValue: (key, value) => {
          dispatch(updateValue(key, value))
      },
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        nodeList: state.app.nodeList,
        oldNodeList: state.app.oldNodeList,
        dcList: state.app.dcList,
        mapView: state.app.mapView,
        mapZoom: state.app.mapZoom,
        mapCenter: state.app.mapCenter,
        fullscreen: state.app.fullscreen,
    }
}



const DataCenterMapContainer= connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(DataCenterMap))
export default DataCenterMapContainer;
