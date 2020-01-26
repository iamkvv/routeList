import React, { Component } from 'react'
import { Modal, Form, Input, DatePicker, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const AddTask = Form.create({ name: 'taskform_in_modal' })(

    class extends React.Component {

        handleSubmit = e => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {

                    //  alert("OK!!")
                    console.log('OK', values);
                    //debugger;
                    let compObj = this.props.companies.filter(comp => comp.ID === values.company)[0];
                    let formvals = Object.assign({}, { company: compObj, task: values.task })
                    //.replace(/\n/g, "\r\n")
                    //values.task.replace(/\n/g,"<br>")


                    this.props.onCreateTask(formvals, this.props.form);
                } else {
                    console.log('ERR', err, values);
                }
            });
        };

        render() {
            const { visible, companies, onCancel, form } = this.props;
            ///???? value
            const Companies = companies.map((comp) =>
                (<Option key={comp.ID}>{`${comp.TITLE}`}</Option>)
            );

            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Новое задание"
                    okText="Создать"
                    onCancel={() => onCancel(form)}
                    onOk={this.handleSubmit} //{onCreate}
                >
                    <Form layout="vertical" >
                        <Form.Item label="Компания">
                            {getFieldDecorator('company', {
                                rules: [{ required: true, message: 'Выберите компанию' }],
                            })(
                                <Select>
                                    {Companies}
                                </Select>
                            )}
                        </Form.Item>


                        <Form.Item label="Задание">
                            {getFieldDecorator('task')(<TextArea rows={2} />)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

export default AddTask;