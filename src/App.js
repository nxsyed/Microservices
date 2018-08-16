import React, { Component } from 'react';
import { Form, Icon, Input, Button, Card, Row, Col } from 'antd';
import PubNubReact from 'pubnub-react';
import './App.css';

const FormItem = Form.Item;

class LoginForm extends Component {

  constructor(props){
    super(props);
    this.state =
     {
      publish: 'pub-c-4e68d624-3bc4-40d9-9b41-71a6208b1b4d',
      subscribe: 'sub-c-eb18f052-a0d8-11e8-ab44-96e83d2b591d',
      message: 'enter your publish and subscribe keys to your function and send a message'
    }
    this.pubnub = new PubNubReact({
      publishKey: this.state.publish,
      subscribeKey: this.state.subscribe
    });
    this.pubnub.init(this);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({publish:values.PubKey, subscribe:values.SubKey})
      }
    });
  }
  sendData = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.pubnub.publish({
          message: this.state.message,
          channel: 'data_channel'
      });
      }
    });
  } 
  componentWillMount() {
    this.pubnub.subscribe({
        channels: ['data_channel'],
        withPresence: true
    });

    this.pubnub.getMessage('data_channel', (msg) => {
        this.setState({message:msg.message})
    });
}

componentWillUnmount() {
    this.pubnub.unsubscribe({
        channels: ['data_channel']
    });
}

  render() {
    const messages = this.pubnub.getMessage('data_channel');
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="gutter">
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Card title="PubNub Keys">
              <Form style={{width:'inherit'}} onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                  {getFieldDecorator('PubKey', {
                    rules: [{ required: true, message: 'please enter your publish key' }],
                  })(
                    <Input prefix={<Icon type="arrow-up" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="pub-xxxxxxx" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('SubKey', {
                    rules: [{ required: true, message: 'please enter your subscribe key' }],
                  })(
                    <Input prefix={<Icon type="arrow-down" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="sub-xxxxxxxx" />
                  )}
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit" className="setKeys">
                    Set Keys
                  </Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card title="Data To Send">
              <Form style={{width:'inherit'}} onSubmit={this.sendData} className="login-form">
                <FormItem>
                  {getFieldDecorator('Data', {
                    rules: [{ required: true, message: 'Enter Data to Send' }],
                  })(
                    <Input prefix={<Icon type="api" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="data to be published" />
                  )}
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit" className="sendData">
                    Send
                  </Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card title="Returned Data">
                  <h1> {this.state.message}</h1>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const App = Form.create()(LoginForm);

export default App;