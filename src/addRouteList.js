import React, { Component } from 'react'
import { Modal, Form, Input, DatePicker, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const AddRouteList = Form.create({ name: 'form_in_modal' })(

    class extends React.Component {

        handleSubmit = e => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {

                    let userObj = this.props.users.filter(usr => usr.ID === values.user)[0];
                    let formvals = Object.assign({}, { user: userObj, comment: values.comment, date: values.date.format("DD/MM/YYYY") })
                    // debugger
                    this.props.onCreate(formvals, this.props.form);
                } else {
                    console.log('ERR', err, values);
                }
            });
        };

        render() {
            const { visible, users, onCancel, onCreate, form } = this.props;
            ///???? value
            const Users = users.map((user) =>
                (<Option key={user.ID}>{`${user.LAST_NAME} ${user.NAME}`}</Option>)
            );

            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Новый маршрутный лист"
                    okText="Создать"
                    onCancel={() => onCancel(form)}
                    onOk={this.handleSubmit} //{onCreate}
                >
                    <Form layout="vertical" >
                        <Form.Item label="Дата">
                            {getFieldDecorator('date', {
                                rules: [{ required: true, message: 'Укажите дату маршрутного листа' }],
                            })(<DatePicker format="DD/MM/YYYY" />)}
                        </Form.Item>

                        <Form.Item label="Исполнитель">
                            {getFieldDecorator('user', {
                                rules: [{ required: true, message: 'Выберите исполнителя' }],
                            })(
                                <Select filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                    {Users}
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item label="Комментарий">
                            {getFieldDecorator('comment')(<TextArea rows={2} />)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

export default AddRouteList;