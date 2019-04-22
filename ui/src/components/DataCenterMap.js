import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

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


import {updateValue} from '../actions/actions'

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 2,
    }
});

const colorScale = scaleLinear()
  .domain([0, 100000000, 1338612970]) // Max is based on China
  .range(["#FFF176", "#FFC107", "#E65100"])

const max = 10;
const min = 5;
const twoPi = Math.PI * 2;

const nodeScale = scaleLinear()
  .domain([0,1])
  .range([min,max])

function circleX(i, dcCount){
  let input = (i % dcCount) +1;

  let x = Math.round(100*Math.cos(twoPi / (dcCount)* input ) * max) / 100;
  return x; 
}

function circleY(i, dcCount){
  let input = (i % dcCount) +1;

  let y = Math.round(100*Math.sin(twoPi / (dcCount) * input )* max)/100;
  return y; 
}

class DataCenterMap extends React.Component {
    render(){
      return (
        <div>
            <div className={"spanningDiv"}>
              <ComposableMap style={{ width: "100%", height: "100%" }} height={window.innerHeight* .3}>
                <ZoomableGroup  zoom={ this.props.mapZoom }>
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
                                fill: colorScale(geography.properties.POP_EST),
                                stroke: "#FFF",
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
                          console.log(node.ip)
                          console.log(nodeScale(node.load))
                          console.log(circleX(i, dcCount))
                          console.log(circleY(i, dcCount))
                          return (
                          <Marker key={i} marker={node}>
                            <circle
                              cx={circleX(i, dcCount)}
                              cy={circleY(i, dcCount)}
                              r={nodeScale(node.load)}
                              fill="rgba(255,87,34,0.8)"
                              stroke="#607D8B"
                              strokeWidth="2"
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
      } 
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        nodeList: state.app.nodeList,
        oldNodeList: state.app.oldNodeList,
        dcList: state.app.dcList,
        mapView: state.app.mapView,
        mapZoom: state.app.mapZoom,
    }
}



const DataCenterMapContainer= connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(DataCenterMap))
export default DataCenterMapContainer;
