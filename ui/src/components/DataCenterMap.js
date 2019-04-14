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

class DataCenterMap extends React.Component {

    render(){
      return (
        <div>
            <div className={"spanningDiv"}>
              <ComposableMap style={{ width: "100%", height: "100%" }} height={window.innerHeight* .3}>
                <ZoomableGroup  zoom={ this.props.mapZoom }>
                  <Geographies geography={geographyObject} disableOptimization> 
                    {(geographies, projection) => geographies.map((geography, i) => (
                      <Geography
                        key={ `geography-${i}` }
                        cacheId={ `geography-${i}` }
                        geography={ geography }
                        projection={ projection }
                        style={{
                          default: {
                            fill: colorScale(geography.properties.pop_est),
                            stroke: "#FFF",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                        }}
                      />
                    ))}
                  </Geographies>
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
        drawerOpen: state.NavigationReducer.drawerOpen,
        page: state.NavigationReducer.page,
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
