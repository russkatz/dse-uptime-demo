import React from "react";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from 'material-kit-react/components/Card/Card';
import CardHeader from 'material-kit-react/components/Card/CardHeader';
import CardBody from 'material-kit-react/components/Card/CardBody';

import * as V from 'victory';
import { VictoryChart, VictoryVoronoiContainer, VictoryLine } from 'victory';


class ReadCard extends React.Component {
    componentDidMount() {
        this.props.init();
    }
    
    
    render() {
      let dcs = Array.from(new Set (this.props.reads.map((read) => read.dc)));

      const lineColors = ["#ca5f14", "#007a97", "#1AB5E0"];
      
      let currentIndex = 0;
      const readData = dcs.map(dc => {
        let thisDcReads = this.props.reads
          .filter((read, i) => read.dc === dc)
          //.filter((read, i) => read.resutl === "Successful")
          .map((read, i) => {
            let result = {"y": read.count, "x": currentIndex}
            currentIndex = currentIndex + 1
            return result
          })
        return thisDcReads;
      });


      return (
            <div className={"classes"}>
                <Card className={"card"}>
                    <CardHeader className={"cardheader"} style={{paddingTop: '20px'}}>DATA READS</CardHeader>
                    <CardBody className={"cardbody"}>
                      <div className={"cardchart"}>

                      <VictoryChart domainPadding={{ y: 10 }}
                        containerComponent={
                          <VictoryVoronoiContainer
                          />
                        }
                      >

                      {
                        dcs.map((dc, i) => {
                          return(
                            <VictoryLine
                              style={{ data: { stroke: lineColors[i], strokeWidth: 3 } }}
                              data={ readData[i] }
                              key={i}
                            />
                          )
                        })



                      }

                      </VictoryChart>
                      
                      </div>
                    </CardBody>
                </Card>
            </div>
        );

    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        reads: state.app.reads
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    init: () => {
    },
    }
}

const ReadCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)((ReadCard))
export default ReadCardContainer;
