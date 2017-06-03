import { Timeline, Row } from 'antd'
import React, { Component } from 'react'
import _ from 'lodash';
class EventTimline extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props.data)
        return (
            <Row>
            <Timeline>
                {
                    _.forEach(this.props.data, (event) =>
                        <Timeline.Item color="green">
                            <p>{event.maLop}</p>
                            <p>At {event.diaDiem}</p>
                            <p>{event.ngayGio}</p>
                        </Timeline.Item>
                    )
                }
            </Timeline>
            </Row>
        );
    }
}
export default EventTimline