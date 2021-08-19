import { Button, Form, Input, Modal, Pagination, Table } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import uuid from "uuid";

const Todo = () => {
  const [data, setData] = useState<any>([]);
  const [data1, setData1] = useState<any>([]);
  const [data2, setData2] = useState<any>([]);
  const [lstorge, setLocalstorage] = useState([]);
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState<any>(0);
  const [form] = Form.useForm();
  const [editHandler, setEditHanler] = useState(false);
  let pagination = {
    current: 1,
    pageSize: 10,
  };

  useEffect(() => {
    axios.get(`https://reqres.in/api/users?page=1`).then((response) => {
      setData1(response.data.data);
      console.log(response.data);
    });
    axios.get(`https://reqres.in/api/users?page=2`).then((response) => {
      setData2(response.data.data);
      console.log(response.data);
    });
    setData([...data1, ...data2]);
  }, []);
  useEffect(() => {
    localStorage.setItem("data", data);
  }, [data]);
  const columns = [
    {
      title: "S/No",
      dataIndex: "dataIndex",
      key: "id",
      render: (value: any, item: any, index: number) =>
        (page - 1) * 6 + index + 1,
    },
    {
      title: "FirstName",
      dataIndex: "first_name",
      key: "id",
      sorter: (a: any, b: any) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: "LastName",
      dataIndex: "last_name",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "id",
    },
    {
      title: "Avatar",
      dataIndex: "",
      key: "id",
      render: (id: any, record: any) => (
        <Avatar size={"large"} src={record.avatar} />
      ),
    },
    {
      title: "Edit Action",
      dataIndex: "",
      key: "id",
      render: (id: any, record: any, index: any) => (
        <Button
          type="primary"
          onClick={() => {
            showModal();
            setEditHanler(true);
            setEdit(index);
            form.setFieldsValue({
              first_name: record.first_name,
              last_name: record.last_name,
              email: record.email,
              avatar: record.avatar,
            });
          }}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "Delete Action",
      dataIndex: "",
      key: "id",
      render: (id: any, record: any, index: any) => (
        <Button
          danger
          type="primary"
          onClick={() => {
            console.log("id", record.id, "i", index);
            setData(data.filter((i: any) => i.id !== record.id));
          }}
        >
          Delete
        </Button>
      ),
    },
  ];
  const onChange = (current: any) => {
    setPage(current);
  };
  console.log(page);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const onFinish = (values: any) => {
    console.log(values);
    let index = edit;
    let d: any = data;
    let c: any = [];
    let up = {
      ...d[index],
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      avatar: values.avatar,
    };
    d = [...d.slice(0, index), up, ...d.slice(index + 1)];
    let data1 = {
      id: uuid.v4(),
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      avatar: values.avatar,
    };
    c = [...data, data1];
    editHandler ? setData(d) : setData(c);
    handleOk();
  };
  console.log(edit.first_name);
  return (
    <>
      <Button
        type="primary"
        style={{ margin: "1rem" }}
        onClick={() => {
          showModal();
          form.setFieldsValue({
            first_name: "",
            last_name: "",
            email: "",
            avatar: "",
          });
        }}
      >
        Add
      </Button>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          pageSize: 6,
          onChange(current) {
            setPage(current);
          },
        }}
        scroll={{ x: 1000 }}
        rowKey="id"
      />
      {/* <Pagination onChange={onChange} total={50} /> */}
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
          form={form}
        >
          <Form.Item
            name="first_name"
            label="FirstName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="LastName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatar" label="Avatra Url">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Todo;
